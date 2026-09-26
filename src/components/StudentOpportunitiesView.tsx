import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  TrendingUp,
  Layers,
  Wrench,
  Check,
  Copy,
  Calendar,
  ChevronRight,
  Award,
} from 'lucide-react';

export interface StudentOpportunity {
  id: number;
  title: string;
  exactExtension: string;
  targetedMetric: string;
  techStack: string[];
  difficulty?: string;
  estimatedWeeks?: number;
  implementationMilestones?: string[];
  resumeBullet: string;
}

interface StudentOpportunitiesViewProps {
  opportunities: StudentOpportunity[];
}

export const StudentOpportunitiesView: React.FC<StudentOpportunitiesViewProps> = ({
  opportunities,
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyResumeBullet = async (bullet: string, id: number) => {
    try {
      await navigator.clipboard.writeText(bullet);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              3. Future Work & Internship Resume Projects
            </h3>
            <p className="text-xs text-slate-400">
              3 concrete, realistic extensions tailored for 3rd-year CS students to stand out in SWE/ML internship applications
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-slate-800/70 border border-slate-700/60 px-3 py-1 text-xs text-slate-300">
          <Award className="h-3.5 w-3.5 text-amber-400" />
          <span>Tailored for FAANG & Research Labs</span>
        </div>
      </div>

      {/* 3 Project Opportunity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {opportunities.map((opp, idx) => (
          <div
            key={opp.id || idx}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg hover:border-slate-700 transition relative overflow-hidden group"
          >
            {/* Top gradient highlight */}
            <div
              className={`absolute top-0 left-0 h-1 w-full ${
                idx === 0
                  ? 'bg-gradient-to-r from-sky-400 to-blue-600'
                  : idx === 1
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-600'
                  : 'bg-gradient-to-r from-purple-400 to-indigo-600'
              }`}
            />

            <div>
              {/* Badge & Index */}
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-300 border border-slate-700">
                  Project #{idx + 1}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Calendar className="h-3 w-3" />
                  {opp.estimatedWeeks || 3} Weeks
                </span>
              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-slate-100 group-hover:text-sky-300 transition mb-3 leading-snug">
                {opp.title}
              </h4>

              {/* Exact Extension */}
              <div className="mb-3.5 rounded-lg bg-slate-950/60 p-3 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 mb-1">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Exact Extension:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {opp.exactExtension}
                </p>
              </div>

              {/* Targeted Performance Metric */}
              <div className="mb-3.5 rounded-lg bg-emerald-950/30 p-3 border border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Targeted Metric:</span>
                </div>
                <p className="text-xs text-emerald-200 font-medium leading-relaxed">
                  {opp.targetedMetric}
                </p>
              </div>

              {/* Recommended Tech Stack */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                  <Wrench className="h-3.5 w-3.5" />
                  <span>Recommended Tech Stack:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {opp.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="rounded-md bg-slate-800/90 px-2 py-0.5 text-[11px] font-mono font-medium text-indigo-300 border border-indigo-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Implementation Milestones */}
              {opp.implementationMilestones && opp.implementationMilestones.length > 0 && (
                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Implementation Roadmap:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {opp.implementationMilestones.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-1.5">
                        <ChevronRight className="h-3.5 w-3.5 text-sky-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Resume Bullet Point Action Box */}
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                  <Sparkles className="h-3 w-3" />
                  Resume Pitch (One-Click Copy):
                </span>
                <button
                  onClick={() => handleCopyResumeBullet(opp.resumeBullet, opp.id || idx)}
                  className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition"
                >
                  {copiedId === (opp.id || idx) ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy Bullet</span>
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800/90 text-xs text-slate-300 italic font-mono leading-relaxed">
                "{opp.resumeBullet}"
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
