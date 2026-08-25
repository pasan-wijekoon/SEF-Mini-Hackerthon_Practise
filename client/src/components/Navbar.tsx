import { Link, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

/**
 * Top navigation bar. Brand links to the home route; primary nav uses
 * <NavLink> so the active route is highlighted via the className callback
 * below (NavLink applies aria-current="page" automatically).
 */
export function Navbar() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}>L&amp;F</span>
          <span className={styles.brandText}>Campus Lost &amp; Found</span>
        </Link>
        <nav aria-label="Primary" className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/browse"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            Browse
          </NavLink>
          <NavLink
            to="/reports/new"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            Report Item
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
