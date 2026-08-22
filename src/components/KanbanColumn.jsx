import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard';
import { Circle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

const COLUMN_CONFIGS = {
  'To Do': {
    title: 'To Do',
    subtitle: 'Backlog & Upcoming Milestones',
    icon: Circle,
    accentBorder: 'border-red-500/40',
    headerBadge: 'bg-red-500/10 text-red-400 border-red-500/30',
    glowColor: 'hover:border-red-500/50'
  },
  'In Progress': {
    title: 'In Progress',
    subtitle: 'Active Lab Exploits & Research',
    icon: Clock,
    accentBorder: 'border-amber-500/40',
    headerBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    glowColor: 'hover:border-amber-500/50'
  },
  'Completed': {
    title: 'Completed',
    subtitle: 'Verified & Executed Deliverables',
    icon: CheckCircle2,
    accentBorder: 'border-emerald-500/40',
    headerBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    glowColor: 'hover:border-emerald-500/50'
  }
};

export default function KanbanColumn({ id, title, cards, onStatusChange }) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
    data: { status: id }
  });

  const config = COLUMN_CONFIGS[id] || {
    title: id,
    subtitle: '',
    icon: Circle,
    accentBorder: 'border-slate-700',
    headerBadge: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  const IconComponent = config.icon;

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl bg-slate-950/60 border transition-all duration-200 min-h-[600px] ${
        isOver
          ? `bg-slate-900/90 border-2 ${config.accentBorder} shadow-2xl scale-[1.008]`
          : 'border-slate-800/80 shadow-lg'
      }`}
    >
      {/* Column Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between sticky top-0 bg-slate-950/90 backdrop-blur-md rounded-t-2xl z-10">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${config.headerBadge}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-slate-100 font-sans tracking-wide">
              {config.title}
            </h3>
            <p className="text-[11px] font-mono text-slate-500 hidden sm:block">
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Count Pill */}
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${config.headerBadge}`}>
          {cards.length}
        </span>
      </div>

      {/* Cards List / Droppable Zone */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-3.5 overflow-y-auto">
        {cards.length === 0 ? (
          <div className={`flex-1 flex flex-col items-center justify-center p-8 rounded-xl border border-dashed text-center min-h-[220px] transition-colors ${
            isOver ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800/60 bg-slate-900/20'
          }`}>
            <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-600 mb-2">
              <IconComponent className="w-5 h-5" />
            </div>
            <p className="text-xs font-mono text-slate-400">
              {isOver ? 'Release to drop here' : `No milestones in ${config.title}`}
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              Drag cards here to update status
            </p>
          </div>
        ) : (
          cards.map((card) => (
            <KanbanCard 
              key={card.id} 
              card={card} 
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
}
