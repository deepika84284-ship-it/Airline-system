import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Flight } from '../types';
import { motion } from 'framer-motion';
import { User, CreditCard, CheckCircle, Armchair, ChevronRight } from 'lucide-react';

export default function BookingPage() {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [passengerName, setPassengerName] = useState('');
  const [selectedSeat, setSelectedSeat] = useState('');
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchFlight = async () => {
      if (!flightId) return;
      const docRef = doc(db, 'flights', flightId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFlight({ id: docSnap.id, ...docSnap.data() } as Flight);
      }
      setLoading(false);
    };
    fetchFlight();
  }, [flightId]);

  const handleBooking = async (e: any) => {
    e.preventDefault();
    if (!flight || !auth.currentUser) return;
    setBooking(true);

    try {
      const bookingData = {
        userId: auth.currentUser.uid,
        flightId: flight.id,
        passengerName,
        seatNumber: selectedSeat,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
        flightDetails: {
          flightNumber: flight.flightNumber,
          airline: flight.airline,
          source: flight.source,
          destination: flight.destination,
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
          price: flight.price
        }
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      
      // Update available seats
      await updateDoc(doc(db, 'flights', flight.id), {
        availableSeats: increment(-1)
      });

      navigate(`/confirmation/${docRef.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div></div>;
  if (!flight) return <div>Flight not found</div>;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <User className="text-indigo-600" />
            Passenger Details
          </h2>
          <form id="booking-form" onSubmit={handleBooking} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600 ml-1">Full Name</label>
              <input
                type="text"
                required
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="As per passport"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-600 ml-1 flex items-center gap-2">
                <Armchair size={18} />
                Select Seat
              </label>
              <div className="grid grid-cols-6 gap-2">
                {['1A', '1B', '1C', '1D', '1E', '1F', '2A', '2B', '2C', '2D', '2E', '2F'].map((seat) => (
                  <button
                    key={seat}
                    type="button"
                    onClick={() => setSelectedSeat(seat)}
                    className={`py-2 rounded-lg text-sm font-bold transition-all ${
                      selectedSeat === seat
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {seat}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CreditCard className="text-indigo-600" />
            Payment Information
          </h2>
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
            <CheckCircle className="text-indigo-600 mt-1" size={20} />
            <p className="text-sm text-indigo-900 leading-relaxed">
              For this demo, payment is simulated. Clicking "Confirm Booking" will process your reservation immediately.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl sticky top-24"
        >
          <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Fare Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-slate-400">
              <span>Base Fare</span>
              <span className="text-white">${flight.price}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Taxes & Fees</span>
              <span className="text-white">$45</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Seat Selection</span>
              <span className="text-white">Free</span>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <div>
                <p className="text-sm text-slate-400">Total Amount</p>
                <p className="text-3xl font-bold text-indigo-400">${flight.price + 45}</p>
              </div>
            </div>
            <button
              form="booking-form"
              disabled={booking || !selectedSeat || !passengerName}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {booking ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  Confirm Booking
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
