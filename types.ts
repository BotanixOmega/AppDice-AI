
export type MenuItem = 'roll' | 'dashboard' | 'history' | 'vault' | 'settings';

export type TargetAudience = 'solopreneur' | 'businessOwner' | 'contentCreator' | 'hobbyist';
export type Platform = 'desktop' | 'mobile' | 'tablet' | 'all';

export interface RollConfig {
  industry: string;
  targetAudience: TargetAudience[];
  platform: Platform[];
  subscriptionValue: number;
  complexity: number;
  outputCount: number;
}

export interface PricingTier {
  tier: 'Basic' | 'Mid' | 'Pro' | 'Max';
  price: number;
  description?: string;
}

export interface AppIdea {
  id: string;
  name: string;
  description: string;
  pricing: PricingTier[];
  features: string[];
}

export interface Phase1Output {
  painPointSummary: string;
  ideas: AppIdea[];
}

export interface Phase2Output {
  developmentPrompt: string;
}

export interface Phase3Output {
  visualPrompt: string;
  featureList: string[];
}

export interface AdCopy {
  copy: string;
  imagePrompt: string;
  painPoint: string;
}

export interface Phase4Output {
  adCopies: AdCopy[];
  pricingGuide: PricingTier[];
}


export type IdeaStatus = 'unused' | 'saved' | 'deployed' | 'canned';

export interface HistoryItem {
  id: string;
  date: Date;
  phase1Output: Phase1Output;
  ideaStatuses: { [ideaId: string]: IdeaStatus };
}

export type VaultStage = 'concept' | 'sandbox' | 'alpha' | 'beta';

export interface VaultItem {
  id: string;
  idea: AppIdea;
  stage: VaultStage;
}
