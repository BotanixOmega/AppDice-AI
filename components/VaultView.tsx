
import React, { useState } from 'react';
import { VaultItem, VaultStage } from '../types';

interface VaultViewProps {
  vault: VaultItem[];
  updateStage: (vaultItemId: string, stage: VaultStage) => void;
}

const stages: VaultStage[] = ['concept', 'sandbox', 'alpha', 'beta'];

const VaultView: React.FC<VaultViewProps> = ({ vault, updateStage }) => {
  const [activeTab, setActiveTab] = useState<VaultStage>('concept');

  const filteredVault = vault.filter(item => item.stage === activeTab);

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto flex flex-col">
      <h2 className="text-2xl md:text-4xl font-bold font-heading mb-4">My Vault</h2>
      
      <div className="border-b border-gray-300 overflow-x-auto no-scrollbar -mx-4 px-4">
        <nav className="-mb-px flex space-x-6 md:space-x-8" aria-label="Tabs">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setActiveTab(stage)}
              className={`${
                activeTab === stage
                  ? 'border-cyber-lime text-midnight-navy'
                  : 'border-transparent text-midnight-navy/60 hover:text-midnight-navy hover:border-gray-400'
              } capitalize whitespace-nowrap py-3 md:py-4 px-1 border-b-4 font-medium text-base md:text-lg`}
            >
              {stage}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="flex-grow mt-6">
        {filteredVault.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg md:text-xl text-gray-500">No ideas in this stage yet.</p>
            <p className="text-sm md:text-base text-gray-400 mt-2">Save ideas from the 'Roll' screen to add them to your vault.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredVault.map(item => (
              <div key={item.id} className="bg-white p-4 md:p-5 rounded-xl shadow-md flex flex-col">
                <h3 className="text-lg md:text-xl font-bold font-heading">{item.idea.name}</h3>
                <p className="text-xs md:text-sm text-midnight-navy/70 mt-2 flex-grow">{item.idea.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="text-[10px] md:text-xs font-semibold">Stage:</label>
                    <select
                        value={item.stage}
                        onChange={(e) => updateStage(item.id, e.target.value as VaultStage)}
                        className="w-full mt-1 capitalize text-xs md:text-sm rounded-md p-2 border-gray-300 focus:ring-2 focus:ring-midnight-navy focus:border-transparent"
                    >
                        {stages.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultView;
