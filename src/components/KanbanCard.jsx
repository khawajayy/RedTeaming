import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  GripVertical, 
  Target, 
  Cpu, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

const MONTH_COLORS = {
  'Month 1': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'Month 2': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'Month 3': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  'Month 4': 'bg-red-500/10 text-red-400 border-red-500/30',
  'Month 5': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  'Month 6': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
};

const STATUS_ICONS = {
  'To Do': <AlertCircle className="w-3.5 h-3.5 text-slate-400" />,
  'In Progress': <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />,
  'Completed': <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
};

export default function KanbanCard({ card, isOverlay = false, onStatusChange }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
    data: { card }
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const monthBadgeClass = MONTH_COLORS[card.month] || 'bg-slate-800 text-slate-300 border-slate-700';

  // Split key concepts into pill items
  const concepts = card.keyConcepts
    ? card.keyConcepts.split(',').map((c) => c.trim()).filter(Boolean)
    : [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border bg-slate-900/90 backdrop-blur-sm transition-all duration-200 ${
        isDragging
          ? 'opacity-40 border-dashed border-red-500 shadow-2xl scale-[0.98]'
          : 'border-slate-800/90 hover:border-slate-700 hover:shadow-xl hover:shadow-black/40'
      } ${isOverlay ? 'shadow-2xl border-red-500/80 bg-slate-900 cursor-grabbing rotate-1 scale-105 ring-2 ring-red-500/30' : ''}`}
    >
      {/* Top Accent Line */}
      <div 
        className={`h-1 w-full rounded-t-xl transition-colors ${
          card.status === 'Completed'
            ? 'bg-emerald-500/80'
            : card.status === 'In Progress'
            ? 'bg-amber-500/80'
            : 'bg-red-500/70'
        }`} 
      />

      <div className="p-4 sm:p-5">
        {/* Header: Month/Week Badge + Drag Handle */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium border ${monthBadgeClass}`}>
              <Calendar className="w-3 h-3 opacity-70" />
              <span>{card.month}</span>
              <span className="opacity-40">•</span>
              <span>{card.week}</span>
            </span>

            <span className="text-[10px] font-mono text-slate-500 bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800/80">
              #{card.order || '•'}
            </span>
          </div>

          <div
            {...listeners}
            {...attributes}
            className="cursor-grab active:cursor-grabbing p-1 -mr-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Drag to move card"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        </div>

        {/* Focus Area (Title) */}
        <h4 className="text-sm sm:text-base font-semibold text-slate-100 mb-2.5 leading-snug group-hover:text-red-400 transition-colors">
          {card.focusArea}
        </h4>

        {/* Action Item / Deliverable */}
        <div className="mb-3.5 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-red-400 font-medium mb-1">
            <Target className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>ACTION ITEM / DELIVERABLE</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {card.actionItem}
          </p>
        </div>

        {/* Key Concepts & Tools */}
        {concepts.length > 0 && (
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>Key Concepts & Tools</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {concepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60 font-mono"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick Status Bar / Mobile Selector */}
        {onStatusChange && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              {STATUS_ICONS[card.status]}
              <span>{card.status}</span>
            </div>

            <div className="flex items-center gap-1">
              {card.status !== 'To Do' && (
                <button
                  type="button"
                  onClick={() => onStatusChange(card.id, 'To Do')}
                  className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
                >
                  To Do
                </button>
              )}
              {card.status !== 'In Progress' && (
                <button
                  type="button"
                  onClick={() => onStatusChange(card.id, 'In Progress')}
                  className="px-2 py-0.5 text-[10px] font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 transition-colors"
                >
                  In Progress
                </button>
              )}
              {card.status !== 'Completed' && (
                <button
                  type="button"
                  onClick={() => onStatusChange(card.id, 'Completed')}
                  className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 transition-colors"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
