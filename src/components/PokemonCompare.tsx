import { X } from 'lucide-react';
import { PokemonDetail } from '../types/pokemon';
import styles from './PokemonCompare.module.css';

interface PokemonCompareProps {
  pokemon: (PokemonDetail | null)[];
  onRemove: (id: number) => void;
  onClose: () => void;
}

const STAT_MAX = 255;

const STAT_NAMES: { key: string; label: string }[] = [
  { key: 'hp', label: 'HP' },
  { key: 'attack', label: 'ATK' },
  { key: 'defense', label: 'DEF' },
  { key: 'special-attack', label: 'Sp.ATK' },
  { key: 'special-defense', label: 'Sp.DEF' },
  { key: 'speed', label: 'SPD' },
];

function getStat(pokemon: PokemonDetail | null, key: string): number {
  if (!pokemon) return 0;
  return pokemon.stats.find((s) => s.name === key)?.value ?? 0;
}

export function PokemonCompare({ pokemon, onRemove, onClose }: PokemonCompareProps) {
  const [p1, p2] = pokemon;

  return (
    <div className={`${styles.typeColors} ${styles.drawer}`} role="complementary" aria-label="Compare Pokémon">
      {/* Header */}
      <div className={styles.drawerHeader}>
        <span className={styles.drawerTitle}>⚡ Compare Mode</span>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close compare panel">
          <X size={16} />
        </button>
      </div>

      {/* Pokemon slots */}
      <div className={styles.compareGrid}>
        {[p1, p2].map((p, idx) => (
          <div key={idx} className={styles.slot}>
            {p ? (
              <div className={styles.pokemonHeader}>
                {p.image && (
                  <img className={styles.pokemonImage} src={p.image} alt={p.name} />
                )}
                <div className={styles.pokemonName}>{p.name}</div>
                <div className={styles.pokemonTypes}>
                  {p.types.map((t) => (
                    <span key={t} className={styles.typeBadge} data-type={t}>{t}</span>
                  ))}
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => onRemove(p.id)}
                  aria-label={`Remove ${p.name} from compare`}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className={styles.emptySlot}>
                <span style={{ fontSize: '1.5rem' }}>＋</span>
                <span>Add Pokémon</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stat comparison rows (only shown when both pokemon are selected) */}
      {p1 && p2 && (
        <div className={styles.statsSection}>
          <div className={styles.statsTitle}>Stats Comparison</div>
          {STAT_NAMES.map(({ key, label }) => {
            const v1 = getStat(p1, key);
            const v2 = getStat(p2, key);
            const maxVal = Math.max(v1, v2, 1);
            const pct1 = (v1 / STAT_MAX) * 100;
            const pct2 = (v2 / STAT_MAX) * 100;
            const p1Wins = v1 > v2;
            const p2Wins = v2 > v1;

            return (
              <div key={key} className={styles.statCompareRow}>
                {/* Left side (p1) */}
                <div className={styles.statBarLeft}>
                  <span className={`${styles.statNum} ${p1Wins ? styles.higherVal : ''}`}>{v1}</span>
                  <div style={{ width: 80, display: 'flex', justifyContent: 'flex-end' }}>
                    <div
                      className={`${styles.statBarFill} ${styles.statBarFillLeft} ${p1Wins ? styles.winner : ''}`}
                      style={{ width: `${pct1}%`, maxWidth: 80, minWidth: 4 }}
                    />
                  </div>
                </div>

                {/* Stat label center */}
                <div className={styles.statLabel}>{label}</div>

                {/* Right side (p2) */}
                <div className={styles.statBarRight}>
                  <div style={{ width: 80 }}>
                    <div
                      className={`${styles.statBarFill} ${styles.statBarFillRight} ${p2Wins ? styles.winner : ''}`}
                      style={{ width: `${pct2}%`, maxWidth: 80, minWidth: 4 }}
                    />
                  </div>
                  <span className={`${styles.statNum} ${p2Wins ? styles.higherVal : ''}`}>{v2}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PokemonCompare;
