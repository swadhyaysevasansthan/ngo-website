import React from 'react';
import { Award, Users, Heart, Leaf, Cpu } from 'lucide-react';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';

const OurTeam = () => {
  const coreMembers = [
    {
      name: "Manish Goel",
      role: "Founder & President",
      description: "(Naturopath, Social Worker)",
      icon: <Users className="w-6 h-6" />,
    },
    {
      name: "Dr. Rajesh Agrawal",
      role: "Vice President",
      description: "M.Pharma, Ph.D., Head – Research & Development.",
      icon: <Users className="w-6 h-6" />,
    },
  ];

  const patrons = [
    {
      name: "Sh. G D Dhanuka",
      role: "Our Patron",
      description: "Addl. District and Sessions Judge (Retd.) Delhi",
      icon: <Award className="w-6 h-6" />,
    },
    {
      name: "Dr Madhu Ved",
      role: "Our Patron",
      description: "Dean - GILP, Delhi | Director – JPS, Delhi \n An author, TV panelist, Life long learner, Aseas Bangkok Awardee Life mantra- A Dream for Green Society",
      icon: <Award className="w-6 h-6" />,
    },
    {
      name: "Dr. Anand Singh",
      role: "Our Patron",
      description: "Professor, College of Horticulture, Banda University of Agriculture and Technology, Banda, Uttar Pradesh",
      icon: <Award className="w-6 h-6" />,
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Brij Bhushan Goel",
      role: "NDDY, D.PH, PGDIHC, DLIM",
      description: "Senior Naturopath Since 1990",
      icon: <Users className="w-6 h-6" />,
    },
    {
      name: "Dr. Shallu Gupta",
      role: "PhD (Naturopathy and Yoga)",
      description: "A Chief Medical Officer of Samshudhi Residential Naturopathy and Panchakarma Hospital in Gurugram. She holds a PhD in Naturopathy and Yoga. She carries 17 yrs of experience in this field.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      name: "Acharya Krishan Garg",
      role: "Yoga Expert",
      description: "Referee Diploma from Asian Yoga Federation, 4× International Gold Medalist, 15× National Gold Medalist",
      icon: <Users className="w-6 h-6" />,
    },
    {
      name: "Acharya Shishir Pokhriyal",
      role: "MA Yogic Science, Pranic Healer",
      description: "Crystal Therapy Expert, Awarded Atal Bharat Ratan",
      icon: <Users className="w-6 h-6" />,
    },
    {
      name: "Acharya Vijay",
      role: "Masters in Yoga",
      description: "Certified From MDNIY, YTTC 300 Hours (Mysore), 2× International Champion",
      icon: <Users className="w-6 h-6" />,
    },
    {
      name: "Yogini Shushma",
      role: "MA in YOGA, Diploma in Naturopathy",
      description: "Pranic healer and Referee in India yoga federation, National yoga champion 2021",
      icon: <Users className="w-6 h-6" />,
    },
    {
      name: "Yogini Bharti",
      role: "Master in Yoga, Bachelor of Naturopathy",
      description: "Diploma in Dietician health and nutrition, 2nd international all martial art championship trophy 2011, south Asian international karate championship",
      icon: <Users className="w-6 h-6" />,
    },
    {
      name: "Yogini Manju",
      role: "Bachelors of Yoga and Naturopathy",
      description: "Masters in Yoga, Bronze medalist in Delhi Olympiad",
      icon: <Users className="w-6 h-6" />,
    },
  ];

  const environmentExperts = [
    {
      name: "Dr. Piyush Mehta",
      role: "Associate Professor (Agribusiness)",
      description: "Dr. YS Parmar University of Horticulture & Forestry",
      icon: <Leaf className="w-6 h-6" />,
    },
    {
      name: "Dr. Anil Chandra",
      role: "Scientist",
      description: "Krishi Vigyan Kendra, Kashipur – G.B. Pant University of Agriculture & Technology",
      icon: <Leaf className="w-6 h-6" />,
    },
    {
      name: "Dr. Anand Singh",
      role: "Professor, Fruit Science",
      description: "College of Horticulture, Banda University of Agriculture & Technology, Banda",
      icon: <Leaf className="w-6 h-6" />,
    },
    {
      name: "Dr. Brij Mohan Pandey",
      role: "Principal Scientist (Agronomy)",
      description: "Vivekananda Parvatiya Krishi Anusandhan Sansthan (ICAR), Almora",
      icon: <Leaf className="w-6 h-6" />,
    },
    {
      name: "Dr. Phoolkumari",
      role: "Subject Matter Specialist (Home Science)",
      description: "Krishi Vigyan Kendra – Hamirpur, Banda University of Agriculture & Technology, Banda",
      icon: <Leaf className="w-6 h-6" />,
    },
    {
      name: "Ruchi Rawal",
      role: "General Secretary",
      description: "Contributing to sustainable environmental and paper-making initiatives",
      icon: <Leaf className="w-6 h-6" />,
    },
    {
      name: "Nitin Goel",
      role: "Treasurer",
      description: "Supporting organizational growth and resource management",
      icon: <Leaf className="w-6 h-6" />,
    },
  ];

  const generalBodyTeam = [
    { name: "Rajiv Kumar Garg", role: "Member", icon: <Users className="w-6 h-6" /> },
    { name: "Tushar Goel", role: "Member", icon: <Users className="w-6 h-6" /> },
    { name: "Ishita Goel", role: "Member", icon: <Users className="w-6 h-6" /> },
    { name: "Mansi Goel", role: "Member", icon: <Users className="w-6 h-6" /> },
  ];

  const youngITTeam = [
    {
      name: "Ayush Behera",
      role: "Pursuing B.Tech (Computer Science)",
      icon: <Cpu className="w-6 h-6" />,
    },
    {
      name: "Tushar Jain",
      role: "Pursuing B.Tech (CSAI)",
      icon: <Cpu className="w-6 h-6" />,
    },
    {
      name: "Tushar Goel",
      role: "Pursuing B.Tech (Computer Science)",
      icon: <Cpu className="w-6 h-6" />,
    },
    {
      name: "Govind",
      role: "Pursuing B.Tech (Computer Science)",
      icon: <Cpu className="w-6 h-6" />,
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
            title="Team Swadhyay Seva Sansthan"
            subtitle="Leaders driving the vision and mission of the foundation"
          />
          <div className="flex justify-center gap-6 flex-wrap ">
            {coreMembers.map((member, index) => (
              <Card key={index} className="max-w-sm w-full">
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-saffron-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {member.icon}
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
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-saffron-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {member.icon}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patrons.map((member, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-saffron-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {member.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 text-center mb-2">{member.name}</h3>
                  <p className="text-sm text-primary-600 text-center font-medium mb-2">{member.role}</p>
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
            title="Our Environment and Paper Making Experts"
            subtitle="Experts leading our sustainability and innovation initiatives"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {environmentExperts.map((member, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {member.icon}
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
                  <div className="w-16 h-16 bg-gradient-to-br from-saffron-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {member.icon}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {youngITTeam.map((member, index) => (
              <Card key={index}>
                <div className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {member.icon}
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