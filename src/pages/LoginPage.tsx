import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('Alex Vance');
  const [email, setEmail] = useState('alex.vance@workplace.io');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [password, setPassword] = useState('MasterAdventurerKey2025!');
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login({
      email,
      password,
      fullName,
      phone: `${countryCode} ${phone}`,
    });
    setIsLoading(false);

    if (success) {
      addToast({
        type: 'success',
        title: 'World Node Synchronized',
        message: `Welcome back to LIFE RPG, ${fullName}!`,
      });
      navigate('/dashboard');
    } else {
      addToast({
        type: 'error',
        title: 'Authentication Failed',
        message: 'Invalid credentials. Please verify your authentication key.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-12 antialiased">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/*  */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-outline-variant/40 p-6 sm:p-10 flex flex-col">
              {/*  */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center p-2.5 shrink-0 shadow-sm border border-outline-variant/30">
                  <svg
                    className="w-full h-full"
                    fill="none"
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M50 12L76 22V52C76 68.5 65 81.5 50 86C35 81.5 24 68.5 24 52V22L50 12Z"
                      stroke="#3525cd"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="6"
                      fill="#f2f3ff"
                    />
                    <path
                      d="M38 68L32 74C30 76 27 76 25 74L24 73C22 71 22 68 24 66L30 60"
                      stroke="#855300"
                      strokeLinecap="round"
                      strokeWidth="5"
                    />
                    <path
                      d="M28 58L42 72"
                      stroke="#855300"
                      strokeLinecap="round"
                      strokeWidth="5"
                    />
                    <path d="M37 55L69 23L77 31L45 63" fill="#4f46e5" />
                    <path d="M69 23L79 17L81 27L77 31L69 23Z" fill="#fea619" />
                    <line
                      stroke="#ffffff"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      x1="43"
                      x2="65"
                      y1="49"
                      y2="27"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-primary font-bold">
                      LIFE RPG • Authentication Portal
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                      v2.4 System
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-0.5">
                    Resume Your Quest
                  </h1>
                  <p className="text-xs sm:text-sm text-on-surface-variant">
                    Synchronize your real-world tasks, attributes, and daily streaks.
                  </p>
                </div>
              </div>

              {/*  */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold border border-outline-variant/30 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-3z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                      fill="#34A853"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold border border-outline-variant/30 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                  <span>GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold border border-outline-variant/30 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Passkey</span>
                </button>
              </div>

              {/*  */}
              <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow h-px bg-surface-container-high" />
                <span className="shrink mx-4 text-xs font-bold uppercase tracking-wider text-outline">
                  Or enter with credentials
                </span>
                <div className="flex-grow h-px bg-surface-container-high" />
              </div>

              {/*  */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/*  */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface flex items-center justify-between">
                    <span>Adventurer Full Name</span>
                    <span className="text-[11px] text-outline font-normal">Primary Identity</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-[20px] text-outline absolute left-3 pointer-events-none">
                      badge
                    </span>
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-sm focus:border-primary-container focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                {/*  */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[11px] text-outline font-normal">Registered Dossier</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-[20px] text-outline absolute left-3 pointer-events-none">
                      mail
                    </span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.vance@workplace.io"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-sm focus:border-primary-container focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                {/*  */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface flex items-center justify-between">
                    <span>Phone Number</span>
                    <span className="text-[11px] text-outline font-normal">2FA Quest Alerts</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative shrink-0">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="py-2.5 pl-3 pr-7 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-xs font-bold shadow-sm focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+81">🇯🇵 +81</option>
                      </select>
                      <span className="material-symbols-outlined text-[16px] text-outline absolute right-2 top-3 pointer-events-none">
                        arrow_drop_down
                      </span>
                    </div>
                    <div className="relative flex-1 flex items-center">
                      <span className="material-symbols-outlined text-[20px] text-outline absolute left-3 pointer-events-none">
                        smartphone
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 019-2834"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-sm focus:border-primary-container focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/*  */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-on-surface">Authentication Key</label>
                    <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                      Forgot Key?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-[20px] text-outline absolute left-3 pointer-events-none">
                      key
                    </span>
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full pl-10 pr-11 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-sm focus:border-primary-container focus:outline-none shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 p-1.5 text-outline hover:text-on-surface transition-colors"
                      title="Toggle password view"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/*  */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      defaultChecked
                      type="checkbox"
                      className="w-4 h-4 rounded border-outline-variant text-primary-container focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-on-surface-variant font-medium">
                      Remember this device (30-day session)
                    </span>
                  </label>
                  <span className="inline-flex items-center gap-1.5 text-xs text-tertiary font-bold">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse" />
                    <span>Node Synced</span>
                  </span>
                </div>

                {/*  */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <span>{isLoading ? 'Synchronizing Node...' : 'Enter World / Sign In'}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </form>

              {/*  */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-6 bg-surface-container-low -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 px-6 sm:px-10 py-4 rounded-b-2xl border-t border-outline-variant/30">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">lock</span>
                  <span>Encrypted Protocol v2.4 • Zero Data Selling</span>
                </div>
                <div className="text-xs text-on-surface-variant">
                  New Adventurer?
                  <Link to="/register" className="font-bold text-primary hover:underline ml-1">
                    Create Dossier
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/*  */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/40 shadow-card flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-outline">
                  Live Dossier Telemetry
                </span>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold">
                  Active Profile
                </span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwjRLyzuY0c2W-43xvEvsBzA8Mn27pW7w3Rxdi1Zmf4l9FYMmcKRkCSZOTv2tj7ZFq8hQzsNAyJKmu22l0TMS4ub4227YG0BVi3fSkan9u3ltS6wezNUaMAZXyWC9pQrpIq3wjaB0fEa9Sy7hwR43uZyiorn53wLHq-Qqe70RoVj3cHpAywTmI1rY2SE2PTX9-DHC8NgAg0qdFfTgEuneXnROT2wr5PHS_nY0B3gczfn84VKbLtpGd"
                  alt="Avatar"
                  className="w-16 h-16 rounded-2xl object-cover border border-outline-variant/40 shadow-sm"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-base text-on-surface">Arion Vance</span>
                  <span className="text-xs text-outline">Level 14 Questing Scholar</span>
                  <div className="flex items-center gap-2 mt-1 tabular-nums">
                    <span className="text-xs font-bold text-secondary">1,240 Gold</span>
                    <span className="text-outline">•</span>
                    <span className="text-xs font-bold text-error">27 Day Streak</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-2">
                <span className="text-xs font-bold text-on-surface">Session Security Notice:</span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Your credentials grant encrypted telemetry access to your persistent character sheet,
                  quest board, and inventory vault.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
