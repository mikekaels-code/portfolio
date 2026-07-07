export type Slide = {
  text: string;
  logos?: boolean;
};

export const story: Slide[] = [
  { text: "Mike Sihombing is a software developer." },
  {
    text: "Based in Indonesia, he designs and builds iOS applications used by millions of people.",
  },
  {
    text: "As Principal iOS Developer at Bank Rakyat Indonesia, he leads decisions on app architecture and technology for core banking systems.",
  },
  {
    text: "Over the years, he has shaped web and mobile products across banking, commerce, and digital identity — and many freelance projects.",
    logos: true,
  },
  {
    text: "He drove architectural improvements, established reusable core components, enhanced performance and security standards, and mentored engineering teams in building scalable and resilient products.",
  },
  {
    text: "He is a graduate of the Apple Developer Academy, and holds a degree in Information Technology with a concentration in Multimedia Engineering.",
  },
  { text: "He lives and works in Indonesia." },
];

export type Partner = { name: string; src: string; scale?: number };

// `scale` optically balances compact/square marks against wide wordmarks
export const partnerRows: Partner[][] = [
  [
    { name: "Tokopedia", src: "/logos/tokopedia.png" },
    { name: "Maybank", src: "/logos/maybank.png" },
    { name: "Cloud Ace", src: "/logos/cloud-ace.png", scale: 2.2 },
    { name: "KOCO", src: "/logos/koco.png", scale: 2.2 },
  ],
  [
    { name: "Privy", src: "/logos/privy.png" },
    { name: "Bank Rakyat Indonesia", src: "/logos/bri.png", scale: 1.4 },
    { name: "Pertamina", src: "/logos/pertamina.png" },
  ],
];

export const contact = {
  email: "mike.sihombing.prof@gmail.com",
  linkedin: "https://www.linkedin.com/in/mike-sihombing/",
  github: "https://github.com/mikekaels",
  medium: "https://medium.com/@mike.sihombing.prof",
};
