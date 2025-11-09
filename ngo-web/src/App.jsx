import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Quiz from './pages/Quiz';
import Contact from './pages/Contact';
import QuestionBank from './pages/QuestionBank'; // new
import OurTeam from './pages/OurTeam';
import NaturalFarming from './pages/NaturalFarming';
import Naturopathy from './pages/Naturopathy';
import Plantation from './pages/Plantation';
import Yoga from './pages/Yoga';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/question-bank" element={<QuestionBank />} /> 
            <Route path="/ourteam" element={<OurTeam />} />
            <Route path="/contact" element={<Contact />} />
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
