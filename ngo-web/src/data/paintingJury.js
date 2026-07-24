// src/data/paintingJury.js
// Data list for the National Environmental Painting Competition jury panel.
// Add new members by appending another object to this array — the section
// and modal on the Upcoming Engagements page will pick them up automatically.

export const paintingJury = [
  {
    id: "joydeep-das-gupta",
    name: "Dr. Joydeep Das Gupta",
    designation: "Subject Expert, University of Lucknow (College of Arts)",
    image: "/images/painting-jury/joydeep-das-gupta.png",
    shortBio:
      "Ph.D in Indian Sculpture & Iconography (B.H.U., Varanasi) with over two decades of teaching and research in Art History and Aesthetics.",
    profile:
      "A focused, result-oriented and diligent academic with innovative teaching skills, Dr. Das Gupta brings a positive, inquisitive approach to art education and has contributed extensively to the study of Indian art history and iconography.",
    education: [
      "Ph.D in Indian Sculpture & Iconography, Banaras Hindu University (2002)",
      "M.A. (Art History), BHU, 1st in Order of Merit (1991)",
      "B.F.A (Applied Arts), BHU (1989)",
    ],
     experience: [
      "25+ Years of Teaching Experience",
      "Former Assistant Professor, Amity University Lucknow (2008–2022)",
      "Former Subject Expert, College of Arts & Crafts, University of Lucknow (2022–2024)",
    ],
    highlights: [
      "Junior Research Fellowship, Indian Council of Historical Research, New Delhi (1994–1996)",
      "National & International Seminar Speaker, with numerous research papers & presentations",
      "Judge for numerous inter-school and university-level painting & art competitions across Lucknow",
    ],
  },

  // 👉 Add the next jury member below, following the same structure:
  // {
  //   id: "unique-slug",
  //   name: "Full Name",
  //   designation: "Primary role/title",
  //   subDesignation: "Secondary role/title (optional)",
  //   image: "/images/painting-jury/filename.jpg",
  //   shortBio: "One or two line summary shown on the card.",
  //   profile: "Longer intro paragraph shown at the top of the modal.",
  //   education: ["Degree, Institute — Year", ...],
  //   experience: ["Role, Institute (Years)", ...],
  //   highlights: ["Notable achievement or recognition", ...],
  // },
];