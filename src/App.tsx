import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfile } from './types';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import FlightSearchPage from './pages/FlightSearchPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import HistoryPage from './pages/HistoryPage';
import Navbar from './components/Navbar';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        {/* Animated logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent mb-6"
        />
        <div className="flex items-center gap-2">
          <Plane className="text-indigo-400" size={24} style={{ transform: 'rotate(45deg)' }} />
          <span className="text-xl font-bold gradient-text">SkyStream</span>
        </div>
        <p className="text-slate-500 text-sm mt-2">Preparing your journey...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen font-sans text-slate-100" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #0c1a2e 100%)' }}>
        <Navbar user={user} profile={profile} />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/search" element={<FlightSearchPage />} />
            <Route path="/book/:flightId" element={user ? <BookingPage /> : <Navigate to="/login" />} />
            <Route path="/confirmation/:bookingId" element={user ? <ConfirmationPage /> : <Navigate to="/login" />} />
            <Route path="/history" element={user ? <HistoryPage /> : <Navigate to="/login" />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 mt-20 py-10 text-center text-slate-600 text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Plane className="text-indigo-500" size={16} style={{ transform: 'rotate(45deg)' }} />
            <span className="text-slate-400 font-semibold">SkyStream</span>
          </div>
          <p>© 2026 SkyStream Airlines. All rights reserved.</p>
          <p className="mt-1">150+ destinations · 2M+ passengers · 98% on-time</p>
        </footer>
      </div>
    </Router>
  );
}
