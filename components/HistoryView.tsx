
import React from 'react';
import { HistoryItem, IdeaStatus } from '../types';

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
  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      <h2 className="text-2xl md:text-4xl font-bold font-heading mb-6 md:mb-8">Roll History</h2>
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
