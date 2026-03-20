import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Booking } from '../types';
import { motion } from 'framer-motion';
import { CheckCircle, Plane, Calendar, User, Armchair, Download, Home } from 'lucide-react';
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

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
      >
        <div className="bg-emerald-500 p-12 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={48} />
          </motion.div>
          <h2 className="text-4xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-emerald-50 opacity-90">Your ticket has been issued successfully.</p>
        </div>

        <div className="p-12 space-y-10">
          <div className="flex justify-between items-start border-b border-slate-100 pb-8">
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Booking ID</p>
              <p className="text-xl font-mono font-bold text-slate-900">{booking.id.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Status</p>
              <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold uppercase">
                {booking.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <Plane size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Flight</p>
                  <p className="font-bold">{booking.flightDetails.airline} - {booking.flightDetails.flightNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Departure</p>
                  <p className="font-bold">
                    {booking.flightDetails.departureTime && format(new Date(booking.flightDetails.departureTime), 'PPP p')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Passenger</p>
                  <p className="font-bold">{booking.passengerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <Armchair size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Seat</p>
                  <p className="font-bold">{booking.seatNumber}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold">{booking.flightDetails.source}</p>
                <p className="text-xs text-slate-400 font-bold uppercase">Origin</p>
              </div>
              <div className="flex-1 w-20 h-[2px] bg-slate-200 relative">
                <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300" size={16} />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{booking.flightDetails.destination}</p>
                <p className="text-xs text-slate-400 font-bold uppercase">Destination</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-indigo-600">${booking.flightDetails.price}</p>
              <p className="text-xs text-slate-400 font-bold uppercase">Paid</p>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <Download size={20} />
              Download Ticket
            </button>
            <Link to="/" className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
              <Home size={20} />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
