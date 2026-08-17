import { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, Heart, GitCompare, ArrowUpDown } from 'lucide-react';
import { usePokemon } from './hooks/usePokemon';
import { SearchBar } from './components/SearchBar';
import { TypeFilter } from './components/TypeFilter';
import { PokemonGrid } from './components/PokemonGrid';
import { PokemonModal } from './components/PokemonModal';
import { PokemonCompare } from './components/PokemonCompare';
import { ErrorState } from './components/ErrorState';
import { PokemonDetail, SortKey, SortOrder } from './types/pokemon';
import { fetchPokemonDetails } from './services/pokemonApi';
import styles from './App.module.css';
import './index.css';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('poke_theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('poke_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const {
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
    isLoading,
    isLoadingDetails,
    error,
    hasMore,
    loadMore,
    toggleFavorite,
    compareIds,
    toggleCompare,
    clearCompare,
    retry,
    resetFilters,
  } = usePokemon();

  // Detail modal state
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null);
  const [showCompare, setShowCompare] = useState(false);

  // Pokemon objects for compare panel
  const [comparePokemon, setComparePokemon] = useState<(PokemonDetail | null)[]>([null, null]);

  // Load pokemon details for compare panel whenever compareIds changes
  useEffect(() => {
    let active = true;
    async function loadCompareDetails() {
      const details = await Promise.all(
        [compareIds[0], compareIds[1]].map(async (id) => {
          if (id == null) return null;
          try {
            return await fetchPokemonDetails(id);
          } catch {
            return null;
          }
        })
      );
      if (active) setComparePokemon(details);
    }
    if (compareIds.length > 0) {
      loadCompareDetails();
    } else {
      setComparePokemon([null, null]);
    }
    return () => { active = false; };
  }, [compareIds]);

  // Read URL params on load to open a specific pokemon or compare mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pokemonParam = params.get('pokemon');
    const compareParam = params.get('compare');

    if (pokemonParam) {
      fetchPokemonDetails(pokemonParam)
        .then((p) => setSelectedPokemon(p))
        .catch(() => {});
    }

    if (compareParam) {
      const ids = compareParam.split(',').slice(0, 2);
      ids.forEach((name) => {
        fetchPokemonDetails(name)
          .then((p) => toggleCompare(p.id))
          .catch(() => {});
      });
      setShowCompare(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update URL param when a pokemon modal is open
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedPokemon) {
      params.set('pokemon', selectedPokemon.name);
    } else {
      params.delete('pokemon');
    }
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedPokemon]);

  const handleOpenDetail = useCallback((pokemon: PokemonDetail) => {
    setSelectedPokemon(pokemon);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedPokemon(null);
  }, []);

  const handleRemoveFromCompare = useCallback((id: number) => {
    toggleCompare(id);
  }, [toggleCompare]);

  const handleCloseCompare = useCallback(() => {
    setShowCompare(false);
    clearCompare();
  }, [clearCompare]);

  const handleToggleCompare = useCallback((id: number) => {
    toggleCompare(id);
    setShowCompare(true);
  }, [toggleCompare]);

  const toggleSortOrder = () => {
    setSortOrder((prev: SortOrder) => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoArea}>
            <span className={styles.logoEmoji} aria-hidden="true">⚡</span>
            <div>
              <div className={styles.logoText}>PokéDex</div>
              <div className={styles.logoSub}>Explorer</div>
            </div>
          </div>

          <div className={styles.headerRight}>
            <button
              className={`${styles.headerBtn} ${showFavoritesOnly ? styles.active : ''}`}
              onClick={() => setShowFavoritesOnly((v: boolean) => !v)}
              id="favorites-filter-btn"
              aria-pressed={showFavoritesOnly}
            >
              <Heart size={14} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
              Favorites {favorites.length > 0 && `(${favorites.length})`}
            </button>

            {compareIds.length > 0 && (
              <button
                className={styles.headerBtn}
                onClick={() => setShowCompare((v) => !v)}
                id="compare-toggle-btn"
              >
                <GitCompare size={14} />
                Compare ({compareIds.length})
              </button>
            )}

            <button
              className={`${styles.headerBtn} ${styles.themeBtn}`}
              onClick={() => setIsDark((d) => !d)}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              id="theme-toggle-btn"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.controlsTop}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* Sort */}
            <div className={styles.sortControls}>
              <span className={styles.sortLabel}>Sort:</span>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                id="sort-select"
                aria-label="Sort Pokémon by"
              >
                <option value="id">ID</option>
                <option value="name">Name</option>
                <option value="hp">HP</option>
                <option value="attack">Attack</option>
                <option value="speed">Speed</option>
              </select>
              <button
                className={styles.sortOrderBtn}
                onClick={toggleSortOrder}
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                aria-label={`Sort order: ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
                id="sort-order-btn"
              >
                <ArrowUpDown size={15} style={{ transform: sortOrder === 'desc' ? 'scaleY(-1)' : 'none', transition: 'transform 0.2s' }} />
              </button>
            </div>
          </div>

          {/* Type filter */}
          <TypeFilter
            types={types}
            selected={selectedType}
            onChange={setSelectedType}
          />
        </div>

        {/* Error state */}
        {error && !isLoading && (
          <ErrorState message={error} onRetry={retry} />
        )}

        {/* Grid */}
        {!error && (
          <PokemonGrid
            pokemon={displayedPokemon}
            favorites={favorites}
            compareIds={compareIds}
            isLoading={isLoading}
            isLoadingDetails={isLoadingDetails}
            hasMore={hasMore}
            onToggleFavorite={toggleFavorite}
            onToggleCompare={handleToggleCompare}
            onOpenDetail={handleOpenDetail}
            onLoadMore={loadMore}
            onResetFilters={resetFilters}
          />
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          Data from{' '}
          <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer">
            PokéAPI
          </a>{' '}
          · Built with ⚡ React + TypeScript
        </p>
      </footer>

      {/* Compare FAB (when compare panel closed but items selected) */}
      {compareIds.length > 0 && !showCompare && (
        <button
          className={styles.compareFab}
          onClick={() => setShowCompare(true)}
          id="compare-fab-btn"
          aria-label={`Open compare panel (${compareIds.length} selected)`}
        >
          <GitCompare size={16} />
          Compare
          <span className={styles.compareBadge}>{compareIds.length}</span>
        </button>
      )}

      {/* Detail Modal */}
      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          isFavorite={favorites.includes(selectedPokemon.id)}
          onToggleFavorite={toggleFavorite}
          onClose={handleCloseDetail}
        />
      )}

      {/* Compare Drawer */}
      {showCompare && compareIds.length > 0 && (
        <PokemonCompare
          pokemon={comparePokemon}
          onRemove={handleRemoveFromCompare}
          onClose={handleCloseCompare}
        />
      )}
    </div>
  );
}

export default App;
