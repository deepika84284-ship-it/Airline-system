import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Booking } from '../types';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Plane, Calendar, MapPin, XCircle, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!auth.currentUser) return;
      const q = query(collection(db, 'bookings'), where('userId', '==', auth.currentUser.uid));
      const snap = await getDocs(q);
      const results = snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking));
      setBookings(results.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()));
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const handleCancel = async (booking: Booking) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await updateDoc(doc(db, 'bookings', booking.id), { status: 'cancelled' });
      await updateDoc(doc(db, 'flights', booking.flightId), { availableSeats: increment(1) });
      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'cancelled' } : b));
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
    </div>
  );

  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const totalSpent = confirmed.reduce((sum, b) => sum + (b.flightDetails?.price || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-2">Your Travel History</p>
          <h2 className="text-4xl font-black text-white">My Bookings</h2>
          <p className="text-slate-400 mt-1">View and manage your flight reservations</p>
        </div>
        <Link to="/search" className="btn-shimmer text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-all flex items-center gap-2">
          <Plane size={16} style={{ transform: 'rotate(45deg)' }} />
          Book New Flight
        </Link>
      </div>

      {/* Stats */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, label: 'Total Flights', value: bookings.length, color: 'from-indigo-500 to-purple-600' },
            { icon: CheckCircle, label: 'Confirmed', value: confirmed.length, color: 'from-emerald-500 to-teal-600' },
            { icon: DollarSign, label: 'Total Spent', value: `$${totalSpent}`, color: 'from-amber-500 to-orange-600' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-dark rounded-2xl p-5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking, idx) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="glass-dark rounded-2xl overflow-hidden card-hover"
            >
              <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Status icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  booking.status === 'confirmed' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  {booking.status === 'confirmed'
                    ? <CheckCircle size={22} className="text-emerald-400" />
                    : <XCircle size={22} className="text-red-400" />}
                </div>

                {/* Route */}
                <div className="flex-1 flex items-center gap-6">
                  <div className="text-center min-w-[80px]">
                    <p className="text-xl font-black text-white">{booking.flightDetails.source}</p>
                    <p className="text-slate-500 text-xs uppercase tracking-widest mt-0.5">From</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Plane size={16} className="text-indigo-400" style={{ transform: 'rotate(45deg)' }} />
                    <div className="w-12 h-px bg-slate-600" />
                  </div>
                  <div className="text-center min-w-[80px]">
                    <p className="text-xl font-black text-white">{booking.flightDetails.destination}</p>
                    <p className="text-slate-500 text-xs uppercase tracking-widest mt-0.5">To</p>
                  </div>
                </div>

                {/* Airline + Date */}
                <div className="flex flex-col items-start md:items-end gap-1 text-sm text-slate-400">
                  <p className="text-white font-semibold">{booking.flightDetails.airline}</p>
                  <p className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {booking.flightDetails.departureTime && format(new Date(booking.flightDetails.departureTime), 'dd MMM yyyy')}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    Seat {booking.seatNumber}
                  </p>
                </div>

                {/* Status badge & cancel */}
                <div className="flex items-center gap-3 ml-auto md:ml-0">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
                    booking.status === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'
                  }`}>
                    {booking.status}
                  </span>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(booking)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-xl transition-all text-xs font-semibold border border-red-500/20"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Footer strip */}
              <div className="bg-white/[0.02] border-t border-white/5 px-6 py-3 flex justify-between items-center text-xs text-slate-600">
                <span>Ref: <span className="text-slate-400 font-mono">{booking.id.substring(0, 8).toUpperCase()}</span></span>
                <span>Booked: {format(new Date(booking.bookingDate), 'dd MMM yyyy, p')}</span>
                <span className="text-white font-bold">${booking.flightDetails.price || '—'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-3xl p-16 text-center"
        >
          <div className="text-7xl mb-6 animate-float">✈️</div>
          <h3 className="text-2xl font-bold text-white mb-3">No bookings yet</h3>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">You haven't made any flight bookings yet. Explore our destinations and plan your next adventure!</p>
          <Link to="/search" className="btn-shimmer text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all inline-flex items-center gap-2">
            <Plane size={18} style={{ transform: 'rotate(45deg)' }} />
            Search Flights
          </Link>
        </motion.div>
      )}
    </div>
  );
}
