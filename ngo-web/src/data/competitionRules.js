import { Brush, BookOpen } from "lucide-react";

export const competitionRules = {
  painting: {
    id: "painting",
    title: "Swadhyay National Environment Painting Competition (SNEPC) 2026–27 — 1st Edition",
    shortTitle: "Painting Competition",
    icon: Brush,
    gradient: "from-orange-500 to-amber-500",
    border: "border-orange-200",

    sections: [
      {
        title: "1. School Responsibilities & Documentation",
        points: [
          <b>Capture, for each group, a minimum of 4 photographs and 1 video recording using GPS-enabled camera devices. Failure to provide this documentation may affect eligibility for National-Level evaluation.</b>,
          "Conduct the competition fairly and transparently within the school premises under proper supervision.",
          "Verify student eligibility and class details, obtain parental consent wherever required, and ensure the authenticity of all entries.",
          "Submit the selected entries within the specified timeline and preserve the original artworks safely before dispatch.",
        ]
      },

      {
        title: "2. School-Level Selection & National Evaluation",
        points: [
          <b>Participating schools will conduct the competition internally and evaluate entries fairly.</b>,
          "Each school will select the Top 5 students from Primary and the Top 5 students from Secondary — a total of 10 national-level entries per school.",
          "There will be no separate physical national event for the Painting Competition; selected paintings from schools across India are evaluated by the National Jury Panel.",
          <b>Schools must submit scanned copies/PDFs of selected paintings digitally, and courier the original paintings to the Foundation address (details to be shared later).</b>
        ]
      },

      {
        title: "3. Student Explanation / Message",
        points: [
          "Each participant must submit a short slogan, message, or paragraph explaining the environmental message conveyed through their painting.",
          <b>Important: the slogan/message must not be written on the artwork itself.</b>
        ]
      },

      {
        title: "4. Registration & Confirmation",
        description: "More information: www.swadhyayseva.org/upcoming-engagements  ·  Register here: www.swadhyayseva.org/school-competition",
        points: [
          "The school's teacher coordinator submits the School Access Form at the registration link above.",
          "Competition officials review the submitted details and approve the request.",
          "Upon approval, the school will receive an approval email at the address provided in the form, along with a unique registration link valid for 2 months. This link can be used to register for both SNEQC and SNEPC.",
          "After the school registers for a competition, officials will review the submission and allot a date from the school's selected preferred dates.",
          "A date-allotment email will then be sent once again to the registered email address confirming the assigned competition date.",
          <b>Along with the date-allotment email, the school receives a Student Information Sheet, which must be filled in with participant details and submitted 3-4 days before the competition date.</b>
        ]
      },

      {
        title: "5. Eligibility",
        points: [
          "Primary — Classes 3rd to 5th.",
          "Secondary — Classes 6th to 8th.",
          "Both groups will be conducted and evaluated separately."
        ]
      },

      {
        title: "6. Maximum Participation",
        points: [
          "Up to 150 students per school in each group.",
          "Total maximum participation: 300 students per school."
        ]
      },

      {
        title: "7. Theme",
        description: "Theme: Environment & Sustainability",
        points: [
          "Schools may choose related topics such as Global Warming, Renewable Energy, Pollution & Waste Management, Tree Plantation, Wildlife Conservation, Sustainable Living, Water Conservation, Climate Change, and Clean Environment."
        ]
      },

      {
        title: "8. Artwork Specifications",
        points: [
          "Artwork must be created on A3 size paper only.",
          "Any medium may be used, including water colours, crayons, oil pastels, pencil colours, acrylic colours, sketch or pens.",
          "Not permitted: digital artwork, AI-generated artwork, printed artwork, tracing artwork, or copied/plagiarized content."
        ]
      },

      {
        title: "9. Competition Duration",
        points: [
          "The competition may be conducted over 2–3 days, depending on the number of participants in the school.",
          "Each participant will be given 1.5 hours to complete the artwork."
        ]
      },

      {
        title: "10. Jury & Evaluation Pattern",
        points: [
          "Entries will be evaluated by an independent National Jury Panel constituted by the Foundation.",
          "Judging criteria include Creativity, Relevance to Theme, Originality, Presentation, and Environmental Message & Awareness.",
          "The jury panel's decision shall be final and binding."
        ]
      },

      {
        title: "11. Awards & Recognition",
        points: [
          "All Participants: E-Certificates.",
          "National Level: The Top 5 students from Primary and Top 5 from Secondary receive Trophies, Certificates of Excellence, and National Recognition.",
          "Winners will be announced through an online recognition ceremony; awards are sent by courier/post."
        ]
      },

      {
        title: "12. Participation Fee",
        points: [
          "There is no registration or participation fee — participation is completely free of cost."
        ]
      },

      {
        title: "13. Disqualification Rules",
        description: "Entries may be disqualified if they:",
        points: [
          "Are copied, plagiarised, digitally created, or AI-generated.",
          "Are submitted with incomplete student details.",
          "Are submitted after the deadline.",
          "Do not comply with the prescribed rules and specifications.",
          "Are conducted outside the school premises.",
          "Are submitted without the required photographs/video documentation."
        ]
      },

      {
        title: "14. Teacher Coordinators",
        points: [
          "Schools should appoint one or two teachers for each group, or more if required, to ensure smooth coordination and supervision."
        ]
      },

      {
        title: "15. Copyright & Usage Rights",
        points: [
          "By participating, schools and participants grant Swadhyay Seva Foundation permission to use the submitted artworks for social media, exhibitions, publications, certificates, environmental awareness campaigns, and educational and promotional activities. Proper credit to students and schools may be provided wherever applicable."
        ]
      },

      {
        title: "16. General Instructions",
        points: [
          "Schools are requested to preserve the selected original artworks carefully before courier dispatch.",
          "The use of unfair means or misrepresentation may result in disqualification.",
          "The Foundation reserves the right to modify these rules, if necessary, for the smooth conduct of the programme."
        ]
      }
    ]
  },

  quiz: {
    id: "quiz",
    title: "Swadhyay National Environment Quiz Competition (SNEQC) 2026–27 — 2nd Edition",
    shortTitle: "Quiz Competition",
    icon: BookOpen,
    gradient: "from-emerald-500 to-teal-600",
    border: "border-emerald-200",

    sections: [

      {
        title: "1. School Responsibilities & Documentation",
        points: [
          <b>Capture a minimum of 4 photographs and 1 video recording of participating students using GPS-enabled camera devices; failure to provide this documentation may affect eligibility for National Level qualification.</b>,
          "Conduct the quiz fairly, transparently, and only within school premises, with proper supervision and discipline.",
          "Verify student eligibility, details, and authenticity of participation, and ensure stable technical arrangements.",
        ]
      },

      {
        title: "2. Registration & Confirmation",
        description: "More information: www.swadhyayseva.org/upcoming-engagements  ·  Register here: www.swadhyayseva.org/school-competition",
        points: [
          "The school's teacher coordinator submits the School Access Form at the registration link above.",
          "Competition officials review the submitted details and approve the request.",
          "Once approved, the school receives an approval email at the address provided in the form, along with a unique registration link valid for 2 months. This link can be used to register for both SNEQC and SNEPC.",
          "After the school registers for a competition, officials review the submission and allot a date from the school's selected preferred dates.",
          "A date-allotment email is sent once again to the registered email address confirming the assigned competition date.",
          <b>Along with the date-allotment email, the school receives a Student Information Sheet, which must be filled in with participant details and submitted 3-4 days before the competition date.</b>
        ]
      },

      {
        title: "3. Pre-Exam Communication",
        points: [
          <b>Five days prior to the exam, the Swadhyay Team will send an email containing a certified question bank of 100 questions, an information sheet, an attendance sheet, and all necessary instructions.</b>,
          "The question bank will be accessible online using a specific password, valid for 5 days, allowing students to prepare for the quiz.",
          "The Student Information Sheet is not resent at this stage, as it is already shared earlier along with the date-allotment email."
        ]
      },

      {
        title: "4. Exam Day Procedure",
        points: [
          <b>On the day of the exam, the Swadhyay Team will send a specific Quiz Code, valid for 2–3 hours, 30 minutes before the start of the exam, along with final instructions.</b>,
          "The quiz will contain 25 objective-type questions based on the question bank provided earlier.",
          "The quiz has a maximum 10-minute time limit, with an attached timer for automatic submission upon time completion.",
          "Early submission will be an advantage for children during selection."
        ]
      },

      {
        title: "5. Competition Format",
        points: [
          "School Level Round: Conducted online, within school premises only, under school supervision.",
          "School Level Round: Individual attempt on a computer system; Multiple Choice Questions (MCQs) only.",
          "School Level Round: Duration — 10 minutes.",
          "National Level Grand Finale: Top performer(s) from each school qualify for the National Level Grand Finale — a live stage event conducted online, attended virtually by finalists from across India."
        ]
      },

      {
        title: "6. Verification, Scoring & Evaluation",
        points: [
          "Schools must verify each participant's class, school enrollment, and student identity; incorrect or unverifiable details may lead to disqualification.",
          "The quiz will be evaluated automatically via the online platform, and system-generated scores are final.",
          <b>The quiz duration is 10 minutes. Rankings will be determined primarily by the number of correct answers. In the event of a tie, the participant who completes and submits the quiz in the shortest time, as recorded by the system, will be ranked higher.</b>,
          "In case of any dispute, the Foundation's decision shall be final and binding."
        ]
      },

      {
        title: "7. Post-Exam Process & Certification",
        points: [
          "After the exam, E-Certificates for participants will be shared once the attendance sheet has been verified.",
          "The school must fill in the feedback Google Form provided in the mail.",
          "The school must also share a Testimonial on school letterhead.",
          <b>Once the feedback form and testimonial are received, E-Certificates for the school and the teacher coordinator will be shared.</b>
        ]
      },

      {
        title: "8. Eligibility",
        points: [
          "Open to students of Classes 6th to 8th.",
          "The competition is conducted as a single combined category for all eligible classes."
        ]
      },

      {
        title: "9. Maximum Participation",
        points: [
          "Up to 50 students per school."
        ]
      },

      {
        title: "10. Theme & Topics",
        description: "Theme: Environment & Sustainability",
        points: [
          "Suggested topics: Global Warming, Renewable Energy, Pollution & Waste Management, Tree Plantation, Wildlife Conservation, Sustainable Living, Water Conservation, Climate Change, and Clean Environment."
        ]
      },

      {
        title: "11. Language & Technical Requirements",
        points: [
          "The quiz will be conducted in English only.",
          "Schools must ensure a stable internet connection, availability of computer systems, and proper supervision.",
          "Use of mobile phones is discouraged unless specifically permitted by the Foundation."
        ]
      },

      {
        title: "12. Awards & Recognition",
        points: [
          "All Participants: E-Certificates.",
          "School Level: Merit Certificates for the Top 3 performers from each school.",
          "National Level: Trophies, Certificates of Excellence, and National Recognition. Details will be shared with shortlisted participants."
        ]
      },

      {
        title: "13. Participation Fee",
        points: [
          "There is no registration or participation fee — participation is completely free of cost."
        ]
      },

      {
        title: "14. Unfair Means & Disqualification",
        points: [
          "Participants may be disqualified for cheating, receiving external assistance, internet misuse, multiple registrations, impersonation, rule violations, conducting the competition outside school premises, or using unauthorized devices/materials.",
          "Schools are requested to ensure fair and transparent conduct."
        ]
      },

      {
        title: "15. Teacher Coordinators",
        points: [
          "Each participating school should appoint 2 teacher coordinators for smooth management and supervision of the competition."
        ]
      },

      {
        title: "16. Copyright, Media & Usage Rights",
        points: [
          "By participating, schools and participants grant Swadhyay Seva Foundation permission to record online sessions/events, use photographs and videos, and publish participant names and results for social media, publications, awareness campaigns, and educational & promotional activities."
        ]
      },

      {
        title: "17. General Instructions",
        points: [
          "Students must participate individually and follow all instructions from the school and the Foundation.",
          "Any attempt to disrupt the fairness or integrity of the competition may result in disqualification.",
          "The Foundation reserves the right to modify rules if required for the smooth conduct of the programme."
        ]
      }
    ]
  }
};