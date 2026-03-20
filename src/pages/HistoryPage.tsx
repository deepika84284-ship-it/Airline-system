import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Booking } from '../types';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Plane, Calendar, MapPin, XCircle, CheckCircle } from 'lucide-react';

export default function HistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!auth.currentUser) return;
      const q = query(collection(db, 'bookings'), where('userId', '==', auth.currentUser.uid));
      const snap = await getDocs(q);
      const results = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      // Sort by date descending
      setBookings(results.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()));
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const handleCancel = async (booking: Booking) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await updateDoc(doc(db, 'bookings', booking.id), {
        status: 'cancelled'
      });

      await updateDoc(doc(db, 'flights', booking.flightId), {
        availableSeats: increment(1)
      });

      setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">My Bookings</h2>
          <p className="text-slate-500">View and manage your flight reservations</p>
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden"
            >
              <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {booking.status === 'confirmed' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Status</p>
                    <p className={`font-bold capitalize ${
                      booking.status === 'confirmed' ? 'text-emerald-600' : 'text-red-600'
                    }`}>{booking.status}</p>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center gap-8">
                  <div className="text-center">
                    <p className="text-lg font-bold">{booking.flightDetails.source}</p>
                    <div className="flex items-center gap-1 text-slate-400 text-xs justify-center">
                      <MapPin size={12} />
                      <span>Origin</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Plane size={16} className="text-slate-300" />
                    <div className="w-16 h-[1px] bg-slate-200"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{booking.flightDetails.destination}</p>
                    <div className="flex items-center gap-1 text-slate-400 text-xs justify-center">
                      <MapPin size={12} />
                      <span>Destination</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 min-w-[250px] justify-end">
                  <div className="text-right">
                    <p className="font-bold">{booking.flightDetails.airline}</p>
                    <p className="text-slate-500 text-sm flex items-center gap-1 justify-end">
                      <Calendar size={14} />
                      {booking.flightDetails.departureTime && format(new Date(booking.flightDetails.departureTime), 'MMM d, yyyy')}
                    </p>
                  </div>
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancel(booking)}
                      className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-all border border-red-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-3 flex justify-between items-center text-xs text-slate-500 border-t border-slate-100">
                <span>Booked on: {format(new Date(booking.bookingDate), 'PPP p')}</span>
                <span>Passenger: <span className="font-bold text-slate-700">{booking.passengerName}</span> (Seat {booking.seatNumber})</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-lg">You haven't made any bookings yet.</p>
        </div>
      )}
    </div>
  );
}
