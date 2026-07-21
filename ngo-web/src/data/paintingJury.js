// src/data/paintingJury.js
// Data list for the National Environmental Painting Competition jury panel.
// Add new members by appending another object to this array — the section
// and modal on the Upcoming Engagements page will pick them up automatically.

export const paintingJury = [
  {
    id: "joydeep-das-gupta",
    name: "Dr. Joydeep Das Gupta",
    designation: "Subject Expert, University of Lucknow (College of Arts)",
    subDesignation: "Visiting Faculty, Amity University Lucknow",
    image: "/images/painting-jury/joydeep-das-gupta.png",
    shortBio:
      "Ph.D in Indian Sculpture & Iconography (B.H.U., Varanasi) with over two decades of teaching and research in Art History and Aesthetics.",
    profile:
      "A focused, result-oriented and diligent academic with innovative teaching skills, Dr. Das Gupta brings a positive, inquisitive approach to art education and has contributed extensively to the study of Indian art history and iconography.",
    education: [
      "Ph.D (Indian Sculpture & Iconography), B.H.U., Varanasi — 2002",
      "M.A. (Art History), B.H.U., Varanasi — 1991 (1st in Order of Merit)",
      "B.F.A (Applied Arts), B.H.U., Varanasi — 1989",
      "Intermediate (Arts), U.P. Board, Varanasi — 1982",
      "High School (Arts), U.P. Board, Allahabad — 1980",
    ],
    experience: [
      "Assistant Professor, Amity School of Fine Arts, Amity University Lucknow (2008–2022)",
      "Visiting Faculty, Amity School of Fine Arts, Amity University Lucknow (2022–Present)",
      "Subject Expert, College of Arts and Crafts, University of Lucknow (2022–Present)",
      "Art Teacher, Glenhill School, Varanasi (1998–2008)",
    ],
    highlights: [
      "Junior Research Fellowship, Indian Council of Historical Research, New Delhi (1994–1996)",
      "Presented papers at multiple National & International Seminars on Indian art history, iconography and aesthetics",
      "Judge for numerous inter-school and university-level painting & art competitions across Lucknow",
      "Well versed in English, Hindi, Bengali and Bhojpuri",
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