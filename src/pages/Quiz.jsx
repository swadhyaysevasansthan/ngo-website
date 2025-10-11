import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Brain, Leaf, Heart, Award, RefreshCw } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';

const Quiz = () => {
  // Define Sprout component BEFORE using it in the quizzes array
  const Sprout = (props) => (
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

  const allQuizzes = [
    {
      icon: <Leaf className="w-10 h-10" />,
      title: "Environmental Awareness Quiz",
      description: "Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.",
      duration: "15 minutes",
      questions: "25 questions",
      difficulty: "Intermediate",
      url: "https://forms.office.com/r/v3yvjbwna2",
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: "Environmental Awareness Quiz",
      description: "Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.",
     duration: "15 minutes",
      questions: "20 questions",
      difficulty: "Beginner",
      url: "#",
    },
    {
      icon: <Sprout className="w-10 h-10" />,
      title: "Environmental Awareness Quiz",
      description: "Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.",
    duration: "15 minutes",
      questions: "30 questions",
      difficulty: "Advanced",
      url: "#",
    },
    {
      icon: <Brain className="w-10 h-10" />,
      title: "Environmental Awareness Quiz",
        description: "Test your knowledge about environmental conservation, climate change, biodiversity, and sustainable practices. Learn about the importance of protecting our planet.",
      duration: "15 minutes",
      questions: "25 questions",
      url: "#",
    },
  ];

  // State to hold the randomly selected quiz
  const [randomQuiz, setRandomQuiz] = useState(null);

  // Function to get a random quiz
  const getRandomQuiz = () => {
    const randomIndex = Math.floor(Math.random() * allQuizzes.length);
    setRandomQuiz(allQuizzes[randomIndex]);
  };

  // Select a random quiz on component mount
  useEffect(() => {
    getRandomQuiz();
  }, []);

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
        <SectionHeader
          title="Why We Conduct Quizzes"
          subtitle="Education through engagement"
        />
        <Card>
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Purpose</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Quizzes are powerful tools for spreading awareness and educating communities about critical 
                  issues affecting our health and environment. Through interactive learning, we make complex 
                  topics accessible and engaging for everyone.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Each quiz is carefully designed to not only test knowledge but also to inform and inspire 
                  action. Participants learn about sustainable practices, natural health solutions, and ways 
                  to contribute to a better society.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">What You'll Gain</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">✓</span>
                    <span>Deeper understanding of environmental and health issues</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">✓</span>
                    <span>Practical knowledge for sustainable living</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">✓</span>
                    <span>Awareness about natural healing and wellness practices</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">✓</span>
                    <span>Insights into organic farming and eco-friendly techniques</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2 mt-1">✓</span>
                    <span>Certificate of participation and achievement</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Featured Quiz Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Featured Quiz"
            subtitle="A randomly selected quiz just for you"
          />
          
          {randomQuiz && (
            <div className="max-w-3xl mx-auto">
              <Card delay={0.1}>
                <div className="p-8 md:p-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-saffron-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
                    {randomQuiz.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                    {randomQuiz.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-8 text-center text-lg">
                    {randomQuiz.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mb-8 justify-center">
                    <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {randomQuiz.duration}
                    </span>
                    <span className="px-4 py-2 bg-saffron-100 text-saffron-700 rounded-full text-sm font-medium">
                      {randomQuiz.questions}
                    </span>
                    
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={randomQuiz.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button variant="primary" className="w-full sm:w-auto">
                        Take Quiz <ExternalLink className="inline ml-2" size={18} />
                      </Button>
                    </a>
                    
                  </div>
                </div>
              </Card>
            </div>
          )}


        </div>
      </section>


    </div>
  );
};

export default Quiz;
