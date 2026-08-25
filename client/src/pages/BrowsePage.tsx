import { Link } from 'react-router-dom';

/**
 * Placeholder for Member 2's BrowsePage. Member 2 will replace this
 * file's body with the real list + filter implementation. Keeping the
 * default export here means the router boots before that work lands.
 */
export default function BrowsePage() {
  return (
    <section>
      <h1>Browse Reports</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
        BrowsePage placeholder &mdash; Member 2 will replace this with the
        real list, search, and filters.
      </p>
      <p style={{ marginTop: 16 }}>
        Try the details page:{' '}
        <Link to="/reports/mock-1">mock-1 (Lost wallet)</Link>
        {' · '}
        <Link to="/reports/mock-2">mock-2 (Found bottle)</Link>
        {' · '}
        <Link to="/reports/mock-3">mock-3 (Resolved)</Link>
      </p>
    </section>
  );
}
