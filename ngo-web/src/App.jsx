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
import Milestones from './pages/Milestones';// new
import Activities from './pages/Activities';// new
import Highlights from './pages/Highlights';// new

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
            <Route path="/milestones" element={<Milestones />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/highlights" element={<Highlights />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
