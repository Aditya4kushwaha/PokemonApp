import { Loader2 } from 'lucide-react';
import { PokemonDetail } from '../types/pokemon';
import { PokemonCard } from './PokemonCard';
import { LoadingCardSkeleton } from './LoadingSkeleton';
import styles from './PokemonGrid.module.css';

interface PokemonGridProps {
  pokemon: PokemonDetail[];
  favorites: number[];
  compareIds: number[];
  isLoading: boolean;
  isLoadingDetails: boolean;
  hasMore: boolean;
  onToggleFavorite: (id: number) => void;
  onToggleCompare: (id: number) => void;
  onOpenDetail: (pokemon: PokemonDetail) => void;
  onLoadMore: () => void;
  onResetFilters: () => void;
}

export function PokemonGrid({
  pokemon,
  favorites,
  compareIds,
  isLoading,
  isLoadingDetails,
  hasMore,
  onToggleFavorite,
  onToggleCompare,
  onOpenDetail,
  onLoadMore,
  onResetFilters,
}: PokemonGridProps) {
  if (isLoading && pokemon.length === 0) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <LoadingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && pokemon.length === 0) {
    return (
      <div className={styles.grid}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <p className={styles.emptyTitle}>No Pokémon found</p>
          <p className={styles.emptyText}>
            No results match your current filters. Try changing the search or type.
          </p>
          <button className={styles.resetBtn} onClick={onResetFilters}>
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {pokemon.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            isFavorite={favorites.includes(p.id)}
            isInCompare={compareIds.includes(p.id)}
            onToggleFavorite={onToggleFavorite}
            onToggleCompare={onToggleCompare}
            onOpenDetail={onOpenDetail}
          />
        ))}
        {/* Append skeleton cards at the end when loading more */}
        {isLoadingDetails && pokemon.length > 0 &&
          Array.from({ length: 4 }).map((_, i) => (
            <LoadingCardSkeleton key={`skel-${i}`} />
          ))}
      </div>

      {hasMore && !isLoadingDetails && (
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreBtn} onClick={onLoadMore} id="load-more-btn">
            Load More Pokémon
          </button>
        </div>
      )}

      {isLoadingDetails && pokemon.length > 0 && !hasMore && (
        <div className={styles.loadMoreContainer}>
          <button className={styles.loadMoreBtn} disabled>
            <Loader2 size={16} className={styles.spinner} />
            Loading…
          </button>
        </div>
      )}
    </>
  );
}

export default PokemonGrid;
