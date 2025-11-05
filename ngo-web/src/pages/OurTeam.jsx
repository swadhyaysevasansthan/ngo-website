import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import TeamSection from '../components/TeamSection';
import {
  coreMembers,
  patrons,
  teamMembers,
  environmentExperts,
  generalBodyTeam,
  youngITTeam
} from '../data/teamData';

const MODAL_HEIGHTS = {
  base: "h-[450px]",
  md: "md:h-[500px]",
  lg: "lg:h-[550px]"
};

const ModalCard = ({ selectedMember, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
    <Card className={`
      w-full max-w-md mx-4 md:max-w-lg md:mx-8 lg:max-w-xl lg:mx-0
      ${MODAL_HEIGHTS.base} ${MODAL_HEIGHTS.md} ${MODAL_HEIGHTS.lg}
      flex flex-col items-center justify-start relative shadow-2xl
    `}>
      <button
        className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-primary-700"
        onClick={onClose}
        aria-label="Close"
      >&times;</button>
      <div className="flex flex-col items-center w-full pt-2 px-2">
        <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-green-500 to-primary-500 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-100 flex items-center justify-center">
          <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full object-cover" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 text-center">
          {selectedMember.name}
        </h3>
        {selectedMember.role && (
          <p className="text-primary-600 font-medium mb-2 text-center">
            {selectedMember.role}
          </p>
        )}
        {selectedMember.description && (
          <p className="text-gray-600 text-center mb-4">{selectedMember.description}</p>
        )}
        <div className="w-full overflow-y-auto px-1 flex-1 text-gray-700 text-sm
          max-h-[150px] md:max-h-[220px] lg:max-h-[280px]">
          {selectedMember.details}
        </div>
      </div>
    </Card>
  </div>
);

const OurTeam = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  useEffect(() => { document.title = 'Our Team - Swadhyay Seva Foundation'; }, []);

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

      {/* Reusable Sections */}
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
        selectable={false}
      />

      {selectedMember && selectedMember.details &&
        <ModalCard selectedMember={selectedMember} onClose={() => setSelectedMember(null)} />
      }
    </div>
  );
};

export default OurTeam;
