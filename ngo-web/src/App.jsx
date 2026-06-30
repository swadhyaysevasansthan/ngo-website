import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnnouncementBanner from './components/AnnouncementBanner';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Quiz from './pages/Quiz';
import Contact from './pages/Contact';
import QuestionBank from './pages/QuestionBank';
import OurTeam from './pages/OurTeam';
import PartnerWithUs from './pages/PartnerWithUs';
import PhotographyCompetition from './pages/PhotographyCompetition';
import SchoolStories from './pages/SchoolStories';
import CurrentlyActiveEvents from './pages/CurrentlyActiveEvents';
import UpcomingEngagements from './pages/UpcomingEngagements';
import TestimonialsPage from './pages/TestimonialsPage';
import DonatePage from './pages/DonatePage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import RegistrationClosed from "./pages/RegistrationClosed.jsx";
import GrandFinalePage from './pages/GrandFinalePage';
import WetlandsDay from './pages/WetlandsDay';
import WorldEnvironmentDay2026 from './pages/WorldEnvironmentDay2026.jsx';

// 🔥 NEW REVIEW PAGES
import ReviewsPage from './pages/Reviews';
import SubmitReview from './pages/SubmitReview';

import SchoolAccessRequest from './pages/SchoolAccessRequest';
import SchoolRegistrationHome from './pages/SchoolRegistrationHome';
import PaintingRegistrationForm from './pages/PaintingRegistrationForm';
import QuizRegistrationForm from './pages/QuizRegistrationForm';
import CommunityPage from './pages/CommunityPage';
import CommunityAdmin from './pages/CommunityAdmin';

// import SponsorPartnerPage from './pages/SponsorPartnerPage';
// import SponsorFloatingAd from './components/SponsorFloatingAd';

import { trackVisitor } from './utils/visitorTracker';
import VisitorCounter from './components/VisitorCounter';

import FarmerProfile from './pages/FarmerProfile';
import InnovativeFarmers from './pages/InnovativeFarmers';
import TeacherProfile from './pages/TeacherProfile.jsx';

function App() {

  useEffect(() => {
    trackVisitor();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* <WelcomeModal /> */}
        <ScrollToTop />
        <Navbar />
        <AnnouncementBanner />
        {/* <SponsorFloatingAd /> */}
        {/*   */}
        <main className="flex-grow">
          <Routes>
            {/* EXISTING ROUTES - UNCHANGED */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/question-bank" element={<QuestionBank />} />
            <Route path="/sneac2025-26" element={<SchoolStories />} />
            <Route path="/quiz/currently-active" element={<CurrentlyActiveEvents />} />
            <Route path="/upcoming-engagements" element={<UpcomingEngagements />} />
            <Route path="/ourteam" element={<OurTeam />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/natural-farming" element={<CommunityPage />} />
            <Route path="/naturopathy" element={<CommunityPage />} />
            <Route path="/plantation" element={<CommunityPage />} />
            {/* <Route path="/certificates" element={<CertificateDownload />} />   */}
            <Route path="/yoga" element={<CommunityPage />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/partner-with-us" element={<PartnerWithUs />} />
            <Route path="/book-donation" element={<CommunityPage />} />
            <Route path="/photography-competition" element={<PhotographyCompetition />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/terms-conditions" element={<TermsAndConditions />} />
            <Route path="/register" element={<RegistrationClosed />} />

            {/* NEW PUBLIC REVIEW ROUTES */}
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/submit-review" element={<SubmitReview />} />
            <Route path="/grand-finale26" element={<GrandFinalePage />} />
            <Route path="/wetlands-day26" element={<WetlandsDay />} />
            <Route path="/environment-day26" element={<WorldEnvironmentDay2026 />} />
            {/* <Route path="/our-sponsors" element={<SponsorPartnerPage />} /> */}

            {/* SNEAC — School Competition Routes */}
            <Route path="/school-competition" element={<SchoolAccessRequest />} />
            <Route path="/school-registration" element={<SchoolRegistrationHome />} />
            <Route path="/school-registration/painting" element={<PaintingRegistrationForm />} />
            <Route path="/school-registration/quiz" element={<QuizRegistrationForm />} />

            {/* NEW ADMIN ROUTES */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/reviews" element={<AdminDashboard />} /> {/* Integrated tab */}

            {/* COMMUNITIES */}
            <Route path="/community/:slug" element={<CommunityPage />} />
            <Route path="/admin/communities" element={<CommunityAdmin />} />

            <Route path="/innovative-farmers" element={<InnovativeFarmers />} />

            <Route path="/innovative-farmers/:slug" element={<FarmerProfile />} />

            <Route path="/yoga-team/:slug" element={<TeacherProfile />} />

          </Routes>
        </main>
        <VisitorCounter />
        <Footer />
      </div>
    </Router>
  );
}

export default App;