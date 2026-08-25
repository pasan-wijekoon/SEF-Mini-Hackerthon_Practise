import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { reportsApi } from "../api/reports";
import type { Report, ReportStatus } from "../types/report";
import styles from "./HomePage.module.css";

type StatusFilter = "All" | ReportStatus | "Lost" | "Found";

const CARD_LIMIT = 8;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* -- SVG icons kept as local components so the file stays readable -- */
const Icon = {
  Tag: (p: { size?: number; stroke?: string }) => (
    <svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill="none">
      <path d="M20.6 12.6L12.6 20.6C12.21 20.99 11.58 20.99 11.19 20.6L3.4 12.81C3.02 12.43 2.8 11.9 2.8 11.36V4.8C2.8 3.7 3.7 2.8 4.8 2.8H11.36C11.9 2.8 12.43 3.02 12.81 3.4L20.6 11.19C20.99 11.58 20.99 12.21 20.6 12.6Z" stroke={p.stroke ?? "currentColor"} strokeWidth="1.7" strokeLinejoin="round"/>
      <circle cx="7.5" cy="7.5" r="1.4" fill={p.stroke ?? "currentColor"}/>
    </svg>
  ),
  Pin: (p: { size?: number }) => (
    <svg width={p.size ?? 13} height={p.size ?? 13} viewBox="0 0 24 24" fill="none">
      <path d="M12 21C12 21 19 14.5 19 9.5C19 5.9 15.9 3 12 3C8.1 3 5 5.9 5 9.5C5 14.5 12 21 12 21Z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Cal: (p: { size?: number }) => (
    <svg width={p.size ?? 13} height={p.size ?? 13} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 9H21M8 3V6M16 3V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Search: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  ArrowRight: (p: { size?: number }) => (
    <svg width={p.size ?? 16} height={p.size ?? 16} viewBox="0 0 24 24" fill="none">
      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  ),
  Check: () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
      <path d="M5 13L9.5 17.5L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  BagArt: () => (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M4 15L6.5 6.5C6.8 5.6 7.6 5 8.5 5H15.5C16.4 5 17.2 5.6 17.5 6.5L20 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <rect x="3" y="15" width="18" height="5" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
};

function ReportTile({ report }: { report: Report }) {
  const isLost = report.type === "Lost";
  const isResolved = report.status === "Resolved";
  const artClass = isResolved
    ? styles.cardArtResolved
    : isLost
    ? styles.cardArtLost
    : styles.cardArtFound;

  return (
    <Link to={`/reports/${report._id}`} className={styles.card}>
      <div className={styles.cardHead}>
        <span className={isLost ? styles.badgeLost : styles.badgeFound}>{report.type}</span>
        {isResolved ? (
          <span className={styles.statusResolved}>
            <Icon.Check /> Resolved
          </span>
        ) : (
          <span className={styles.statusActive}>Active</span>
        )}
      </div>
      <div className={`${styles.cardArt} ${artClass}`}>
        <Icon.BagArt />
      </div>
      <div>
        <div className={styles.cardTitle}>{report.itemName}</div>
        <div className={styles.cardCat}>{report.category}</div>
      </div>
      <div className={styles.cardMeta}>
        <div className={styles.cardMetaRow}><Icon.Pin /> {report.location}</div>
        <div className={styles.cardMetaRow}><Icon.Cal /> {formatDate(report.date)}</div>
      </div>
      <div className={styles.cardCta}>View details <Icon.ArrowRight size={13} /></div>
    </Link>
  );
}

export default function HomePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await reportsApi.getReports();
        if (!ignore) setReports(data);
      } catch (e) {
        if (!ignore) setError(e instanceof Error ? e.message : "Failed to load reports");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(reports.map((r) => r.category))).sort(),
    [reports]
  );

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter === "Lost" && r.type !== "Lost") return false;
      if (statusFilter === "Found" && r.type !== "Found") return false;
      if (statusFilter === "Resolved" && r.status !== "Resolved") return false;
      if (statusFilter === "Active" && r.status !== "Active") return false;
      if (category !== "All" && r.category !== category) return false;
      if (search.trim()) {
        const s = search.toLowerCase();
        if (
          !r.itemName.toLowerCase().includes(s) &&
          !r.description?.toLowerCase().includes(s) &&
          !r.location.toLowerCase().includes(s)
        ) return false;
      }
      return true;
    });
  }, [reports, search, statusFilter, category]);

  const shown = filtered.slice(0, CARD_LIMIT);
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;

  return (
    <div className={styles.root}>
      {/* Google Fonts for the design's Instrument Serif + Manrope */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ============ HERO ============ */}
      <section className={styles.hero}>
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <div className={styles.chip}>
              <span className={styles.chipDot} />
              {resolvedCount > 0
                ? `${resolvedCount} item${resolvedCount === 1 ? "" : "s"} reunited with their owners`
                : "Post an item — help someone find what they lost"}
            </div>
            <h1 className={styles.headline}>
              Lost something on campus?{" "}
              <span className={styles.headlineAccent}>Someone probably found it.</span>
            </h1>
            <p className={styles.lede}>
              One shared board for every misplaced wallet, key, charger and hoodie on campus. Post it, search it, and get it back — no noticeboards, no group-chat spam.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/browse" className={styles.btnPrimary}>
                Browse reports <Icon.ArrowRight />
              </Link>
              <Link to="/reports/new" className={styles.btnSecondary}>
                I found something
              </Link>
            </div>
          </div>

          <div className={styles.heroArt}>
            <div className={`${styles.artCard} ${styles.artCard1}`}>
              <div className={styles.artCardHead}>
                <span className={`${styles.artTag} ${styles.artTagLost}`}>Lost</span>
              </div>
              <div className={styles.artTitle}>Silver Wristwatch</div>
              <div className={styles.artMeta}><Icon.Pin size={12} /> Sports Complex</div>
            </div>
            <div className={`${styles.artCard} ${styles.artCard2}`}>
              <div className={styles.artCardHead}>
                <span className={`${styles.artTag} ${styles.artTagFound}`}>Found</span>
              </div>
              <div className={styles.artTitle}>Set of Keys</div>
              <div className={styles.artMeta}><Icon.Pin size={12} /> Parking Lot C</div>
            </div>
            <div className={styles.artLogo}>
              <Icon.Tag size={26} stroke="var(--bg)" />
            </div>
          </div>
        </div>
      </section>

      {/* ============ SEARCH / FILTER ============ */}
      <section className={`${styles.container} ${styles.filterWrap}`}>
        <div className={styles.filterBar}>
          <div className={styles.search}>
            <Icon.Search />
            <input
              className={styles.searchInput}
              placeholder='Search by item, e.g. "wallet", "charger"…'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.divider} />
          <div className={styles.pills}>
            {(["All", "Lost", "Found", "Resolved"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setStatusFilter(v as StatusFilter)}
                className={`${styles.pill} ${
                  statusFilter === v
                    ? styles.pillActive
                    : v === "Lost"
                    ? styles.pillLost
                    : v === "Found"
                    ? styles.pillFound
                    : ""
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <label className={styles.selectWrap}>
            Category:
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* ============ RECENT REPORTS ============ */}
      <section className={`${styles.container} ${styles.gridSection}`}>
        <div className={styles.gridHeader}>
          <h2 className={styles.gridTitle}>Recent reports</h2>
          <span className={styles.gridCount}>
            {loading
              ? "Loading…"
              : `Showing ${shown.length} of ${filtered.length}`}
          </span>
        </div>

        <div className={styles.grid}>
          {loading && <div className={styles.stateBox}>Loading reports…</div>}
          {error && <div className={styles.stateBox}>Could not load reports: {error}</div>}
          {!loading && !error && shown.length === 0 && (
            <div className={styles.stateBox}>No reports match your filters yet.</div>
          )}
          {!loading && !error && shown.map((r) => (
            <ReportTile key={r._id} report={r} />
          ))}
        </div>
      </section>
    </div>
  );
}
