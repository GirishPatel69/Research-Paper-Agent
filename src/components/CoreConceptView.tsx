import React from 'react';
import { Target, Cpu, Binary, CheckCircle2, FileText, Sparkles } from 'lucide-react';

interface CoreConceptData {
  problemStatement: string;
  primaryMethodology: string;
  keyBreakthroughs: string;
  fullSummary: string;
  wordCount?: number;
}

interface CoreConceptViewProps {
  data: CoreConceptData;
}

export const CoreConceptView: React.FC<CoreConceptViewProps> = ({ data }) => {
  // Calculate word count of the accessible synthesis
  const countWords = (str: string) => (str ? str.trim().split(/\s+/).length : 0);
  const words = data.wordCount || countWords(data.fullSummary);
  const isWithinLimit = words <= 300;

  return (
    <div className="space-y-4">
      {/* Header bar with strict word limit constraint badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              1. Core Concept Extraction
            </h3>
            <p className="text-xs text-slate-400">
              Plain, accessible synthesis of the problem, methodology, and breakthroughs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-medium border ${
              isWithinLimit
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>
              {words} / 300 words
            </span>
            <span className="text-[10px] text-slate-400 font-sans">
              {isWithinLimit ? '(Strict Limit Met)' : '(Over 300)'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of the 3 Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Problem Statement */}
        <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="absolute top-0 left-0 h-1 w-full bg-rose-500/70" />
          <div className="flex items-center gap-2 mb-2 text-rose-400">
            <Target className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Problem Statement</h4>
          </div>
          <p className="text-xs leading-relaxed text-slate-300">
            {data.problemStatement}
          </p>
        </div>

        {/* Primary Methodology */}
        <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="absolute top-0 left-0 h-1 w-full bg-sky-500/70" />
          <div className="flex items-center gap-2 mb-2 text-sky-400">
            <Cpu className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Primary Methodology</h4>
          </div>
          <p className="text-xs leading-relaxed text-slate-300">
            {data.primaryMethodology}
          </p>
        </div>

        {/* Key Breakthroughs */}
        <div className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-4 relative overflow-hidden group hover:border-slate-700 transition">
          <div className="absolute top-0 left-0 h-1 w-full bg-purple-500/70" />
          <div className="flex items-center gap-2 mb-2 text-purple-400">
            <Binary className="h-4 w-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Algorithmic Breakthroughs</h4>
          </div>
          <p className="text-xs leading-relaxed text-slate-300">
            {data.keyBreakthroughs}
          </p>
        </div>
      </div>

      {/* Accessible Synthesis Callout */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-indigo-400" />
          <h4 className="text-xs font-semibold text-indigo-300">
            Synthesized Accessible Explanation
          </h4>
        </div>
        <p className="text-sm leading-relaxed text-slate-200 font-sans">
          {data.fullSummary}
        </p>
      </div>
    </div>
  );
};
