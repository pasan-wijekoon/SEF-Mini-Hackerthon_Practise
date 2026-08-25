import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <section className={styles.wrap}>
      <p className={styles.code}>404</p>
      <h1>This page doesn&apos;t exist.</h1>
      <p className={styles.lead}>
        The page you&apos;re looking for may have been moved or never existed.
      </p>
      <Link to="/" className="btn">
        Back to Browse
      </Link>
    </section>
  );
}
