import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import TeamSection from '../components/TeamSection';
import ModalCard from '../components/ModalCard';

// Import all your lists
import {
  coreMembers,
  patrons,
  teamMembers,
  environmentExperts,
  generalBodyTeam,
  youngITTeam
} from '../data/teamData';

const OurTeam = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    document.title = 'Our Team - Swadhyay Seva Foundation';
  }, []);

  return (
    <div className="bg-gray-50">
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Meet the visionaries, healers, and mentors who drive our mission forward with passion and expertise.
          </p>
        </div>
      </section>
      <TeamSection
        members={coreMembers}
        sectionHeader={{
          Component: SectionHeader,
          title: "Team Swadhyay Seva Foundation",
          subtitle: "Leaders driving the vision and mission of the foundation",
          bg: "bg-gray-50"
        }}
        setSelectedMember={setSelectedMember}
      />
      <TeamSection
        members={teamMembers}
        sectionHeader={{
          Component: SectionHeader,
          title: "Our Yog and Naturopathy Experts Team",
          subtitle: "Dedicated professionals leading our initiatives with expertise and passion",
          bg: "bg-white"
        }}
        setSelectedMember={setSelectedMember}
      />
      <TeamSection
        members={patrons}
        sectionHeader={{
          Component: SectionHeader,
          title: "Our Patrons",
          subtitle: "Guiding figures who inspire and support our journey",
          bg: "bg-gray-50"
        }}
        setSelectedMember={setSelectedMember}
      />
      <TeamSection
        members={environmentExperts}
        sectionHeader={{
          Component: SectionHeader,
          title: "Our Academic Advisory Panel",
          subtitle: "Academic professionals , Experienced educators and researchers guiding quiz creation and verifying content quality",
          bg: "bg-white"
        }}
        setSelectedMember={setSelectedMember}
      />
      <TeamSection
        members={generalBodyTeam}
        sectionHeader={{
          Component: SectionHeader,
          title: "General Body Team",
          subtitle: "Core members supporting organizational initiatives",
          bg: "bg-gray-50"
        }}
        selectable={false}
      />
      <TeamSection
        members={youngITTeam}
        sectionHeader={{
          Component: SectionHeader,
          title: "Young IT Team",
          subtitle: "Innovative minds driving our digital transformation",
          bg: "bg-white"
        }}
        setSelectedMember={setSelectedMember}
      />

      {selectedMember && selectedMember.details &&
        <ModalCard selectedMember={selectedMember} onClose={() => setSelectedMember(null)} />
      }
    </div>
  );
};

export default OurTeam;
