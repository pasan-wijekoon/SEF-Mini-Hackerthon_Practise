
// App.tsx is intentionally a no-op: routing is provided by RouterProvider
// in main.tsx (react-router v7 idiom), with routes, the shared Navbar/
// Layout, and real pages (BrowsePage, ItemDetailsPage, ReportFormPage,
// NotFoundPage) already wired up in router.tsx. This file is kept as a
// stable re-export target for tooling; remove if unused.
export { router } from './router';

