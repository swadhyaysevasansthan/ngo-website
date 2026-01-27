import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Brain, Award, Lock, ShieldCheck } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';


/* ========= Module-scope constants ========= */


// Custom Sprout icon as a JSX factory function
const SproutIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
  </svg>
);


// Stable quizzes array (3 entries)
const ALL_QUIZZES = [
  {
    id: 1,
    title: 'Environmental Awareness Quiz',
    description:
      'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.',
    duration: '10 minutes',
    questions: '25 questions',
    url: 'https://forms.office.com/r/txK4sTkaH0',
  },
  {
    id: 2,
    title: 'Environmental Awareness Quiz',
    description:
      'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.',
    duration: '10 minutes',
    questions: '25 questions',
    url: 'https://forms.office.com/r/yzYgSSymwi',
  },
  {
    id: 3,
    title: 'Environmental Awareness Quiz',
    description:
      'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.',
    duration: '10 minutes',
    questions: '25 questions',
    url: 'https://forms.office.com/r/2wg712yyez',
  },
  {
    id: 4,
    title: 'Environmental Awareness Quiz',
    description:
      'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.',
    duration: '10 minutes',
    questions: '25 questions',
    url: 'https://forms.office.com/r/mnC4kzj354',
  },
  {
    id: 5,
    title: 'Environmental Awareness Quiz',
    description:
      'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.',
    duration: '10 minutes',
    questions: '25 questions',
    url: 'https://forms.office.com/r/EaijAT2Mvp',
  },
  {
    id: 6,
    title: 'Environmental Awareness Quiz',
    description:
      'Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.',
    duration: '10 minutes',
    questions: '25 questions',
    url: 'https://forms.office.com/r/XKp6WJHZST',
  },
];


// Access code to quiz mapping
const ACCESS_CODE_MAP = {
  [process.env.REACT_APP_QUIZ_ACCESS_CODE_1]: 0, // Maps to quiz at index 0
  [process.env.REACT_APP_QUIZ_ACCESS_CODE_2]: 1, // Maps to quiz at index 1
  [process.env.REACT_APP_QUIZ_ACCESS_CODE_3]: 2, // Maps to quiz at index 2
  [process.env.REACT_APP_QUIZ_ACCESS_CODE_4]: 3, // Maps to quiz at index 2
  [process.env.REACT_APP_QUIZ_ACCESS_CODE_5]: 4, // Maps to quiz at index 2
  [process.env.REACT_APP_QUIZ_ACCESS_CODE_6]: 5, // Maps to quiz at index 2
};


// Access/lock configuration at module scope
const ACCESS_DURATION_MIN = 13; // 13 minutes for both access and lock
const ACCESS_KEY = 'sss_quiz_access_granted';
const CLICK_KEY = 'sss_quiz_taken_at';


// Utility at module scope
const minutesSince = (timestamp) => (Date.now() - timestamp) / (1000 * 60);


/* =================== Component =================== */


const Quiz = () => {

  useEffect(() => {
    document.title = 'Quiz - Swadhyay Seva Foundation';
  }, []);


  // Display quiz (default to first quiz for display purposes)
  const [displayQuiz, setDisplayQuiz] = useState(ALL_QUIZZES[0]);
  
  // Selected quiz based on access code
  const [selectedQuiz, setSelectedQuiz] = useState(null);


  // Access code gate
  const [codeInput, setCodeInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState('');


  // One-click lock
  const [isTakenLocked, setIsTakenLocked] = useState(false);


  // Initialize: restore authorization and quiz selection
  useEffect(() => {
    // restore access and quiz selection
    try {
      const stored = localStorage.getItem(ACCESS_KEY);
      if (stored) {
        const { grantedAt, quizIndex } = JSON.parse(stored);
        if (minutesSince(grantedAt) <= ACCESS_DURATION_MIN) {
          setIsAuthorized(true);
          if (quizIndex !== undefined && ALL_QUIZZES[quizIndex]) {
            setSelectedQuiz(ALL_QUIZZES[quizIndex]);
            setDisplayQuiz(ALL_QUIZZES[quizIndex]);
          }
        } else {
          localStorage.removeItem(ACCESS_KEY);
        }
      }
    } catch {
      localStorage.removeItem(ACCESS_KEY);
    }


    // restore click lock
    try {
      const clickAtRaw = localStorage.getItem(CLICK_KEY);
      if (clickAtRaw) {
        const clickAt = Number(clickAtRaw);
        const elapsed = minutesSince(clickAt);
        if (elapsed < ACCESS_DURATION_MIN) {
          setIsTakenLocked(true);
        } else {
          localStorage.removeItem(CLICK_KEY);
        }
      }
    } catch {
      localStorage.removeItem(CLICK_KEY);
    }
  }, []);


  // Verify access code and set corresponding quiz
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setAuthError('');
    
    const trimmedCode = codeInput.trim().toLowerCase();
    const quizIndex = ACCESS_CODE_MAP[trimmedCode];
    
    if (quizIndex !== undefined) {
      setIsAuthorized(true);
      setSelectedQuiz(ALL_QUIZZES[quizIndex]);
      setDisplayQuiz(ALL_QUIZZES[quizIndex]);
      localStorage.setItem(ACCESS_KEY, JSON.stringify({ 
        grantedAt: Date.now(),
        quizIndex: quizIndex 
      }));
    } else {
      setIsAuthorized(false);
      setAuthError('Invalid code. Please contact the organizer for the correct access code.');
    }
  };


  // Take quiz with one-click lock (12-minute lock)
  const handleTakeQuiz = () => {
    if (!selectedQuiz?.url || selectedQuiz.url === '#') return;
    if (isTakenLocked) return;


    localStorage.setItem(CLICK_KEY, String(Date.now()));
    setIsTakenLocked(true);
    window.open(selectedQuiz.url, '_blank', 'noopener,noreferrer');
  };


  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-saffron-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Award className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Test Your Awareness</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Challenge yourself with our interactive quizzes designed to spread awareness about
              environmental conservation, natural health, and sustainable living
            </p>
          </motion.div>
        </div>
      </section>


      {/* Why Quizzes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader title="Why We Conduct Quizzes" subtitle="Education through engagement" />
        <Card>
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Purpose</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Quizzes make complex topics accessible and engaging while raising awareness on health and environment.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  They foster practical learning that inspires responsible action and sustainable habits.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">What You'll Gain</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start"><span className="text-primary-600 mr-2 mt-1">✓</span><span>Deeper understanding of key issues</span></li>
                  <li className="flex items-start"><span className="text-primary-600 mr-2 mt-1">✓</span><span>Practical tips for sustainable living</span></li>
                  <li className="flex items-start"><span className="text-primary-600 mr-2 mt-1">✓</span><span>Awareness of natural wellness practices</span></li>
                  <li className="flex items-start"><span className="text-primary-600 mr-2 mt-1">✓</span><span>Motivation to contribute positively</span></li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </section>


      {/* Featured Quiz Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Featured Quiz" subtitle="Enter the access code to proceed" />


          <div className="max-w-3xl mx-auto">
            <Card delay={0.1}>
              <div className="p-8 md:p-12">
                {/* Badge with two separate circles side by side */}
                <div className="flex items-center justify-center gap-4 mx-auto mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center shadow-sm">
                    <Brain className="w-9 h-9 text-primary-600" />
                  </div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center shadow-sm">
                    <SproutIcon className="w-8 h-8 text-green-600" />
                  </div>
                </div>


                <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                  {displayQuiz.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 text-center text-lg">
                  {displayQuiz.description}
                </p>


                {/* Duration + Questions side by side */}
                <div className="flex flex-wrap gap-3 mb-8 justify-center">
                  <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {displayQuiz.duration}
                  </span>
                  <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {displayQuiz.questions}
                  </span>
                </div>


                {/* Access Gate + One-Click Control */}
                {!isAuthorized ? (
                  <div className="max-w-xl mx-auto">
                    <div className="flex items-center justify-center mb-4 text-gray-700">
                      <Lock className="w-5 h-5 mr-2 text-primary-600" />
                      <span className="text-sm">Protected quiz. Enter the access code to continue.</span>
                    </div>
                    <form onSubmit={handleVerifyCode} className="flex flex-col sm:flex-row gap-3 justify-center">
                      <input
                        type="password"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value)}
                        placeholder="Enter access code"
                        className="w-full sm:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        aria-label="Access code"
                      />
                      <Button type="submit" variant="primary" className="w-full sm:w-auto">
                        Verify Code
                      </Button>
                    </form>
                    {authError && <p className="text-red-600 text-sm text-center mt-3">{authError}</p>}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center text-green-600">
                      <ShieldCheck className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Access granted</span>
                    </div>


                    <Button
                      variant="primary"
                      className={`w-full sm:w-auto ${(!selectedQuiz?.url || selectedQuiz.url === '#' || isTakenLocked) ? 'opacity-60 cursor-not-allowed' : ''}`}
                      onClick={handleTakeQuiz}
                      disabled={!selectedQuiz?.url || selectedQuiz.url === '#' || isTakenLocked}
                      title={
                        !selectedQuiz?.url || selectedQuiz.url === '#'
                          ? 'Quiz link coming soon'
                          : isTakenLocked
                          ? 'You have already opened the quiz. Please try again later.'
                          : 'Open quiz in a new tab'
                      }
                    >
                      Take Quiz <ExternalLink className="inline ml-2" size={18} />
                    </Button>


                    <p className="text-xs text-gray-500 text-center">
                      Note: After clicking "Take Quiz", don't go back. You won't be able to take it again.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};


export default Quiz;
