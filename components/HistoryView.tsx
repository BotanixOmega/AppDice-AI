
import React from 'react';
import { HistoryItem, IdeaStatus } from '../types';
import { Icon } from './Icon';

interface HistoryViewProps {
  history: HistoryItem[];
  updateStatus: (historyItemId: string, ideaId: string, status: IdeaStatus) => void;
}

const statusColors: { [key in IdeaStatus]: string } = {
  unused: 'bg-gray-200 text-gray-800',
  saved: 'bg-blue-200 text-blue-800',
  deployed: 'bg-green-200 text-green-800',
  canned: 'bg-red-200 text-red-800',
};

const HistoryView: React.FC<HistoryViewProps> = ({ history, updateStatus }) => {
  const handleExportCSV = () => {
    // CSV headers
    const headers = [
      "Roll Date",
      "Pain Point Summary",
      "App Name",
      "App Description",
      "Basic Price ($)",
      "Mid Price ($)",
      "Pro Price ($)",
      "Features",
      "Status"
    ];
    
    const rows = history.flatMap(item => {
      // Safely ensure date is parsed fine even if serialized as string
      const itemDate = item.date instanceof Date ? item.date : new Date(item.date);
      const dateStr = itemDate.toLocaleString().replace(/"/g, '""');
      const painSummary = item.phase1Output.painPointSummary.replace(/"/g, '""');
      
      return item.phase1Output.ideas.map(idea => {
        const name = idea.name.replace(/"/g, '""');
        const desc = idea.description.replace(/"/g, '""');
        
        const basicPrice = idea.pricing.find(p => p.tier === 'Basic' || p.tier === 'basic')?.price ?? 0;
        const midPrice = idea.pricing.find(p => p.tier === 'Mid' || p.tier === 'mid')?.price ?? 0;
        const proPrice = idea.pricing.find(p => p.tier === 'Pro' || p.tier === 'pro')?.price ?? 0;
        
        const featuresStr = idea.features.join('; ').replace(/"/g, '""');
        const status = item.ideaStatuses[idea.id] || 'unused';
        
        return [
          `"${dateStr}"`,
          `"${painSummary}"`,
          `"${name}"`,
          `"${desc}"`,
          basicPrice,
          midPrice,
          proPrice,
          `"${featuresStr}"`,
          `"${status}"`
        ];
      });
    });
    
    // Use UTF-8 BOM to ensure compatibility across Excel and standard tools
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `appdice_idea_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8 border-b border-midnight-navy/5 pb-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-bold font-heading text-midnight-navy">Roll History</h2>
          <p className="text-xs text-midnight-navy/60 mt-0.5">Explore, manage, and download all generated app startup ideas.</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-2 bg-midnight-navy text-white hover:bg-midnight-navy/90 active:scale-[0.98] transition-all px-4 py-2.5 rounded-lg text-xs md:text-sm font-bold shadow-sm self-start sm:self-auto cursor-pointer"
            title="Export all generated app concepts as CSV text sheet"
          >
            <Icon name="download" className="w-4 h-4 text-cyber-lime" />
            <span>Export to CSV</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Your roll history is empty. Generate some ideas to see them here!</p>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {history.map((item) => (
            <div key={item.id} className="bg-white p-4 md:p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl font-bold font-heading">Roll from {item.date.toLocaleString()}</h3>
              </div>
              <p className="text-sm md:text-md font-semibold mb-2">Pain Point Summary:</p>
              <p className="text-xs md:text-sm bg-cloud-dancer p-3 rounded-lg mb-4">{item.phase1Output.painPointSummary}</p>
              
              <div className="space-y-3 md:space-y-4">
                {item.phase1Output.ideas.map(idea => (
                  <div key={idea.id} className="p-3 bg-cloud-dancer rounded-lg flex flex-col gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-sm md:text-base">{idea.name}</p>
                      <p className="text-xs md:text-sm text-midnight-navy/70">{idea.description}</p>
                    </div>
                    <div className="flex items-center">
                      <select 
                        value={item.ideaStatuses[idea.id] || 'unused'} 
                        onChange={(e) => updateStatus(item.id, idea.id, e.target.value as IdeaStatus)}
                        className={`capitalize text-xs md:text-sm rounded-md px-3 py-1.5 border-0 focus:ring-2 focus:ring-midnight-navy w-full ${statusColors[item.ideaStatuses[idea.id] || 'unused']}`}
                      >
                        <option value="unused">Unused</option>
                        <option value="saved">Saved</option>
                        <option value="deployed">Deployed</option>
                        <option value="canned">Canned</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
