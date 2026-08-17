import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className={styles.searchContainer}>
      <Search size={18} className={styles.searchIcon} />
      <input
        id="pokemon-search"
        type="text"
        className={styles.input}
        placeholder="Search by name or number…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search Pokémon"
      />
      {value && (
        <button
          className={styles.clearButton}
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
