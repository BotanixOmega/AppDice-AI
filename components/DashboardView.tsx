
import React from 'react';
import { HistoryItem, VaultItem } from '../types';

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
  const totalRolls = history.length;
  const totalIdeasGenerated = history.reduce((sum, item) => sum + item.phase1Output.ideas.length, 0);
  const totalIdeasSaved = vault.length;
  const ideasDeployed = history.flatMap(h => Object.values(h.ideaStatuses)).filter(s => s === 'deployed').length;

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      <h2 className="text-2xl md:text-4xl font-bold font-heading mb-6 md:mb-8">Dashboard</h2>
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
