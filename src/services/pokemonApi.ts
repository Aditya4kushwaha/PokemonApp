import { PokemonDetail } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Helper to map API response to internal structure
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRawToDetail(raw: any): PokemonDetail {
  return {
    id: raw.id,
    name: raw.name,
    image: raw.sprites.other['official-artwork'].front_default || raw.sprites.front_default || '',
    types: raw.types.map((t: any) => t.type.name),
    height: raw.height,
    weight: raw.weight,
    abilities: raw.abilities.map((a: any) => a.ability.name),
    stats: raw.stats.map((s: any) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    moves: raw.moves.map((m: any) => m.move.name),
  };
}

// Fetch details for a list of URLs
async function fetchDetailsInParallel(items: { name: string; url: string }[]): Promise<PokemonDetail[]> {
  const promises = items.map(async (item) => {
    const res = await fetch(item.url);
    if (!res.ok) throw new Error(`Failed to fetch details for ${item.name}`);
    const data = await res.json();
    return mapRawToDetail(data);
  });
  return Promise.all(promises);
}

export async function fetchPokemonList(
  limit: number,
  offset: number
): Promise<{ count: number; results: PokemonDetail[] }> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Failed to fetch Pokémon list');
  const data = await res.json();
  const results = await fetchDetailsInParallel(data.results);
  return {
    count: data.count,
    results,
  };
}

export async function fetchPokemonByType(
  type: string,
  limit: number,
  offset: number
): Promise<{ count: number; results: PokemonDetail[] }> {
  const res = await fetch(`${BASE_URL}/type/${type}`);
  if (!res.ok) throw new Error(`Failed to fetch Pokémon of type ${type}`);
  const data = await res.json();
  
  // The API returns all pokemon for a given type, let's extract the list
  const allPokemon = data.pokemon.map((p: any) => p.pokemon);
  const count = allPokemon.length;
  
  // Slice it locally for pagination
  const slicedPokemon = allPokemon.slice(offset, offset + limit);
  const results = await fetchDetailsInParallel(slicedPokemon);
  
  return {
    count,
    results,
  };
}

export async function fetchPokemonDetails(nameOrId: string | number): Promise<PokemonDetail> {
  const cleanQuery = typeof nameOrId === 'string' ? nameOrId.toLowerCase().trim() : nameOrId;
  const res = await fetch(`${BASE_URL}/pokemon/${cleanQuery}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Pokemon not found');
    }
    throw new Error('Failed to fetch Pokémon details');
  }
  const data = await res.json();
  return mapRawToDetail(data);
}

// Fetch all available types for the filter options
export async function fetchAllTypes(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/type`);
  if (!res.ok) throw new Error('Failed to fetch types');
  const data = await res.json();
  // Filter out 'unknown' and 'shadow' types if they exist as they have few/no pokemon
  return data.results
    .map((t: any) => t.name)
    .filter((name: string) => name !== 'unknown' && name !== 'shadow');
}
