import React from 'react';
import { Gauge, ShieldCheck, Zap, Activity } from 'lucide-react';

export interface TokenStats {
  inputTokensEstimated: number;
  outputTokensEstimated: number;
  totalTokensEstimated: number;
  tokenBudgetLimit: number;
  budgetUsedPercent: number;
  executionStrategy: string;
}

interface TokenBudgetTrackerProps {
  stats: TokenStats;
}

export const TokenBudgetTracker: React.FC<TokenBudgetTrackerProps> = ({ stats }) => {
  const isWellUnderLimit = stats.totalTokensEstimated < 25000;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              Operational Constraints Telemetry
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-emerald-400">
                ACTIVE
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Token efficiency budget enforcement (&lt; 25,000 token limit)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-md bg-slate-800/80 px-2.5 py-1 text-xs font-mono text-slate-300 border border-slate-700/60">
            <span className="text-slate-400">Strategy:</span>{' '}
            <span className="text-sky-400 font-semibold">{stats.executionStrategy}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            Tokens Consumed: <strong>{stats.totalTokensEstimated.toLocaleString()}</strong> /{' '}
            {stats.tokenBudgetLimit.toLocaleString()} max
          </span>
          <span className="font-semibold text-emerald-400">
            {stats.budgetUsedPercent}% of 25k budget
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isWellUnderLimit
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-amber-500 to-rose-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(2, stats.budgetUsedPercent))}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-3">
            <span>
              Prompt Tokens: <strong className="text-slate-300 font-mono">{stats.inputTokensEstimated.toLocaleString()}</strong>
            </span>
            <span>•</span>
            <span>
              Analysis Tokens: <strong className="text-slate-300 font-mono">{stats.outputTokensEstimated.toLocaleString()}</strong>
            </span>
          </div>
          <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
            <Zap className="h-3 w-3" />
            Ultra-efficient ({(stats.tokenBudgetLimit - stats.totalTokensEstimated).toLocaleString()} tokens headroom remaining)
          </span>
        </div>
      </div>
    </div>
  );
};
