
import React from 'react';

const SettingsView: React.FC = () => {
  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      <h2 className="text-2xl md:text-4xl font-bold font-heading mb-6 md:mb-8">Settings</h2>
      <div className="space-y-4 md:space-y-6">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
          <h3 className="text-xl md:text-2xl font-bold font-heading mb-4">User Information</h3>
          <p className="text-sm md:text-base">User settings and profile information will be available here in a future update.</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
          <h3 className="text-xl md:text-2xl font-bold font-heading mb-4">Prompt Settings</h3>
          <p className="text-sm md:text-base">Global prompt configurations and customizations will be managed from this section.</p>
        </div>
         <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
          <h3 className="text-xl md:text-2xl font-bold font-heading mb-4">API Key</h3>
          <p className="text-sm md:text-base">API key management is handled externally. Please ensure your `API_KEY` environment variable is set correctly.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
