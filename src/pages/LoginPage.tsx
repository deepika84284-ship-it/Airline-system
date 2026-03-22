import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, LogIn, UserPlus, Plane, ArrowRight, AlertCircle } from 'lucide-react';

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    'auth/operation-not-allowed': '❌ Email/Password sign-in is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method.',
    'auth/invalid-credential': '❌ Incorrect email or password. Please try again.',
    'auth/user-not-found': '❌ No account found with this email. Please sign up first.',
    'auth/wrong-password': '❌ Incorrect password. Please try again.',
    'auth/email-already-in-use': '❌ This email is already registered. Please sign in instead.',
    'auth/weak-password': '❌ Password must be at least 6 characters.',
    'auth/invalid-email': '❌ Please enter a valid email address.',
    'auth/too-many-requests': '❌ Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': '❌ Network error. Please check your internet connection.',
    'auth/popup-closed-by-user': '❌ Sign-in popup was closed. Please try again.',
  };
  return map[code] || `❌ Sign-in failed (${code}). Please try again.`;
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: any) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          displayName: name,
          email: user.email,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(friendlyError(err.code || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(friendlyError(err.code || ''));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-5xl glass-dark rounded-3xl overflow-hidden shadow-2xl glow-card grid grid-cols-1 lg:grid-cols-2">

        {/* Left Panel — Image */}
        <div className="relative hidden lg:block h-full min-h-[600px]">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=800&q=80"
            alt="Sky view from airplane"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-indigo-950/60" />
          <div className="absolute inset-0 flex flex-col justify-between p-10">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Plane size={18} className="text-white" style={{ transform: 'rotate(45deg)' }} />
              </div>
              <span className="text-xl font-bold text-white">SkyStream</span>
            </div>

            {/* Tagline */}
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-white leading-tight">
                Your journey<br />starts here ✈️
              </h2>
              <p className="text-slate-300 max-w-xs">
                Book flights to 150+ destinations. Best fares, instant confirmation.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['🇮🇳 Mumbai', '🇦🇪 Dubai', '🇯🇵 Tokyo', '🇬🇧 London'].map(dest => (
                  <span key={dest} className="glass px-3 py-1.5 rounded-full text-white text-xs font-medium border border-white/10">
                    {dest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          {/* Tab Toggle */}
          <div className="flex gap-1 p-1 rounded-xl mb-8 w-full" style={{ background: 'rgba(15,23,42,0.6)' }}>
            {[
              { key: true, label: 'Sign In', icon: LogIn },
              { key: false, label: 'Register', icon: UserPlus },
            ].map(tab => (
              <button
                key={String(tab.key)}
                onClick={() => { setIsLogin(tab.key); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isLogin === tab.key
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Title */}
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white">
                  {isLogin ? 'Welcome back 👋' : 'Create account'}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {isLogin ? 'Sign in to manage your bookings' : 'Join SkyStream for exclusive flight deals'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="input-dark pl-10"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input-dark pl-10"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="input-dark pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-shimmer text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-2">
                <div className="absolute w-full h-px bg-white/10" />
                <span className="relative bg-slate-900 px-4 text-xs text-slate-500 uppercase tracking-widest">
                  or continue with
                </span>
              </div>

              {/* Google */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full glass border border-white/10 py-3.5 rounded-xl font-semibold text-slate-300 hover:bg-white/5 transition-all flex items-center justify-center gap-3"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>

              <p className="text-center text-slate-500 text-sm pt-2">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
