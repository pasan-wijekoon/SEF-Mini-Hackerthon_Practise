import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import ReportFormPage from './pages/ReportFormPage';

/**
 * Central route configuration. The root route renders <Layout /> which
 * mounts the Navbar and an <Outlet /> for the active child.
 *
 * Routes:
 *  - /              → HomePage (Campus Finder hero + featured reports)
 *  - /browse        → BrowsePage (full list with filter/search)
 *  - /reports/new   → ReportFormPage
 *  - /reports/:id   → ItemDetailsPage
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'browse', element: <BrowsePage /> },
      { path: 'reports/new', element: <ReportFormPage /> },
      { path: 'reports/:id', element: <ItemDetailsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
