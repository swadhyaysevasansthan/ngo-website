import React, {useEffect} from 'react';
import { Award, Users, User, Heart, Leaf, Cpu } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';

const OurTeam = () => {


    useEffect(() => {
        document.title = 'Our Team - Swadhyay Seva Foundation';
    }, []);
  const coreMembers = [
    {
      name: "Manish Goel",
      role: "Founder & President",
      description: "Naturopath, Trainer, Financial Consultant, Social Activist, Vedic Farmer",
      image: "/images/team/manish-goel.jpg",
    },
    {
      name: "Dr. Rajesh Agrawal",
      role: "Co-Founder & Vice President",
      description: "M.Pharma, Ph.D., General Manager – Research & Development, Pharmaceutical Research Scientist",
      image: "/images/team/rajesh-agrawal.jpg",
    },
    {
      name: "Nitin Goel",
      role: "Co-Founder & Treasurer",
      description: "Supporting organizational growth and resource management",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Ruchi Rawal",
      role: "General Secretary",
      description: "Contributing to sustainable environmental and paper-making initiatives",
      image: "/images/team/user-nobg.png",
    },
    
  ];

  const patrons = [
    {
      name: "Sh. G D Dhanuka",
      role: "Our Patron",
      description: "Addl. District and Sessions Judge (Retd.) Delhi",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Dr Madhu Ved",
      role: "Our Patron",
      description: "Dean - GILP, Delhi | Director – JPS, Delhi \n An author, TV panelist, Life long learner, Aseas Bangkok Awardee Life mantra- A Dream for Green Society",
      image: "/images/team/madhu-ved.jpg",
    },
    {
      name: "Dr. Anand Singh",
      role: "Our Patron",
      description: "Professor, College of Horticulture, Banda University of Agriculture and Technology, Banda, Uttar Pradesh",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Sandeep Marodia",
      role: "Our Patron",
      description: "Industrialist & Social Activist",
      image: "/images/team/user-nobg.png",
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Brij Bhushan Goel",
      role: "NDDY, D.PH, PGDIHC, DLIM",
      description: "Senior Naturopath Since 1990",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Dr. Shallu Gupta",
      role: "PhD (Naturopathy and Yoga)",
      description: "A Chief Medical Officer of Samshudhi Residential Naturopathy and Panchakarma Hospital in Gurugram. She holds a PhD in Naturopathy and Yoga. She carries 17 yrs of experience in this field.",
      image: "/images/team/shalu-gupta.jpg",
    },
    {
      name: "Acharya Krishan Garg",
      role: "Yoga Expert",
      description: "Referee Diploma from Asian Yoga Federation, 4× International Gold Medalist, 15× National Gold Medalist",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Acharya Shishir Pokhriyal",
      role: "MA Yogic Science, Pranic Healer",
      description: "Crystal Therapy Expert, Awarded Atal Bharat Ratan",
      image: "/images/team/shishir-pokhriyal.jpg",
    },
    {
      name: "Acharya Vijay",
      role: "Masters in Yoga",
      description: "Certified From MDNIY, YTTC 300 Hours (Mysore), 2× International Champion",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Yogini Shushma",
      role: "MA in YOGA, Diploma in Naturopathy",
      description: "Pranic healer and Referee in India yoga federation, National yoga champion 2021",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Yogini Bharti",
      role: "Master in Yoga, Bachelor of Naturopathy",
      description: "Diploma in Dietician health and nutrition, 2nd international all martial art championship trophy 2011, south Asian international karate championship",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Yogini Manju",
      role: "Bachelors of Yoga and Naturopathy",
      description: "Masters in Yoga, Bronze medalist in Delhi Olympiad",
      image: "/images/team/user-nobg.png",
    },
  ];

  const environmentExperts = [
    {
      name: "Dr. Piyush Mehta",
      role: "Associate Professor (Agribusiness)",
      description: "Dr. YS Parmar University of Horticulture & Forestry",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Dr. Anil Chandra",
      role: "Scientist",
      description: "Krishi Vigyan Kendra, Kashipur – G.B. Pant University of Agriculture & Technology",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Dr. Anand Singh",
      role: "Professor, Fruit Science",
      description: "College of Horticulture, Banda University of Agriculture & Technology, Banda",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Dr. Brij Mohan Pandey",
      role: "Principal Scientist (Agronomy)",
      description: "Vivekananda Parvatiya Krishi Anusandhan Sansthan (ICAR), Almora",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Dr. Phoolkumari",
      role: "Subject Matter Specialist (Home Science)",
      description: "Krishi Vigyan Kendra – Hamirpur, Banda University of Agriculture & Technology, Banda",
      image: "/images/team/user-nobg.png",
    },
  ];

  const generalBodyTeam = [
    { name: "Rajiv Kumar Garg", role: "Member", image: "/images/team/user-nobg.png", },
    { name: "Tushar Goel", role: "Member", image: "/images/team/user-nobg.png", },
    { name: "Ishita Goel", role: "Member", image: "/images/team/user-nobg.png", },
    { name: "Mansi Goel", role: "Member", image: "/images/team/user-nobg.png", },
  ];

  const youngITTeam = [
    {
      name: "Ayush Behera",
      role: "Pursuing B.Tech (Computer Science)",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Tushar Jain",
      role: "Pursuing B.Tech (CSAI)",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Tushar Goel",
      role: "Pursuing B.Tech (Computer Science)",
      image: "/images/team/user-nobg.png",
    },
    {
      name: "Govind Goyal",
      role: "Pursuing B.Tech (Computer Science)",
      image: "/images/team/user-nobg.png", 
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Meet the visionaries, healers, and mentors who drive our mission forward with passion and expertise.
          </p>
        </div>
      </section>

      {/* Core Members */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Team Swadhyay Seva Foundation"
            subtitle="Leaders driving the vision and mission of the foundation"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreMembers.map((member, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-green-500 to-primary-500 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-100">
                     
                     <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        />
                    
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 text-center mb-2">{member.name}</h3>
                  <p className="text-sm text-primary-600 text-center font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-gray-600 text-center leading-relaxed">{member.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Team */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Yog and Naturopathy Experts Team"
            subtitle="Dedicated professionals leading our initiatives with expertise and passion"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-green-500 to-primary-500 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-100">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 text-center mb-2">{member.name}</h3>
                  <p className="text-sm text-primary-600 text-center font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-gray-600 text-center leading-relaxed">{member.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Patrons */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Our Patrons" subtitle="Guiding figures who inspire and support our journey" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {patrons.map((member, index) => (
              <Card key={index}>
                <div className="p-6">
                  
                    <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-green-500 to-primary-500 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-100">
                        <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        />
                    </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 text-center mb-2">{member.name}</h3>
                  <p className="text-xs text-gray-600 text-center leading-relaxed whitespace-pre-line">{member.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Environment & Paper Making Experts */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Academic Advisory Panel"
            subtitle="Academic professionals , Experienced educators and researchers guiding quiz creation and verifying content quality"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {environmentExperts.map((member, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-green-500 to-primary-500 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-100">
                        <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        />
                    </div>
                  <h3 className="text-lg font-bold text-gray-800 text-center mb-2">{member.name}</h3>
                  <p className="text-sm text-primary-600 text-center font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-gray-600 text-center leading-relaxed">{member.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* General Body Team */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="General Body Team" subtitle="Core members supporting organizational initiatives" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {generalBodyTeam.map((member, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-saffron-500 to-primary-500 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-100">
                        <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        />
                    </div>
                  <h3 className="text-lg font-bold text-gray-800 text-center mb-2">{member.name}</h3>
                  <p className="text-sm text-primary-600 text-center font-medium mb-2">{member.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Young IT Team */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Young IT Team"
            subtitle="Innovative minds driving our digital transformation"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {youngITTeam.map((member, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-primary-500 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-100">
                    <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 text-center mb-2">{member.name}</h3>
                  <p className="text-sm text-primary-600 text-center font-medium mb-2">{member.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurTeam;