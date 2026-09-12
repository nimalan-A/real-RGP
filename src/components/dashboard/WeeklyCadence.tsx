import React from 'react';
import { WEEKLY_ACTIVITY } from '../../data/mockData';

interface WeeklyCadenceProps {
  currentStreak: number;
  bestStreak: number;
}

export const WeeklyCadence: React.FC<WeeklyCadenceProps> = ({ currentStreak, bestStreak }) => {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/40 shadow-card flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-bold text-base text-on-surface">Weekly Cadence & Streak</h3>
          <p className="text-xs text-on-surface-variant">
            Consecutive quest discipline over the current cycle
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-error text-xs font-bold bg-error-container/60 px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
            <span>{currentStreak}-Day Active Streak</span>
          </div>
          <div className="flex items-center gap-1.5 text-secondary text-xs font-bold bg-secondary-fixed/60 px-3 py-1 rounded-full">
            <span className="material-symbols-outlined text-[16px]">trophy</span>
            <span>Best: {bestStreak} Days</span>
          </div>
        </div>
      </div>

      {/*  */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-1">
        {WEEKLY_ACTIVITY.map((day) => (
          <div
            key={day.day}
            className={`rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 text-center border transition-all ${
              day.isToday
                ? 'bg-surface-container border-primary-container shadow-sm'
                : 'bg-surface-container-low border-outline-variant/30'
            }`}
          >
            <span
              className={`text-[11px] font-bold uppercase ${
                day.isToday ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {day.day} {day.isToday && '(TODAY)'}
            </span>

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                day.completed
                  ? 'bg-tertiary-fixed text-on-tertiary-fixed font-bold'
                  : 'bg-primary-container text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {day.completed ? 'check' : 'pending'}
              </span>
            </div>

            <span
              className={`text-[11px] font-semibold tabular-nums ${
                day.completed ? 'text-tertiary' : 'text-primary font-bold'
              }`}
            >
              {day.completed ? '100%' : `${day.quests}/${day.total} Done`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
