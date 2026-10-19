export const site = {
  name: "Studio Noir",
  city: "Delhi",
  email: "hello@studio-noir.example",
  tagline: "Night photographer in Delhi NCR. Fashion, music videos and the odd portrait, mostly after 9 pm.",
  intro: "I shoot at night because Delhi looks honest after ten. Labels and directors hire me when they want a frame that feels like the middle of a film, not the cover of a catalogue.",
  heroImage: "/images/main.jpg",
  // files live in public/video/. Set reel: null to fall back to the photo montage
  reel: { src: "/video/reel2.mp4", poster: "/video/reel-poster.jpg" },
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Vimeo", href: "https://vimeo.com/" },
    { label: "Are.na", href: "https://www.are.na/" },
  ],
  // fictional clients: swap for real ones only if this ever becomes a real site
  clients: ["Maison Atelier", "Northfold", "Kinoo Films", "Aster & Co", "Paper Lantern", "Slow Hours"],
  // fill these in with your own name and portfolio link
  credit: { name: "YOUR NAME", href: "https://your-portfolio.com" },
  disclaimer: "Concept project. Studio, clients and copy are fictional. All photos and video are my own.",
};

export const projects = [
  {
    id: "lookbooks", title: "Commercial lookbooks", kind: "Fashion and e-commerce", year: "2026",
    description: "Lookbooks for small labels who would rather show real people than perfect ones. One hard light, clothes that move, and no retouching that makes anyone look like a render.",
    camera: "Leica SL2, 50mm",
    note: "waited an hour for this light. worth it.",
    images: [
      "/images/1.jpeg",
      "/images/2.jpeg",
    ],
  },
  {
    id: "motion", title: "Film stills", kind: "Short films and music videos", year: "2025",
    description: "Stills I shoot on set between takes, lit by whatever the scene already has. Directors keep asking for them long after the edit is locked.",
    camera: "Sony A7 IV, 35mm",
    note: "one lamp, one take.",
    images: [
      "/images/3.jpeg",
      "/images/4.jpeg",
    ],
  },
  {
    id: "rig", title: "Behind the light", kind: "Rigs and set diagrams", year: "2026",
    description: "How a frame gets built: one strobe through a grid, no fill, blacks left alone. Kept here for the clients who always ask how.",
    camera: "Sony A7R V, ISO 200, f/1.4",
    note: "yes, that's the whole rig.",
    images: [
      "/images/5.jpeg",
    ],
  },
];

export const story = [
  { year: "2019", title: "First roll", text: "Borrowed a film camera and shot friends on rooftops around Delhi NCR after dark. Most of the roll was out of focus. A few frames weren't, and I kept going." },
  { year: "2021", title: "Finding the look", text: "Stopped chasing sunsets. One hard light, deep shadow, a long lens. A small label paid me for a lookbook, then another one did." },
  { year: "2026", title: "Today", text: "Mostly campaigns and music videos now, plus the occasional portrait I take because I want to. Still shooting after dark." },
];

export const services = [
  { title: "Campaigns and lookbooks", text: "One day or a week. I plan the light, work with your stylist and hand over graded files, not a folder of maybes." },
  { title: "Film and music video stills", text: "On set with the crew, shooting frames that match the grade, so the stills look like they came from the film." },
  { title: "Editorial portraits", text: "One light, one person, on location or in a small studio. Usually quick, usually quiet." },
];