import React from 'react';
import { useGame } from '../context/GameContext';
import { WEEKLY_ACTIVITY } from '../data/mockData';

export const ProgressPage: React.FC = () => {
  const { character } = useGame();

  return (
    <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/*  */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container" />
            <span className="text-xs text-outline uppercase font-bold tracking-wider">
              Analytics & Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-0.5">
            Progress Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Empirical velocity metrics, daily output distribution, and execution reliability.
          </p>
        </div>

        <div className="flex items-center gap-3 tabular-nums">
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
            <span className="text-[10px] text-outline uppercase font-bold">Reliability</span>
            <p className="text-xl font-black text-tertiary">96.4%</p>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center">
            <span className="text-[10px] text-outline uppercase font-bold">Weekly XP Output</span>
            <p className="text-xl font-black text-primary">1,490 XP</p>
          </div>
        </div>
      </div>

      {/*  */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-card flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-col">
            <h2 className="font-bold text-lg text-on-surface">Weekly Daily Output Distribution</h2>
            <p className="text-xs text-outline">
              Quests logged and raw XP gained per day from Monday through Sunday
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-primary-container" />
              <span className="text-on-surface-variant">Completed Quests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-surface-container-high" />
              <span className="text-outline">Day Capacity (8)</span>
            </div>
          </div>
        </div>

        {/*  */}
        <div className="relative w-full bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 overflow-x-auto">
          <svg
            viewBox="0 0 700 240"
            className="w-full min-w-[600px] h-auto overflow-visible select-none"
          >
            {/*  */}
            <line x1="40" y1="20" x2="680" y2="20" stroke="#dae2fd" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="40" y1="65" x2="680" y2="65" stroke="#dae2fd" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="40" y1="110" x2="680" y2="110" stroke="#dae2fd" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="40" y1="155" x2="680" y2="155" stroke="#dae2fd" strokeDasharray="3 3" strokeWidth="1" />
            <line x1="40" y1="200" x2="680" y2="200" stroke="#c7c4d8" strokeWidth="1.5" />

            {/*  */}
            <text x="30" y="24" textAnchor="end" fill="#777587" fontSize="11" fontWeight="600">8 Q</text>
            <text x="30" y="69" textAnchor="end" fill="#777587" fontSize="11">6 Q</text>
            <text x="30" y="114" textAnchor="end" fill="#777587" fontSize="11">4 Q</text>
            <text x="30" y="159" textAnchor="end" fill="#777587" fontSize="11">2 Q</text>
            <text x="30" y="204" textAnchor="end" fill="#777587" fontSize="11">0</text>

            {/*  */}
            {WEEKLY_ACTIVITY.map((d, index) => {
              const xPos = 75 + index * 90;
              const barHeight = (d.quests / 8) * 180;
              const yPos = 200 - barHeight;

              return (
                <g key={d.day} className="cursor-pointer group">
                  {/*  */}
                  <rect x={xPos} y="20" width="46" height="180" rx="4" fill="#e2e7ff" />
                  {/*  */}
                  <rect
                    x={xPos}
                    y={yPos}
                    width="46"
                    height={barHeight}
                    rx="4"
                    fill={d.isToday ? '#3525cd' : '#4f46e5'}
                    className="transition-all group-hover:opacity-90"
                  />
                  {/*  */}
                  <text
                    x={xPos + 23}
                    y={yPos - 6}
                    textAnchor="middle"
                    fill="#131b2e"
                    fontSize="12"
                    fontWeight="700"
                  >
                    {d.quests}
                  </text>
                  <text
                    x={xPos + 23}
                    y="218"
                    textAnchor="middle"
                    fill="#131b2e"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {d.day}
                  </text>
                  <text
                    x={xPos + 23}
                    y="233"
                    textAnchor="middle"
                    fill="#777587"
                    fontSize="11"
                  >
                    {d.xp} XP
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/*  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-card flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-outline">
            Primary Output Category
          </span>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-700 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">psychology</span>
            </div>
            <div>
              <h4 className="font-bold text-base text-on-surface">Intellect (48%)</h4>
              <p className="text-xs text-outline">DSA, System Design, Coding</p>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-violet-600 h-full rounded-full" style={{ width: '48%' }} />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-card flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-outline">
            Physical Conditioning
          </span>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">fitness_center</span>
            </div>
            <div>
              <h4 className="font-bold text-base text-on-surface">Strength & Vit (32%)</h4>
              <p className="text-xs text-outline">Heavy Circuit, Calisthenics, Running</p>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '32%' }} />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40 shadow-card flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-outline">
            Cognitive Discipline
          </span>
          <div className="flex items-center gap-3 mt-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[24px]">hourglass_top</span>
            </div>
            <div>
              <h4 className="font-bold text-base text-on-surface">Discipline (20%)</h4>
              <p className="text-xs text-outline">Reading, Deep Work, Mindfulness</p>
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '20%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
