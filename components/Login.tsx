import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, UserCheck, ArrowRight, ArrowLeft, Building2, 
  Briefcase, User, Mail, CheckCircle2, Loader2,
  ShieldCheck, Eye, EyeOff, Terminal, Key,
  FileCode, Bug, Siren, Radio, Wifi, Database,
  Server, HardDrive, Network, Globe, Cpu, AlertCircle
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

// 20+ Cyber Security Icons for the background
const ICONS = [
  Shield, Lock, Terminal, ShieldCheck, UserCheck, 
  Key, FileCode, Bug, Siren, Radio, 
  Wifi, Database, Server, HardDrive, Network, 
  Globe, Cpu, Eye, EyeOff, Building2, Briefcase
];

export const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we should default to signup based on navigation state
  const [isSignUp, setIsSignUp] = useState(false);
  
  useEffect(() => {
    if (location.search.includes('mode=signup')) {
      setIsSignUp(true);
    }
  }, [location]);

  // Form State
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    role: 'Security Engineer',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null); // Clear error on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
        if (isSignUp) {
            // Register Flow
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            
            // Update profile with name (Note: Firestore would be better for company/role)
            await updateProfile(userCredential.user, {
                displayName: formData.fullName
            });
            
            // In a real app, save company/role to Firestore 'users' collection here
            console.log("Registered:", userCredential.user.uid, formData.company, formData.role);
            
        } else {
            // Login Flow
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
        }
        
        onLogin(); // Trigger app state update
    } catch (err: any) {
        console.error("Auth Error:", err);
        // Map common Firebase errors to user-friendly messages
        let msg = "Authentication failed. Please try again.";
        if (err.code === 'auth/invalid-email') msg = "Invalid email address.";
        if (err.code === 'auth/user-not-found') msg = "No user found with this email.";
        if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
        if (err.code === 'auth/email-already-in-use') msg = "Email already registered.";
        if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
        
        setError(msg);
    } finally {
        setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617] -z-20"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10"></div>
      
      {/* Floating Icons Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {Array.from({ length: 24 }).map((_, i) => {
            const Icon = ICONS[i % ICONS.length];
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = 3 + Math.random() * 4;
            return (
                <div 
                    key={i} 
                    className="absolute animate-pulse"
                    style={{ 
                      top: `${top}%`, 
                      left: `${left}%`, 
                      animationDelay: `${delay}s`,
                      animationDuration: `${duration}s`
                    }}
                >
                    <Icon className="w-8 h-8 text-emerald-500/30" />
                </div>
            )
        })}
      </div>

      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <div className="p-2 rounded-full bg-slate-900/50 border border-slate-700/50 group-hover:border-primary/50 transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </div>
        <span className="font-mono text-sm font-medium hidden sm:inline-block">Back to Base</span>
      </button>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="p-8 pb-6 text-center border-b border-slate-800/50">
            <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-5 border border-primary/20 shadow-lg shadow-emerald-500/10">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              {isSignUp ? 'Initialize Protocol' : 'Agent Authentication'}
            </h2>
            <p className="text-slate-400">
              {isSignUp ? 'Register for autonomous security clearance.' : 'Enter credentials to access mission control.'}
            </p>
          </div>

          <div className="p-8 pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Error Alert */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
              )}

              {isSignUp && (
                <div className="animate-in fade-in slide-in-from-top-4 space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-mono text-emerald-500/80 uppercase font-semibold ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                            <input 
                                name="fullName"
                                type="text" 
                                placeholder="John Doe"
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                value={formData.fullName}
                                onChange={handleChange}
                                required={isSignUp}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Company */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono text-emerald-500/80 uppercase font-semibold ml-1">Organization</label>
                            <div className="relative group">
                                <Building2 className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input 
                                    name="company"
                                    type="text" 
                                    placeholder="Acme Corp"
                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required={isSignUp}
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-mono text-emerald-500/80 uppercase font-semibold ml-1">Role</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                <select 
                                    name="role"
                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option>Security Engineer</option>
                                    <option>Developer</option>
                                    <option>CISO / Manager</option>
                                    <option>DevOps / SRE</option>
                                    <option>Student / Researcher</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-emerald-500/80 uppercase font-semibold ml-1">Work Email</label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input 
                        name="email"
                        type="email" 
                        placeholder="agent@company.com"
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-emerald-500/80 uppercase font-semibold ml-1">Passcode</label>
                <div className="relative group">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <input 
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-emerald-600 text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Authenticating...</span>
                    </>
                ) : (
                    <>
                        <span>{isSignUp ? 'Initiate Registration' : 'Access System'}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </button>
            </form>
          </div>

          {/* Footer / Toggle */}
          <div className="p-6 bg-slate-950/50 border-t border-slate-800/50 text-center">
            <button 
                onClick={toggleMode}
                className="text-slate-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2 mx-auto"
            >
                {isSignUp ? (
                    <>Already have clearance? <span className="text-primary font-semibold">Sign In</span></>
                ) : (
                    <>Need access? <span className="text-primary font-semibold">Request Clearance</span></>
                )}
            </button>
          </div>
        </div>
        
        {/* Compliance badges */}
        <div className="flex justify-center gap-6 mt-8 opacity-50">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle2 className="w-3 h-3" /> SOC2 Compliant
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Lock className="w-3 h-3" /> End-to-End Encrypted
            </div>
        </div>
      </div>
    </div>
  );
};
