import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { BrowsePage } from './pages/BrowsePage';
import './App.css';

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Campus Lost & Found
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Browse
            </Link>
            <Link to="/report" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Report Item
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<BrowsePage />} />
            <Route path="/items/:id" element={<div className="p-8 text-center text-gray-500">Item Details Page - Coming Soon</div>} />
            <Route path="/report" element={<div className="p-8 text-center text-gray-500">Report Form Page - Coming Soon</div>} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-100 py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
            Campus Lost & Found Portal - SE3090 Mini Hackathon
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
