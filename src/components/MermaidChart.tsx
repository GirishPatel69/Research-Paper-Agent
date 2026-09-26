import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  Code,
  Eye,
  AlertTriangle,
} from 'lucide-react';

interface MermaidChartProps {
  chartCode: string;
  paperTitle?: string;
}

// Initialize mermaid once
try {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    themeVariables: {
      darkMode: true,
      background: '#0b0f19',
      primaryColor: '#1e293b',
      primaryTextColor: '#f8fafc',
      primaryBorderColor: '#38bdf8',
      lineColor: '#64748b',
      secondaryColor: '#1e1b4b',
      tertiaryColor: '#0f172a',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '13px',
      edgeLabelBackground: '#0f172a',
      nodeBorder: '#38bdf8',
      mainBkg: '#0f172a',
      clusterBkg: '#111827',
      clusterBorder: '#374151',
    },
    flowchart: {
      curve: 'basis',
      htmlLabels: true,
      useMaxWidth: false,
    },
  });
} catch (e) {
  console.warn('Mermaid initialization warning:', e);
}

export const MermaidChart: React.FC<MermaidChartProps> = ({ chartCode, paperTitle }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setRenderError(null);

    const renderChart = async () => {
      if (!chartCode) return;

      const uniqueId = `mermaid-chart-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      try {
        // Basic code cleaning
        let cleanCode = chartCode
          .replace(/^```(mermaid)?\s*/i, '')
          .replace(/```\s*$/, '')
          .trim();

        if (!cleanCode.startsWith('graph ') && !cleanCode.startsWith('flowchart ')) {
          cleanCode = `graph TD\n${cleanCode}`;
        }

        const { svg } = await mermaid.render(uniqueId, cleanCode);
        if (isMounted) {
          setSvgHtml(svg);
          setRenderError(null);
        }
      } catch (err: any) {
        console.warn('Mermaid rendering failed:', err);
        if (isMounted) {
          setRenderError(err?.message || 'Failed to render Mermaid diagram.');
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chartCode]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(chartCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadSvg = () => {
    if (!svgHtml) return;
    const blob = new Blob([svgHtml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(paperTitle || 'architecture').toLowerCase().replace(/\s+/g, '_')}_flowchart.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`relative rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-hidden bg-slate-950/95 backdrop-blur-xl' : ''
      }`}
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 bg-slate-950/70 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-mono font-semibold tracking-wide text-indigo-400 border border-indigo-500/20">
            [FLOWCHART]
          </span>
          <h4 className="text-xs font-medium text-slate-400">
            Mermaid.js System Architecture Flowchart
          </h4>
        </div>

        {/* View Mode & Action Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center rounded-lg bg-slate-800/80 p-0.5 border border-slate-700/60">
            <button
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                viewMode === 'visual'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              Diagram
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                viewMode === 'code'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              Mermaid Code
            </button>
          </div>

          {viewMode === 'visual' && !renderError && (
            <div className="flex items-center gap-1 ml-2 border-l border-slate-800 pl-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
                title="Zoom Out"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 w-11 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.15))}
                title="Zoom In"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                title="Reset Zoom"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 ml-2 border-l border-slate-800 pl-2">
            <button
              onClick={handleCopyCode}
              title="Copy Mermaid Code"
              className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            {svgHtml && !renderError && (
              <button
                onClick={handleDownloadSvg}
                title="Download SVG"
                className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export SVG</span>
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        ref={containerRef}
        className={`relative overflow-auto p-4 transition-all ${
          isFullscreen ? 'h-[calc(100vh-120px)]' : 'min-h-[380px] max-h-[640px]'
        }`}
      >
        {viewMode === 'visual' ? (
          renderError ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-3 rounded-full bg-amber-500/10 p-3 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h5 className="text-sm font-semibold text-slate-200 mb-1">
                Mermaid Syntax Fallback Display
              </h5>
              <p className="text-xs text-slate-400 max-w-md mb-4">
                The visual renderer encountered an unsupported token. You can inspect the clean
                Mermaid specification below or copy it to Mermaid Live Editor:
              </p>
              <pre className="max-w-2xl w-full text-left font-mono text-xs bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto text-sky-300">
                {chartCode}
              </pre>
            </div>
          ) : (
            <div
              className="flex justify-center items-center min-h-[340px] transition-transform duration-150 origin-top"
              style={{ transform: `scale(${zoomLevel})` }}
              dangerouslySetInnerHTML={{ __html: svgHtml }}
            />
          )
        ) : (
          <div className="relative">
            <pre className="font-mono text-xs leading-relaxed bg-slate-950/80 p-5 rounded-lg border border-slate-800 text-sky-300 overflow-x-auto selection:bg-sky-500/30">
              {chartCode}
            </pre>
          </div>
        )}
      </div>

      {/* Footer Info Pill */}
      <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/50 px-4 py-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Components, data inputs, model layers, and data outputs charted
        </span>
        <span className="font-mono text-slate-400">Mermaid graph TD v10+</span>
      </div>
    </div>
  );
};
