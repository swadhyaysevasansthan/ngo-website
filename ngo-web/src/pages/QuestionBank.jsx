import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Eye, EyeOff, Lock, FileText, GraduationCap, ShieldCheck, 
  ChevronUp, ChevronDown, Sparkles, AlertCircle, ZoomIn, ZoomOut,
  Maximize2, ArrowRight, CheckCircle2, ShieldAlert
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { quizSettingsAPI } from "../utils/api";

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDF_FILE = "/question-banks/SNEQC 26-27.pdf";

/* ─── Responsive Protected PDF Viewer ────────────────────────────────── */
const PdfJsViewer = ({ src }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [scaleFactor, setScaleFactor] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = useRef(null);

  // Disable right-click + save/print/copy shortcuts
  useEffect(() => {
    const preventKeys = (e) => {
      const k = e.key?.toLowerCase();
      const meta = e.metaKey || e.ctrlKey;
      if (meta && ["s", "p", "o", "u", "c"].includes(k)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const preventContext = (e) => e.preventDefault();
    document.addEventListener("keydown", preventKeys, true);
    document.addEventListener("contextmenu", preventContext, true);
    return () => {
      document.removeEventListener("keydown", preventKeys, true);
      document.removeEventListener("contextmenu", preventContext, true);
    };
  }, []);

  // Update container width on window resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth - 48;
        setContainerWidth(Math.max(320, Math.min(w, 920)));
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const scrollTo = (page) => {
    const el = document.getElementById(`pdf-page-${page}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setCurrentPage(page);
  };

  const handleZoom = (delta) => {
    setScaleFactor(prev => Math.min(1.4, Math.max(0.7, prev + delta)));
  };

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xl bg-slate-900">
      
      {/* Top Floating Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-900 border-b border-slate-800 text-white text-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 text-xs sm:text-sm">SNEQC Official Question Bank</h4>
            <span className="text-[10px] text-slate-400">Class 6th – 8th • Protected Document</span>
          </div>
        </div>

        {numPages && (
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700/60">
              <button
                onClick={() => handleZoom(-0.1)}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 px-1">
                {Math.round(scaleFactor * 100)}%
              </span>
              <button
                onClick={() => handleZoom(0.1)}
                className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/60">
              <button
                onClick={() => scrollTo(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-1 rounded-lg hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
                title="Previous Page"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-medium text-slate-200 tabular-nums px-1.5">
                Page {currentPage} of {numPages}
              </span>
              <button
                onClick={() => scrollTo(Math.min(numPages, currentPage + 1))}
                disabled={currentPage >= numPages}
                className="p-1 rounded-lg hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
                title="Next Page"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PDF Pages Scroll Area */}
      <div
        ref={containerRef}
        onScroll={(e) => {
          if (!numPages) return;
          const container = e.currentTarget;
          const pages = container.querySelectorAll('[data-page]');
          pages.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            if (rect.top >= containerRect.top - 50 && rect.top < containerRect.top + containerRect.height / 2) {
              setCurrentPage(Number(el.dataset.page));
            }
          });
        }}
        className="w-full h-[78vh] overflow-y-auto overflow-x-hidden bg-slate-950/90 select-none p-4 sm:p-8 flex flex-col items-center gap-6"
      >
        <Document
          file={src}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          onLoadError={(err) => setError(err?.message || "Failed to load document")}
          loading={
            <div className="flex flex-col items-center justify-center py-28 text-slate-400 gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <span className="text-sm font-semibold text-slate-300">Rendering Question Bank PDF...</span>
                <p className="text-xs text-slate-500 mt-1">Please wait while the document loads</p>
              </div>
            </div>
          }
        >
          {error ? (
            <div className="text-red-400 text-sm bg-red-950/40 border border-red-800/60 rounded-2xl p-6 text-center max-w-md my-8">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <h5 className="font-bold text-red-200 mb-1">Failed to load Question Bank</h5>
              <p className="text-xs text-red-300/80">{error}</p>
            </div>
          ) : (
            Array.from(new Array(numPages || 0), (_, idx) => (
              <div
                key={idx}
                id={`pdf-page-${idx + 1}`}
                data-page={idx + 1}
                className="relative shadow-2xl rounded-xl overflow-hidden border border-slate-700/50 bg-white"
              >
                <Page
                  pageNumber={idx + 1}
                  width={containerWidth * scaleFactor}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            ))
          )}
        </Document>
      </div>

      {/* Security Disclaimer Strip */}
      <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Swadhyay Seva Foundation Protected Academic Asset • Unauthorised copying, distribution or printing strictly prohibited</span>
        </div>
        <span className="font-mono text-slate-500">Watermarked Session</span>
      </div>

    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   QuestionBank Component
═══════════════════════════════════════════════════════════════════════ */
const QuestionBank = () => {
  useEffect(() => { 
    document.title = "Official Question Bank | Swadhyay Seva Foundation"; 
  }, []);

  const [accessCode,   setAccessCode]   = useState(null); // null = loading
  const [code,         setCode]         = useState("");
  const [showCode,     setShowCode]     = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error,        setError]        = useState("");

  // Fetch access code from backend API
  useEffect(() => {
    quizSettingsAPI.getPublic()
      .then((res) => setAccessCode(res.data?.data?.questionBankCode ?? ""))
      .catch((err) => {
        console.error("Failed to load question bank code:", err);
        setAccessCode("");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter the access code.");
      return;
    }
    if (accessCode !== null && code.trim().toLowerCase() === accessCode.trim().toLowerCase()) {
      setIsAuthorized(true);
      setError("");
    } else {
      setError("Invalid access code. Please verify with your school coordinator.");
    }
  };

  const highlights = [
    { title: "Standardized Syllabus", desc: "Covers environmental conservation, flora & fauna, and climate awareness." },
    { title: "Class 6th – 8th Focused", desc: "Tailored to intermediate school curriculum with conceptual questions." },
    { title: "Direct Preparation", desc: "Representative of actual competition formats and scoring rubrics." }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 selection:bg-blue-500 selection:text-white">

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white pt-24 pb-32 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>SNEQC 2026–27 Official Repository</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Environmental Awareness <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-teal-200 bg-clip-text text-transparent">Question Bank</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              Official study guide and question set for participating students. Prepare, review, and achieve academic excellence.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {[
                { icon: GraduationCap, label: "Class 6th – 8th Curriculum", color: "text-blue-300" },
                { icon: FileText, label: "Official PDF Document", color: "text-cyan-300" },
                { icon: Lock, label: "Access Code Protected", color: "text-amber-300" },
                { icon: ShieldCheck, label: "Verified Study Material", color: "text-emerald-300" }
              ].map(({ icon: Icon, label, color }) => (
                <div 
                  key={label} 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-xs sm:text-sm font-medium text-slate-200 shadow-sm"
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main Content Area ────────────────────────────────────────── */}
      <section className="relative -mt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!isAuthorized ? (
            /* ── Lock Screen ───────────────────────────────────────── */
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-200/80 overflow-hidden">
                <div className="h-2.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500" />
                
                <div className="p-6 sm:p-10 md:p-12">
                  {/* Lock Graphic */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                      Access Protected Resource
                    </h2>
                    <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                      This question bank is distributed to registered institutions and students. Please enter your authorization access code to unlock the reader.
                    </p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid sm:grid-cols-3 gap-3 mb-8">
                    {highlights.map((h, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{h.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">{h.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Code Input Form */}
                  {accessCode === null ? (
                    <div className="p-6 text-center text-slate-400 flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Connecting to authorization service...</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider text-center">
                          Question Bank Access Passcode
                        </label>
                        <div className="relative">
                          <input
                            type={showCode ? "text" : "password"}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-5 py-3.5 pr-12 bg-slate-50 border-2 border-slate-300 rounded-xl text-base font-mono tracking-wider focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 placeholder:font-sans text-center"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => setShowCode(!showCode)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
                            title={showCode ? "Hide code" : "Show code"}
                            tabIndex={-1}
                          >
                            {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: "auto" }}
                            exit={{ opacity: 0, y: -6, height: 0 }}
                            className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium"
                          >
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                            <span>{error}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        type="submit"
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-base"
                      >
                        <span>Unlock Question Bank</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </form>
                  )}

                  <p className="text-center text-xs text-slate-400 mt-6">
                    Need the passcode? Contact your participating school administration or the Swadhyay Seva Foundation support desk.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── Unlocked Viewer ───────────────────────────────────── */
            <motion.div
              key="unlocked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    SNEQC 2026–27 Question Bank
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Official Environmental Education Syllabus · Class 6th – 8th
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold self-start sm:self-auto">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorized Session</span>
                </div>
              </div>

              {/* The protected viewer */}
              <PdfJsViewer src={PDF_FILE} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

    </div>
  );
};

export default QuestionBank;
