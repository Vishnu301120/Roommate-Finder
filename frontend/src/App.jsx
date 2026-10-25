import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import RoommatesPage from './pages/RoommatesPage';
import PostListingPage from './pages/PostListingPage';
import ProfilePage from './pages/ProfilePage';
import ConnectionsPage from './pages/ConnectionsPage';
import ChatPage from './pages/ChatPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Scroll restoration helper
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <SocketProvider>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/listings" element={<ListingsPage />} />
                  <Route path="/listings/:id" element={<ListingDetailPage />} />
                  <Route path="/roommates" element={<RoommatesPage />} />
                  <Route path="/post-listing" element={<PostListingPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/connections" element={<ConnectionsPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </SocketProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
