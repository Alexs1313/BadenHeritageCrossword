export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export type CrosswordItem = {
  clue: string;
  answer: string;
  fact: string;
  image?: any;
};

export type CrosswordTopic = {
  id: string;
  title: string;
  cover: any;
  levels: Record<Difficulty, CrosswordItem[]>;
};

export const BADEN_CROSSWORDS: CrosswordTopic[] = [
  {
    id: 'thermal',
    title: 'Thermal Culture',
    cover: require('../HeritageAssts/imgs/thermal.png'),
    levels: {
      easy: [
        {
          clue: 'Warm water place for relaxation',
          answer: 'BATH',
          fact: 'Baden-Baden’s bathing tradition goes back to Roman times, when thermal bathing was part of daily life and recovery.',
        },
        {
          clue: 'A spa-style thermal complex',
          answer: 'THERME',
          fact: '“Therme” is widely used in German-speaking regions for thermal bath complexes, strongly associated with Baden-Baden.',
        },
      ],
      medium: [
        {
          clue: 'Natural source of hot water',
          answer: 'SPRING',
          fact: 'Thermal springs are the foundation of Baden-Baden’s identity as a historic resort destination.',
        },
        {
          clue: 'Hot mist rising from water',
          answer: 'STEAM',
          fact: 'Warm mineral water creates steam in cooler air—an iconic atmospheric image for thermal places.',
        },
      ],
      hard: [
        {
          clue: 'Ancient builders of early baths',
          answer: 'ROMANS',
          fact: 'Romans engineered bathhouses across Europe, including the region around Baden, valuing both hygiene and social ritual.',
        },
        {
          clue: 'A place focused on recovery',
          answer: 'HEALER',
          fact: 'Spa towns were historically linked to health routines: calm schedules, walking, water treatments, and rest.',
        },
      ],
      extreme: [
        {
          clue: 'Latin word for “waters”',
          answer: 'AQUAE',
          fact: 'Many Roman spa towns used “Aquae” in names, marking places known for therapeutic waters.',
        },
        {
          clue: 'Latin term for baths',
          answer: 'BALNEA',
          fact: '“Balnea” referred to bath facilities in Roman culture—one of the earliest organized wellness traditions.',
        },
      ],
    },
  },

  {
    id: 'arts',
    title: 'Classical Arts',
    cover: require('../HeritageAssts/imgs/ClassicalArts.png'),
    levels: {
      easy: [
        {
          clue: 'Stage performance with singing',
          answer: 'OPERA',
          fact: 'Cultural resorts like Baden-Baden built reputations not only on water, but on concerts, theatre, and seasonal events.',
        },
        {
          clue: 'Organized sound art',
          answer: 'MUSIC',
          fact: 'Music culture in spa towns supported a refined leisure image—quiet prestige rather than loud spectacle.',
        },
      ],
      medium: [
        {
          clue: 'Classical dance form',
          answer: 'BALLET',
          fact: 'Ballet and classical performances often traveled through European resort circuits, especially in the 19th century.',
        },
        {
          clue: 'Place where art is displayed',
          answer: 'MUSEUM',
          fact: 'Cultural identity in Baden-Baden is strongly tied to curated arts and heritage institutions.',
        },
      ],
      hard: [
        {
          clue: 'A classical piece for piano/ensemble',
          answer: 'SONATA',
          fact: 'Sonata forms are linked to European classical tradition—exactly the mood this app is referencing visually.',
        },
        {
          clue: 'Painting surface',
          answer: 'CANVAS',
          fact: 'Visual arts complement spa culture: landscapes, portraits, and architecture studies helped define heritage aesthetics.',
        },
      ],
      extreme: [
        {
          clue: 'Wall painting technique',
          answer: 'FRESCO',
          fact: 'Fresco is a historic European technique often seen in heritage interiors and classical architecture.',
        },
        {
          clue: 'Poetic line in a song',
          answer: 'LYRIC',
          fact: 'Lyric tradition sits at the intersection of literature and music—core classical arts territory.',
        },
      ],
    },
  },

  {
    id: 'arch',
    title: 'Architecture',
    cover: require('../HeritageAssts/imgs/Architecture.png'),
    levels: {
      easy: [
        {
          clue: 'Rounded roof structure',
          answer: 'DOME',
          fact: 'Domes are a signature element of European civic architecture, often used to signal importance and grandeur.',
        },
        {
          clue: 'Curved support in buildings',
          answer: 'ARCH',
          fact: 'Arches are both structural and symbolic—linked to heritage, longevity, and classical design.',
        },
      ],
      medium: [
        {
          clue: 'Steps between floors',
          answer: 'STAIR',
          fact: 'Grand staircases were part of social architecture, designed for elegant movement and encounters.',
        },
        {
          clue: 'Front exterior of a building',
          answer: 'FACADE',
          fact: 'Baden-Baden’s historic buildings emphasize symmetry and facade detail to create a refined city image.',
        },
      ],
      hard: [
        {
          clue: 'Arched ceiling structure',
          answer: 'VAULT',
          fact: 'Vaults are common in classical and historic buildings—another heritage cue that reads premium.',
        },
        {
          clue: 'Medieval European style',
          answer: 'GOTHIC',
          fact: 'Gothic influences appear across Europe and are often associated with history, craft, and timelessness.',
        },
      ],
      extreme: [
        {
          clue: 'Round opening in a dome',
          answer: 'OCULUS',
          fact: 'The oculus is a classic architectural feature used to bring controlled light into grand interiors.',
        },
        {
          clue: 'Decorative entrance gateway',
          answer: 'PORTAL',
          fact: 'Portals were designed as threshold moments, signaling status and tradition.',
        },
      ],
    },
  },

  {
    id: 'society',
    title: 'Society',
    cover: require('../HeritageAssts/imgs/Society.png'),
    levels: {
      easy: [
        {
          clue: 'High-status social group',
          answer: 'ELITE',
          fact: 'Baden-Baden historically attracted elites seeking health routines and refined social life.',
        },
        {
          clue: 'Visitor staying at an event/place',
          answer: 'GUEST',
          fact: 'Guest culture is central to resort towns: etiquette, calm service, and social rhythm.',
        },
      ],
      medium: [
        {
          clue: 'Formal social gathering room',
          answer: 'SALON',
          fact: 'Salons were spaces for conversation, music, and ideas—perfect match for the app’s quiet tone.',
        },
        {
          clue: 'Formal clothing code',
          answer: 'DRESS',
          fact: 'Resort society relied on dress etiquette to signal respect, status, and occasion.',
        },
      ],
      hard: [
        {
          clue: 'Supporter of arts and culture',
          answer: 'PATRON',
          fact: 'Patrons shaped cultural towns by funding venues, artists, and seasonal programs.',
        },
        {
          clue: 'Structured discussion',
          answer: 'DEBATE',
          fact: 'Spa environments often encouraged intellectual exchange—calm settings where ideas traveled fast.',
        },
      ],
      extreme: [
        {
          clue: 'Agreement between sides',
          answer: 'TREATY',
          fact: 'European resort towns sometimes hosted quiet meetings where negotiations happened away from formal centers.',
        },
        {
          clue: 'Close social group',
          answer: 'CIRCLE',
          fact: 'Circles mattered: reputation and trust networks were key in historical high society.',
        },
      ],
    },
  },

  {
    id: 'symbols',
    title: 'Symbols',
    cover: require('../HeritageAssts/imgs/Symbols.png'),
    levels: {
      easy: [
        {
          clue: 'Luxury metal color',
          answer: 'GOLD',
          fact: 'Gold is used in heritage design as a signal of value—especially effective paired with graphite.',
        },
        {
          clue: 'Deep black gemstone name',
          answer: 'ONYX',
          fact: 'Onyx is a classic luxury reference, often used to communicate calm prestige.',
        },
      ],
      medium: [
        {
          clue: 'Emblem used by families/cities',
          answer: 'CREST',
          fact: 'Crests connect directly to European identity—cities, houses, and heritage institutions.',
        },
        {
          clue: 'Official mark/stamp',
          answer: 'SEAL',
          fact: 'Seals represent authenticity and tradition—good thematic fit for a heritage crossword.',
        },
      ],
      hard: [
        {
          clue: 'Hidden code in letters',
          answer: 'CIPHER',
          fact: 'Ciphers tie to history, diplomacy, and intellectual challenge—works well for harder crosswords.',
        },
        {
          clue: 'Repeated decorative theme',
          answer: 'MOTIF',
          fact: 'Motifs are visual signatures across art and architecture—exactly what heritage design relies on.',
        },
      ],
      extreme: [
        {
          clue: 'Messenger of coats of arms',
          answer: 'HERALD',
          fact: 'Heralds and heraldry created systems of symbols that still influence European premium aesthetics.',
        },
        {
          clue: 'Symbolic mark that represents an idea',
          answer: 'EMBLEM',
          fact: 'Emblems are compact meanings—small forms that carry identity, tradition, and status.',
        },
      ],
    },
  },
];
