import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import BrowsePage from './pages/BrowsePage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import ReportFormPage from './pages/ReportFormPage';

/**
 * Central route configuration. The root route renders <Layout /> which
 * mounts the Navbar and an <Outlet /> for the active child. Pages marked
 * as placeholders (BrowsePage, ReportFormPage) are owned by Members 2 & 3
 * and will be replaced without touching the router.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <BrowsePage /> },
      { path: 'reports/new', element: <ReportFormPage /> },
      { path: 'reports/:id', element: <ItemDetailsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
