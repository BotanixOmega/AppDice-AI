
import React from 'react';
import { MenuItem } from '../types';
import { Icon } from './Icon';

interface LeftMenuProps {
  currentView: MenuItem;
  setCurrentView: (view: MenuItem) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const menuItems: { id: MenuItem; name: string; icon: string }[] = [
  { id: 'roll', name: 'Roll', icon: 'roll' },
  { id: 'dashboard', name: 'Dashboard', icon: 'dashboard' },
  { id: 'history', name: 'History', icon: 'history' },
  { id: 'vault', name: 'My Vault', icon: 'vault' },
  { id: 'settings', name: 'Settings', icon: 'settings' },
];

const LeftMenu: React.FC<LeftMenuProps> = ({ currentView, setCurrentView, isCollapsed, setIsCollapsed }) => {
  return (
    <aside className="w-full h-full bg-midnight-navy text-cloud-dancer p-6 flex flex-col transition-all duration-300 ease-in-out relative">
      {/* Header / Logo */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'} mb-16 mt-4`}>
        <div className="bg-cyber-lime p-2.5 rounded-xl text-midnight-navy shadow-[0_0_20px_rgba(204,255,0,0.4)] flex-shrink-0">
          <Icon name="logo" className="w-7 h-7" />
        </div>
        {!isCollapsed && (
          <h1 className="text-2xl font-heading font-bold text-cyber-lime tracking-tight whitespace-nowrap overflow-hidden">AppDice AI</h1>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-3 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            title={isCollapsed ? item.name : ''}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4 px-5'} py-4 rounded-xl transition-all duration-200 w-full text-left group relative ${
              currentView === item.id 
                ? 'bg-cyber-lime text-midnight-navy shadow-[0_4px_15px_rgba(204,255,0,0.25)]' 
                : 'hover:bg-white/5 text-cloud-dancer/60 hover:text-cloud-dancer'
            }`}
          >
            <Icon name={item.icon} className={`w-6 h-6 transition-transform duration-200 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
            {!isCollapsed && <span className="font-bold text-xs uppercase tracking-[0.15em] whitespace-nowrap">{item.name}</span>}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-midnight-navy text-cyber-lime text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-50 border border-white/10 shadow-2xl">
                {item.name}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle Button - Centered on border */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-20 bg-midnight-navy border border-white/10 text-cyber-lime rounded-full p-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:bg-cyber-lime hover:text-midnight-navy transition-all z-20 active:scale-90"
      >
        <Icon name={isCollapsed ? 'chevronRight' : 'chevronLeft'} className="w-4 h-4" />
      </button>
    </aside>
  );
};

export default LeftMenu;