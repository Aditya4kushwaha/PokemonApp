import { useEffect, useRef } from 'react';
import { X, Heart } from 'lucide-react';
import { PokemonDetail } from '../types/pokemon';
import styles from './PokemonModal.module.css';

interface PokemonModalProps {
  pokemon: PokemonDetail;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClose: () => void;
}

const STAT_MAX = 255;

function getStatHue(statName: string): number {
  const map: Record<string, number> = {
    hp: 120,
    attack: 0,
    defense: 220,
    'special-attack': 280,
    'special-defense': 200,
    speed: 48,
  };
  return map[statName] ?? 180;
}

function formatStatName(name: string): string {
  const map: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    speed: 'Speed',
  };
  return map[name] || name;
}

export function PokemonModal({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onClose,
}: PokemonModalProps) {
  const primaryType = pokemon.types[0] || 'normal';
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Focus trap & focus close button on open
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const heightM = (pokemon.height / 10).toFixed(1);
  const weightKg = (pokemon.weight / 10).toFixed(1);

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${pokemon.name}`}
    >
      <div className={`${styles.typeColors} ${styles.modal}`} data-type={primaryType}>
        {/* Banner */}
        <div className={styles.banner}>
          <div className={styles.bannerBg} />
          <button
            ref={closeRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={18} />
          </button>
          {pokemon.image && (
            <img
              className={styles.image}
              src={pokemon.image}
              alt={pokemon.name}
            />
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.nameBlock}>
              <div className={styles.id}>#{String(pokemon.id).padStart(4, '0')}</div>
              <h2 className={styles.name}>{pokemon.name}</h2>
            </div>
            <button
              className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
              onClick={() => onToggleFavorite(pokemon.id)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
              {isFavorite ? 'Saved' : 'Favorite'}
            </button>
          </div>

          {/* Types */}
          <div className={styles.types}>
            {pokemon.types.map((t) => (
              <span key={t} className={styles.typeBadge} data-type={t}>{t}</span>
            ))}
          </div>

          {/* Physical stats */}
          <div className={styles.physicalRow}>
            <div className={styles.physStat}>
              <div className={styles.physLabel}>Height</div>
              <div className={styles.physValue}>{heightM} m</div>
            </div>
            <div className={styles.physStat}>
              <div className={styles.physLabel}>Weight</div>
              <div className={styles.physValue}>{weightKg} kg</div>
            </div>
            <div className={styles.physStat}>
              <div className={styles.physLabel}>Abilities</div>
              <div className={styles.physValue}>{pokemon.abilities.length}</div>
            </div>
          </div>

          {/* Base Stats */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Base Stats</div>
            {pokemon.stats.map((stat) => {
              const pct = Math.min((stat.value / STAT_MAX) * 100, 100);
              const hue = getStatHue(stat.name);
              return (
                <div key={stat.name} className={styles.statRow}>
                  <span className={styles.statName}>{formatStatName(stat.name)}</span>
                  <span className={styles.statValue}>{stat.value}</span>
                  <div className={styles.statBarContainer}>
                    <div
                      className={styles.statBar}
                      style={
                        {
                          '--bar-width': `${pct}%`,
                          '--bar-hue': hue,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Abilities */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Abilities</div>
            <div className={styles.abilitiesList}>
              {pokemon.abilities.map((ab) => (
                <span key={ab} className={styles.abilityTag}>{ab}</span>
              ))}
            </div>
          </div>

          {/* Moves */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Moves ({pokemon.moves.length})</div>
            <div className={styles.movesScroll}>
              {pokemon.moves.slice(0, 40).map((mv) => (
                <span key={mv} className={styles.moveTag}>{mv}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonModal;
