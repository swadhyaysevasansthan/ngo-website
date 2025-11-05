// src/components/TeamSection.jsx
import React from "react";
import Card from "./Card";

const TeamSection = ({
  members, sectionHeader, setSelectedMember, selectable = true
}) => (
  <section className={sectionHeader?.bg || "bg-white"}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {sectionHeader && (
        <sectionHeader.Component
          title={sectionHeader.title}
          subtitle={sectionHeader.subtitle}
        />
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((member, index) => {
          const hasDetails = !!member.details;
          const hasDescription = !!member.description;

          return (
            <div
              key={index}
              className={!hasDetails ? "cursor-default" : "cursor-pointer"}
              onClick={() => selectable && hasDetails && setSelectedMember(member)}
              style={!hasDetails ? { opacity: 1 } : {}}
            >
              <Card className="
                flex flex-col items-center justify-between 
                h-[250px] min-h-[250px] max-h-[250px]
                md:h-[300px] md:min-h-[300px] md:max-h-[300px]
                lg:h-[300px] lg:min-h-[300px] lg:max-h-[300px]
                w-full
              ">
                <div className="p-6 flex flex-col items-center flex-1 w-full">
                  <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-green-500 to-primary-500 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-100 flex items-center justify-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
                    {member.name}
                  </h3>
                  {member.role && (
                    <p className="text-sm text-primary-600 text-center font-medium mb-2">{member.role}</p>
                  )}
                  {/* If NO details, show description in card */}
                  {hasDescription && !hasDetails && (
                    <p className="text-xs text-gray-600 text-center leading-relaxed">{member.description}</p>
                  )}
                  {/* If details, show click for more only */}
                  {hasDetails && (
                    <span className="mt-2 block text-xs text-gray-400 text-center">(Click for more)</span>
                  )}
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default TeamSection;
