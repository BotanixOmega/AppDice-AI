
import React from 'react';
import { HistoryItem, VaultItem } from '../types';

interface DashboardViewProps {
  history: HistoryItem[];
  vault: VaultItem[];
}

const StatCard: React.FC<{title: string, value: string | number, description: string}> = ({title, value, description}) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-medium text-midnight-navy/70">{title}</h3>
        <p className="text-5xl font-heading font-bold text-midnight-navy mt-2">{value}</p>
        <p className="text-sm text-midnight-navy/60 mt-2">{description}</p>
    </div>
);


const DashboardView: React.FC<DashboardViewProps> = ({ history, vault }) => {
  const totalRolls = history.length;
  const totalIdeasGenerated = history.reduce((sum, item) => sum + item.phase1Output.ideas.length, 0);
  const totalIdeasSaved = vault.length;
  const ideasDeployed = history.flatMap(h => Object.values(h.ideaStatuses)).filter(s => s === 'deployed').length;

  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-4xl font-bold font-heading mb-8">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Rolls" value={totalRolls} description="Number of times the dice has been rolled."/>
        <StatCard title="Ideas Generated" value={totalIdeasGenerated} description="Total unique app ideas created by AI."/>
        <StatCard title="Ideas in Vault" value={totalIdeasSaved} description="Concepts saved for future consideration."/>
        <StatCard title="Ideas Deployed" value={ideasDeployed} description="Marked as shipped and in the wild!"/>
      </div>
      
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold font-heading mb-4">Recent Activity</h3>
          {history.length === 0 ? (
              <p>No rolls yet. Go to the Roll tab to generate some ideas!</p>
          ) : (
              <ul className="space-y-4">
                  {history.slice(0, 5).map(item => (
                      <li key={item.id} className="p-4 bg-cloud-dancer rounded-lg flex justify-between items-center">
                          <div>
                              <p className="font-semibold">Generated {item.phase1Output.ideas.length} new ideas</p>
                              <p className="text-sm text-midnight-navy/60">{item.date.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                              {item.phase1Output.ideas.map(idea => (
                                <span key={idea.id} className="ml-2 px-2 py-1 bg-midnight-navy/10 text-xs rounded-full">{idea.name}</span>
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
