
import React, { useState, useEffect } from 'react';
import { getGeminiApiKey, testApiConnection } from '../services/geminiService';
import { Icon } from './Icon';

const SettingsView: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Load key from localStorage on mount (only load what's actually in browser storage to avoid displaying global fallback secrets)
  useEffect(() => {
    const saved = localStorage.getItem("gemini_api_key");
    if (saved) {
      setApiKey(saved);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      localStorage.removeItem("gemini_api_key");
      setSaveStatus("Custom key cleared. Falling back to environment variables.");
    } else {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      setSaveStatus("Gemini API key saved to your browser's private localStorage successfully!");
    }
    setTestResult(null); // Clear previous tests
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleClear = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey('');
    setTestResult(null);
    setSaveStatus("Custom key cleared from browser cache.");
    setTimeout(() => setSaveStatus(null), 4000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testApiConnection(apiKey.trim() || undefined);
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ success: false, message: e?.message || "An exception occurred during testing." });
    } finally {
      setTesting(false);
    }
  };

  // Determine if we are utilizing a custom localStorage key or fallback
  const isUsingCustomKey = typeof window !== 'undefined' && !!localStorage.getItem("gemini_api_key");
  const actualKeyInUse = getGeminiApiKey();

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto">
      <h2 className="text-2xl md:text-4xl font-bold font-heading mb-6 md:mb-8 text-midnight-navy">Settings</h2>
      
      <div className="space-y-6 max-w-4xl">
        {/* API Key management section */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-midnight-navy/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-midnight-navy/5 text-midnight-navy rounded-lg">
              <Icon name="key" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold font-heading text-midnight-navy">Gemini API Key</h3>
              <p className="text-xs text-midnight-navy/60">Configure your personal Gemini API key for real-time model synthesis.</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs md:text-sm text-midnight-navy/80 leading-relaxed">
              If your hosted deployment is missing the default <code className="bg-midnight-navy/5 px-1.5 py-0.5 rounded text-xs font-mono font-bold">GEMINI_API_KEY</code> environment variable, you can override it securely here. The key is saved directly to your browser's <strong className="font-semibold text-midnight-navy">localStorage</strong> and is never sent to any server other than directly to Google's official Gemini endpoint.
            </p>

            {/* Input & Visiblity Toggle Block */}
            <div className="relative mt-2">
              <input
                id="api-key-input"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your Gemini API Key here (AIzaSy...)"
                className="w-full text-xs md:text-sm rounded-lg pl-4 pr-12 py-3 border border-midnight-navy/20 bg-cloud-dancer/50 focus:bg-white focus:ring-2 focus:ring-midnight-navy focus:border-transparent outline-none transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-midnight-navy/55 hover:text-midnight-navy transition-colors focus:outline-none"
                title={showKey ? "Hide key" : "Show key"}
              >
                <Icon name="eye" className="w-5 h-5" />
              </button>
            </div>

            {/* Status Info Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-midnight-navy/60">Active Source:</span>
                {isUsingCustomKey ? (
                  <span className="bg-cyber-lime/20 text-midnight-navy font-bold px-2 py-0.5 rounded-full border border-cyber-lime/40">
                    Custom Browser Key
                  </span>
                ) : actualKeyInUse ? (
                  <span className="bg-midnight-navy/5 text-midnight-navy font-bold px-2 py-0.5 rounded-full">
                    System Environment Variable
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                     No Key Configured
                  </span>
                )}
              </div>
              {isUsingCustomKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-red-600 hover:text-red-800 hover:underline transition-colors font-semibold"
                >
                  Clear browser key & revert
                </button>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-midnight-navy text-white hover:bg-midnight-navy/90 active:scale-[0.98] transition-all px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold"
              >
                <Icon name="save" className="w-4 h-4" />
                <span>Save Key to Browser</span>
              </button>

              <button
                type="button"
                disabled={testing}
                onClick={handleTest}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 border border-midnight-navy/20 hover:bg-midnight-navy/5 active:scale-[0.98] transition-all px-5 py-2.5 rounded-lg text-xs md:text-sm font-bold text-midnight-navy ${testing ? 'opacity-55 cursor-not-allowed' : ''}`}
              >
                {testing ? (
                  <>
                    <Icon name="refresh" className="w-4 h-4 animate-spin text-midnight-navy/70" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Icon name="refresh" className="w-4 h-4" />
                    <span>Test Gateway Connection</span>
                  </>
                )}
              </button>
            </div>

            {/* Save Status Banner */}
            {saveStatus && (
              <div className="p-3 bg-cyber-lime/10 text-midnight-navy rounded-lg border border-cyber-lime/30 text-xs flex items-center space-x-2 animate-fadeIn">
                <Icon name="check" className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{saveStatus}</span>
              </div>
            )}

            {/* Test Connection Results Card */}
            {testResult && (
              <div className={`p-4 rounded-lg flex items-start space-x-3 border animate-fadeIn text-xs ${testResult.success ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'}`}>
                {testResult.success ? (
                  <Icon name="check" className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Icon name="alert" className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold mb-1">{testResult.success ? "Connection Secure!" : "Gateway Refused Authorization"}</h4>
                  <p className="leading-relaxed font-mono opacity-80">{testResult.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Prompt Instructions Section */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md border border-midnight-navy/10">
          <h3 className="text-xl md:text-2xl font-bold font-heading text-midnight-navy mb-4">Prompt Configuration</h3>
          <p className="text-xs md:text-sm text-midnight-navy/80 leading-relaxed mb-3">
            Prompt templates are designed utilizing the latest instructional alignments. To modify the generator's underlying reasoning model, expand structural directives, or tailor pricing calculations, edit the prompt layout inside <code className="bg-midnight-navy/5 px-1 py-0.5 rounded text-xs font-mono font-bold">services/geminiService.ts</code> directly in your workspace.
          </p>
          <ul className="list-disc pl-5 text-xs text-midnight-navy/70 space-y-2 mt-2">
            <li><strong>Phase 1 Primary Prompt</strong>: Custom crawls forums (such as Reddit/Quora) to locate validated pain points.</li>
            <li><strong>Phase 2 Technical Blueprint</strong>: Standardizes MVPs with responsive database architectures.</li>
            <li><strong>Phase 3 Stylist Spec</strong>: Prompts image generators with fully accessible color maps.</li>
            <li><strong>Phase 4 Launch Kit</strong>: Synthesizes high-conversion marketing copying packages.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
