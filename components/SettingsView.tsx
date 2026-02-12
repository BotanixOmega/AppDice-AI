
import React from 'react';

const SettingsView: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-4xl font-bold font-heading mb-8">Settings</h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold font-heading mb-4">User Information</h3>
        <p>User settings and profile information will be available here in a future update.</p>
      </div>
      <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold font-heading mb-4">Prompt Settings</h3>
        <p>Global prompt configurations and customizations will be managed from this section.</p>
      </div>
       <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold font-heading mb-4">API Key</h3>
        <p>API key management is handled externally. Please ensure your `API_KEY` environment variable is set correctly.</p>
      </div>
    </div>
  );
};

export default SettingsView;
