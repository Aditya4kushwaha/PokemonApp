import styles from './LoadingSkeleton.module.css';

export function LoadingCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={`${styles.id} shimmer-anim`} />
      <div className={`${styles.favorite} shimmer-anim`} />
      <div className={`${styles.image} shimmer-anim`} />
      <div className={`${styles.name} shimmer-anim`} />
      <div className={styles.typesContainer}>
        <div className={`${styles.typeBadge} shimmer-anim`} />
        <div className={`${styles.typeBadge} shimmer-anim`} />
      </div>
    </div>
  );
}

interface LoadingGridSkeletonProps {
  count?: number;
}

export function LoadingGridSkeleton({ count = 8 }: LoadingGridSkeletonProps) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, index) => (
        <LoadingCardSkeleton key={index} />
      ))}
    </div>
  );
}
export default LoadingGridSkeleton;
