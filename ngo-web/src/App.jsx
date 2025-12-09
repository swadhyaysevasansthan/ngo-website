import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import WelcomeModal from './components/WelcomeModal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Quiz from './pages/Quiz';
import Contact from './pages/Contact';
import QuestionBank from './pages/QuestionBank'; 
import OurTeam from './pages/OurTeam';
import NaturalFarming from './pages/NaturalFarming';
import Naturopathy from './pages/Naturopathy';
import Plantation from './pages/Plantation';
import Yoga from './pages/Yoga';
import SchoolStories from './pages/SchoolStories';
import CurrentlyActiveEvents from './pages/CurrentlyActiveEvents';
import UpcomingEngagements from './pages/UpcomingEngagements';
import TestimonialsPage from './pages/TestimonialsPage';

import LatestUpdatesBar from './components/LatestUpdatesBar';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* <WelcomeModal /> */}
        <Navbar />
        
       <LatestUpdatesBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/question-bank" element={<QuestionBank />} /> 
            <Route path="/school-stories" element={<SchoolStories />} />
            <Route path="/quiz/currently-active" element={<CurrentlyActiveEvents />} />
            <Route path="/quiz/upcoming-engagements" element={<UpcomingEngagements />} />
            <Route path="/ourteam" element={<OurTeam />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/natural-farming" element={<NaturalFarming />} />
            <Route path="/naturopathy" element={<Naturopathy />} />
            <Route path="/plantation" element={<Plantation />} />
            <Route path="/yoga" element={<Yoga />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
