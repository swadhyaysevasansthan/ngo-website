// src/data/snpcGrandFinale.js
//
// Content sourced from the official event posters and the Grand Finale
// minutes/flow-of-programme document. Photo/video fields use the
// "CLOUDINARY_URL" placeholder convention (see Photo component in the
// page file) — replace each with the real Cloudinary URL once the
// ~400 event photos are uploaded. Winner names are intentionally NOT
// hardcoded here: the page links out to the live Results Gallery
// (/photography-gallery) instead, which is already wired to real data.

export const eventMeta = {
  title: "SNPC 2026 Grand Finale",
  fullName: "Swadhyay National Photography Competition 2026 — Grand Finale Ceremony",
  memorialName: "Santosh Kumar Goel Memorial Grand Finale",
  theme: "Capturing Nature, Inspiring Change",
  date: "Sunday, 30th August 2026",
  time: "10:30 AM – 01:30 PM",
  venue: "Lakshmibai College, University of Delhi",
  venueSub: "Ashok Vihar, Delhi",
  organizer: "Swadhyay Seva Foundation",
  collaboration: "Centre for Promotion of Environmental Conservation, Public Health and Hygiene, Lakshmibai College",
  associateSponsor: "Hayonergy",
  heroImage: "CLOUDINARY_URL",
  aboutImage: "CLOUDINARY_URL",
};

export const chiefGuest = {
  name: "Mr. Bharat Arora",
  designation: "President, Action Committee of Unaided Private Schools",
  photo: "https://res.cloudinary.com/demp2xljz/image/upload/v1788421299/0798a38c-71ea-45eb-86b0-7181cdb0ea0c.png",
};

export const guestsOfHonour = [
  {
    name: "Prof. (Dr.) Saahil Arora",
    credentials: "MPharm, PhD",
    designation: "Dean & Professor, School of Medical & Allied Sciences, G D Goenka University",
    subDesignation: "Former Director, Chandigarh University, Mohali, Punjab",
    bio: "30 years in pharmaceutical research, credited with 70+ research papers, 4 book chapters and 2 patents, and five novel products spanning oral and transparent gels for pain and fungal infections.",
    photo: "https://res.cloudinary.com/demp2xljz/image/upload/v1788421446/4ddf756f-3db5-4637-8683-60242302254e.png",
  },
  {
    name: "Dr. Preeti Chitkara",
    designation: "Dean of Public Relations & International Relations (PR&IR), KIET Deemed to be University, Delhi-NCR",
    subDesignation: "TEDx Speaker · Author · Leadership Communication Expert",
    bio: "Recipient of 20+ prestigious awards including the Global Teacher's Award, Gurupnishad Samman, Shikha Gaurav Award and the International Women's Achiever's Award.",
    photo: "https://res.cloudinary.com/demp2xljz/image/upload/v1788421376/00bc9a63-90a6-499a-a04e-05e2687eaee3.png",
  },
  {
    name: "Dr. Anand Singh",
    designation: "Professor, Fruit Science, College of Horticulture, BUAT, Banda",
    subDesignation: "Former Head & Senior Scientist, KVK Sitapur & KVK Sitamarhi",
    bio: "Recognised for contributions to fruit germplasm conservation and horticultural research, with 30+ research papers, 72 popular articles, 4 books and 12 book chapters to his name.",
    photo: "https://res.cloudinary.com/demp2xljz/image/upload/v1788421515/e4b58901-0373-46ab-a5c3-07bbe2135c31.png",
  },
  {
    name: "Prof. Soora Naresh Kumar",
    designation: "Head & Principal Scientist, Division of Environmental Sciences, ICAR-IARI, New Delhi",
    subDesignation: "Lead Author, IPCC AR7 Working Group II",
    bio: "Over 30 years of research experience; expert team member of the WMO Task Team on Climate and Agricultural Modelling, and part of the Task Force under the National Mission for Sustaining Himalayan Ecosystems.",
    photo: "https://res.cloudinary.com/demp2xljz/image/upload/v1788421462/f910b9d6-4f45-4d80-835e-866163284f6a.png",
  },
];

export const jury = [
  {
    name: "Prof. Bhupesh C. Little",
    designation: "Internationally acclaimed fine art photographer",
    bio: "A professional career spanning over three decades in fine art photography.",
    photo: "https://res.cloudinary.com/demp2xljz/image/upload/v1788421654/c3a7f4f6-e1f8-4007-8528-13088b913c69.png",
  },  
  {
    name: "Anup Sah",
    designation: "Padma Shri Awardee Photographer",
    bio: "Recipient of numerous national and international photography awards.",
    photo: "https://res.cloudinary.com/demp2xljz/image/upload/v1788421600/01ca541b-3651-40ae-966d-c28d21585c27.png",
  },
  {
    name: "Parveen Gahlot",
    designation: "Photography Mentor",
    bio: "More than a decade of experience across Wildlife, Macro, Travel and Aviation photography.",
    photo: "https://res.cloudinary.com/demp2xljz/image/upload/v1788421622/d1e62a30-9741-430c-8229-5ef839fdb454.png",
  },
  {
    name: "T. Narayan",
    designation: "Renowned photojournalist",
    bio: "Over three decades covering politics, wildlife, arts, lifestyle and sports.",
    photo: "https://res.cloudinary.com/demp2xljz/image/upload/v1788421665/27ab2329-94f5-4a6f-a421-e1e32f96bdc8.png",
  },
  {
    name: "Dr. Tulika Sahu",
    designation: "First woman in India with a PhD in Photography",
    bio: "National record holder, certified by the Limca Book of Records (2015).",
    photo: "https://res.cloudinary.com/demp2xljz/image/upload/v1788421627/e686f001-0382-4c5a-bfea-b42048b78661.png",
  },
];

export const patrons = [
  { name: "Dr. Madhu Ved", role: "Patron, Swadhyay Seva Foundation" },
  { name: "Dipankar Saha", role: "Patron, Swadhyay Seva Foundation" },
];

// The full flow-of-programme, adapted for a public-facing audience
// (internal logistics notes — who escorts guests, mic handling, etc. —
// have been left out).
export const schedule = [
  { time: "10:30 AM", activity: "Guest Arrival, Reception & Tilak Ceremony" },
  { time: "10:45 AM", activity: "Opening Ceremony — Welcome Address & Introduction to SNPC 2026–27 and the Santosh Kumar Goel Memorial" },
  { time: "10:55 AM", activity: "Diya Lighting Ceremony & Saraswati Vandana" },
  { time: "11:00 AM", activity: "Environment-themed Play by Manvi Public School" },
  { time: "11:15 AM", activity: "Felicitation of the Chief Guest, Guests of Honour, Jury and Patrons with Tulsi Pots & Mementoes" },
  { time: "11:40 AM", activity: "Showcase of the Top Photographs from SNPC 2026" },
  { time: "11:45 AM", activity: "Announcement of Grand Finale Winners & Prize Distribution (3 Winners, 5 Consolation Prizes)" },
  { time: "12:05 PM", activity: "Dance Performance by Dr. Rakesh Gulati & Happiness Gulati" },
  { time: "12:15 PM", activity: "In Loving Memory — A Tribute Reel for Santosh Kumar Goel" },
  { time: "12:25 PM", activity: "Organizational Video & Glimpse of SNPC 2026–27" },
  { time: "12:35 PM", activity: "Special Awards to Special People, presented by Mrs. Sudha Goel" },
  { time: "12:45 PM", activity: "Words from the Chief Guest and Guests of Honour" },
  { time: "01:15 PM", activity: "Vote of Thanks" },
  { time: "01:20 PM", activity: "Lunch & Networking" },
];

export const galleryTabs = [
  {
    label: "Opening & Felicitation",
    photos: [
      { src: "CLOUDINARY_URL", caption: "Tilak ceremony welcoming the guests" },
      { src: "CLOUDINARY_URL", caption: "Diya lighting ceremony" },
      { src: "CLOUDINARY_URL", caption: "Felicitation with Tulsi pots and mementoes" },
    ],
  },
  {
    label: "Chief Guest & Guests of Honour",
    photos: [
      { src: "CLOUDINARY_URL", caption: "Mr. Bharat Arora addressing the gathering" },
      { src: "CLOUDINARY_URL", caption: "Guests of Honour on stage" },
      { src: "CLOUDINARY_URL", caption: "Founders in conversation with guests" },
    ],
  },
  {
    label: "Jury & Showcase",
    photos: [
      { src: "CLOUDINARY_URL", caption: "The jury panel of SNPC 2026" },
      { src: "CLOUDINARY_URL", caption: "Showcase of the top photographs" },
    ],
  },
  {
    label: "Cultural Performances",
    photos: [
      { src: "CLOUDINARY_URL", caption: "Environment-themed play by Manvi Public School" },
      { src: "CLOUDINARY_URL", caption: "Dance performance by Dr. Rakesh Gulati & Happiness Gulati" },
    ],
  },
  {
    label: "Prize Distribution",
    photos: [
      { src: "CLOUDINARY_URL", caption: "Winner announcement moment" },
      { src: "CLOUDINARY_URL", caption: "Consolation prize distribution" },
      { src: "CLOUDINARY_URL", caption: "Jury presenting the awards" },
    ],
  },
  {
    label: "In Loving Memory",
    photos: [
      { src: "CLOUDINARY_URL", caption: "Tribute reel for Santosh Kumar Goel" },
    ],
  },
  {
    label: "Audience & Networking",
    photos: [
      { src: "CLOUDINARY_URL", caption: "Guests networking over lunch" },
      { src: "CLOUDINARY_URL", caption: "Audience at the venue" },
      { src: "CLOUDINARY_URL", caption: "Group photo of the day" },
    ],
  },
];

export const closingImage = "CLOUDINARY_URL";
export const memorialImage = "CLOUDINARY_URL";
export const youtubeVideoId = "YOUR_YOUTUBE_VIDEO_ID";