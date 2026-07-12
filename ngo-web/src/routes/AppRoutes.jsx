import { Routes, Route } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

// Public Pages
import Home from "../pages/Home";
import About from "../pages/About";
import Quiz from "../pages/Quiz";
import Contact from "../pages/Contact";
import QuestionBank from "../pages/QuestionBank";
import OurTeam from "../pages/OurTeam";
import PartnerWithUs from "../pages/PartnerWithUs";
import PhotographyCompetition from "../pages/PhotographyCompetition";
import SchoolStories from "../pages/SchoolStories";
import CurrentlyActiveEvents from "../pages/CurrentlyActiveEvents";
import UpcomingEngagements from "../pages/UpcomingEngagements";
import TestimonialsPage from "../pages/TestimonialsPage";
import DonatePage from "../pages/DonatePage";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import RefundPolicy from "../pages/RefundPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";
import RegistrationClosed from "../pages/RegistrationClosed";
import GrandFinalePage from "../pages/GrandFinalePage";
import WetlandsDay from "../pages/WetlandsDay";
import WorldEnvironmentDay2026 from "../pages/WorldEnvironmentDay2026";
import ReviewsPage from "../pages/Reviews";
import SubmitReview from "../pages/SubmitReview";

import SchoolAccessRequest from "../pages/SchoolAccessRequest";
import SchoolRegistrationHome from "../pages/SchoolRegistrationHome";
import PaintingRegistrationForm from "../pages/PaintingRegistrationForm";
import QuizRegistrationForm from "../pages/QuizRegistrationForm";

import CommunityPage from "../pages/CommunityPage";

import InnovativeFarmers from "../pages/InnovativeFarmers";
import FarmerProfile from "../pages/FarmerProfile";
import TeacherProfile from "../pages/TeacherProfile";

// Admin Pages
import AdminDashboard from "../pages/AdminDashboard";
import AdminLogin from "../pages/AdminLogin";
import CommunityAdmin from "../pages/CommunityAdmin";

export default function AppRoutes() {
    return (
        <Routes>
            {/* PUBLIC WEBSITE */}
            <Route element={<PublicLayout />}>
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
                <Route path="/book-donation" element={<CommunityPage />} />
                <Route path="/yoga" element={<CommunityPage />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/partner-with-us" element={<PartnerWithUs />} />
                <Route path="/photography-competition" element={<PhotographyCompetition />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/terms-conditions" element={<TermsAndConditions />} />
                <Route path="/register" element={<RegistrationClosed />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/submit-review" element={<SubmitReview />} />
                <Route path="/grand-finale26" element={<GrandFinalePage />} />
                <Route path="/wetlands-day26" element={<WetlandsDay />} />
                <Route path="/environment-day26" element={<WorldEnvironmentDay2026 />} />

                {/* School Competition */}
                <Route path="/school-competition" element={<SchoolAccessRequest />} />
                <Route path="/school-registration" element={<SchoolRegistrationHome />} />
                <Route path="/school-registration/painting" element={<PaintingRegistrationForm />} />
                <Route path="/school-registration/quiz" element={<QuizRegistrationForm />} />

                {/* Communities */}
                <Route path="/community/:slug" element={<CommunityPage />} />

                {/* Farmers */}
                <Route path="/innovative-farmers" element={<InnovativeFarmers />} />
                <Route path="/innovative-farmers/:slug" element={<FarmerProfile />} />

                {/* Yoga Team */}
                <Route path="/yoga-team/:slug" element={<TeacherProfile />} />
            </Route>

            {/* ADMIN */}
            {/* LOGIN */}
            <Route element={<PublicRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin/login" element={<AdminLogin />} />
                </Route>
            </Route>
            {/* PROTECTED ADMIN */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/reviews" element={<AdminDashboard />} />
                    <Route path="/admin/communities" element={<CommunityAdmin />} />
                </Route>
            </Route>

        </Routes>
    );
}