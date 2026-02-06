export type AchievementId =
  | 'first_step'
  | 'early_scholar'
  | 'steady_progress'
  | 'consistent_mind'
  | 'heritage_keeper'
  | 'legacy_completed';

export type AchievementItem = {
  id: AchievementId;
  title: string;
  desc: string;
  icon: any;
  iconLocked?: any;
};

export const BADEN_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'first_step',
    title: 'First Step',
    desc: 'Completed your first crossword.',
    icon: require('../HeritageAssts/imgs/ach1.png'),
    iconLocked: require('../HeritageAssts/imgs/lockach1.png'),
  },
  {
    id: 'early_scholar',
    title: 'Early Scholar',
    desc: 'Solved 5 crosswords in any categories.',
    icon: require('../HeritageAssts/imgs/ach2.png'),
    iconLocked: require('../HeritageAssts/imgs/lockach2.png'),
  },
  {
    id: 'steady_progress',
    title: 'Steady Progress',
    desc: 'Completed all Easy level crosswords.',
    icon: require('../HeritageAssts/imgs/ach3.png'),
    iconLocked: require('../HeritageAssts/imgs/lockach3.png'),
  },
  {
    id: 'consistent_mind',
    title: 'Consistent Mind',
    desc: 'Solved 10 crosswords without using hints.',
    icon: require('../HeritageAssts/imgs/ach4.png'),
    iconLocked: require('../HeritageAssts/imgs/lockach4.png'),
  },
  {
    id: 'heritage_keeper',
    title: 'Heritage Keeper',
    desc: 'Completed all Medium level crosswords.',
    icon: require('../HeritageAssts/imgs/ach5.png'),
    iconLocked: require('../HeritageAssts/imgs/lockach5.png'),
  },
  {
    id: 'legacy_completed',
    title: 'Legacy Completed',
    desc: 'Completed at least one crossword at every difficulty level.',
    icon: require('../HeritageAssts/imgs/ach6.png'),
    iconLocked: require('../HeritageAssts/imgs/lockach6.png'),
  },
];
