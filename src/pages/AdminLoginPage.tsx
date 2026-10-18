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
    resetAdminPassword,
    ownerRecoveryAdmin
  } = useApp();

  // Status check for initial provisioning
  const [checkingSetup, setCheckingSetup] = useState(true);
  const [isSetupCompleted, setIsSetupCompleted] = useState<boolean>(true);
  const [setupKeyRequired, setSetupKeyRequired] = useState<boolean>(false);
  
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
  const [setupKey, setSetupKey] = useState('');
  const [showSetupPassword, setShowSetupPassword] = useState(false);
  const [setupSuccess, setSetupSuccess] = useState(false);

  // Emergency Recovery Passphrase Modal State
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryPassphrase, setRecoveryPassphrase] = useState('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Server-Authorized Owner Recovery Modal State
  const [showOwnerRecoveryModal, setShowOwnerRecoveryModal] = useState(false);
  const [ownerSecret, setOwnerSecret] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerConfirmPassword, setOwnerConfirmPassword] = useState('');
  const [ownerRecoveryPass, setOwnerRecoveryPass] = useState('');
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [ownerMessage, setOwnerMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
          setSetupKeyRequired(Boolean(data.setupKeyRequired));
        }
      } catch (err) {
        console.warn('Failed to verify admin setup status:', err);
      } finally {
        setCheckingSetup(false);
      }
    }
    checkStatus();
  }, []);

  // Password complexity helper
  const checkPasswordComplexity = (pwd: string): { valid: boolean; reason?: string } => {
    if (pwd.length < 10) return { valid: false, reason: 'Password must be at least 10 characters long.' };
    if (!/[A-Z]/.test(pwd)) return { valid: false, reason: 'Must contain at least one uppercase letter (A-Z).' };
    if (!/[a-z]/.test(pwd)) return { valid: false, reason: 'Must contain at least one lowercase letter (a-z).' };
    if (!/[0-9]/.test(pwd)) return { valid: false, reason: 'Must contain at least one numeric digit (0-9).' };
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd)) {
      return { valid: false, reason: 'Must contain at least one special character (!@#$%^&*...).' };
    }
    return { valid: true };
  };

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

    if (setupKeyRequired && !setupKey.trim()) {
      setErrorMessage('System environment requires a valid Initial Setup Authorization Key.');
      return;
    }

    const complexity = checkPasswordComplexity(setupPassword);
    if (!complexity.valid) {
      setErrorMessage(complexity.reason || 'Master password does not meet enterprise security requirements.');
      return;
    }

    if (setupPassword !== setupConfirmPassword) {
      setErrorMessage('Master password confirmation does not match.');
      return;
    }

    if (setupRecoveryPassphrase && setupRecoveryPassphrase.length < 10) {
      setErrorMessage('Emergency recovery passphrase must be at least 10 characters if provided.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await setupInitialSuperAdmin({
        name: setupName,
        email: setupEmail,
        password: setupPassword,
        recoveryPassphrase: setupRecoveryPassphrase || undefined,
        setupKey: setupKey ? setupKey.trim() : undefined
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

    const complexity = checkPasswordComplexity(recoveryNewPassword);
    if (!complexity.valid) {
      setRecoveryMessage({ type: 'error', text: complexity.reason || 'New password does not meet security requirements.' });
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

  // Handle Server-Authorized Owner Privilege Recovery
  const handleOwnerRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerMessage(null);

    if (!ownerSecret.trim() || !ownerEmail.trim() || !ownerPassword) {
      setOwnerMessage({ type: 'error', text: 'Authorization secret, new email, and master password are required.' });
      return;
    }

    const complexity = checkPasswordComplexity(ownerPassword);
    if (!complexity.valid) {
      setOwnerMessage({ type: 'error', text: complexity.reason || 'New password does not meet security requirements.' });
      return;
    }

    if (ownerPassword !== ownerConfirmPassword) {
      setOwnerMessage({ type: 'error', text: 'Master password confirmation does not match.' });
      return;
    }

    if (ownerRecoveryPass && ownerRecoveryPass.length < 10) {
      setOwnerMessage({ type: 'error', text: 'Emergency recovery passphrase must be at least 10 characters if provided.' });
      return;
    }

    setOwnerLoading(true);
    try {
      const result = await ownerRecoveryAdmin({
        recoverySecret: ownerSecret.trim(),
        newEmail: ownerEmail.trim(),
        newName: ownerName.trim() || undefined,
        newPassword: ownerPassword,
        newRecoveryPassphrase: ownerRecoveryPass.trim() || undefined
      });

      if (result.success) {
        setOwnerMessage({
          type: 'success',
          text: 'Super Administrator credentials recovered successfully! Access established.'
        });
        setTimeout(() => {
          setShowOwnerRecoveryModal(false);
          navigate('/admin/dashboard');
        }, 1200);
      } else {
        setOwnerMessage({ type: 'error', text: result.error || 'Owner recovery failed. Verify authorization secret.' });
      }
    } catch (err: any) {
      setOwnerMessage({ type: 'error', text: err.message || 'Error occurred during owner recovery.' });
    } finally {
      setOwnerLoading(false);
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

                    {setupKeyRequired && (
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg space-y-1.5">
                        <label className="block text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                          <span>Initial Setup Authorization Key</span>
                        </label>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          This deployment is protected by a server environment authorization key (INITIAL_SETUP_KEY).
                        </p>
                        <input
                          type="password"
                          required
                          value={setupKey}
                          onChange={(e) => setSetupKey(e.target.value)}
                          placeholder="Enter authorization key..."
                          className="w-full bg-slate-950 border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-slate-300">
                          Master Passphrase
                        </label>
                        <span className="text-[10px] text-amber-400 font-mono">OWASP Standard</span>
                      </div>
                      <div className="relative">
                        <input
                          type={showSetupPassword ? 'text' : 'password'}
                          required
                          value={setupPassword}
                          onChange={(e) => setSetupPassword(e.target.value)}
                          placeholder="Min. 10 chars (A-Z, a-z, 0-9, symbol)"
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
                      <p className="mt-1 text-[10px] text-slate-400">
                        Must contain at least 10 characters, uppercase, lowercase, number, and symbol.
                      </p>
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
                        placeholder="Re-enter master passphrase"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-slate-300">
                          Emergency Recovery Passphrase (Recommended)
                        </label>
                        <span className="text-[10px] text-slate-400">Min. 10 chars</span>
                      </div>
                      <input
                        type="text"
                        value={setupRecoveryPassphrase}
                        onChange={(e) => setSetupRecoveryPassphrase(e.target.value)}
                        placeholder="e.g., Tactical-Recovery-Alpha-2026"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                      <p className="mt-1 text-[10px] text-slate-500">
                        Stored via PBKDF2-SHA512 with cryptographic salt. Used exclusively for emergency credential recovery.
                      </p>
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
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowRecoveryModal(true)}
                        className="text-[11px] text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        Passphrase Reset
                      </button>
                      <span className="text-slate-700">·</span>
                      <button
                        type="button"
                        onClick={() => setShowOwnerRecoveryModal(true)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors font-semibold flex items-center gap-1"
                        title="Authorized Server Owner Credential Recovery"
                      >
                        <KeyRound className="w-3 h-3 text-amber-400" />
                        <span>Owner Recovery</span>
                      </button>
                    </div>
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
                <label className="block text-slate-300 mb-1">New Master Passphrase (Min. 10 chars, A-Z, a-z, 0-9, symbol)</label>
                <input
                  type="password"
                  required
                  value={recoveryNewPassword}
                  onChange={(e) => setRecoveryNewPassword(e.target.value)}
                  placeholder="Min. 10 chars with complexity"
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

      {/* Server-Authorized Owner Credential Recovery Modal */}
      {showOwnerRecoveryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-xl p-6 shadow-2xl space-y-4 my-8">
            <div className="flex justify-between items-start pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Shield className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <h3 className="text-sm font-bold text-white font-display">
                    SafeNet Directorate — Owner Credential Recovery
                  </h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Requires server-side verification of a one-time recovery authorization secret (<code className="text-amber-300 font-mono text-[10px]">OWNER_RECOVERY_KEY</code> or server token).
                </p>
              </div>
              <button
                onClick={() => {
                  setShowOwnerRecoveryModal(false);
                  setOwnerMessage(null);
                }}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            {ownerMessage && (
              <div className={`p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                ownerMessage.type === 'success' 
                  ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-200' 
                  : 'bg-red-950/70 border border-red-800 text-red-200'
              }`}>
                {ownerMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <span>{ownerMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleOwnerRecovery} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Server-Authorized One-Time Recovery Secret</span>
                </label>
                <input
                  type="password"
                  required
                  value={ownerSecret}
                  onChange={(e) => setOwnerSecret(e.target.value)}
                  placeholder="Enter OWNER_RECOVERY_KEY or server token"
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Supplied via secure server environment variable or generated protected token file. Single-use only.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    New Official Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="owner@safenetsecurityltd.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Administrator Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g., Capt. Emmanuel Adeleke (Rtd.)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-300 font-medium">
                    New Master Passphrase
                  </label>
                  <span className="text-[10px] text-amber-400 font-mono">Min. 10 Chars</span>
                </div>
                <input
                  type="password"
                  required
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  placeholder="Min. 10 chars (A-Z, a-z, 0-9, symbol)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  Must contain uppercase, lowercase, digit, and special symbol (OWASP 210,000 PBKDF2-SHA512).
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Confirm Master Passphrase
                </label>
                <input
                  type="password"
                  required
                  value={ownerConfirmPassword}
                  onChange={(e) => setOwnerConfirmPassword(e.target.value)}
                  placeholder="Re-enter new master passphrase"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-slate-300 font-medium">
                    New Emergency Recovery Passphrase (Optional)
                  </label>
                  <span className="text-[10px] text-slate-500">For future resets</span>
                </div>
                <input
                  type="text"
                  value={ownerRecoveryPass}
                  onChange={(e) => setOwnerRecoveryPass(e.target.value)}
                  placeholder="e.g., SafeNet-Delta-Reserve-2026"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <div className="text-[10px] text-slate-500 leading-tight">
                  All previous sessions revoked immediately. Authorization burned upon execution.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOwnerRecoveryModal(false);
                      setOwnerMessage(null);
                    }}
                    className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={ownerLoading}
                    className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    {ownerLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying & Recovering...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Recover Administrator Access</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
