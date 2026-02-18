import React from "react";
import Card from "./Card";

const TeamSection = ({
  members,
  sectionHeader,
  setSelectedMember,
  selectable = true,
}) => {
  const isFewMembers = members.length <= 2;

  return (
    <section className={sectionHeader?.bg || "bg-white"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {sectionHeader && (
          <sectionHeader.Component
            title={sectionHeader.title}
            subtitle={sectionHeader.subtitle}
          />
        )}

        <div
          className={
            isFewMembers
              ? "flex flex-wrap justify-center gap-6"
              : "grid md:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center"
          }
        >
          {members.map((member, index) => {
            const hasDetails = !!member.details;
            const hasDescription = !!member.description;

            return (
              <div
                key={index}
                className={`${hasDetails ? "cursor-pointer" : "cursor-default"} w-full max-w-xs`}
                onClick={() =>
                  selectable && hasDetails && setSelectedMember(member)
                }
                style={!hasDetails ? { opacity: 1 } : {}}
              >
                <Card
                  className="
                    flex flex-col items-center justify-between 
                    h-[250px] min-h-[250px] max-h-[250px]
                    md:h-[300px] md:min-h-[300px] md:max-h-[300px]
                    lg:h-[300px] lg:min-h-[300px] lg:max-h-[300px]
                    w-full
                  "
                >
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
                      <p className="text-sm text-primary-600 text-center font-medium mb-2">
                        {member.role}
                      </p>
                    )}

                    {/* Show description in card if no details */}
                    {hasDescription && !hasDetails && (
                      <div className="w-full overflow-y-auto max-h-[90px] md:max-h-[110px] lg:max-h-[125px] px-2 text-xs text-gray-600 text-center leading-relaxed">
                        {typeof member.description === "string"
                          ? member.description
                          : member.description}
                      </div>
                    )}

                    {/* If details exist, show click-for-more */}
                    {hasDetails && (
                      <span className="mt-2 block text-xs text-gray-400 text-center">
                        (Click for more)
                      </span>
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
};

export default TeamSection;
