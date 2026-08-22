import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  Flame, 
  TrendingUp 
} from 'lucide-react';

export default function ProgressStats({ cards = [] }) {
  const total = cards.length;
  const completed = cards.filter((c) => c.status === 'Completed').length;
  const inProgress = cards.filter((c) => c.status === 'In Progress').length;
  const todo = cards.filter((c) => c.status === 'To Do' || !c.status).length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressPercentage = total > 0 ? Math.round((inProgress / total) * 100) : 0;

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-xl mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        
        {/* Left: Overall Completion Stat */}
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            {/* SVG Circular Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-700 ease-out"
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-bold font-mono text-white leading-none">
                {percentage}%
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">
                6-Month Mastery Campaign
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20">
                24 Milestones
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {completed} of {total} milestones fully completed
            </p>
          </div>
        </div>

        {/* Middle: Tactical Progress Bar */}
        <div className="flex-1 max-w-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exploit Execution Pipeline</span>
            </span>
            <span>{completed + inProgress} / {total} Active or Complete</span>
          </div>
          
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 flex gap-0.5">
            <div 
              className="bg-emerald-500 rounded-l-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              style={{ width: `${percentage}%` }}
              title={`Completed: ${percentage}%`}
            />
            <div 
              className="bg-amber-500 transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              style={{ width: `${inProgressPercentage}%` }}
              title={`In Progress: ${inProgressPercentage}%`}
            />
          </div>
        </div>

        {/* Right: Quick Pill Counters */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
          <div className="bg-slate-950/80 border border-red-500/20 rounded-xl px-3 py-2 text-center">
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">To Do</span>
            <span className="text-base font-bold font-mono text-slate-100">{todo}</span>
          </div>
          <div className="bg-slate-950/80 border border-amber-500/20 rounded-xl px-3 py-2 text-center">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">In Flight</span>
            <span className="text-base font-bold font-mono text-slate-100">{inProgress}</span>
          </div>
          <div className="bg-slate-950/80 border border-emerald-500/20 rounded-xl px-3 py-2 text-center">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Done</span>
            <span className="text-base font-bold font-mono text-slate-100">{completed}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
