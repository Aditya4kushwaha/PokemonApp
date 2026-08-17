import styles from './TypeFilter.module.css';

interface TypeFilterProps {
  types: string[];
  selected: string;
  onChange: (type: string) => void;
}

export function TypeFilter({ types, selected, onChange }: TypeFilterProps) {
  const allTypes = ['all', ...types];

  return (
    <div className={`${styles.wrapper} ${styles.typeColors}`}>
      <div className={styles.filterRow} role="group" aria-label="Filter by type">
        {allTypes.map((type) => (
          <button
            key={type}
            className={`${styles.pill} ${selected === type ? styles.active : ''}`}
            data-type={type}
            onClick={() => onChange(type)}
            aria-pressed={selected === type}
            aria-label={`Filter by ${type}`}
          >
            {type === 'all' ? '✦ All Types' : type}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TypeFilter;
