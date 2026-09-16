const CLOUD_BASE = "https://res.cloudinary.com/demp2xljz/image/upload";

// Build a delivery URL for an event photo with sensible default
// transformations (auto-format, auto-quality) applied.
const cld = (path, transform = "q_auto,f_auto") => `${CLOUD_BASE}/${transform}/${path}`;

// Large "hero" style crop — used for full-width banner/section images.
const cldHero = (path) => cld(path, "w_1920,q_auto,f_auto");

// Gallery-thumbnail crop — matches the ~3:2 aspect ratio of the source
// files (6720x4480) so nothing gets awkwardly cropped.
const cldThumb = (path) => cld(path, "w_900,h_600,c_fill,g_auto,q_auto,f_auto");

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
  heroImage: cldHero("v1789465373/0K4A0274_afxg17.jpg"),
  aboutImage: cldThumb("v1789465468/0K4A0432_tbhwuy.jpg"),
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
    label: "Opening & Welcome Ceremony",
    photos: [
      { src: cldThumb("v1789465451/0K4A0378_ekd3g4.jpg"), caption: "Guests arriving at Lakshmibai College" },
      { src: cldThumb("v1789465373/0K4A0298_btehr4.jpg"), caption: "Reception ahead of the Tilak ceremony" },
      { src: cldThumb("v1789465376/0K4A0329_s4wqkr.jpg"), caption: "Tilak ceremony welcoming the guests" },
      { src: cldThumb("v1789465384/0K4A0317_lcgkjz.jpg"), caption: "Welcome address begins" },
      { src: cldThumb("v1789465453/0K4A0398_ihp2wy.jpg"), caption: "Introducing SNPC 2026–27" },
      { src: cldThumb("v1789465454/0K4A0403_kyqfie.jpg"), caption: "The Founder introduces the Santosh Kumar Goel Memorial is introduced" },
      { src: cldThumb("v1789465456/0K4A0414_q22spn.jpg"), caption: "Diya lighting ceremony" },
      { src: cldThumb("v1789465462/0K4A0418_hd8nom.jpg"), caption: "Saraswati Vandana" },
      { src: cldThumb("v1789465468/0K4A0436_rrx363.jpg"), caption: "Group Photograph" },
    ],
  },
  {
    label: "Guests & Jury Felicitation",
    photos: [
      { src: cldThumb("v1789567671/0K4A0443_maqt6g.jpg"), caption: "Chief Guest, Sh. Bharat Arora, felicitated by the President and VP" },
      { src: cldThumb("v1789465472/0K4A0457_sxhyb1.jpg"), caption: "Guests of Honour, Dr. Preeti Chitkara, honoured with memento." },
      { src: cldThumb("v1789567867/0K4A0450_wolbwm.jpg"), caption: "Guests of Honour, Dr. Saahil Arora, honoured with Tulsi pot." },
      { src: cldThumb("v1789562859/0K4A0470_zmmnd7.jpg"), caption: "Sh. Anup Sah honoured by Guests and VP" },
      { src: cldThumb("v1789465476/0K4A0484_v8xrza.jpg"), caption: "Dr. Bhupesh C. Little honoured by Guests and VP" },
      { src: cldThumb("v1789562858/0K4A0475_lw2a4e.jpg"), caption: "Sh. Parveen Gahlot honoured by Guests and VP" },
      { src: cldThumb("v1789465476/0K4A0494_wyzfkt.jpg"), caption: "Foundation's Patrons are felicitated" },
    ],
  },
  {
    label: "Environment Play",
    photos: [
      { src: cldThumb("v1789465477/0K4A0502_om9pp4.jpg"), caption: "Manvi Public School's environment-themed play" },
      { src: cldThumb("v1789563380/0K4A0503_wtzcj6.jpg"), caption: "Students performing on stage" },
      { src: cldThumb("v1789465479/0K4A0508_y17pzd.jpg"), caption: "A scene from the play" },
    ],
  },
  {
    label: "Winners & Prize Distribution",
    photos: [
      { src: cldThumb("v1789465483/0K4A0520_vxqbej.jpg"), caption: "The jury panel of SNPC 2026" },
      { src: cldThumb("v1789465480/0K4A0517_akzwa8.jpg"), caption: "A winner receiving their prize" },
      { src: cldThumb("v1789465479/0K4A0515_p2vbwp.jpg"), caption: "Runner-up prize distribution" },
    ],
  },
  {
    label: "Dance Performance",
    photos: [
      { src: cldThumb("v1789465487/0K4A0538_fmoyz4.jpg"), caption: "Dr. Rakesh Gulati perform" },
      { src: cldThumb("v1789465487/0K4A0541_thnoy8.jpg"), caption: "A lively moment from the dance" },
      { src: cldThumb("v1789465490/0K4A0544_kql95s.jpg"), caption: "Performers take a bow" },
    ],
  },
  {
    label: "Words by Jury Panel",
    photos: [
      { src: cldThumb("v1789465484/0K4A0524_mtwimn.jpg"), caption: "Sh. Anup Sah discusses about the competition" },
      { src: cldThumb("v1789465487/0K4A0531_q2y0cj.jpg"), caption: "Dr. Bhupesh C. Little addresses the audience" },
      { src: cldThumb("v1789565187/0K4A0534_r13ebr.jpg"), caption: "Sh. Parveen Gahlot tells the audience about SNPC 2026" },
    ],
  },
  {
    label: "Special Honours",
    photos: [
      { src: cldThumb("v1789465496/0K4A0591_qsvtft.jpg"), caption: "Mrs. Sudha Goel is honoured" },
      { src: cldThumb("v1789465498/0K4A0602_xs7gnr.jpg"), caption: "Mrs. Sudha Goel presenting the Special Award to Mr. Vinay Das" },
      { src: cldThumb("v1789465498/0K4A0610_ofzz5e.jpg"), caption: "Mrs. Sudha Goel presenting the Special Award to Mr. Jalaj Nagar" },
      { src: cldThumb("v1789465499/0K4A0616_p6fcz1.jpg"), caption: "Mementoes presented to the IT Team" },
      { src: cldThumb("v1789465501/0K4A0619_uwyj3h.jpg"), caption: "Mementoes presented to the IT Team" },
      { src: cldThumb("v1789465500/0K4A0613_i32edo.jpg"), caption: "Mementoes presented to the IT Team" },
    ],
  },  
  {
    label: "Closing Words & Lunch",
    photos: [
      { src: cldThumb("v1789465500/0K4A0623_vdsgx0.jpg"), caption: "Sh. Bharat Arora addressing the gathering" },
      { src: cldThumb("v1789465501/0K4A0631_awzdxb.jpg"), caption: "Words from Dr. Saahil Arora" },
      { src: cldThumb("v1789465489/0K4A0557_asy2a3.jpg"), caption: "Dr. Preeti Chitkara taking the stage" },
      { src: cldThumb("v1789465511/0K4A0651_dtdyxm.jpg"), caption: "Vote of Thanks by VP Dr. Rajesh Agarwal" },
      { src: cldThumb("v1789465512/0K4A0657_nillxq.jpg"), caption: "Closing of the Event" },
      { src: cldThumb("v1789465524/0K4A0723_j9f3ai.jpg"), caption: "Guests heading in for lunch" },
      { src: cldThumb("v1789465520/0K4A0714_valals.jpg"), caption: "Networking over lunch" },
      { src: cldThumb("v1789465519/0K4A0679_vc8isy.jpg"), caption: "Group photo of the day" },
    ],
  }
];

export const closingImage = cldHero("v1789567405/0K4A0426_wdwy8e.jpg");
export const memorialImage = "CLOUDINARY_URL";
export const youtubeVideoId = "YOUR_YOUTUBE_VIDEO_ID";