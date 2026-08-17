export interface PokemonShort {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number; // in decimeters
  weight: number; // in hectograms
  abilities: string[];
  stats: PokemonStat[];
  moves: string[];
}

export type SortKey = 'id' | 'name' | 'hp' | 'attack' | 'speed';
export type SortOrder = 'asc' | 'desc';
