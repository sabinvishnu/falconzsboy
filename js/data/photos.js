/* ==========================================================================
   FALCON // ATELIER - PHOTOGRAPHY DATASET & EXIF SPECS
   ========================================================================== */

const PHOTOS_DATA = [
  {
    id: "photo-01",
    title: "Neon Rain Reflection",
    category: "street",
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1600&auto=format&fit=crop",
    location: "Shinjuku, Tokyo, Japan",
    year: "2025",
    camera: "Hasselblad X2D 100C",
    lens: "XCD 50mm f/2.5 V",
    focalLength: "50mm",
    aperture: "f/1.4",
    shutterSpeed: "1/250s",
    iso: "800",
    colorPalette: ["#141b2b", "#d81b60", "#00f0ff", "#3949ab", "#f50057"],
    description: "Captured during a sudden typhoon downpour in Kabukicho. The wet asphalt acts as a giant mirror reflecting glowing neon signages in vibrant magenta and cyan tones.",
    rawUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1600&auto=format&fit=crop&sat=-70&con=-30",
    featured: true,
    tags: ["Tokyo", "Rain", "Neon", "Cyberpunk", "Medium Format"]
  },
  {
    id: "photo-02",
    title: "Glacial Silent Awakening",
    category: "nature",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop",
    location: "Jökulsárlón Lagoon, Iceland",
    year: "2024",
    camera: "Sony A1",
    lens: "FE 16-35mm f/2.8 GM II",
    focalLength: "21mm",
    aperture: "f/8.0",
    shutterSpeed: "1.5s",
    iso: "100",
    colorPalette: ["#1c2d37", "#4f7b99", "#a8c5d8", "#e3edf2", "#2c4150"],
    description: "First morning light illuminating ancient icebergs drifting from the Vatnajökull glacier towards the black sand ocean beach. Long exposure softens the tide.",
    rawUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop&sat=-60",
    featured: true,
    tags: ["Iceland", "Glacier", "Landscape", "Dawn", "Sony A1"]
  },
  {
    id: "photo-03",
    title: "The Editorial Muse",
    category: "portrait",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop",
    location: "Paris Fashion Week Studio, France",
    year: "2025",
    camera: "Leica M11",
    lens: "Noctilux-M 50mm f/0.95 ASPH",
    focalLength: "50mm",
    aperture: "f/0.95",
    shutterSpeed: "1/1000s",
    iso: "64",
    colorPalette: ["#2d1b15", "#8c5643", "#d6a99a", "#f7e5df", "#4a2d24"],
    description: "High-contrast editorial portrait utilizing soft north-window studio daylight. Razor-thin depth of field isolates the subject's gaze.",
    rawUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop&sat=-50",
    featured: true,
    tags: ["Portrait", "Leica", "Paris", "Editorial", "Studio"]
  },
  {
    id: "photo-04",
    title: "Monolithic Geometry",
    category: "architecture",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop",
    location: "Valencia, Spain",
    year: "2024",
    camera: "Hasselblad X2D 100C",
    lens: "XCD 28mm f/4 P",
    focalLength: "28mm",
    aperture: "f/11",
    shutterSpeed: "1/500s",
    iso: "100",
    colorPalette: ["#0d131a", "#1b2838", "#537791", "#cbe3f0", "#94b5cb"],
    description: "Minimalist architectural study highlighting smooth curves and stark white concrete shadows against the crisp Mediterranean sky.",
    rawUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop&sat=-60",
    featured: false,
    tags: ["Architecture", "Minimalism", "Spain", "Medium Format"]
  },
  {
    id: "photo-05",
    title: "Milky Way over Desert Arch",
    category: "astro",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop",
    location: "Moab Desert, Utah, USA",
    year: "2025",
    camera: "Sony A1",
    lens: "FE 24mm f/1.4 GM",
    focalLength: "24mm",
    aperture: "f/1.4",
    shutterSpeed: "15s",
    iso: "3200",
    colorPalette: ["#070a14", "#1a1c36", "#3f3357", "#845e84", "#c492b1"],
    description: "Tracked panoramic stitch showing the galactic core aligned precisely behind sandstone canyon arches under zero light pollution conditions.",
    rawUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop&sat=-40",
    featured: true,
    tags: ["Astrophotography", "Milky Way", "Utah", "Night Sky", "Sony"]
  },
  {
    id: "photo-06",
    title: "Sahara Golden Hour Waves",
    category: "nature",
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1600&auto=format&fit=crop",
    location: "Erg Chebbi Dunes, Morocco",
    year: "2024",
    camera: "Leica M11",
    lens: "Summicron-M 35mm f/2 ASPH",
    focalLength: "35mm",
    aperture: "f/5.6",
    shutterSpeed: "1/800s",
    iso: "100",
    colorPalette: ["#3b1e08", "#854919", "#d47a2a", "#f0ab56", "#fce1b8"],
    description: "Low angle light casting dramatic long shadows across pristine wind-sculpted sand dunes just minutes before sunset.",
    rawUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1600&auto=format&fit=crop&sat=-50",
    featured: false,
    tags: ["Morocco", "Sahara", "Dunes", "Golden Hour", "Leica"]
  },
  {
    id: "photo-07",
    title: "Midnight Taxi in Soho",
    category: "street",
    url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1600&auto=format&fit=crop",
    location: "London, United Kingdom",
    year: "2025",
    camera: "Leica M6 (35mm Film)",
    lens: "Summilux 35mm f/1.4",
    focalLength: "35mm",
    aperture: "f/2.0",
    shutterSpeed: "1/60s",
    iso: "400 (Kodak Tri-X)",
    colorPalette: ["#121212", "#383838", "#787878", "#d0d0d0", "#ffffff"],
    description: "Candid street capture on black & white 35mm film pushed two stops. Moody London fog blending into iconic red cab headlights.",
    rawUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1600&auto=format&fit=crop",
    featured: false,
    tags: ["London", "Film", "Street", "B&W", "Leica M6"]
  },
  {
    id: "photo-08",
    title: "The Solitary Monk",
    category: "portrait",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop",
    location: "Kyoto, Japan",
    year: "2024",
    camera: "Hasselblad X2D 100C",
    lens: "XCD 90mm f/2.5 V",
    focalLength: "90mm",
    aperture: "f/2.8",
    shutterSpeed: "1/320s",
    iso: "200",
    colorPalette: ["#1a2419", "#3b4f38", "#7a9475", "#c2d1be", "#473b2e"],
    description: "Environmental portrait of a Zen monk sweeping autumn maple leaves at dawn outside Tofuku-ji temple.",
    rawUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop&sat=-60",
    featured: false,
    tags: ["Kyoto", "Japan", "Portrait", "Zen", "Medium Format"]
  },
  {
    id: "photo-09",
    title: "Skyscraper Silhouette Matrix",
    category: "architecture",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    location: "Financial District, New York, USA",
    year: "2025",
    camera: "Sony A1",
    lens: "FE 12-24mm f/2.8 GM",
    focalLength: "14mm",
    aperture: "f/8.0",
    shutterSpeed: "1/400s",
    iso: "100",
    colorPalette: ["#0b1520", "#182c3f", "#325373", "#749bbd", "#bdcee0"],
    description: "Worm's eye perspective looking straight up into the towering glass canyon of Manhattan midtown scrapers reflecting dramatic cloud layers.",
    rawUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop&sat=-50",
    featured: false,
    tags: ["NYC", "Architecture", "Skyscraper", "Sony A1"]
  },
  {
    id: "photo-10",
    title: "Patagonia Alpine Peaks",
    category: "nature",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop",
    location: "Torres del Paine, Chile",
    year: "2025",
    camera: "Hasselblad X2D 100C",
    lens: "XCD 38mm f/2.5 V",
    focalLength: "38mm",
    aperture: "f/8.0",
    shutterSpeed: "1/500s",
    iso: "100",
    colorPalette: ["#162536", "#2f4d66", "#618199", "#9bb3c7", "#dce6ed"],
    description: "Snow-capped jagged granite needles rising above turquoise glacier lakes in Patagonia. High dynamic range capture retaining deep shadow crevices.",
    rawUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop&sat=-70&con=-30",
    featured: true,
    tags: ["Mountains", "Patagonia", "Alpine", "Chile", "Landscape"]
  }
];

const STORIES_DATA = [
  {
    id: "story-01",
    title: "Neon Rain in Shinjuku",
    subtitle: "A 3-AM walk through Tokyo's wet alleyways",
    date: "October 2025",
    location: "Tokyo, Japan",
    coverImg: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200&auto=format&fit=crop",
    excerpt: "When the typhoon hits Tokyo, the city transforms into a liquid mirror of glowing signs, steam vents, and solitary umbrella shadows.",
    content: `
      <p>There is a specific silence that only exists in Shinjuku after 2 AM during a heavy downpour. The thrum of bullet trains stops, the commercial crowds fade into subterranean izakayas, and all that remains is the rhythm of raindrops striking plastic umbrellas.</p>
      <p>Equipped with a sealed Hasselblad medium format camera and a single 50mm lens, I walked through Omoide Yokocho and Kabukicho. The dynamic range of modern sensors allowed me to preserve both the intense luminance of LED neon signs and the deep shadow detail of damp timber alleyways.</p>
      <blockquote>"Photography is not about seeing the light, but feeling the emotion it casts upon the pavement."</blockquote>
      <p>This photo essay documents 4 hours of solitary exploration between midnight and sunrise in East Tokyo.</p>
    `
  },
  {
    id: "story-02",
    title: "Nordic Silence: The Icelandic Fjords",
    subtitle: "Chasing sub-zero dawn light in winter conditions",
    date: "February 2024",
    location: "Vik & Vatnajökull, Iceland",
    coverImg: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
    excerpt: "Winter in southern Iceland offers only 4 hours of twilight daylight per day. Every frame requires planning against freeze-thaw winds.",
    content: `
      <p>Working in -15°C temperatures tests both human endurance and lithium-ion batteries. In the Icelandic winter, the sun never reaches zenith; instead, it skims the horizon in a perpetual 4-hour golden hour.</p>
      <p>Standing on the black basalt pebbles of Diamond Beach while 2000-year-old glacier chunks washed ashore in turquoise foam felt like visiting another planet.</p>
    `
  },
  {
    id: "story-03",
    title: "The Sahara Horizon Essay",
    subtitle: "Documenting nomadic life across the Great Erg",
    date: "November 2024",
    location: "Merzouga, Morocco",
    coverImg: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop",
    excerpt: "Navigating shifting dunes with mechanical film cameras where micro-sand grains challenge delicate lens helicoids.",
    content: `
      <p>The Sahara desert is a masterclass in light, texture, and silence. Digital cameras with motorized zooms are vulnerable to sand intrusion, so I relied exclusively on mechanical Leica M rangefinders wrapped in protective chamois cloth.</p>
    `
  }
];
