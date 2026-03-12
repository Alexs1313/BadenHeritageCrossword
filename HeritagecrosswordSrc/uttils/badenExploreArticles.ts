export type ExploreArticle = {
  id: string;
  title: string;
  body: string;
  quizQuestion: string;
  quizAnswer: boolean;
  thumb?: any;
};

// Картинки статей: свои картинки для каждой статьи — положите в HeritageAssts/imgs/ файлы
// heritagecnartclic1.png … heritagecnartclic10.png или замените путь thumb на свой.
export const BADEN_EXPLORE_ARTICLES: ExploreArticle[] = [
  {
    id: '1',
    title: 'Thermal Culture of Baden-Baden',
    thumb: require('../HeritageAssts/imgs/heritagecnartclic1.png'),
    body: `Baden-Baden is one of Europe's most famous thermal spa cities. Its reputation is built on natural hot springs that have attracted visitors for thousands of years. The city's name itself reflects this identity—"Baden" means bathing.

The Romans were among the first to organize bathing culture in this region. They built thermal bathhouses around the hot springs and developed sophisticated bathing routines. These bath complexes combined relaxation, hygiene, and social life.

Today, Baden-Baden continues this tradition through famous thermal complexes such as Caracalla Spa and the historic Friedrichsbad. Visitors move between warm pools, steam rooms, and resting areas in carefully designed sequences. The experience follows a calm rhythm that echoes ancient Roman practices.

Thermal bathing remains one of the city's defining experiences. People visit not only for wellness but also for the peaceful atmosphere created by warm water, steam, and elegant architecture.`,
    quizQuestion:
      'The name "Baden-Baden" is connected to the city\'s long tradition of thermal bathing.',
    quizAnswer: true,
  },
  {
    id: '2',
    title: 'Baden-Baden and Classical Arts',
    thumb: require('../HeritageAssts/imgs/heritagecnartclic2.png'),
    body: `Baden-Baden has long been known as a cultural destination. During the 19th century the city attracted artists, composers, and writers from across Europe. Visitors came not only for the baths but also for concerts, theatre, and elegant social life.

One of the most famous cultural venues in the city today is the Festspielhaus Baden-Baden. It is one of the largest opera and concert houses in Europe. The venue hosts opera productions, orchestras, and international performances throughout the year.

Music has always played an important role in the city's identity. Classical concerts and seasonal cultural festivals helped Baden-Baden build a reputation as a refined European resort. This artistic tradition continues to shape the city's atmosphere.

The combination of wellness and culture made Baden-Baden unique among spa towns. Visitors could spend the day at thermal baths and the evening attending concerts or performances.`,
    quizQuestion:
      'The Festspielhaus Baden-Baden is one of the largest opera houses in Europe.',
    quizAnswer: true,
  },
  {
    id: '3',
    title: 'Architecture of Baden-Baden',
    thumb: require('../HeritageAssts/imgs/heritagecnartclic3.png'),
    body: `Architecture in Baden-Baden reflects centuries of European history. Elegant buildings, grand staircases, and classical facades define the city center. These structures were designed to create an atmosphere of refinement and prestige.

Many buildings in the city reflect classical and historic styles. Arches, domes, and decorative facades appear throughout the town's cultural landmarks. These architectural elements help preserve the heritage identity of Baden-Baden.

The Kurhaus is one of the most recognizable buildings in the city. Built in the 19th century, it was designed as a social and cultural center for visitors. Its architecture combines classical symmetry with decorative details that signal elegance and tradition.

Walking through Baden-Baden feels like moving through layers of history. From Roman ruins to grand 19th-century structures, architecture tells the story of the city's development as a European spa resort.`,
    quizQuestion:
      'The Kurhaus Baden-Baden was built as a social and cultural center for visitors to the spa town.',
    quizAnswer: true,
  },
  {
    id: '4',
    title: 'Society and Social Life in Baden-Baden',
    thumb: require('../HeritageAssts/imgs/heritagecnartclic4.png'),
    body: `During the 19th century Baden-Baden became a gathering place for European high society. Aristocrats, artists, diplomats, and wealthy travelers visited the city regularly. It was often called the "summer capital of Europe."

Visitors followed a social rhythm that balanced relaxation and cultural activity. Mornings were often spent walking in parks or visiting thermal baths. Evenings included concerts, conversations in salons, and formal gatherings.

The city's casinos, theatres, and gardens became meeting places for international guests. These venues created opportunities for conversation, networking, and cultural exchange. Social life in Baden-Baden combined elegance with intellectual curiosity.

This tradition of refined hospitality still shapes the city today. Guests come for the peaceful environment, cultural events, and the sense of timeless European charm.`,
    quizQuestion:
      'In the 19th century Baden-Baden was sometimes called the "summer capital of Europe."',
    quizAnswer: true,
  },
  {
    id: '5',
    title: 'Symbols and Identity of Baden-Baden',
    thumb: require('../HeritageAssts/imgs/heritagecnartclic5.png'),
    body: `Cities often express their identity through symbols and visual design. Baden-Baden uses heraldic elements such as crests and decorative motifs that reflect its European heritage. These symbols appear in architecture, city emblems, and cultural institutions.

The Baden region historically used heraldry to represent local authority and tradition. Shields, crowns, and decorative leaves often appear in these designs. Such elements connect modern Baden-Baden to its historical roots.

Luxury materials and colors also became associated with the city's image. Gold accents, dark stone, and classical ornamentation appear in many buildings and venues. These design choices communicate elegance and prestige.

Today Baden-Baden combines historic symbolism with modern design. The city preserves its heritage while presenting itself as a refined destination for culture, wellness, and architecture.`,
    quizQuestion:
      'Heraldic crests and decorative motifs are part of the visual heritage of the Baden region.',
    quizAnswer: true,
  },
  {
    id: '6',
    title: 'Roman Roots of Baden-Baden',
    thumb: require('../HeritageAssts/imgs/heritagecnartclic6.png'),
    body: `The history of Baden-Baden begins long before the modern city existed. During the Roman era the region was already known for its natural hot springs. The Romans called the settlement Aquae, meaning "waters," highlighting the importance of thermal sources.

Roman engineers built organized bath complexes around these springs. These bathhouses included pools of different temperatures, steam rooms, and spaces for rest and conversation. Bathing was both a practical routine and a social activity.

Archaeological remains of Roman baths can still be found in Baden-Baden today. These ruins show how advanced Roman bathing culture was for its time. They also explain why the town continued to develop as a spa destination.

The Roman tradition of thermal bathing laid the foundation for the city's future identity. Even today, visitors come to Baden-Baden for the same reason people did two thousand years ago—its healing waters.`,
    quizQuestion:
      'The Romans called the settlement in Baden-Baden "Aquae" because of its thermal waters.',
    quizAnswer: true,
  },
  {
    id: '7',
    title: 'The Kurhaus of Baden-Baden',
    thumb: require('../HeritageAssts/imgs/heritagecnartclic7.png'),
    body: `One of the most recognizable landmarks in Baden-Baden is the Kurhaus. Built in the early 19th century, the building was designed as a cultural and social center for visitors of the spa town. Its elegant architecture reflects the prestige Baden-Baden gained during the golden age of European spa travel.

The Kurhaus was created as a place where guests could gather, relax, and enjoy cultural events. Visitors attended concerts, formal gatherings, and seasonal celebrations inside its grand halls. These events became an important part of the social rhythm of the city.

The building itself combines classical architecture with refined interior design. Tall columns, ornate ceilings, and impressive chandeliers create a sophisticated atmosphere. The architecture was intended to welcome international visitors and represent the elegance of the spa town.

Today the Kurhaus remains a symbol of Baden-Baden's cultural heritage. It continues to host concerts, exhibitions, and public events. The building reflects the long tradition of hospitality and culture that defines the city.`,
    quizQuestion:
      'The Kurhaus in Baden-Baden was originally built as a cultural and social center for visitors of the spa town.',
    quizAnswer: true,
  },
  {
    id: '8',
    title: 'The Lichtentaler Allee',
    thumb: require('../HeritageAssts/imgs/heritagecnartclic8.png'),
    body: `The Lichtentaler Allee is one of the most beautiful parks in Baden-Baden. This historic promenade stretches along the Oos River and connects many important cultural sites. Visitors often walk here to enjoy the peaceful landscape.

The park was originally designed as a place for relaxation and social encounters. Guests of the spa town used it for morning walks and quiet conversations. The elegant paths and gardens reflected the calm lifestyle associated with resort towns.

Over time the park became an essential part of the city's identity. Museums, historic villas, and cultural institutions were built nearby. The combination of nature and architecture created a unique atmosphere.

Today the Lichtentaler Allee remains one of Baden-Baden's most recognizable locations. It represents the harmony between nature, culture, and leisure that defines the city.`,
    quizQuestion:
      'The Lichtentaler Allee is a historic park and promenade located along the Oos River in Baden-Baden.',
    quizAnswer: true,
  },
  {
    id: '9',
    title: 'Baden-Baden as a European Resort',
    thumb: require('../HeritageAssts/imgs/heritagecnartclic9.png'),
    body: `During the 19th century Baden-Baden became one of the most fashionable resort destinations in Europe. Wealthy travelers from France, Russia, Britain, and other countries visited regularly. The city offered a combination of health, culture, and social life.

Visitors followed a relaxed but structured routine. They spent time at the thermal baths, walked in parks, attended concerts, and gathered in salons. This lifestyle helped define the reputation of Baden-Baden.

Famous writers such as Fyodor Dostoevsky and Ivan Turgenev spent time in the city. Many artists found inspiration in its elegant architecture and peaceful surroundings. These cultural connections helped spread the city's reputation across Europe.

Because of its international visitors, Baden-Baden became known as a cosmopolitan town. Its atmosphere combined luxury with intellectual exchange.`,
    quizQuestion:
      'In the 19th century visitors from many European countries traveled to Baden-Baden for health and social life.',
    quizAnswer: true,
  },
  {
    id: '10',
    title: 'Modern Baden-Baden',
    thumb: require('../HeritageAssts/imgs/heritagecnartclic10.png'),
    body: `Although Baden-Baden has ancient roots, it remains a vibrant city today. Modern visitors still come for thermal spas, cultural festivals, and historic architecture. The city carefully preserves its heritage while offering contemporary experiences.

Cultural institutions continue to play a major role in city life. Concerts, exhibitions, and international events attract visitors from around the world. The famous Festspielhaus is one of the key centers for music and opera.

Nature also surrounds Baden-Baden. Located near the Black Forest, the city offers scenic landscapes and walking routes. This combination of culture and nature makes the destination unique.

Baden-Baden today represents a blend of history and modern luxury. Its thermal waters, cultural venues, and elegant parks continue to attract travelers seeking both relaxation and inspiration.`,
    quizQuestion:
      'Baden-Baden is located near the Black Forest region of Germany.',
    quizAnswer: true,
  },
];
