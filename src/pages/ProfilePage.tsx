import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const ProfilePage: React.FC = () => {
  const { character } = useGame();
  const { user, updateUser } = useAuth();
  const { addToast } = useNotifications();

  const [fullName, setFullName] = useState(user?.fullName || character.name);
  const [email, setEmail] = useState(user?.email || 'arion.vance@liferpg.dev');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 019-2834');
  const [bio, setBio] = useState(
    user?.bio ||
      'Productivity specialist turning algorithmic discipline and physical training into measurable game progression.'
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      fullName,
      email,
      phone,
      bio,
    });
    setIsSaved(true);
    addToast({
      type: 'success',
      title: 'Dossier Profile Updated',
      message: 'Your adventurer metadata has been synchronized.',
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="px-4 sm:px-8 py-6 max-w-5xl mx-auto flex flex-col gap-6">
      {/*  */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/40 shadow-card flex flex-col sm:flex-row items-center gap-6">
        <div className="relative shrink-0">
          <img
            src={user?.avatar || character.avatar}
            alt={fullName}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-primary-container shadow-md"
          />
          <span className="absolute -bottom-2 -right-2 bg-primary-container text-on-primary text-xs font-black px-2.5 py-0.5 rounded-full shadow">
            LVL {character.level}
          </span>
        </div>

        <div className="flex flex-col text-center sm:text-left min-w-0 flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              {fullName}
            </h1>
            <span className="px-2.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold">
              {character.rank}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1 font-medium">
            {user?.classType || 'Grand Sage & Code Architect'}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-on-surface-variant tabular-nums">
            <span>
              <strong className="text-on-surface">{character.streak}</strong> Day Streak
            </span>
            <span>•</span>
            <span>
              <strong className="text-on-surface">{character.gold.toLocaleString()}</strong> Gold
            </span>
            <span>•</span>
            <span>
              <strong className="text-on-surface">{character.totalXp.toLocaleString()}</strong> Lifetime XP
            </span>
          </div>
        </div>
      </div>

      {/*  */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant/40 shadow-card flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
          <div>
            <h2 className="text-lg font-bold text-on-surface">Adventurer Identification & Security</h2>
            <p className="text-xs text-on-surface-variant">Manage your credentials and transmission dossier</p>
          </div>
          {isSaved && (
            <span className="px-3 py-1 rounded bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check</span>
              <span>Saved</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">Full Dossier Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-lowest text-sm focus:border-primary-container focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">Registered Dossier Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-lowest text-sm focus:border-primary-container focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">Phone Number (2FA Alerts)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant/50 bg-surface-container-lowest text-sm focus:border-primary-container focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">Character Title & Honorific</label>
            <input
              disabled
              type="text"
              value={character.title}
              className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant/40 bg-surface-container-low text-sm text-outline cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-bold text-on-surface">Adventurer Manifesto / Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-outline-variant/50 bg-surface-container-lowest text-sm focus:border-primary-container focus:outline-none resize-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-bold text-sm shadow-sm transition-all"
            >
              Save Dossier Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
