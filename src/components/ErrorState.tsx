import { AlertCircle, RotateCcw } from 'lucide-react';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message = "We couldn't load the Pokémon data.", onRetry }: ErrorStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <AlertCircle size={32} />
      </div>
      <h3 className={styles.title}>Something went wrong</h3>
      <p className={styles.message}>{message}</p>
      <button className={styles.retryButton} onClick={onRetry} aria-label="Retry loading data">
        <RotateCcw size={16} />
        Try Again
      </button>
    </div>
  );
}

export default ErrorState;
