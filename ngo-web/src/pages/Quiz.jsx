import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, Brain, Award, Lock, ShieldCheck, Leaf, Eye, EyeOff, 
  BookOpen, Users, Clock, CheckCircle, Sparkles, AlertCircle, ArrowRight,
  HelpCircle, Compass, Check
} from 'lucide-react';
import { quizSettingsAPI } from '../utils/api';

/* ─── Custom Sprout SVG ─────────────────────────────────────────────── */
const SproutIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
  </svg>
);

/* ─── Constants ─────────────────────────────────────────────────────── */
const ACCESS_DURATION_MIN = 13;
const ACCESS_KEY = 'sss_quiz_access_granted';
const CLICK_KEY  = 'sss_quiz_taken_at';
const minutesSince = (ts) => (Date.now() - ts) / 60000;

/* ═══════════════════════════════════════════════════════════════════════
   Quiz Component
═══════════════════════════════════════════════════════════════════════ */
const Quiz = () => {
  useEffect(() => { 
    document.title = 'Quiz & Awareness Challenge | Swadhyay Seva Sansthan'; 
  }, []);

  /* quiz config */
  const [allQuizzes,    setAllQuizzes]    = useState([]);
  const [accessCodeMap, setAccessCodeMap] = useState({});
  const [configLoading, setConfigLoading] = useState(true);

  /* display & active quiz */
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  /* auth */
  const [codeInput,    setCodeInput]    = useState('');
  const [showCode,     setShowCode]     = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError,    setAuthError]    = useState('');
  const [remainingTime, setRemainingTime] = useState(null);

  /* one-click lock */
  const [isTakenLocked, setIsTakenLocked] = useState(false);

  /* ── Load quiz config ───────────────────────────────────────────── */
  useEffect(() => {
    quizSettingsAPI.getPublic()
      .then((res) => {
        const quizzes = res.data?.data?.quizzes || [];
        setAllQuizzes(quizzes);
        if (quizzes.length > 0) {
          setSelectedQuiz(quizzes[0]);
        }
        const map = {};
        quizzes.forEach((q, i) => {
          if (q.access_code) {
            map[q.access_code.trim().toLowerCase()] = i;
          }
        });
        setAccessCodeMap(map);
      })
      .catch((err) => {
        console.error('Quiz config fetch failed:', err);
      })
      .finally(() => setConfigLoading(false));
  }, []);

  /* ── Restore session & live countdown ───────────────────────────── */
  useEffect(() => {
    if (!allQuizzes.length) return;
    try {
      const stored = localStorage.getItem(ACCESS_KEY);
      if (stored) {
        const { grantedAt, quizIndex } = JSON.parse(stored);
        const elapsed = minutesSince(grantedAt);
        if (elapsed <= ACCESS_DURATION_MIN) {
          setIsAuthorized(true);
          const minsLeft = Math.max(1, Math.ceil(ACCESS_DURATION_MIN - elapsed));
          setRemainingTime(minsLeft);
          if (quizIndex !== undefined && allQuizzes[quizIndex]) {
            setSelectedQuiz(allQuizzes[quizIndex]);
          }
        } else {
          localStorage.removeItem(ACCESS_KEY);
          setIsAuthorized(false);
          setRemainingTime(null);
        }
      }
    } catch { 
      localStorage.removeItem(ACCESS_KEY); 
    }

    try {
      const raw = localStorage.getItem(CLICK_KEY);
      if (raw) {
        if (minutesSince(Number(raw)) < ACCESS_DURATION_MIN) {
          setIsTakenLocked(true);
        } else {
          localStorage.removeItem(CLICK_KEY);
        }
      }
    } catch { 
      localStorage.removeItem(CLICK_KEY); 
    }
  }, [allQuizzes]);

  /* ── Handlers ───────────────────────────────────────────────────── */
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setAuthError('');
    if (!codeInput.trim()) {
      setAuthError('Please enter an access code');
      return;
    }

    const trimmed = codeInput.trim().toLowerCase();
    
    // Check if entered code matches currently selected quiz first
    if (selectedQuiz && selectedQuiz.access_code?.trim().toLowerCase() === trimmed) {
      const idx = allQuizzes.findIndex(q => q.id === selectedQuiz.id);
      setIsAuthorized(true);
      setRemainingTime(ACCESS_DURATION_MIN);
      localStorage.setItem(ACCESS_KEY, JSON.stringify({ grantedAt: Date.now(), quizIndex: idx }));
      return;
    }

    // Check all quizzes in case user entered a valid code for another quiz
    const idx = accessCodeMap[trimmed];
    if (idx !== undefined && allQuizzes[idx]) {
      setIsAuthorized(true);
      setSelectedQuiz(allQuizzes[idx]);
      setRemainingTime(ACCESS_DURATION_MIN);
      localStorage.setItem(ACCESS_KEY, JSON.stringify({ grantedAt: Date.now(), quizIndex: idx }));
    } else {
      setAuthError('Invalid access code. Please check with your teacher or organizer.');
    }
  };

  const handleTakeQuiz = () => {
    if (!selectedQuiz?.url || selectedQuiz.url === '#' || isTakenLocked) return;
    localStorage.setItem(CLICK_KEY, String(Date.now()));
    setIsTakenLocked(true);
    window.open(selectedQuiz.url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    // If not already authorized for this quiz, keep state clean
    setAuthError('');
  };

  /* ── Benefit cards ──────────────────────────────────────────────── */
  const features = [
    { 
      icon: Brain, 
      title: 'Deepen Environmental Knowledge', 
      desc: 'Explore natural health, eco-conservation, and sustainability concepts in an engaging format.',
      gradient: 'from-violet-500/10 to-purple-500/10 text-violet-600 border-violet-100'
    },
    { 
      icon: Leaf, 
      title: 'Inspire Real-World Action', 
      desc: 'Questions are designed to spark conscious daily habits that protect our local ecosystems.',
      gradient: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-100'
    },
    { 
      icon: Users, 
      title: 'School & Community Spirit', 
      desc: 'Join hundreds of schools and thousands of students competing in friendly academic spirit.',
      gradient: 'from-blue-500/10 to-cyan-500/10 text-blue-600 border-blue-100'
    },
    { 
      icon: Award, 
      title: 'Earn Recognition & Certificates', 
      desc: 'Top-performing candidates receive commendations and certificates from the foundation.',
      gradient: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-100'
    },
  ];

  /* ── Rules / Steps ──────────────────────────────────────────────── */
  const steps = [
    {
      step: '01',
      title: 'Obtain Access Code',
      desc: 'Receive your unique quiz code from your school coordinator or event supervisor.'
    },
    {
      step: '02',
      title: 'Unlock & Review',
      desc: 'Enter the code below. Your 13-minute access window starts once verified.'
    },
    {
      step: '03',
      title: 'Complete On Microsoft Forms',
      desc: 'Click "Take Quiz" to open the official Microsoft Form and submit answers carefully.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 selection:bg-emerald-500 selection:text-white">

      {/* ── Hero Section with Glow Mesh ───────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white pt-24 pb-32 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Swadhyay Seva Sansthan Quiz Portal</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Test Your <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">Environmental Awareness</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              Engage with curated challenges designed to expand your ecological consciousness, natural well-being, and sustainable life habits.
            </p>

            {/* Quick Stat Chips */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {[
                { icon: Clock, label: '10–13 Min Time Limit', color: 'text-amber-300' },
                { icon: BookOpen, label: 'Standardized Questions', color: 'text-teal-300' },
                { icon: ShieldCheck, label: 'Anti-Malpractice Locked', color: 'text-emerald-300' },
                { icon: Award, label: 'Official SSS Certificate', color: 'text-cyan-300' }
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

      {/* ── Main Quiz Portal Section ───────────────────────────────────── */}
      <section className="relative -mt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        
        {/* Loading State */}
        {configLoading ? (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-16 text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-slate-700 font-semibold text-lg">Loading Quizzes...</h3>
            <p className="text-slate-400 text-sm mt-1">Connecting to Swadhyay Seva Sansthan server</p>
          </div>
        ) : allQuizzes.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-slate-800 font-bold text-xl mb-2">No Quizzes Active At This Time</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Please check back shortly or reach out to your school coordinator for upcoming quiz schedules.
            </p>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Quiz Selector (when more than 1 quiz exists) */}
            {allQuizzes.length > 1 && (
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-200 flex flex-wrap gap-2 items-center justify-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3">
                  Available Quizzes:
                </span>
                <div className="flex flex-wrap gap-2">
                  {allQuizzes.map((quiz, idx) => {
                    const isCurrent = selectedQuiz?.id === quiz.id;
                    return (
                      <button
                        key={quiz.id || idx}
                        onClick={() => handleSelectQuiz(quiz)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                          isCurrent 
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/40' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>{quiz.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Quiz Card */}
            {selectedQuiz && (
              <motion.div
                key={selectedQuiz.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-200/70 overflow-hidden"
              >
                {/* Top Glowing Gradient Bar */}
                <div className="h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />

                <div className="p-6 sm:p-10 md:p-12">
                  
                  {/* Quiz Details Header */}
                  <div className="text-center max-w-2xl mx-auto mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold mb-3">
                      <SproutIcon className="w-3.5 h-3.5" />
                      <span>Swadhyay Seva Sansthan Competition</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                      {selectedQuiz.title}
                    </h2>

                    <p className="text-slate-600 text-base leading-relaxed">
                      {selectedQuiz.description || 'Test your environmental aptitude and awareness with this curated assessment.'}
                    </p>

                    {/* Meta Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Duration: <strong>{selectedQuiz.duration || '10 Minutes'}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                        <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                        <span>Questions: <strong>{selectedQuiz.questions || '25 Questions'}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Platform: <strong>Microsoft Forms</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Elegant Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-4 text-slate-400 font-semibold tracking-wider">
                        {isAuthorized ? 'Access Status' : 'Verification Required'}
                      </span>
                    </div>
                  </div>

                  {/* Auth Gate / Action Area */}
                  <AnimatePresence mode="wait">
                    {!isAuthorized ? (
                      <motion.div
                        key="locked-state"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-md mx-auto"
                      >
                        <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 text-center mb-6">
                          <div className="w-14 h-14 bg-amber-100/80 border-2 border-amber-300/80 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                            <Lock className="w-7 h-7 text-amber-600" />
                          </div>
                          <h4 className="font-bold text-slate-800 text-base mb-1">Passcode Protected</h4>
                          <p className="text-slate-500 text-xs leading-relaxed">
                            Please provide the official access code provided by your teacher or quiz administrator.
                          </p>
                        </div>

                        <form onSubmit={handleVerifyCode} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                              Access Code
                            </label>
                            <div className="relative">
                              <input
                                type={showCode ? 'text' : 'password'}
                                value={codeInput}
                                onChange={(e) => setCodeInput(e.target.value)}
                                placeholder="Enter code (e.g. SSSQUIZ26)"
                                className="w-full px-5 py-3.5 pr-12 bg-white border-2 border-slate-300 rounded-xl text-base font-mono tracking-wider focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 placeholder:font-sans"
                                aria-label="Access Code"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => setShowCode(!showCode)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
                                title={showCode ? 'Hide code' : 'Show code'}
                                tabIndex={-1}
                              >
                                {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          <AnimatePresence>
                            {authError && (
                              <motion.div
                                initial={{ opacity: 0, y: -6, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -6, height: 0 }}
                                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium"
                              >
                                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                                <span>{authError}</span>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <button
                            type="submit"
                            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-base"
                          >
                            <span>Verify & Start Session</span>
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="unlocked-state"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-lg mx-auto flex flex-col items-center gap-6"
                      >
                        {/* Access Status Banner */}
                        <div className="w-full p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                              <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                              <h5 className="font-bold text-emerald-900 text-sm">Access Verified & Authorized</h5>
                              <p className="text-emerald-700 text-xs">
                                Ready for submission on Microsoft Forms
                              </p>
                            </div>
                          </div>
                          {remainingTime !== null && (
                            <div className="px-3 py-1 bg-white rounded-lg border border-emerald-200 text-emerald-800 text-xs font-mono font-bold shrink-0">
                              ~{remainingTime}m left
                            </div>
                          )}
                        </div>

                        {/* Take Quiz Button */}
                        <button
                          onClick={handleTakeQuiz}
                          disabled={!selectedQuiz?.url || selectedQuiz.url === '#' || isTakenLocked}
                          className={`w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl ${
                            isTakenLocked || !selectedQuiz?.url || selectedQuiz.url === '#'
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-teal-800 shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 transform hover:-translate-y-0.5 active:translate-y-0'
                          }`}
                        >
                          {isTakenLocked ? (
                            <>
                              <Clock className="w-5 h-5" />
                              <span>Quiz Session Already Opened</span>
                            </>
                          ) : (
                            <>
                              <span>Launch Microsoft Forms Quiz</span>
                              <ExternalLink className="w-5 h-5" />
                            </>
                          )}
                        </button>

                        {/* Anti-Cheat Disclaimer */}
                        <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/70 text-amber-900 text-xs leading-relaxed text-center">
                          <strong>⚠️ Crucial Exam Rule:</strong> Once you click "Launch Microsoft Forms Quiz", the assessment window opens in a new tab. Do not reload or navigate away, as the link locks to maintain exam integrity.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            )}

          </div>
        )}

      </section>

      {/* ── 3-Step Process ────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Process
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">How It Works</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((st, i) => (
              <div 
                key={st.step} 
                className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:border-emerald-200 transition-colors"
              >
                <div className="text-3xl font-black text-emerald-500/30 mb-3 font-mono">
                  {st.step}
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">{st.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Quizzes Feature Grid ──────────────────────────────────── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Purpose & Impact
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Why We Conduct Environmental Quizzes
          </h3>
          <p className="text-slate-500 text-sm max-w-lg mx-auto mt-2">
            Transforming awareness into sustainable lifestyle habits through active engagement.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`bg-white rounded-2xl p-6 border ${f.gradient} shadow-sm hover:shadow-md transition-all flex flex-col gap-3`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">{f.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Quiz;
