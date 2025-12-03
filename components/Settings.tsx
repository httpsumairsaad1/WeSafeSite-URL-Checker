import React, { useState } from 'react';
import { 
  User, Shield, Bell, Cpu, CreditCard, Save, 
  Check, Lock, Smartphone, Mail, Globe, 
  Zap, AlertTriangle, Key, ChevronRight, ToggleRight
} from 'lucide-react';

type Tab = 'account' | 'security' | 'notifications' | 'agents' | 'billing';

const Tabs = [
  { id: 'account', label: 'Account & Org', icon: User },
  { id: 'security', label: 'Security & Keys', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'agents', label: 'Agent Config', icon: Cpu },
  { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
];

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('account');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">System Configuration</h1>
          <p className="text-slate-400">Manage your profile, security preferences, and autonomous agent behavior.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all
            ${saved 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
              : 'bg-primary hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/10'}
          `}
        >
          {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saved ? 'Changes Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-surface border border-slate-800 rounded-xl overflow-hidden sticky top-8">
            {Tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-4 text-sm font-medium transition-colors border-l-2
                    ${isActive 
                      ? 'bg-slate-800/50 text-white border-primary' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border-transparent'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-surface border border-slate-800 rounded-xl p-8 min-h-[600px]">
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'agents' && <AgentSettings />}
          {activeTab === 'billing' && <BillingSettings />}
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components for Each Tab --- */

const AccountSettings = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-primary" /> Profile Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-400 uppercase">Full Name</label>
          <input type="text" defaultValue="Alex Cipher" className="input-field" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-400 uppercase">Email Address</label>
          <input type="email" defaultValue="alex@wesafesite.com" className="input-field" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-400 uppercase">Job Title</label>
          <input type="text" defaultValue="Lead Security Engineer" className="input-field" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-400 uppercase">Phone (Optional)</label>
          <input type="tel" defaultValue="+1 (555) 000-1337" className="input-field" />
        </div>
      </div>
    </div>

    <div className="pt-8 border-t border-slate-800">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Globe className="w-5 h-5 text-blue-500" /> Organization Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-400 uppercase">Company Name</label>
          <input type="text" defaultValue="Cyberdyne Systems" className="input-field" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-mono text-slate-400 uppercase">Website URL</label>
          <input type="url" defaultValue="https://cyberdyne.net" className="input-field" />
        </div>
      </div>
    </div>
  </div>
);

const SecuritySettings = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Lock className="w-5 h-5 text-primary" /> Password & Authentication
      </h2>
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-800 rounded-full">
              <Key className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-white font-medium">Change Password</p>
              <p className="text-xs text-slate-500">Last changed 3 months ago</p>
            </div>
          </div>
          <button className="text-sm text-primary hover:text-emerald-400 font-medium">Update</button>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-slate-800 rounded-full">
              <Smartphone className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-slate-500">Secure your account with 2FA</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Enabled</span>
            <button className="text-sm text-slate-400 hover:text-white">Configure</button>
          </div>
        </div>
      </div>
    </div>

    <div className="pt-8 border-t border-slate-800">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-purple-500" /> API Access Keys
      </h2>
      <p className="text-slate-400 text-sm mb-6">Manage API keys for CI/CD integration and external monitoring tools.</p>
      
      <div className="space-y-3">
        {[
            { name: "Production CI/CD", key: "ws_live_938...4x2", lastUsed: "2 mins ago" },
            { name: "Dev Environment", key: "ws_dev_821...9k9", lastUsed: "5 days ago" }
        ].map((key, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                <div>
                    <p className="text-white font-mono text-sm font-bold">{key.name}</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">{key.key} • Last used: {key.lastUsed}</p>
                </div>
                <button className="text-red-400 hover:text-red-300 text-xs font-bold uppercase">Revoke</button>
            </div>
        ))}
        <button className="mt-4 flex items-center gap-2 text-sm text-primary font-bold hover:text-emerald-400">
            <Zap className="w-4 h-4" /> Generate New Key
        </button>
      </div>
    </div>
  </div>
);

const NotificationSettings = () => (
  <div className="space-y-8">
     <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" /> Alert Preferences
      </h2>

      <div className="space-y-6">
        <NotificationToggle 
            title="Critical Vulnerability Detected" 
            desc="Immediate alert when a High or Critical severity issue is found."
            defaultChecked
        />
        <NotificationToggle 
            title="Automatic Patch Applied" 
            desc="Notify when the Patcher agent successfully fixes a vulnerability."
            defaultChecked
        />
        <NotificationToggle 
            title="Weekly Security Digest" 
            desc="A summary report of all activity and improved security score."
        />
        <NotificationToggle 
            title="Agent Offline Alert" 
            desc="Get notified if any agent in the swarm goes offline."
            defaultChecked
        />
      </div>

      <div className="pt-8 border-t border-slate-800">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" /> Channels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="p-4 border border-emerald-500/50 bg-emerald-500/10 rounded-lg flex items-center justify-between">
                    <span className="font-medium text-emerald-400">Email</span>
                    <Check className="w-4 h-4 text-emerald-500" />
               </div>
               <div className="p-4 border border-slate-700 bg-slate-800/50 rounded-lg flex items-center justify-between opacity-50 cursor-not-allowed">
                    <span className="font-medium text-slate-400">Slack</span>
                    <span className="text-[10px] uppercase bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">Pro</span>
               </div>
               <div className="p-4 border border-slate-700 bg-slate-800/50 rounded-lg flex items-center justify-between opacity-50 cursor-not-allowed">
                    <span className="font-medium text-slate-400">Teams</span>
                    <span className="text-[10px] uppercase bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">Ent</span>
               </div>
          </div>
      </div>
  </div>
);

const NotificationToggle: React.FC<{title: string, desc: string, defaultChecked?: boolean}> = ({title, desc, defaultChecked}) => (
    <div className="flex items-start justify-between">
        <div>
            <p className="text-white font-medium">{title}</p>
            <p className="text-sm text-slate-500">{desc}</p>
        </div>
        <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </div>
    </div>
);

const AgentSettings = () => (
    <div className="space-y-8">
        <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" /> Autonomous Behavior
            </h2>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6">
                
                <div className="space-y-3">
                    <label className="text-white font-medium block">Scan Intensity</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Passive', 'Balanced', 'Aggressive'].map((mode, i) => (
                            <button key={mode} className={`py-2 rounded-lg text-sm font-bold border transition-colors ${i === 1 ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'}`}>
                                {mode}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500">
                        Balanced: Standard testing. Aggressive: May trigger WAFs or degrade performance.
                    </p>
                </div>

                <div className="h-px bg-slate-800"></div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <label className="text-white font-medium block">Auto-Patching Strategy</label>
                        <span className="text-xs font-mono bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded">Requires Approval</span>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                        Determine how the Patcher agent applies fixes to your codebase.
                    </p>
                    <select className="input-field">
                        <option>Human Review Required (Recommended)</option>
                        <option>Auto-apply Low Severity only</option>
                        <option>Fully Autonomous (Experimental)</option>
                    </select>
                </div>
            </div>
        </div>

        <div>
             <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500" /> Target Scope
            </h2>
             <div className="space-y-2">
                <label className="text-sm font-mono text-slate-400 uppercase">Allowed Domains (Comma separated)</label>
                <textarea className="input-field min-h-[100px]" defaultValue="cyberdyne.net, api.cyberdyne.net, staging.cyberdyne.net" />
            </div>
        </div>
    </div>
);

const BillingSettings = () => (
    <div className="space-y-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" /> Current Plan
        </h2>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Shield className="w-32 h-32 text-primary" />
            </div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-white">Pro Plan</h3>
                    <span className="bg-primary text-slate-950 text-xs font-bold px-2 py-1 rounded">ACTIVE</span>
                </div>
                <p className="text-slate-400 mb-6 max-w-md">You have access to advanced agent capabilities, unlimited scans, and priority support.</p>
                
                <div className="flex gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500" /> 5 Concurrent Agents
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                         <Check className="w-4 h-4 text-emerald-500" /> 1 Year History
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="bg-white hover:bg-slate-200 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                        Manage Subscription
                    </button>
                    <button className="text-slate-400 hover:text-white font-medium text-sm">
                        View Invoices
                    </button>
                </div>
            </div>
        </div>
    </div>
);


/* Styles */
const style = document.createElement('style');
style.textContent = `
  .input-field {
    width: 100%;
    background-color: rgba(2, 6, 23, 0.5); /* slate-950/50 */
    border: 1px solid rgb(51, 65, 85); /* slate-700 */
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    color: white;
    font-size: 0.875rem;
    transition: all 0.2s;
  }
  .input-field:focus {
    outline: none;
    border-color: #10b981; /* primary */
    box-shadow: 0 0 0 1px #10b981;
  }
`;
document.head.appendChild(style);
