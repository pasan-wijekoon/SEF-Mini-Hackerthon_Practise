import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getReportById, resolveReport } from '../api/reports';
import { StatusBadge } from '../components/StatusBadge';
import type { Report } from '../types/report';
import styles from './ItemDetailsPage.module.css';

type LoadStatus = 'loading' | 'loaded' | 'resolving' | 'error';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  // Bumping this counter re-triggers the fetch effect (used by Retry).
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setStatus('loading');
    setError(null);
    getReportById(id)
      .then((r) => {
        if (cancelled) return;
        setReport(r);
        setStatus('loaded');
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Failed to load report');
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [id, retryToken]);

  const handleResolve = useCallback(async () => {
    if (!id || !report) return;
    if (report.status === 'Resolved') return;
    setStatus('resolving');
    try {
      const updated = await resolveReport(id);
      setReport(updated);
      setStatus('loaded');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to resolve report');
      setStatus('loaded');
    }
  }, [id, report]);

  const handleRetry = useCallback(() => {
    setError(null);
    setRetryToken((n) => n + 1);
  }, []);

  return (
    <article className={styles.page}>
      <p className={styles.crumbs}>
        <Link to="/">← Back to Browse</Link>
      </p>

      {status === 'loading' && <Skeleton />}

      {status === 'error' && (
        <div className={styles.error} role="alert">
          <strong>Couldn&apos;t load this report.</strong>
          <p>{error}</p>
          <button type="button" className="btn" onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      {status !== 'loading' && status !== 'error' && report && (
        <>
          <header className={styles.header}>
            <div className={styles.titleRow}>
              <h1>{report.itemName}</h1>
              <div className={styles.badges}>
                <StatusBadge variant="type" value={report.type} />
                <StatusBadge
                  variant="status"
                  value={report.status}
                  size="sm"
                />
              </div>
            </div>
          </header>

          <div className={styles.grid}>
            <section className={styles.main} aria-label="Report details">
              <Field label="Category">{report.category}</Field>
              <Field label="Location">{report.location}</Field>
              <Field label="Date">{formatDate(report.date)}</Field>
              <div className={styles.descriptionBlock}>
                <h2>Description</h2>
                <p>{report.description}</p>
              </div>
            </section>

            <aside className={styles.sidebar} aria-label="Contact">
              <div className={styles.contactCard}>
                <h2>Contact</h2>
                <p className={styles.contact}>{report.contactInfo}</p>
                <p className={styles.meta}>
                  Reported {formatDate(report.createdAt)}
                </p>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className="btn"
                  onClick={handleResolve}
                  disabled={
                    report.status === 'Resolved' || status === 'resolving'
                  }
                >
                  {status === 'resolving'
                    ? 'Resolving…'
                    : report.status === 'Resolved'
                      ? 'Resolved'
                      : 'Mark as Resolved'}
                </button>
                {report.status === 'Resolved' && (
                  <p className={styles.resolvedNote}>
                    This report has been marked as resolved.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </>
      )}
    </article>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{children}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={`${styles.skel} ${styles.skelTitle}`} />
      <div className={`${styles.skel} ${styles.skelLine}`} />
      <div className={`${styles.skel} ${styles.skelLine}`} />
      <div className={`${styles.skel} ${styles.skelBlock}`} />
    </div>
  );
}
