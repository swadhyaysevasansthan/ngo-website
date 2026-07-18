import { Brush, BookOpen } from "lucide-react";

export const competitionRules = {
  painting: {
    id: "painting",
    title: "National Environmental Painting Competition",
    shortTitle: "Painting Competition",
    icon: Brush,
    gradient: "from-orange-500 to-amber-500",
    border: "border-orange-200",

    sections: [
      {
        title: "1. Eligibility",
        points: [
          "Group A — Classes 3rd to 5th.",
          "Group B — Classes 6th to 8th.",
          "Both groups will be conducted and evaluated separately."
        ]
      },

      {
        title: "2. Maximum Participation",
        points: [
          "Up to 150 students per school in each group.",
          "Maximum 300 students per school."
        ]
      },

      {
        title: "3. Theme",
        points: [
          "Environment & Sustainability.",
          "Schools may choose topics such as Global Warming, Renewable Energy, Pollution & Waste Management, Tree Plantation, Wildlife Conservation, Sustainable Living, Water Conservation, Climate Change and Clean Environment."
        ]
      },

      {
        title: "4. Artwork Specifications",
        points: [
          "Artwork must be on A3 size paper.",
          "Any medium may be used, including water colours, crayons, oil pastels, pencil colours, acrylic colours, sketch pens, or mixed media.",
          "Digital artwork, AI generated artwork, printed artwork and tracing are not permitted."
        ]
      },

      {
        title: "5. Competition Duration",
        points: [
          "The competition may be conducted over 2–3 days, depending on the number of participants in the school.",
          "Each participant gets 1.5 hours."
        ]
      },

      {
        title: "6. Student Explanation",
        points: [
          "Each participant must submit a short slogan, message, or paragraph explaining the environmental message conveyed through their painting.",
          "The slogan/message must not be written on the artwork itself."
        ]
      },

      {
        title: "7. Registration & Confirmation",
        points: [
          "Teacher Coordinator submits School Access Form.",
          "Foundation reviews and approves.",
          "School receives registration link valid for two months.",
          "Competition date is allotted.",
          "Attendance Sheet is sent five days before competition."
        ]
      },

      {
        title: "8. School-Level Selection & National Evaluation",
        points: [
          "Schools select Top 5 students from each group.",
          "Maximum 10 National Level entries.",
          "National Jury evaluates shortlisted paintings.",
          "Schools courier original paintings."
        ]
      },

      {
        title: "9. Jury & Evaluation",
        points: [
          "Independent National Jury Panel.",
          "Judging based on Creativity, Relevance, Originality, Presentation and Environmental Message.",
          "Jury decision is final."
        ]
      },

      {
        title: "10. Awards & Recognition",
        points: [
          "E-Certificate for every participant.",
          "Top National winners receive trophies and Certificates of Excellence."
        ]
      },

      {
        title: "11. Participation Fee",
        points: [
          "Participation is completely FREE."
        ]
      },

      {
        title: "12. Disqualification",
        points: [
          "Copied artwork.",
          "AI generated artwork.",
          "Late submissions.",
          "Rule violations.",
          "Missing documentation."
        ]
      },

      {
        title: "13. School Responsibilities",
        points: [
          "Conduct fair evaluation.",
          "Verify student eligibility.",
          "Send selected entries.",
          "Capture photographs and videos."
        ]
      },

      {
        title: "14. Teacher Coordinators",
        points: [
          "Schools should appoint 1–2 teachers per group."
        ]
      },

      {
        title: "15. Copyright & Usage Rights",
        points: [
          "Foundation may use submitted artworks for awareness campaigns, exhibitions, publications and educational purposes."
        ]
      },

      {
        title: "16. General Instructions",
        points: [
          "Preserve original artwork before dispatch.",
          "Misrepresentation may lead to disqualification.",
          "Foundation may modify rules whenever required."
        ]
      }
    ]
  },

  quiz: {
    id: "quiz",
    title: "National Environment Quiz Competition",
    shortTitle: "Quiz Competition",
    icon: BookOpen,
    gradient: "from-emerald-500 to-teal-600",
    border: "border-emerald-200",

    sections: [
      {
        title: "1. Eligibility",
        points: [
          "Open to Classes 6th–8th."
        ]
      },

      {
        title: "2. Maximum Participation",
        points: [
          "Maximum 50 students per school."
        ]
      },

      {
        title: "3. Theme & Topics",
        points: [
          "Environment & Sustainability.",
          "Topics include Global Warming, Renewable Energy, Pollution, Tree Plantation, Wildlife Conservation, Sustainable Living, Water Conservation and Climate Change."
        ]
      },

      {
        title: "4. Competition Format",
        points: [
          "School Level Online MCQ Quiz.",
          "10-minute duration.",
          "Top performer qualifies for National Level."
        ]
      },

      {
        title: "5. Registration & Confirmation",
        points: [
          "School submits Access Form.",
          "Foundation approval.",
          "Registration link issued.",
          "Competition date allotted.",
          "Attendance Sheet shared before competition."
        ]
      },

      {
        title: "6. Language & Technical Requirements",
        points: [
          "Quiz is conducted in English.",
          "Stable internet required.",
          "Computer system preferred."
        ]
      },

      {
        title: "7. Verification, Scoring & Evaluation",
        points: [
          "Schools verify student details.",
          "Automatic online evaluation.",
          "Foundation decision is final."
        ]
      },

      {
        title: "8. Awards & Recognition",
        points: [
          "Participation Certificates.",
          "Top 3 Merit Certificates.",
          "National Level trophies and recognition."
        ]
      },

      {
        title: "9. Participation Fee",
        points: [
          "Participation is completely FREE."
        ]
      },
      {
        title: "10. Unfair Means & Disqualification",
        points: [
          "Cheating.",
          "External assistance.",
          "Multiple registrations.",
          "Impersonation.",
          "Rule violations."
        ]
      },
      {
        title: "11. School Responsibilities",
        points: [
          "Conduct fairly.",
          "Verify eligibility.",
          "Maintain technical arrangements.",
          "Capture photographs and videos."
        ]
      },
      {
        title: "12. Teacher Coordinators",
        points: [
          "Schools should appoint two teacher coordinators."
        ]
      },
      {
        title: "13. Copyright & Usage Rights",
        points: [
          "Foundation may publish participant names, photographs and videos for educational and promotional purposes."
        ]
      },
      {
        title: "14. General Instructions",
        points: [
          "Students participate individually.",
          "Foundation may modify rules if required."
        ]
      }
    ]
  }
};