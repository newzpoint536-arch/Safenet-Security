import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  KeyRound, 
  CheckCircle2, 
  RefreshCw,
  HelpCircle,
  ChevronLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const { 
    navigate, 
    isAdminAuthenticated, 
    adminUser, 
    loginAdmin, 
    setupInitialSuperAdmin,
    resetAdminPassword 
  } = useApp();

  // Status check for initial provisioning
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [isSetupCompleted, setIsSetupCompleted] = useState<boolean>(true);
  
  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial Provisioning Form State
  const [setupName, setSetupName] = useState('');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [setupRecoveryPassphrase, setSetupRecoveryPassphrase] = useState('');
  const [showSetupPassword, setShowSetupPassword] = useState(false);
  const [setupSuccess, setSetupSuccess] = useState(false);

  // Recovery / Forgot Password State
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryPassphrase, setRecoveryPassphrase] = useState('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAdminAuthenticated, navigate]);

  // Check setup status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/admin/setup-status');
        if (res.ok) {
          const data = await res.json();
          setIsSetupCompleted(Boolean(data.isSetup));
        }
      } catch (err) {
        console.warn('Failed to verify admin setup status:', err);
      } finally {
        setCheckingSetup(false);
      }
    }
    checkStatus();
  }, []);

  // Handle Administrator Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please provide both administrative email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginAdmin(email, password);
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMessage(result.error || 'Authentication rejected. Verify your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Initial Provisioning of first Super Admin
  const handleInitialSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!setupName.trim() || !setupEmail.trim() || !setupPassword) {
      setErrorMessage('All required fields must be provided.');
      return;
    }

    if (setupPassword.length < 8) {
      setErrorMessage('Master password must be at least 8 characters long.');
      return;
    }

    if (setupPassword !== setupConfirmPassword) {
      setErrorMessage('Master password confirmation does not match.');
      return;
    }

    if (setupRecoveryPassphrase && setupRecoveryPassphrase.length < 8) {
      setErrorMessage('Emergency recovery passphrase must be at least 8 characters if provided.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await setupInitialSuperAdmin({
        name: setupName,
        email: setupEmail,
        password: setupPassword,
        recoveryPassphrase: setupRecoveryPassphrase || undefined
      });

      if (result.success) {
        setSetupSuccess(true);
        setIsSetupCompleted(true);
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1200);
      } else {
        setErrorMessage(result.error || 'Failed to complete initial administrator provisioning.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while provisioning administrator.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Recovery Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMessage(null);

    if (!recoveryEmail || !recoveryPassphrase || !recoveryNewPassword) {
      setRecoveryMessage({ type: 'error', text: 'All recovery fields are required.' });
      return;
    }

    if (recoveryNewPassword.length < 8) {
      setRecoveryMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }

    setRecoveryLoading(true);
    try {
      const result = await resetAdminPassword(recoveryEmail, recoveryPassphrase, recoveryNewPassword);
      if (result.success) {
        setRecoveryMessage({
          type: 'success',
          text: 'Master credentials updated successfully. You may now log in.'
        });
        setTimeout(() => {
          setShowRecoveryModal(false);
          setEmail(recoveryEmail);
          setRecoveryMessage(null);
        }, 1800);
      } else {
        setRecoveryMessage({ type: 'error', text: result.error || 'Emergency reset failed.' });
      }
    } catch (err: any) {
      setRecoveryMessage({ type: 'error', text: err.message || 'Failed to reset password.' });
    } finally {
      setRecoveryLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950 px-4">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <span className="text-xs uppercase tracking-widest font-mono">Verifying Security Perimeter...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Tactical Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Back Link to Public Site */}
        <div className="mb-6 flex justify-between items-center text-xs">
          <button
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Public Website</span>
          </button>
          <span className="font-mono text-[11px] text-emerald-400/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Perimeter Secure
          </span>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden">
          
          {/* Card Header */}
          <div className="p-6 border-b border-slate-800/80 bg-slate-950/50 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400/20 to-blue-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
              <Shield className="w-7 h-7 stroke-[2]" />
            </div>
            <h1 className="text-xl font-bold font-heading text-white tracking-tight">
              SafeNet Security Solutions Ltd
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">
              Central Command & Tactical Operations Desk
            </p>
          </div>

          <div className="p-6">
            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-lg bg-red-950/60 border border-red-800/60 flex items-start gap-3 text-red-200 text-xs">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* CASE 1: INITIAL PROVISIONING WIZARD */}
            {!isSetupCompleted ? (
              <div className="space-y-4">
                <div className="p-3 bg-amber-400/10 border border-amber-400/30 rounded-lg text-amber-300 text-xs leading-relaxed">
                  <div className="font-bold flex items-center gap-1.5 text-amber-400 mb-1">
                    <KeyRound className="w-4 h-4" />
                    <span>Initial System Deployment Provisioning</span>
                  </div>
                  No administrative credentials exist in this environment. As the authorized systems administrator, configure the primary Super Administrator account.
                </div>

                {setupSuccess ? (
                  <div className="py-8 text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                    <h3 className="text-base font-bold text-white">Super Administrator Provisioned</h3>
                    <p className="text-xs text-slate-400">Initializing session tokens and redirecting to Operations Command...</p>
                  </div>
                ) : (
                  <form onSubmit={handleInitialSetup} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Full Name & Rank
                      </label>
                      <input
                        type="text"
                        required
                        value={setupName}
                        onChange={(e) => setSetupName(e.target.value)}
                        placeholder="e.g., Capt. Emmanuel Adeleke (Rtd.)"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Official Administrative Email
                      </label>
                      <input
                        type="email"
                        required
                        value={setupEmail}
                        onChange={(e) => setSetupEmail(e.target.value)}
                        placeholder="admin@safenetsecurityltd.com"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Master Passphrase (Min. 8 characters)
                      </label>
                      <div className="relative">
                        <input
                          type={showSetupPassword ? 'text' : 'password'}
                          required
                          value={setupPassword}
                          onChange={(e) => setSetupPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 pr-9 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSetupPassword(!showSetupPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                        >
                          {showSetupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Confirm Master Passphrase
                      </label>
                      <input
                        type={showSetupPassword ? 'text' : 'password'}
                        required
                        value={setupConfirmPassword}
                        onChange={(e) => setSetupConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-slate-300">
                          Emergency Recovery Passphrase (Optional)
                        </label>
                        <span className="text-[10px] text-slate-400">Used for credential reset</span>
                      </div>
                      <input
                        type="text"
                        value={setupRecoveryPassphrase}
                        onChange={(e) => setSetupRecoveryPassphrase(e.target.value)}
                        placeholder="e.g., Tactical-Recovery-Alpha-2026"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Encrypting & Provisioning...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Provision Super Administrator</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* CASE 2: STANDARD ADMINISTRATOR LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Administrator Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@safenetsecurityltd.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Security Passphrase</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRecoveryModal(true)}
                      className="text-[11px] text-amber-400/90 hover:text-amber-300 transition-colors"
                    >
                      Emergency Recovery?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-400/10"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Authenticate to Command Desk</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-center">
                  <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Protected by Rate-Limiting & PBKDF2-SHA512 Encryption</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Security & Regulatory Footnote */}
        <div className="mt-6 text-center space-y-1 text-[11px] text-slate-400 font-mono">
          <div>SafeNet Security Operations Centre (SOC)</div>
          <div>NSCDC Category A Licensed • ISO 9001:2015 • ISO 18788</div>
        </div>
      </div>

      {/* Emergency Credential Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Emergency Credential Recovery</span>
              </h3>
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            {recoveryMessage && (
              <div className={`mb-4 p-3 rounded-lg text-xs leading-relaxed ${
                recoveryMessage.type === 'success' 
                  ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200' 
                  : 'bg-red-950/60 border border-red-800 text-red-200'
              }`}>
                {recoveryMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Administrative Email</label>
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="admin@safenetsecurityltd.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Emergency Recovery Passphrase</label>
                <input
                  type="password"
                  required
                  value={recoveryPassphrase}
                  onChange={(e) => setRecoveryPassphrase(e.target.value)}
                  placeholder="Enter passphrase supplied during setup"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">New Master Password (Min 8 chars)</label>
                <input
                  type="password"
                  required
                  value={recoveryNewPassword}
                  onChange={(e) => setRecoveryNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  {recoveryLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Credentials</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
