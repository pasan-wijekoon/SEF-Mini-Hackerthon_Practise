import type { ReportStatus, ReportType } from '../types/report';
import styles from './StatusBadge.module.css';

export type StatusBadgeVariant = 'type' | 'status';

type StatusBadgeProps = {
  /** 'type' renders Lost/Found; 'status' renders Active/Resolved. */
  variant: StatusBadgeVariant;
  value: ReportType | ReportStatus;
  size?: 'sm' | 'md';
};

/**
 * Pill badge for a report's type (Lost/Found) or status (Active/Resolved).
 * Color is driven entirely by CSS classes keyed off variant + value so the
 * React Compiler can safely hoist the className strings.
 */
export function StatusBadge({ variant, value, size = 'md' }: StatusBadgeProps) {
  // Static lookup maps avoid string concatenation in render.
  const valueClass = VALUE_CLASS[value];
  const variantClass = variant === 'type' ? styles.type : styles.status;
  const sizeClass = size === 'sm' ? styles.sm : styles.md;

  return (
    <span
      className={`${styles.badge} ${variantClass} ${valueClass} ${sizeClass}`}
      role={variant === 'status' ? 'status' : undefined}
    >
      {value}
    </span>
  );
}

const VALUE_CLASS: Record<ReportType | ReportStatus, string> = {
  Lost: styles.lost,
  Found: styles.found,
  Active: styles.active,
  Resolved: styles.resolved,
};
