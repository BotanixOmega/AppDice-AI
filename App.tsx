
import React, { useState, useCallback } from 'react';
import LeftMenu from './components/LeftMenu';
import RollView from './components/RollView';
import DashboardView from './components/DashboardView';
import HistoryView from './components/HistoryView';
import VaultView from './components/VaultView';
import SettingsView from './components/SettingsView';
import { MenuItem, HistoryItem, VaultItem, AppIdea, IdeaStatus, VaultStage } from './types';
import { Icon } from './components/Icon';


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<MenuItem>('roll');
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [vault, setVault] = useState<VaultItem[]>([]);

  const addToHistory = useCallback((item: Omit<HistoryItem, 'id' | 'date'>) => {
    setHistory(prev => [{ ...item, id: Date.now().toString(), date: new Date() }, ...prev]);
  }, []);

  const addToVault = useCallback((idea: AppIdea) => {
    // Prevent duplicates
    if (vault.some(item => item.idea.id === idea.id)) return;
    setVault(prev => [{ id: Date.now().toString(), idea, stage: 'concept' }, ...prev]);
  }, [vault]);
  
  const updateHistoryItemStatus = (historyItemId: string, ideaId: string, status: IdeaStatus) => {
    setHistory(prev => prev.map(item => {
      if (item.id === historyItemId) {
        return {
          ...item,
          ideaStatuses: {
            ...item.ideaStatuses,
            [ideaId]: status,
          }
        };
      }
      return item;
    }));
  };
  
  const updateVaultItemStage = (vaultItemId: string, stage: VaultStage) => {
    setVault(prev => prev.map(item => item.id === vaultItemId ? { ...item, stage } : item));
  };


  const renderView = () => {
    switch (currentView) {
      case 'roll':
        return <RollView addToHistory={addToHistory} addToVault={addToVault} />;
      case 'dashboard':
        return <DashboardView history={history} vault={vault} />;
      case 'history':
        return <HistoryView history={history} updateStatus={updateHistoryItemStatus} />;
      case 'vault':
        return <VaultView vault={vault} updateStage={updateVaultItemStage} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <RollView addToHistory={addToHistory} addToVault={addToVault} />;
    }
  };

  return (
    <div className="flex h-screen bg-cloud-dancer text-midnight-navy font-body leading-relaxed">
      <LeftMenu currentView={currentView} setCurrentView={setCurrentView} />
      <main className={`transition-all duration-300 ease-in-out h-full ${isConfigOpen ? 'w-[60%]' : 'w-[70%]'}`}>
        {renderView()}
      </main>
      {currentView === 'roll' && (
        <div className={`transition-all duration-300 ease-in-out h-full bg-midnight-navy/5 overflow-hidden ${isConfigOpen ? 'w-[10%]' : 'w-0'}`}>
          <button 
            onClick={() => setIsConfigOpen(!isConfigOpen)} 
            className="absolute top-1/2 -translate-y-1/2 bg-midnight-navy text-cyber-lime rounded-l-full w-6 h-16 flex items-center justify-center"
            style={{ right: isConfigOpen ? '10%' : '0' }}
          >
            <Icon name={isConfigOpen ? 'chevronRight' : 'chevronLeft'} className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;