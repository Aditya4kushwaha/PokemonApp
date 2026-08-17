import { Heart, GitCompare } from 'lucide-react';
import { PokemonDetail } from '../types/pokemon';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
  pokemon: PokemonDetail;
  isFavorite: boolean;
  isInCompare: boolean;
  onToggleFavorite: (id: number) => void;
  onToggleCompare: (id: number) => void;
  onOpenDetail: (pokemon: PokemonDetail) => void;
}

export function PokemonCard({
  pokemon,
  isFavorite,
  isInCompare,
  onToggleFavorite,
  onToggleCompare,
  onOpenDetail,
}: PokemonCardProps) {
  const primaryType = pokemon.types[0] || 'normal';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenDetail(pokemon);
    }
  };

  return (
    <div
      className={`${styles.typeColors} ${styles.card}`}
      data-type={primaryType}
      onClick={() => onOpenDetail(pokemon)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${pokemon.name}`}
    >
      {/* Color banner */}
      <div className={styles.banner}>
        <div className={styles.bannerBg} />
        <div className={styles.ballPattern} />
        {pokemon.image ? (
          <img
            className={styles.image}
            src={pokemon.image}
            alt={pokemon.name}
            loading="lazy"
          />
        ) : (
          <div style={{ width: 110, height: 110 }} />
        )}
      </div>

      {/* Card body */}
      <div className={styles.cardBody}>
        <div className={styles.idRow}>
          <span className={styles.id}>#{String(pokemon.id).padStart(4, '0')}</span>
          <div className={styles.controls}>
            <button
              className={`${styles.iconBtn} ${styles.compareBtn} ${isInCompare ? styles.inCompare : ''}`}
              onClick={(e) => { e.stopPropagation(); onToggleCompare(pokemon.id); }}
              aria-label={isInCompare ? 'Remove from compare' : 'Add to compare'}
              title={isInCompare ? 'Remove from compare' : 'Add to compare'}
            >
              <GitCompare size={13} />
            </button>
            <button
              className={`${styles.iconBtn} ${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(pokemon.id); }}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              title={isFavorite ? 'Unfavorite' : 'Favorite'}
            >
              <Heart size={13} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
        <div className={styles.name}>{pokemon.name}</div>
        <div className={styles.types}>
          {pokemon.types.map((type) => (
            <span key={type} className={styles.typeBadge} data-type={type}>
              {type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
