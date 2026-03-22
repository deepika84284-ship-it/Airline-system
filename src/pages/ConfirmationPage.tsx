import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Booking } from '../types';
import { motion } from 'framer-motion';
import { CheckCircle, Plane, Calendar, User, Home, Download, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function ConfirmationPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      const docRef = doc(db, 'bookings', bookingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBooking({ id: docSnap.id, ...docSnap.data() } as Booking);
      }
      setLoading(false);
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
    </div>
  );

  if (!booking) return (
    <div className="glass-dark rounded-2xl p-12 text-center">
      <p className="text-slate-400 text-lg">Booking not found.</p>
      <Link to="/" className="text-indigo-400 mt-4 inline-block hover:underline">Go Home</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Celebration rings */}
      <div className="relative">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3 + i, opacity: 0 }}
            transition={{ duration: 1.2, delay: i * 0.2, ease: 'easeOut' }}
            className="absolute inset-0 flex items-start justify-center pt-8 pointer-events-none"
          >
            <div className="w-16 h-16 rounded-full border-2 border-emerald-400/40" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="glass-dark rounded-3xl overflow-hidden shadow-2xl glow-card"
      >
        {/* Success Header */}
        <div className="relative px-8 py-12 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0f766e 100%)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-40 h-40 bg-emerald-200 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-teal-200 rounded-full blur-2xl" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, delay: 0.3 }}
            className="relative w-20 h-20 bg-emerald-400/20 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-400/30"
          >
            <CheckCircle size={44} className="text-emerald-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-black text-white mb-2"
          >
            Booking Confirmed! 🎉
          </motion.h2>
          <p className="text-emerald-200 opacity-80">Your ticket has been issued successfully</p>
        </div>

        {/* Boarding Pass Card */}
        <div className="mx-6 -mt-4 relative">
          {/* Ticket tear line */}
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-5 h-5 rounded-full bg-slate-950 -ml-8" />
            <div className="flex-1 border-t-2 border-dashed border-slate-700" />
            <div className="w-5 h-5 rounded-full bg-slate-950 -mr-8" />
          </div>
          <div className="glass-dark rounded-2xl p-6 -mt-3">
            {/* Booking ID + Status */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Booking Reference</p>
                <p className="text-lg font-mono font-black text-white">{booking.id.substring(0, 8).toUpperCase()}</p>
              </div>
              <span className="badge-confirmed px-4 py-1.5 rounded-full text-sm font-bold uppercase">
                {booking.status}
              </span>
            </div>

            {/* Route */}
            <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl" style={{ background: 'rgba(99,102,241,0.08)' }}>
              <div className="text-center flex-1">
                <p className="text-3xl font-black text-white">{booking.flightDetails.source}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Departure</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Plane size={20} className="text-indigo-400" style={{ transform: 'rotate(45deg)' }} />
                <div className="w-16 h-px bg-indigo-500/30" />
                <p className="text-xs text-slate-500">{booking.flightDetails.airline}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-3xl font-black text-white">{booking.flightDetails.destination}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Arrival</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Calendar, label: 'Departure', value: booking.flightDetails.departureTime ? format(new Date(booking.flightDetails.departureTime), 'dd MMM yyyy') : '—' },
                { icon: Clock, label: 'Time', value: booking.flightDetails.departureTime ? format(new Date(booking.flightDetails.departureTime), 'HH:mm') : '—' },
                { icon: User, label: 'Passenger', value: booking.passengerName },
                { icon: MapPin, label: 'Seat', value: booking.seatNumber },
              ].map((item, i) => (
                <div key={i} className="glass rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <item.icon size={12} className="text-indigo-400" />
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{item.label}</p>
                  </div>
                  <p className="text-white font-bold text-sm truncate">{item.value}</p>
                </div>
              ))}
            </div>

            {/* QR placeholder + Price */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
              <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600">
                <div className="grid grid-cols-3 gap-0.5">
                  {Array.from({length: 9}).map((_,i) => (
                    <div key={i} className={`w-5 h-5 rounded-sm ${Math.random() > 0.4 ? 'bg-slate-400' : 'bg-transparent'}`} />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Amount Paid</p>
                <p className="text-4xl font-black text-white">${booking.flightDetails.price}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 p-6 mt-2">
          <button className="flex-1 glass border border-white/10 text-slate-300 py-3.5 rounded-xl font-semibold hover:bg-white/5 transition-all flex items-center justify-center gap-2">
            <Download size={18} />
            Download Ticket
          </button>
          <Link
            to="/"
            className="flex-1 btn-shimmer text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
