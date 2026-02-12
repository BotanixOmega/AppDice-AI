
import { GoogleGenAI, Type } from "@google/genai";
import { RollConfig, AppIdea, Phase1Output, Phase2Output, Phase3Output, Phase4Output } from '../types';

// This is a placeholder. In a real environment, this would be a secure environment variable.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_HERE" });

const model = 'gemini-3-pro-preview';

const phase1Schema = {
  type: Type.OBJECT,
  properties: {
    painPointSummary: {
      type: Type.STRING,
      description: "A detailed summary of the common pain points for the specified niche, based on research from sources like Reddit and Quora."
    },
    ideas: {
      type: Type.ARRAY,
      description: "An array of viral app ideas.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique identifier for the idea, e.g., using UUID." },
          name: { type: Type.STRING, description: "A creative and SEO-friendly name for the app." },
          description: { type: Type.STRING, description: "A concise and compelling description of the app." },
          pricing: {
            type: Type.ARRAY,
            description: "An array of three pricing tiers: Basic, Mid, and Pro.",
            items: {
              type: Type.OBJECT,
              properties: {
                tier: { type: Type.STRING, description: "The name of the tier (e.g., 'Basic', 'Mid', 'Pro')." },
                price: { type: Type.NUMBER, description: "The estimated monthly subscription price for the tier." }
              },
              required: ["tier", "price"]
            }
          },
          features: {
            type: Type.ARRAY,
            description: "A list of key features for the app.",
            items: { type: Type.STRING }
          }
        },
        required: ["id", "name", "description", "pricing", "features"]
      }
    }
  },
  required: ["painPointSummary", "ideas"]
};

export const generatePhase1 = async (config: RollConfig): Promise<Phase1Output> => {
  const prompt = `
    Act as an expert product development specialist with deep experience in market analysis and opportunity sourcing.
    Based on the following criteria, scan popular online communities like Reddit and Quora to identify common, unsolved pain points for the target audience.
    
    Criteria:
    - Industry: ${config.industry}
    - Target Audience: ${config.targetAudience.join(', ')}
    - Platform: ${config.platform.join(', ')}
    - Desired Subscription Value: Around $${config.subscriptionValue}/month
    - Complexity Level: ${config.complexity} out of 5 (0=simple, 5=complex)

    Your task is to:
    1.  Provide a detailed summary of the discovered pain points for this niche.
    2.  Ideate ${config.outputCount} viral app ideas that solve these pain points. Each idea must have a creative, SEO-friendly name.
    3.  For each app idea, provide a description, a list of core features, and three estimated monthly subscription price tiers (Basic, Mid, Pro).
    4.  Generate a unique ID for each idea.
    5.  Format your entire response as a single JSON object matching the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: phase1Schema,
      }
    });
    
    const jsonText = response.text;
    const result = JSON.parse(jsonText) as Phase1Output;
    // Ensure ideas have unique IDs client-side if model fails
    result.ideas = result.ideas.map(idea => ({ ...idea, id: idea.id || `idea-${Math.random()}`}));
    return result;
  } catch (error) {
    console.error("Error in generatePhase1:", error);
    throw new Error("Failed to generate app ideas. Please check your API key and try again.");
  }
};


export const generatePhase2 = async (idea: AppIdea): Promise<Phase2Output> => {
  const prompt = `
    Act as an expert app developer with specialized experience in prompt engineering and creating viral user experiences.
    For the app idea "${idea.name}", which is described as "${idea.description}" and has features like "${idea.features.join(', ')}", your task is to draft a highly detailed initial development prompt.
    This prompt should be comprehensive enough for another AI or a development team to build a first draft (MVP) of the app.
    It must cover:
    - Core functionality and user flows.
    - Key architectural considerations (e.g., frontend framework, backend needs).
    - Database schema suggestions for key entities.
    - How to address the primary user pain points this app solves.
    - Suggestions for a 'viral loop' or shareability feature.
  `;
  const response = await ai.models.generateContent({ model, contents: prompt });
  return { developmentPrompt: response.text };
};

export const generatePhase3 = async (idea: AppIdea): Promise<Phase3Output> => {
    const prompt = `
    Act as a senior UI/UX designer and product strategist.
    For the app idea "${idea.name}", you are to create a visual and functional specification. Focus on comfort-oriented UX and a visually standout UI.

    Your output should be a JSON object with two keys: "visualPrompt" and "featureList".

    1.  **visualPrompt**: A detailed prompt for an image generation AI (like Midjourney or DALL-E) to create a visual style guide for the app. This prompt should specify:
        -   **Color Palette**: Suggest a primary, secondary, and accent color scheme that is visually appealing and accessible.
        -   **Typography**: Recommend font pairings for headings and body text.
        -   **Styling Conventions**: Describe the style for buttons (shape, effects), tabs, menus, and sliders.
        -   **Animations**: Suggest subtle animations for user interactions to enhance the UX.
        -   **Overall Vibe**: Define the overall aesthetic (e.g., minimalist, brutalist, neumorphic, futuristic).

    2.  **featureList**: An expanded and detailed list of features. For each feature, include a sub-list of unique aspects or "secret sauce" elements that would make it stand out from competitors, especially features that are typically expensive or unavailable elsewhere.
  `;

  const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
  });
  // Simple parsing as schema is not strictly enforced here
  const result = JSON.parse(response.text);
  return {
    visualPrompt: result.visualPrompt || "No visual prompt generated.",
    featureList: result.featureList || ["No features generated."]
  };
};


export const generatePhase4 = async (idea: AppIdea): Promise<Phase4Output> => {
  const prompt = `
    Act as an expert digital marketing strategist specializing in launching new web and mobile apps.
    For the app "${idea.name}", your task is to create a marketing launch kit.
    
    Your output must be a JSON object with two keys: "adCopies" and "pricingGuide".

    1.  **adCopies**: Create an array of 5 viral ad copy pieces. Each element in the array should be an object containing:
        -   **painPoint**: The single, specific user pain point this ad addresses.
        -   **copy**: A short, punchy ad copy (like for a social media post) that speaks directly to that pain point and presents the app as the solution.
        -   **imagePrompt**: A detailed prompt for an image generation AI to create a visually striking ad creative that complements the copy.

    2.  **pricingGuide**: Create a full pricing guide as an array of objects. It should have 3-4 tiers (e.g., Basic, Pro, Max). Each tier object should include:
        -   **tier**: The name of the tier.
        -   **price**: A specific monthly price.
        -   **description**: A list of the key features or limits included in that tier.
  `;
   const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: 'application/json' }
  });
  const result = JSON.parse(response.text);
  return {
      adCopies: result.adCopies || [],
      pricingGuide: result.pricingGuide || []
  };
};
