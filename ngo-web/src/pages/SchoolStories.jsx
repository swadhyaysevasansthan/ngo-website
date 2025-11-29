import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import EventModalCard from '../components/EventModalCard'; // Import the new component

const SchoolStories = () => {
  useEffect(() => {
    document.title = 'School Stories - Swadhyay Seva Foundation';
  }, []);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const pastEvents = [
    {
      id: 1,
      school: 'Eklavya Model Residential School Lahaul (EMRS)',
      location: 'Udaipur, Himachal Pradesh',
      date: 'November 4, 2025',
      participants: '50 students',
      description: 'We conducted an engaging environmental awareness quiz competition at EMRS Lahaul, testing students\' knowledge on climate change, biodiversity, and sustainable practices. The event was met with great enthusiasm from both students and faculty.',
      highlights: [
        'Interactive quiz format with 25 questions',
        'Focus on environmental conservation and sustainability',
        'Certificate distribution to all participants',
        'Engaging discussions on climate action'
      ],
      images: [
        '/images/events/emrs/emrs1.jpeg',
        '/images/events/emrs/emrs2.jpeg',
        '/images/events/emrs/emrs3.jpeg',
      ]
    },
    {
      id: 2,
      school: 'PM Shri School Jawahar Navodya Vidyalaya Lari',
      location: 'Tabo, Himachal Pradesh',
      date: 'November 13, 2025',
      participants: '49 students',
      description: 'We organized an exciting environmental awareness quiz at PM Shri School Jawahar Navodya Vidyalaya in the remote village of Lari, Tabo. The quiz challenged 49 bright students on topics including sustainable development, renewable energy, and conservation practices. The event fostered environmental consciousness in this high-altitude community, inspiring students to become eco-ambassadors in their region.',
      highlights: [
        'Comprehensive quiz covering sustainable living and eco-friendly practices',
        'Strong participation from students in a remote mountain region',
        'Interactive sessions on local environmental challenges and solutions',
        'Distribution of educational materials and certificates to all participants',
        'Emphasis on the role of youth in climate action'
      ],
      images: [
        '/images/events/JNV/jnv1.jpeg', 
        '/images/events/JNV/jnv2.jpeg',
        '/images/events/JNV/jnv3.jpeg',
        '/images/events/JNV/jnv4.jpeg',
        '/images/events/JNV/jnv5.jpeg',
      ]
    },
    {
      id: 3,
      school: 'Academic Heights World School',
      location: 'New Delhi, Delhi',
      date: 'November 18, 2025',
      participants: '30 students',
      description: 'Academic Heights World School in New Delhi welcomed our team for an interactive environmental quiz event. Thirty enthusiastic students participated, showcasing impressive knowledge on recycling, water conservation, and sustainable living. The event offered a platform for young minds to explore real-world environmental issues and seek innovative solutions for their city.',
      highlights: [
        'Engaging quiz sessions with creative rounds',
        'Focus on urban sustainability, recycling, and water conservation',
        'Participation certificates presented to all students',
        'Facilitated group discussion on local eco-friendly initiatives'
      ],
      images: [
        '/images/events/academic-heights/acad1.jpeg', 
        '/images/events/academic-heights/acad2.jpeg',
        '/images/events/academic-heights/acad3.jpeg',
      ]
    },
    {
      id: 4,
      school: 'Koormanchal Academy, Almora',
      location: 'Almora, Uttarakhand',
      date: 'November 18, 2025',
      participants: '5 students',
      description: 'Our outreach at Koormanchal Academy in Almora brought the message of environmental stewardship to a small but motivated group of five students. Despite the limited numbers, the quiz event sparked meaningful dialogue around biodiversity and the unique ecological challenges of the Himalayan region. The personalized session fostered lasting curiosity and an eagerness for further learning.',
      highlights: [
        'Personalized quiz and discussion event with every participant',
        'Special emphasis on biodiversity in the Himalayan region',
        'Encouraged creative thinking on local environmental protection',
        'Distributed certificates and resource materials to all students'
      ],
      images: [
        '/images/events/koormanchal/koormanchal1.jpeg', 
        '/images/events/koormanchal/koormanchal2.jpeg',
        '/images/events/koormanchal/koormanchal3.jpeg',
      ]
    },
    {
      id: 5,
      school: 'DAV Public School BSPS, Surangani',
      location: 'Chamba, Himachal Pradesh',
      date: 'November 21, 2025',
      participants: '36 students',
      description: 'DAV Public School BSPS in Surangani, Chamba hosted a dynamic environmental quiz for 36 enthusiastic students. The event focused on climate change, biodiversity, and practical steps for conservation relevant to the local community. The students actively collaborated, sharing innovative ideas for protecting Himachal’s natural beauty and fostering a culture of environmental responsibility.',
      highlights: [
        'Collaborative quiz emphasizing teamwork and environmental awareness',
        'Discussions about local conservation strategies in Himachal',
        'All attendees received certificates for their participation',
        'Encouraged students to launch small-scale sustainability projects'
      ],
      images: [
        '/images/events/dav-surangani/dav1.jpg', 
        '/images/events/dav-surangani/dav2.jpg',
        '/images/events/dav-surangani/dav3.jpg',
      ]
    },
    {
      id: 6,
      school: "Gyan Vigyan Children's Academy, Hawalbagh",
      location: 'Almora, Uttarakhand',
      date: 'November 21, 2025',
      participants: '49 students',
      description: 'At Gyan Vigyan Children\'s Academy in Hawalbagh, Almora, the quiz engaged 49 students in lively learning about Uttarakhand’s unique ecosystems. The event encouraged creative thinking about waste management, forest conservation, and the importance of water resources in hill regions. Students left motivated to implement eco-friendly habits in their daily lives.',
      highlights: [
        'Focused on sustainability and conservation in Himalayan hill regions',
        'Thought-provoking rounds on waste management and water resources',
        'Certificates awarded to all young participants',
        'Sparked student pledges to protect the environment at home and in the community'
      ],
      images: [
        '/images/events/gyan-vigyan/gyan1.jpg',
        '/images/events/gyan-vigyan/gyan2.jpg',
        '/images/events/gyan-vigyan/gyan3.jpg',
        '/images/events/gyan-vigyan/gyan4.jpg',
      ]
    },
    {
      id: 7,
      school: 'Poorna Prajna High School',
      location: 'Mumbai, Maharashtra',
      date: 'November 24, 2025',
      participants: '37 students',
      description: 'Pooma Prajna High School in Mumbai hosted an interactive quiz for 37 students, emphasizing urban environmental challenges and solutions. Topics included air pollution, marine conservation, and sustainable transport. The event inspired students to brainstorm ways they can contribute to making Mumbai cleaner and greener.',
      highlights: [
        'Quiz focused on urban ecology and sustainable transport',
        'Engaging conversations about pollution and clean city initiatives',
        'Recognition certificates given to every participant',
        'Motivated students to join and organize green activities in their neighborhoods'
      ],
      images: [
        '/images/events/pphs/pphs1.jpeg',
        '/images/events/pphs/pphs2.jpeg',
        '/images/events/pphs/pphs3.jpeg',
        '/images/events/pphs/pphs4.jpeg',
      ]
    },
    // {
    //   id: 8,
    //   school: 'EMRS Nichar',
    //   location: 'Nichar, Himachal Pradesh',
    //   date: 'November 21, 2025',
    //   participants: '42 students',
    //   description: 'EMRS Nichar welcomed our team for an inspiring environmental quiz event in Himachal’s mountainous heartland. Forty-two students participated enthusiastically, learning about biodiversity, climate resilience, and practical conservation efforts suited for their hill region. The quiz encouraged peer collaboration and helped foster a strong sense of ecological responsibility within the student community.',
    //   highlights: [
    //     'Interactive quiz encouraging teamwork and sharing of ideas',
    //     'Special focus on biodiversity and climate resilience in mountain ecosystems',
    //     'Distribution of participation certificates and eco-awareness materials',
    //     'Students developed action points for conservation in their local surroundings'
    //   ],
    //   images: [
    //     '/images/events/emrs-nichar/emrsnichar1.jpg', 
    //     '/images/events/emrs-nichar/emrsnichar2.jpg',
    //     '/images/events/emrs-nichar/emrsnichar3.jpg',
    //   ]
    // },
    {
  id: 9,
  school: 'Salwan Public School, Mayur Vihar',
  location: 'Mayur Vihar, Delhi',
  date: 'November 28, 2025',
  participants: '43 students',
  description: 'Salwan Public School in Mayur Vihar hosted an energetic quiz event focused on urban environmental issues. Forty-three students participated, tackling questions on sustainable living, pollution control, and city-based conservation strategies. The event inspired lively debates and creative problem-solving, motivating students to pursue eco-friendly practices in their daily lives and neighborhoods.',
  highlights: [
    'Stimulating quiz sessions centered on urban sustainability',
    'Debates and discussions on local environmental challenges',
    'Certificates presented to all student participants',
    'Encouraged real-world solutions for cleaner, greener city living'
  ],
  images: [
    '/images/events/salwan-mayurvihar/salwan1.jpg', // Replace with your actual image paths
    '/images/events/salwan-mayurvihar/salwan2.jpg',
    '/images/events/salwan-mayurvihar/salwan3.jpg',
  ]
}


  ];

  const closeModal = () => {
    setSelectedEvent(null);
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedEvent]);

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">School Stories</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Celebrating the memorable quiz events we've conducted with bright young minds across schools
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeader
          title="Our Journey in Schools"
          subtitle="Click on any event to view full details"
        />

        <div className="flex flex-wrap justify-center gap-6">
          {pastEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] max-w-sm"
            >
             <Card className="h-[260px] sm:h-[270px] lg:h-[280px] flex flex-col justify-between">


                <div
                  className="p-6 cursor-pointer hover:shadow-xl transition-shadow h-full flex flex-col justify-between"
                  onClick={() => setSelectedEvent(event)}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {event.school}
                  </h3>
                  
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-primary-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-primary-600" />
                      <span>{event.participants}</span>
                    </div>
                  </div>

                  <div className="mt-4 text-primary-600 font-medium text-sm">
                    Click to view details →
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use the EventModalCard Component */}
      {selectedEvent && (
        <EventModalCard
          selectedEvent={selectedEvent}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SchoolStories;
