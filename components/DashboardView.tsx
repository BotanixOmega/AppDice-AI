
import React, { useState, useEffect } from 'react';
import { HistoryItem, VaultItem } from '../types';
import { testApiConnection, getGeminiApiKey } from '../services/geminiService';
import { Icon } from './Icon';

interface DashboardViewProps {
  history: HistoryItem[];
  vault: VaultItem[];
}

const StatCard: React.FC<{title: string, value: string | number, description: string}> = ({title, value, description}) => (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
        <h3 className="text-sm md:text-lg font-medium text-midnight-navy/70">{title}</h3>
        <p className="text-3xl md:text-5xl font-heading font-bold text-midnight-navy mt-1 md:mt-2">{value}</p>
        <p className="text-xs md:text-sm text-midnight-navy/60 mt-1 md:mt-2">{description}</p>
    </div>
);


const DashboardView: React.FC<DashboardViewProps> = ({ history, vault }) => {
  const [apiState, setApiState] = useState<'loading' | 'success' | 'error' | 'unconfigured'>('loading');
  const [apiMessage, setApiMessage] = useState<string>('');

  const totalRolls = history.length;
  const totalIdeasGenerated = history.reduce((sum, item) => sum + item.phase1Output.ideas.length, 0);
  const totalIdeasSaved = vault.length;
  const ideasDeployed = history.flatMap(h => Object.values(h.ideaStatuses)).filter(s => s === 'deployed').length;

  // Real-time verify function
  const checkConnection = async () => {
    setApiState('loading');
    const key = getGeminiApiKey();
    if (!key) {
      setApiState('unconfigured');
      setApiMessage('No active Gemini API Key found. To enable AI generation features, please install one under Settings.');
      return;
    }
    const result = await testApiConnection();
    if (result.success) {
      setApiState('success');
      setApiMessage(result.message);
    } else {
      setApiState('error');
      setApiMessage(result.message);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      {/* Title + Connectivity Status Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-4xl font-bold font-heading text-midnight-navy">Dashboard</h2>
        
        {/* Compact Pill Status */}
        <button 
          onClick={checkConnection}
          className="inline-flex items-center space-x-1.5 self-start sm:self-auto text-xs font-bold uppercase tracking-wider text-midnight-navy bg-white px-3 py-1.5 rounded-full shadow-sm border border-midnight-navy/10 hover:bg-cloud-dancer/50 transition-colors"
          title="Click to run real-time connectivity diagnostics"
        >
          {apiState === 'loading' && (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="text-amber-700">Verifying API Gateway...</span>
            </>
          )}
          {apiState === 'success' && (
            <>
              <span className="relative flex h-20 w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-700">System Connected</span>
            </>
          )}
          {apiState === 'unconfigured' && (
            <>
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="text-slate-600">API Key Missing</span>
            </>
          )}
          {apiState === 'error' && (
            <>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-rose-700">API Gateway Offline</span>
            </>
          )}
        </button>
      </div>

      {/* Connectivity Alert Ribbons */}
      <div className="mb-6 md:mb-8">
        {apiState === 'loading' && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center space-x-3 text-xs md:text-sm text-amber-800 animate-pulse">
            <Icon name="refresh" className="w-5 h-5 text-amber-600 animate-spin flex-shrink-0" />
            <p><strong>Checking Gateway Connection:</strong> Pinging Google Gemini API servers to verify keys and routes...</p>
          </div>
        )}

        {apiState === 'success' && (
          <div className="bg-emerald-50/70 border border-emerald-200/60 p-4 rounded-xl flex items-start space-x-3 text-xs md:text-sm text-emerald-950">
            <Icon name="check" className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Gemini API Connection Validated</p>
              <p className="opacity-80 text-xs mt-0.5">{apiMessage} | Model active: <code className="font-bold font-mono">gemini-3.5-flash</code></p>
            </div>
          </div>
        )}

        {apiState === 'unconfigured' && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3 text-xs md:text-sm text-amber-950">
            <Icon name="alert" className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Missing API Credentials</p>
              <p className="opacity-80 text-xs mt-0.5">App is currently falling back to placeholder systems. Go to the <strong>Settings tab</strong> to securely add your Gemini API Key in localStorage for full functionality.</p>
            </div>
          </div>
        )}

        {apiState === 'error' && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start space-x-3 text-xs md:text-sm text-rose-950">
            <Icon name="alert" className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Gemini API Key authorization failure!</p>
              <p className="opacity-85 text-xs font-mono bg-white/50 p-2 rounded-md mt-1 border border-rose-100 max-h-24 overflow-y-auto">{apiMessage}</p>
              <p className="opacity-90 text-[11px] mt-2 text-rose-800">
                👉 Please check your API key spelling, ensure it has enough billing credits / tier limits, or override it in your private browser via the <strong>Settings tab</strong>.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Rolls" value={totalRolls} description="Number of times the dice has been rolled."/>
        <StatCard title="Ideas Generated" value={totalIdeasGenerated} description="Total unique app ideas created by AI."/>
        <StatCard title="Ideas in Vault" value={totalIdeasSaved} description="Concepts saved for future consideration."/>
        <StatCard title="Ideas Deployed" value={ideasDeployed} description="Marked as shipped and in the wild!"/>
      </div>
      
      <div className="mt-8 md:mt-10 bg-white p-4 md:p-6 rounded-xl shadow-md">
          <h3 className="text-xl md:text-2xl font-bold font-heading mb-4">Recent Activity</h3>
          {history.length === 0 ? (
              <p className="text-sm md:text-base">No rolls yet. Go to the Roll tab to generate some ideas!</p>
          ) : (
              <ul className="space-y-3 md:space-y-4">
                  {history.slice(0, 5).map(item => (
                      <li key={item.id} className="p-3 md:p-4 bg-cloud-dancer rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <div>
                              <p className="font-semibold text-sm md:text-base">Generated {item.phase1Output.ideas.length} new ideas</p>
                              <p className="text-xs md:text-sm text-midnight-navy/60">{item.date.toLocaleString()}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 sm:justify-end">
                              {item.phase1Output.ideas.map(idea => (
                                <span key={idea.id} className="px-2 py-1 bg-midnight-navy/10 text-[10px] md:text-xs rounded-full">{idea.name}</span>
                              ))}
                          </div>
                      </li>
                  ))}
              </ul>
          )}
      </div>

    </div>
  );
};

export default DashboardView;
