import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  FileText,
  Bookmark,
  Share2,
  Check,
  Terminal,
  ShieldAlert,
  GitBranch,
  Layers,
  History,
  Trash2,
} from 'lucide-react';
import { MermaidChart } from './components/MermaidChart';
import { CoreConceptView } from './components/CoreConceptView';
import { StudentOpportunitiesView, StudentOpportunity } from './components/StudentOpportunitiesView';
import { TokenBudgetTracker, TokenStats } from './components/TokenBudgetTracker';
import { RawAgentReportModal } from './components/RawAgentReportModal';

interface CoreConcept {
  problemStatement: string;
  primaryMethodology: string;
  keyBreakthroughs: string;
  fullSummary: string;
  wordCount?: number;
}

interface AnalysisResult {
  paperTitle: string;
  authors: string;
  year: string;
  coreConcept: CoreConcept;
  mermaidFlowchart: string;
  studentOpportunities: StudentOpportunity[];
  rawAgentReport: string;
  tokenStats: TokenStats;
  analyzedAt: string;
}

interface PresetPaper {
  id: string;
  title: string;
  url: string;
  category: string;
  arxivId: string;
  authors: string;
  year: number;
  highlight: string;
}

export default function App() {
  const [inputUrl, setInputUrl] = useState('');
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presets, setPresets] = useState<PresetPaper[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [quickCopied, setQuickCopied] = useState(false);

  // Load presets on mount
  useEffect(() => {
    fetch('/api/presets')
      .then((res) => res.json())
      .then((data) => {
        if (data.presets) setPresets(data.presets);
      })
      .catch((err) => console.warn('Could not load presets:', err));

    // Load saved history
    try {
      const saved = localStorage.getItem('cs_research_agent_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const saveToHistory = (newResult: AnalysisResult) => {
    try {
      const updated = [
        newResult,
        ...history.filter((h) => h.paperTitle !== newResult.paperTitle),
      ].slice(0, 10);
      setHistory(updated);
      localStorage.setItem('cs_research_agent_history', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cs_research_agent_history');
  };

  const handleAnalyze = async (presetTarget?: PresetPaper) => {
    const targetUrl = presetTarget ? presetTarget.url : inputUrl.trim();
    const targetTitle = presetTarget ? presetTarget.title : '';
    const targetText = inputMode === 'text' ? inputText.trim() : '';

    if (!targetUrl && !targetText && !presetTarget) {
      setError('Please provide a research paper URL, title, or abstract text.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          text: targetText,
          title: targetTitle,
          presetId: presetTarget?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to analyze paper');
      }

      const formattedResult: AnalysisResult = {
        paperTitle: data.paperTitle,
        authors: data.authors,
        year: data.year,
        coreConcept: data.coreConcept,
        mermaidFlowchart: data.mermaidFlowchart,
        studentOpportunities: data.studentOpportunities,
        rawAgentReport: data.rawAgentReport,
        tokenStats: data.tokenStats,
        analyzedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setResult(formattedResult);
      saveToHistory(formattedResult);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while analyzing the paper.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareReport = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.rawAgentReport);
      setQuickCopied(true);
      setTimeout(() => setQuickCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white">
                  PaperAgent
                </h1>
                <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-400 border border-indigo-500/20">
                  CS Research Agent
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Core Concept • Architectural Flowchart (Mermaid) • Student Internship Projects
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-400">
              <ShieldAlert className="h-3.5 w-3.5 text-emerald-400" />
              <span>Token Constraint: &lt; 25k tokens</span>
            </div>

            {result && (
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition border border-slate-700"
              >
                <Terminal className="h-3.5 w-3.5 text-sky-400" />
                <span>Raw Agent Output</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Paper Ingestion Hero & Input Area */}
        <section className="rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-950 p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Academic Paper Ingestion
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Paste an arXiv link, DOI, or PDF URL to extract architecture and brainstorm 3rd-year CS resume projects
              </p>
            </div>

            {/* Input Mode Switch */}
            <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setInputMode('url')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  inputMode === 'url'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                URL / arXiv ID
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  inputMode === 'text'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Paste Abstract
              </button>
            </div>
          </div>

          {/* Input Box */}
          {inputMode === 'url' ? (
            <div className="relative">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && handleAnalyze()}
                    placeholder="e.g. https://arxiv.org/abs/1706.03762 or 2205.14135 (FlashAttention)"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  {inputUrl && (
                    <button
                      onClick={() => setInputUrl('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-500 hover:text-slate-300"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleAnalyze()}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 transition"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Ingesting Paper...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze Paper</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste the title, abstract, or methodology text of the academic paper here..."
                rows={4}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => handleAnalyze()}
                  disabled={loading || !inputText.trim()}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 transition"
                >
                  {loading ? 'Ingesting Text...' : 'Analyze Text'}
                </button>
              </div>
            </div>
          )}

          {/* Benchmark Paper Presets */}
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">
                1-Click Benchmark Papers (Foundational to Cutting-Edge):
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Click any paper to inspect immediately
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setInputUrl(p.url);
                    setInputMode('url');
                    handleAnalyze(p);
                  }}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700/80 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white border border-slate-700/60 transition group text-left"
                >
                  <Bookmark className="h-3 w-3 text-sky-400 group-hover:text-sky-300" />
                  <span>{p.title.split(':')[0]}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({p.year})</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-rose-400 hover:text-rose-200 font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}
        </section>

        {/* Loading Indicator with Stage Progression */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 animate-pulse">
              <Sparkles className="h-6 w-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Computer Science Research Agent Executing Pipeline
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Prioritizing token efficiency (&lt; 25,000 tokens) • Synthesizing core concept •
                Generating Mermaid.js architectural graph • Formulating student project extensions...
              </p>
            </div>
            <div className="flex justify-center items-center gap-3 text-xs font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1 text-sky-400">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping" />
                Step 1: Core Concept
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-indigo-400">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
                Step 2: [FLOWCHART] Mermaid
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Step 3: Resume Projects
              </span>
            </div>
          </div>
        )}

        {/* Analysis Results View */}
        {result && !loading && (
          <div className="space-y-6">
            {/* Paper Header Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-md bg-sky-500/20 px-2 py-0.5 text-[11px] font-mono font-semibold text-sky-300">
                    {result.year || 'Research Paper'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Parsed at {result.analyzedAt}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {result.paperTitle}
                </h2>
                {result.authors && (
                  <p className="text-xs text-slate-400 mt-1">
                    Authors: <span className="text-slate-300">{result.authors}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareReport}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-medium text-slate-200 border border-slate-700 transition"
                  title="Copy formatted agent report"
                >
                  {quickCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied Full Report</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Copy Full Report</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-2 text-xs font-medium text-white transition shadow-sm"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Agent Terminal View</span>
                </button>
              </div>
            </div>

            {/* Operational Constraints & Token Telemetry */}
            {result.tokenStats && <TokenBudgetTracker stats={result.tokenStats} />}

            {/* Step 1: Core Concept Extraction */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
              <CoreConceptView data={result.coreConcept} />
            </div>

            {/* Step 2: Architectural Flowchart (Mermaid.js) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <GitBranch className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      2. Architectural Flowchart (Mermaid.js)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Components, data inputs, model layers, and data outputs
                    </p>
                  </div>
                </div>
              </div>

              <MermaidChart
                chartCode={result.mermaidFlowchart}
                paperTitle={result.paperTitle}
              />
            </div>

            {/* Step 3: Future Work & Student Internship Opportunities */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
              <StudentOpportunitiesView opportunities={result.studentOpportunities} />
            </div>
          </div>
        )}

        {/* History / Previous Analyses */}
        {history.length > 0 && (
          <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Recent Analyses ({history.length})
                </h3>
              </div>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition"
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setResult(item)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition text-left group ${
                    result?.paperTitle === item.paperTitle
                      ? 'border-sky-500/60 bg-sky-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-mono text-sky-400">{item.year || 'Paper'}</span>
                    <span>{item.analyzedAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-2">
                    {item.paperTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                    {item.coreConcept.primaryMethodology}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Initial Empty State Guide */}
        {!result && !loading && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 mb-3 border border-sky-500/20">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">
                1. Core Concept Extraction
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Condenses problem statements, primary methodologies, and mathematical breakthroughs in under 300 plain, accessible words.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 mb-3 border border-indigo-500/20">
                <GitBranch className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">
                2. Architectural Flowcharts
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Renders interactive SVG Mermaid.js flowcharts mapping data inputs, model layers, and data outputs with pan, zoom, and code export.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1">
                3. Student Resume Opportunities
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates 3 concrete, realistic extension projects for 3rd-year CS students with exact extensions, targeted metrics, tech stacks, and ready-to-use resume bullets.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* Raw Agent Report Modal */}
      {result && (
        <RawAgentReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportText={result.rawAgentReport}
          paperTitle={result.paperTitle}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 py-4 text-center text-xs text-slate-500">
        <p>
          PaperAgent • Computer Science Research Agent • Designed for Undergraduate Researchers &amp; Systems Engineers
        </p>
      </footer>
    </div>
  );
}
