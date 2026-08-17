import { useState, useEffect, useRef, useMemo } from 'react';
import { PokemonDetail, SortKey, SortOrder } from '../types/pokemon';
import { fetchPokemonDetails, fetchAllTypes } from '../services/pokemonApi';

const LIMIT = 20;

export function usePokemon() {
  // Directory of all pokemon { name, url, id }
  const [directory, setDirectory] = useState<{ name: string; url: string; id: number }[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState<SortKey>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem('poke_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Pagination offset for the current filtered list
  const [visibleCount, setVisibleCount] = useState(LIMIT);
  
  // Loading & Error states
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache to store loaded details to prevent double fetching
  const detailsCache = useRef<Record<string, PokemonDetail>>({});
  const [displayedPokemon, setDisplayedPokemon] = useState<PokemonDetail[]>([]);

  // Compare selection (holds up to 2 IDs)
  const [compareIds, setCompareIds] = useState<number[]>([]);

  // 1. Fetch directories & type lists on mount
  useEffect(() => {
    let active = true;
    async function init() {
      try {
        setIsLoadingDirectory(true);
        setError(null);
        
        // Fetch all 1025 standard Pokemon (Gen 1-9) to avoid extra forms/special entries if wanted, 
        // or let's fetch all 1300 to be complete
        const [dirRes, typesRes] = await Promise.all([
          fetch('https://pokeapi.co/api/v2/pokemon?limit=1300'),
          fetchAllTypes(),
        ]);

        if (!dirRes.ok) throw new Error('Failed to load Pokémon directory');
        const dirData = await dirRes.json();
        
        const parsedDir = dirData.results.map((item: { name: string; url: string }) => {
          // Extract ID from URL (e.g., https://pokeapi.co/api/v2/pokemon/25/ -> 25)
          const parts = item.url.split('/');
          const id = parseInt(parts[parts.length - 2], 10);
          return {
            name: item.name,
            url: item.url,
            id,
          };
        }).filter((item: { id: number }) => item.id <= 1025); // Limit to standard pokemon (1-1025) for clean assets

        if (active) {
          setDirectory(parsedDir);
          setTypes(typesRes);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'An error occurred during initialization.');
        }
      } finally {
        if (active) {
          setIsLoadingDirectory(false);
        }
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('poke_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // 2. Fetch Pokémon by type if needed
  // Note: Since we have the directory, we can filter it using a type map.
  // To keep it super fast and accurate, we can query the type endpoint if a type filter is selected.
  const [typePokemonIds, setTypePokemonIds] = useState<number[] | null>(null);
  const [isLoadingTypeIds, setIsLoadingTypeIds] = useState(false);

  useEffect(() => {
    if (selectedType === 'all') {
      setTypePokemonIds(null);
      return;
    }

    let active = true;
    async function loadTypeIds() {
      try {
        setIsLoadingTypeIds(true);
        const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
        if (!res.ok) throw new Error(`Failed to load type ${selectedType}`);
        const data = await res.json();
        const ids = data.pokemon.map((p: any) => {
          const parts = p.pokemon.url.split('/');
          return parseInt(parts[parts.length - 2], 10);
        }).filter((id: number) => id <= 1025);

        if (active) {
          setTypePokemonIds(ids);
        }
      } catch (err: any) {
        if (active) {
          setError(`Could not filter by type: ${err.message}`);
        }
      } finally {
        if (active) {
          setIsLoadingTypeIds(false);
        }
      }
    }
    loadTypeIds();
    return () => {
      active = false;
    };
  }, [selectedType]);

  // 3. Filter and Sort the list of ALL matching Pokemon
  const filteredSortedList = useMemo(() => {
    if (isLoadingDirectory) return [];

    let list = directory;

    // Filter by type
    if (selectedType !== 'all' && typePokemonIds) {
      list = list.filter((p) => typePokemonIds.includes(p.id));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => p.name.includes(q) || p.id.toString() === q);
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      list = list.filter((p) => favorites.includes(p.id));
    }

    return list;
  }, [directory, selectedType, typePokemonIds, searchQuery, showFavoritesOnly, favorites, isLoadingDirectory]);

  // Reset pagination when filter/search changes
  useEffect(() => {
    setVisibleCount(LIMIT);
  }, [searchQuery, selectedType, showFavoritesOnly]);

  // Determine if we have more to load
  const hasMore = visibleCount < filteredSortedList.length;

  // 4. Fetch details for the slice of visible Pokémon
  useEffect(() => {
    if (isLoadingDirectory || isLoadingTypeIds) return;

    let active = true;
    const targetSlice = filteredSortedList.slice(0, visibleCount);

    if (targetSlice.length === 0) {
      setDisplayedPokemon([]);
      return;
    }

    async function loadDetails() {
      setIsLoadingDetails(true);
      setError(null);
      try {
        const details = await Promise.all(
          targetSlice.map(async (item) => {
            const cacheKey = item.name;
            if (detailsCache.current[cacheKey]) {
              return detailsCache.current[cacheKey];
            }
            const data = await fetchPokemonDetails(item.name);
            detailsCache.current[cacheKey] = data;
            return data;
          })
        );

        if (active) {
          // Now sort the detailed items according to selected SortKey and SortOrder
          const sortedDetails = [...details].sort((a, b) => {
            let valA: string | number = '';
            let valB: string | number = '';

            if (sortBy === 'id') {
              valA = a.id;
              valB = b.id;
            } else if (sortBy === 'name') {
              valA = a.name;
              valB = b.name;
            } else {
              // HP, Attack, Speed
              const statNameMap: Record<string, string> = {
                hp: 'hp',
                attack: 'attack',
                speed: 'speed',
              };
              const statA = a.stats.find((s) => s.name === statNameMap[sortBy]);
              const statB = b.stats.find((s) => s.name === statNameMap[sortBy]);
              valA = statA ? statA.value : 0;
              valB = statB ? statB.value : 0;
            }

            if (typeof valA === 'string' && typeof valB === 'string') {
              return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            } else {
              return sortOrder === 'asc'
                ? (valA as number) - (valB as number)
                : (valB as number) - (valA as number);
            }
          });

          setDisplayedPokemon(sortedDetails);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Failed to load Pokémon details');
        }
      } finally {
        if (active) {
          setIsLoadingDetails(false);
        }
      }
    }

    loadDetails();

    return () => {
      active = false;
    };
  }, [filteredSortedList, visibleCount, sortBy, sortOrder, isLoadingDirectory, isLoadingTypeIds]);

  // Actions
  const loadMore = () => {
    if (hasMore && !isLoadingDetails) {
      setVisibleCount((prev) => prev + LIMIT);
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((cid) => cid !== id);
      }
      if (prev.length >= 2) {
        // Replace the second one or shift
        return [prev[0], id];
      }
      return [...prev, id];
    });
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  const retry = () => {
    // Retriggering details loading by spreading directory or visibleCount
    setVisibleCount((prev) => prev);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setShowFavoritesOnly(false);
    setSortBy('id');
    setSortOrder('asc');
    setVisibleCount(LIMIT);
  };

  return {
    types,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    favorites,
    showFavoritesOnly,
    setShowFavoritesOnly,
    displayedPokemon,
    isLoading: isLoadingDirectory || isLoadingTypeIds || isLoadingDetails,
    isLoadingDetails,
    error,
    hasMore,
    loadMore,
    toggleFavorite,
    compareIds,
    setCompareIds,
    toggleCompare,
    clearCompare,
    retry,
    resetFilters,
  };
}
