
import React from 'react';
import { MenuItem } from '../types';
import { Icon } from './Icon';

interface LeftMenuProps {
  currentView: MenuItem;
  setCurrentView: (view: MenuItem) => void;
}

const menuItems: { id: MenuItem; name: string; icon: string }[] = [
  { id: 'roll', name: 'Roll', icon: 'roll' },
  { id: 'dashboard', name: 'Dashboard', icon: 'dashboard' },
  { id: 'history', name: 'History', icon: 'history' },
  { id: 'vault', name: 'My Vault', icon: 'vault' },
  { id: 'settings', name: 'Settings', icon: 'settings' },
];

const LeftMenu: React.FC<LeftMenuProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-[30%] h-full bg-midnight-navy text-cloud-dancer p-6 flex flex-col">
      <div className="flex items-center mb-12">
        <h1 className="text-3xl font-heading font-bold text-cyber-lime">AppDice AI</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 w-full text-left text-lg hover:bg-cloud-dancer/10 ${
              currentView === item.id ? 'bg-cyber-lime text-midnight-navy' : ''
            }`}
          >
            <Icon name={item.icon} className="w-6 h-6"/>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto text-sm text-cloud-dancer/50">
        <p>&copy; {new Date().getFullYear()} AppDice AI</p>
        <p>Powered by Taoana Systems</p>
      </div>
    </aside>
  );
};

export default LeftMenu;