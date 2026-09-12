import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { addToast } = useNotifications();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Authentication keys do not match.',
      });
      return;
    }

    setIsLoading(true);
    const success = await register({
      email,
      password,
      fullName,
    });
    setIsLoading(false);

    if (success) {
      addToast({
        type: 'success',
        title: 'Dossier Registered',
        message: 'Initiating Adventurer Onboarding protocol.',
      });
      navigate('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-surface-container-lowest rounded-2xl shadow-card border border-outline-variant/40 p-8 flex flex-col gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-[28px]">shield</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">
              Create Adventurer Dossier
            </h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Begin your LIFE RPG progression journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface">Character / Full Name</label>
              <input
                required
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Arion Vance"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-sm focus:border-primary-container focus:outline-none shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface">Email Address</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arion@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-sm focus:border-primary-container focus:outline-none shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface">Authentication Key (Password)</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-sm focus:border-primary-container focus:outline-none shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface">Confirm Key</label>
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/50 text-on-surface text-sm focus:border-primary-container focus:outline-none shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <span>{isLoading ? 'Creating Dossier...' : 'Start Onboarding'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          <div className="text-center text-xs text-on-surface-variant border-t border-surface-container-high pt-4">
            Already registered?
            <Link to="/login" className="font-bold text-primary hover:underline ml-1">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
