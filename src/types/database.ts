export interface People {
  id: number;
  name: string;
  img: string;
  role: string;
}

export interface Category {
  id: number;
  category: string;
  people: People[];
}

export type Credit = Category[];

export interface CritData {
  [key: string]: {
    trophies: number;
    crit: number;
  };
}

export interface Deck {
  guide: number[];
  id: number;
  type: 'PvP' | 'Co-op' | 'Crew' | '-';
  rating: {
    default: number;
    c8?: number;
    c9?: number;
    c10?: number;
  };
  battlefield: Battlefield['id'];
  decks: Die['id'][][];
}

export type DeckList = Deck[];

export interface DeckGuide {
  id: number;
  name: string;
  type: 'PvP' | 'Co-op' | 'Crew';
  diceList: Die['id'][][];
  guide: string;
  battlefield: Battlefield['id'];
  archived: boolean;
}

export type DeckGuides = DeckGuide[];

interface Alternatives {
  desc: string;
  list?: Array<Die['id'] | null>;
}

interface ArenaValue {
  type: 'Main Dps' | 'Assist Dps' | 'Slow' | 'Value';
  assist: number;
  dps: number;
  slow: number;
  value: number;
}

export interface Die {
  id: number;
  name: string;
  type:
    | 'Physical'
    | 'Magic'
    | 'Buff'
    | 'Merge'
    | 'Transform'
    | 'Install'
    | 'Debuff';
  desc: string;
  detail: string;
  img: string;
  target: 'Front' | 'Strongest' | 'Random' | 'Weakest' | '-';
  rarity: 'Common' | 'Rare' | 'Unique' | 'Legendary';
  atk: number;
  spd: number;
  eff1: number;
  eff2: number;
  nameEff1: string;
  nameEff2: string;
  unitEff1: string;
  unitEff2: string;
  cupAtk: number;
  cupSpd: number;
  cupEff1: number;
  cupEff2: number;
  pupAtk: number;
  pupSpd: number;
  pupEff1: number;
  pupEff2: number;
  alternatives?: Alternatives;
  arenaValue: ArenaValue;
}

export type DiceList = Die[];

export type DiscordBotCommandList = {
  category: string;
  commands: { command: string; description: string }[];
}[];

export interface News {
  game: string;
  website: string;
}

export interface Info {
  [key: string]: {
    youtubeId: string | undefined;
    message: string | undefined;
  };
}

export interface Patreon {
  id: string;
  name: string;
  img: string | undefined;
  tier: number;
}

export type PatreonList = (Info & Patreon)[];

export interface UserData {
  'linked-account': {
    discord?: string;
    patreon?: string;
  };
  'patreon-tier'?: number;
  editor?: true;
}

export interface Battlefield {
  id: number;
  name: string;
  img: string;
  desc: string;
  source: string;
  buffName: string;
  buffValue: number;
  buffUnit: string;
  buffCupValue: number;
}

export interface Guide {
  id: number;
  level: 'Beginners' | 'Intermediate' | 'Advanced';
  title: string;
  content: string;
}

export interface Boss {
  id: number;
  name: string;
  img: string;
  desc: string;
}

export interface Box {
  id: number;
  name: string;
  img: string;
  from: string;
  contain: string;
}

export interface WikiContent {
  box: Box[];
  intro: {
    PvP: string;
    'Co-op': string;
    Crew: string;
    Arena: string;
    Store: string;
  };
  boss: Boss[];
  tips: Guide[];
  battlefield: Battlefield[];
}

export type DatabasePath =
  | 'credit'
  | 'critData'
  | 'decks'
  | 'decks_guide'
  | 'dice'
  | 'discord_bot/help'
  | 'news'
  | 'patreon_list';

export interface Data {
  credit: Credit;
  critData: CritData;
  decks: DeckList;
  decks_guide: DeckGuides;
  dice: DiceList;
  'discord_bot/help': DiscordBotCommandList;
  news: News;
  patreon_list: PatreonList;
  wiki: WikiContent;
}
