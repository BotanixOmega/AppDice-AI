
import React, { useState } from 'react';
import { generatePhase1, generatePhase2, generatePhase3, generatePhase4 } from '../services/geminiService';
import { AppIdea, Phase1Output, Phase2Output, Phase3Output, Phase4Output, RollConfig, HistoryItem, TargetAudience, Platform } from '../types';
import { Icon } from './Icon';

interface RollViewProps {
  addToHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
  addToVault: (idea: AppIdea) => void;
}

const TARGET_AUDIENCES: TargetAudience[] = ['solopreneur', 'businessOwner', 'contentCreator', 'hobbyist'];
const PLATFORMS: Platform[] = ['desktop', 'mobile', 'tablet', 'all'];
const SUBSCRIPTION_VALUES = [0, 10, 30, 99, 250];

const ConfigPanel: React.FC<{config: RollConfig, setConfig: React.Dispatch<React.SetStateAction<RollConfig>>}> = ({ config, setConfig }) => {
    
    const handleAudienceChange = (audience: TargetAudience) => {
        const newAudience = config.targetAudience.includes(audience)
            ? config.targetAudience.filter(a => a !== audience)
            : [...config.targetAudience, audience];
        setConfig(prev => ({ ...prev, targetAudience: newAudience }));
    };

    const handlePlatformChange = (platform: Platform) => {
        const newPlatform = config.platform.includes(platform)
            ? config.platform.filter(p => p !== platform)
            : [...config.platform, platform];
        setConfig(prev => ({ ...prev, platform: newPlatform }));
    };

    return (
        <div className="p-2 space-y-4">
            <h3 className="text-lg font-heading text-cyber-lime md:block hidden">Roll Parameters</h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 opacity-50">Industry</label>
                    <input type="text" value={config.industry} onChange={e => setConfig(p => ({...p, industry: e.target.value}))} className="w-full bg-white/5 p-3 rounded-xl border border-white/10 text-white focus:ring-2 focus:ring-cyber-lime outline-none transition-all text-sm"/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">Audience</label>
                        <div className="space-y-1.5">
                            {TARGET_AUDIENCES.map(aud => (
                                <label key={aud} className="flex items-center space-x-2 cursor-pointer group">
                                    <input type="checkbox" checked={config.targetAudience.includes(aud)} onChange={() => handleAudienceChange(aud)} className="form-checkbox h-3.5 w-3.5 bg-white/10 border-white/20 text-cyber-lime rounded focus:ring-cyber-lime"/>
                                    <span className="capitalize text-[10px] font-medium group-hover:text-cyber-lime transition-colors">{aud}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">Platform</label>
                        <div className="space-y-1.5">
                            {PLATFORMS.map(plat => (
                                <label key={plat} className="flex items-center space-x-2 cursor-pointer group">
                                    <input type="checkbox" checked={config.platform.includes(plat)} onChange={() => handlePlatformChange(plat)} className="form-checkbox h-3.5 w-3.5 bg-white/10 border-white/20 text-cyber-lime rounded focus:ring-cyber-lime"/>
                                    <span className="capitalize text-[10px] font-medium group-hover:text-cyber-lime transition-colors">{plat}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">Subscription Value</label>
                    <div className="flex flex-wrap gap-1.5">
                        {SUBSCRIPTION_VALUES.map(val => (
                            <button key={val} onClick={() => setConfig(p => ({...p, subscriptionValue: val}))} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${config.subscriptionValue === val ? 'bg-cyber-lime text-midnight-navy border-cyber-lime' : 'border-white/10 hover:bg-white/5'}`}>
                                ${val}
                            </button>
                        ))}
                    </div>
                </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 opacity-50">Complexity</label>
                        <select 
                            value={config.complexity} 
                            onChange={e => setConfig(p => ({...p, complexity: +e.target.value}))}
                            className="w-full bg-white/5 px-3 py-2.5 rounded-xl border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-cyber-lime"
                        >
                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v} className="bg-midnight-navy">Tier {v}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1 opacity-50">Outputs</label>
                        <select 
                            value={config.outputCount} 
                            onChange={e => setConfig(p => ({...p, outputCount: +e.target.value}))}
                            className="w-full bg-white/5 px-3 py-2.5 rounded-xl border border-white/10 text-white text-xs outline-none focus:ring-2 focus:ring-cyber-lime"
                        >
                            {[1, 2, 3, 4, 5].map(v => <option key={v} value={v} className="bg-midnight-navy">{v} Ideas</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};


const RollView: React.FC<RollViewProps> = ({ addToHistory, addToVault }) => {
  const [phase, setPhase] = useState(0); // 0: Ready, 1: Ideas, 2: Dev, 3: Visuals, 4: Marketing
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState<RollConfig>({
    industry: 'Productivity',
    targetAudience: ['hobbyist'],
    platform: ['all'],
    subscriptionValue: 30,
    complexity: 2,
    outputCount: 3,
  });

  const [phase1Result, setPhase1Result] = useState<Phase1Output | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<AppIdea | null>(null);
  const [phase2Result, setPhase2Result] = useState<Phase2Output | null>(null);
  const [phase3Result, setPhase3Result] = useState<Phase3Output | null>(null);
  const [phase4Result, setPhase4Result] = useState<Phase4Output | null>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);


  const [isConfigDrawerOpen, setIsConfigDrawerOpen] = useState(false);

  const handleRoll = async () => {
    setIsLoading(true);
    setError(null);
    setPhase(0);
    setPhase1Result(null);
    setSelectedIdea(null);
    setPhase2Result(null);
    setPhase3Result(null);
    setPhase4Result(null);
    setIsConfigDrawerOpen(false); // Close drawer on mobile after roll

    try {
      const result = await generatePhase1(config);
      setPhase1Result(result);
      addToHistory({
          phase1Output: result,
          ideaStatuses: result.ideas.reduce((acc, idea) => ({ ...acc, [idea.id]: 'unused' }), {})
      });
      setPhase(1);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectIdea = async (idea: AppIdea) => {
    setSelectedIdea(idea);
    setIsLoading(true);
    setError(null);
    try {
      const result = await generatePhase2(idea);
      setPhase2Result(result);
      setPhase(2);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToPhase3 = async () => {
    if (!selectedIdea) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generatePhase3(selectedIdea);
      setPhase3Result(result);
      setPhase(3);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProceedToPhase4 = async () => {
    if (!selectedIdea) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generatePhase4(selectedIdea);
      setPhase4Result(result);
      setPhase(4);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToVault = (idea: AppIdea) => {
      addToVault(idea);
      // You could add a toast notification here
  }
  
  const renderPhaseContent = () => {
    // Phase 0: The Dice
    if (phase === 0 && !isLoading && !phase1Result) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full px-6 text-center">
            <div className="flex-1" /> {/* Top Spacer */}
            <div className="flex flex-col items-center justify-center">
                <button onClick={handleRoll} disabled={isLoading} className="group transition-transform duration-500 hover:scale-110 active:scale-90 relative">
                    <Icon name="roll" className={`w-28 h-28 sm:w-36 sm:h-36 md:w-56 md:h-56 text-midnight-navy/50 group-hover:text-cyber-lime ${isLoading ? 'animate-spin' : 'animate-spin-slow'}`} />
                </button>
                <p className="mt-8 text-xl md:text-2xl font-bold tracking-tight">Tap the dice to roll for viral ideas!</p>
                
                {/* Mobile Config Trigger */}
                <button 
                  onClick={() => setIsConfigDrawerOpen(true)}
                  className="md:hidden mt-12 flex items-center space-x-3 bg-midnight-navy text-cyber-lime px-10 py-5 rounded-2xl font-bold shadow-2xl active:scale-95 transition-transform"
                >
                  <Icon name="settings" className="w-5 h-5" />
                  <span className="uppercase tracking-widest text-sm">Parameters</span>
                </button>
            </div>
            <div className="flex-1" /> {/* Bottom Spacer for vertical centering on all views */}
        </div>
      );
    }

    // Common container for phases 1-4
    return (
      <div className="p-4 md:p-8 overflow-y-auto h-full w-full space-y-6 md:space-y-8 pb-32">
        {phase1Result && (
          <div className="p-5 md:p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-midnight-navy">Pain Point Summary</h2>
            <p className="text-sm md:text-base text-midnight-navy/80 leading-relaxed">{phase1Result.painPointSummary}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 mt-8">
                {phase1Result.ideas.map(idea => (
                    <IdeaCard 
                      key={idea.id} 
                      idea={idea} 
                      isExpanded={expandedCardId === idea.id}
                      onView={() => setExpandedCardId(expandedCardId === idea.id ? null : idea.id)}
                      onSave={() => handleSaveToVault(idea)}
                      onBuild={() => handleSelectIdea(idea)}
                      isDisabled={!!selectedIdea}
                    />
                ))}
            </div>
          </div>
        )}
        
        {phase2Result && selectedIdea && (
           <div className="p-4 md:p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-xl md:text-2xl font-heading font-bold mb-4">Phase 2: Development Prompt for "{selectedIdea.name}"</h2>
                <pre className="bg-midnight-navy/5 p-3 md:p-4 rounded-lg text-xs md:text-sm whitespace-pre-wrap font-mono overflow-x-auto">{phase2Result.developmentPrompt}</pre>
                <button onClick={handleProceedToPhase3} disabled={isLoading} className="mt-4 w-full bg-cyber-lime text-midnight-navy font-bold py-3 px-4 rounded-lg min-h-[44px]">
                    {isLoading ? "Generating..." : "Proceed to Phase 03"}
                </button>
            </div>
        )}

        {phase3Result && selectedIdea && (
           <div className="p-4 md:p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-xl md:text-2xl font-heading font-bold mb-4">Phase 3: Visuals & Functionality for "{selectedIdea.name}"</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Visual Styling Prompt</h3>
                        <pre className="bg-midnight-navy/5 p-3 md:p-4 rounded-lg text-xs md:text-sm whitespace-pre-wrap font-mono overflow-x-auto">{phase3Result.visualPrompt}</pre>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold mb-2">Expanded Feature List</h3>
                        <ul className="list-disc list-inside space-y-2 bg-midnight-navy/5 p-3 md:p-4 rounded-lg text-sm md:text-base">
                            {phase3Result.featureList.map((feature, i) => <li key={i}>{feature}</li>)}
                        </ul>
                    </div>
                </div>
                <button onClick={handleProceedToPhase4} disabled={isLoading} className="mt-4 w-full bg-cyber-lime text-midnight-navy font-bold py-3 px-4 rounded-lg min-h-[44px]">
                    {isLoading ? "Generating..." : "Proceed to Phase 04"}
                </button>
            </div>
        )}
        
        {phase4Result && selectedIdea && (
           <div className="p-4 md:p-6 bg-white rounded-xl shadow-md">
                <h2 className="text-xl md:text-2xl font-heading font-bold mb-4">Phase 4: Marketing for "{selectedIdea.name}"</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Viral Ad Copy</h3>
                        <div className="space-y-4">
                            {phase4Result.adCopies.map((ad, i) => (
                                <div key={i} className="bg-midnight-navy/5 p-3 md:p-4 rounded-lg">
                                    <p className="font-semibold italic text-sm md:text-base">Pain Point: {ad.painPoint}</p>
                                    <p className="my-2 text-sm md:text-base"><strong>Ad Copy:</strong> {ad.copy}</p>
                                    <p className="text-[10px] md:text-xs text-midnight-navy/60"><strong>Image Prompt:</strong> {ad.imagePrompt}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2">Pricing Guide</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {phase4Result.pricingGuide.map(tier => (
                                <div key={tier.tier} className="bg-midnight-navy/5 p-4 rounded-lg border-t-4 border-cyber-lime">
                                    <p className="font-bold text-lg md:text-xl">{tier.tier}</p>
                                    <p className="text-2xl md:text-3xl font-heading">${tier.price}<span className="text-sm md:text-base font-body">/mo</span></p>
                                    <p className="text-xs md:text-sm text-midnight-navy/70 mt-2">{tier.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                 <button onClick={handleRoll} disabled={isLoading} className="mt-6 w-full bg-midnight-navy text-cyber-lime font-bold py-3 px-4 rounded-lg min-h-[44px]">
                    Roll Again!
                </button>
            </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col md:flex-row h-full relative">
      <div className="flex-1 h-full bg-cloud-dancer relative overflow-hidden flex flex-col">
         {isLoading && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
                <Icon name="roll" className="w-16 h-16 md:w-24 md:h-24 text-cyber-lime animate-spin"/>
                <p className="text-white text-lg md:text-xl mt-4 font-bold">AI is working its magic...</p>
            </div>
        )}
        {error && <div className="p-4 bg-red-500 text-white text-center font-bold z-50 relative">{error}</div>}
        {renderPhaseContent()}
        
        {/* Mobile Config Toggle Button (Floating) */}
        {phase !== 0 && (
          <button 
            onClick={() => setIsConfigDrawerOpen(true)}
            className="md:hidden fixed bottom-20 right-4 bg-midnight-navy text-cyber-lime p-4 rounded-full shadow-2xl z-40 border border-white/10"
          >
            <Icon name="settings" className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Desktop Config Panel */}
      <div className="hidden md:block w-[350px] flex-shrink-0 border-l border-midnight-navy/5">
          <ConfigPanel config={config} setConfig={setConfig} />
      </div>

      {/* Mobile Config Drawer (Full Screen Overlay) */}
      {isConfigDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-midnight-navy flex flex-col p-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-heading text-cyber-lime font-bold">Roll Parameters</h3>
              <button onClick={() => setIsConfigDrawerOpen(false)} className="bg-white/10 p-2 rounded-full text-white">
                <Icon name="close" className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 min-h-0 overflow-y-auto">
                <ConfigPanel config={config} setConfig={setConfig} />
            </div>

            <button 
              onClick={() => { handleRoll(); setIsConfigDrawerOpen(false); }}
              className="mt-6 w-full bg-cyber-lime text-midnight-navy font-bold py-5 rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.3)] active:scale-95 transition-transform flex items-center justify-center space-x-3 mb-4"
            >
              <Icon name="roll" className="w-6 h-6" />
              <span className="uppercase tracking-widest text-lg">Roll for Ideas</span>
            </button>
        </div>
      )}
    </div>
  );
};


const IdeaCard: React.FC<{idea: AppIdea, isExpanded: boolean, onView: () => void, onSave: () => void, onBuild: () => void, isDisabled: boolean}> = ({idea, isExpanded, onView, onSave, onBuild, isDisabled}) => {
    
    return (
        <div className={`p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col transition-all duration-300 ${isDisabled ? 'opacity-50' : ''}`}>
            <h3 className="text-xl font-bold font-heading">{idea.name}</h3>
            <p className="text-sm text-midnight-navy/70 mt-1 flex-grow">{idea.description}</p>
            
            {isExpanded && (
                <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        {idea.features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                    <h4 className="font-semibold mt-4 mb-2">Pricing:</h4>
                    <div className="flex justify-around text-center text-sm">
                        {idea.pricing.map(p => (
                            <div key={p.tier}>
                                <p className="font-bold">{p.tier}</p>
                                <p>${p.price}/mo</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end space-x-2 mt-4 pt-2 border-t">
                <IconButton icon={isExpanded ? 'close' : 'eye'} tooltip={isExpanded ? 'Close' : 'View'} onClick={onView} disabled={isDisabled} color="text-red-500"/>
                <IconButton icon="save" tooltip="Save" onClick={onSave} disabled={isDisabled} />
                <IconButton icon="build" tooltip="Build" onClick={onBuild} disabled={isDisabled} />
            </div>
        </div>
    );
};

const IconButton: React.FC<{icon: string, tooltip: string, onClick: () => void, disabled: boolean, color?: string}> = ({icon, tooltip, onClick, disabled, color = 'text-midnight-navy'}) => {
    return (
        <div className="relative group">
            <button onClick={onClick} disabled={disabled} className={`p-2 rounded-full hover:bg-cloud-dancer disabled:cursor-not-allowed disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center`}>
                <Icon name={icon} className={`w-5 h-5 ${color}`}/>
            </button>
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-midnight-navy text-cloud-dancer text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {tooltip}
            </div>
        </div>
    )
}


export default RollView;