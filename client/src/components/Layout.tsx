import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import styles from './Layout.module.css';

/**
 * Top-level layout that wraps every routed page. Pure structural — does
 * not fetch data. The Navbar is rendered once and the matched child
 * route is mounted via <Outlet />.
 */
export function Layout() {
  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className={styles.footer}>
        <div className="container">
          <small>
            Campus Lost &amp; Found Portal &middot; SE3090 Mini Hackathon
          </small>
        </div>
      </footer>
    </div>
  );
}
