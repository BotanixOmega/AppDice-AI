
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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

  // Calculate main width: 100% - sidebar - rightPanel
  // We'll use flex-1 for main and fixed widths for others

  return (
    <div className="flex flex-col h-full w-full bg-cloud-dancer text-midnight-navy font-body leading-relaxed overflow-hidden">
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block h-full flex-shrink-0 transition-all duration-300 ease-in-out" style={{ width: isSidebarCollapsed ? '80px' : '280px' }}>
          <LeftMenu 
            currentView={currentView} 
            setCurrentView={setCurrentView} 
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />
        </div>

        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
          {/* Main Content */}
          <main className="flex-1 h-0 min-h-0 overflow-y-auto transition-all duration-300 ease-in-out">
            {renderView()}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden flex-shrink-0 bg-midnight-navy text-cloud-dancer h-[calc(4.5rem+env(safe-area-inset-bottom))] flex items-center justify-around z-[60] border-t border-white/10 px-2 pb-[env(safe-area-inset-bottom)]">
        {[
          { id: 'roll', icon: 'roll', label: 'Roll' },
          { id: 'dashboard', icon: 'dashboard', label: 'Dash' },
          { id: 'history', icon: 'history', label: 'History' },
          { id: 'vault', icon: 'vault', label: 'Vault' },
          { id: 'settings', icon: 'settings', label: 'Settings' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as MenuItem)}
            className={`flex flex-col items-center justify-center space-y-1 flex-1 h-full transition-colors ${
              currentView === item.id ? 'text-cyber-lime' : 'text-cloud-dancer/60'
            }`}
          >
            <Icon name={item.icon} className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Global Footer - Locked across the bottom */}
      <footer className="flex-shrink-0 bg-midnight-navy text-cloud-dancer/40 border-t border-white/10 px-6 py-3 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-[0.2em] font-bold z-50">
        <div className="flex items-center space-x-4">
          <span>&copy; {new Date().getFullYear()} AppDice AI</span>
          <span className="hidden md:inline border-l border-white/10 h-3" />
          <span className="text-cyber-lime/40">v1.2.0 - Stable</span>
        </div>
        <div className="hidden md:block">
          <span className="text-cloud-dancer/30">System Status: </span>
          <span className="text-cyber-lime">Active</span>
        </div>
        <div className="mt-2 md:mt-0">
          Powered by <span className="text-cyber-lime/60">MO TAOANA</span>
        </div>
      </footer>
    </div>
  );
};

export default App;