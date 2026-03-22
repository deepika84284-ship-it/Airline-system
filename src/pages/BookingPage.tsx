import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Flight } from '../types';
import { motion } from 'framer-motion';
import { User, CreditCard, CheckCircle, ChevronRight, Plane, MapPin, Clock, Info } from 'lucide-react';
import { format } from 'date-fns';

const OCCUPIED = ['1B', '2D', '3A', '4C', '4E', '5F', '6B'];

function getDuration(dep: string, arr: string) {
  const diff = (new Date(arr).getTime() - new Date(dep).getTime()) / (1000 * 60);
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${h}h ${m > 0 ? m + 'm' : ''}`.trim();
}

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
      try {
        const docRef = doc(db, 'flights', flightId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFlight({ id: docSnap.id, ...docSnap.data() } as Flight);
        }
      } catch (_) {}
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
      try {
        await updateDoc(doc(db, 'flights', flight.id), { availableSeats: increment(-1) });
      } catch (_) {}
      navigate(`/confirmation/${docRef.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
    </div>
  );

  if (!flight) return (
    <div className="glass-dark rounded-2xl p-12 text-center">
      <p className="text-slate-400 text-lg">Flight not found.</p>
    </div>
  );

  const rows = ['1', '2', '3', '4', '5', '6'];
  const cols = ['A', 'B', 'C', '', 'D', 'E', 'F'];
  const taxes = 45;
  const total = flight.price + taxes;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">

        {/* Flight Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg flex-shrink-0">
            {flight.airline.split(' ').map((w) => w[0]).join('')}
          </div>
          <div className="flex-1">
            <p className="text-slate-400 text-xs uppercase tracking-widest">{flight.airline} · {flight.flightNumber}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-white font-bold">{flight.source}</span>
              <Plane size={16} className="text-indigo-400" style={{ transform: 'rotate(45deg)' }} />
              <span className="text-white font-bold">{flight.destination}</span>
            </div>
          </div>
          <div className="text-right text-sm text-slate-400">
            <p>{format(new Date(flight.departureTime), 'HH:mm')} → {format(new Date(flight.arrivalTime), 'HH:mm')}</p>
            <p className="flex items-center gap-1 justify-end"><Clock size={12} /> {getDuration(flight.departureTime, flight.arrivalTime)}</p>
          </div>
        </motion.div>

        {/* Passenger Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-dark rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-xl flex items-center justify-center"><User size={16} className="text-indigo-400" /></div>
            Passenger Details
          </h2>
          <form id="booking-form" onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Full Name (as per passport)</label>
              <input
                type="text"
                required
                value={passengerName}
                onChange={e => setPassengerName(e.target.value)}
                className="input-dark"
                placeholder="e.g. John David Smith"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Phone Number</label>
                <input type="tel" className="input-dark" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Nationality</label>
                <select className="input-dark" style={{ appearance: 'none' }}>
                  <option value="">Select nationality</option>
                  <option>Indian</option><option>American</option><option>British</option>
                  <option>Australian</option><option>Emirati</option><option>Singaporean</option>
                </select>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Seat Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-xl flex items-center justify-center"><MapPin size={16} className="text-indigo-400" /></div>
            Select Your Seat
          </h2>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-md bg-indigo-500/20 border border-indigo-500/40 inline-block" /> Available</span>
            <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-md bg-indigo-600 inline-block" /> Selected</span>
            <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-md bg-slate-700 inline-block opacity-60" /> Occupied</span>
          </div>

          {/* Plane nose */}
          <div className="flex justify-center mb-4">
            <div className="px-6 py-2 rounded-full glass text-slate-400 text-xs">✈ Front of Aircraft</div>
          </div>

          {/* Seat Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[320px] max-w-[400px] mx-auto">
              {/* Column labels */}
              <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {['A','B','C','','D','E','F'].map((col, i) => (
                  <div key={i} className="text-center text-xs text-slate-500 font-semibold">{col}</div>
                ))}
              </div>
              {rows.map(row => (
                <div key={row} className="grid gap-2 mb-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                  {['A','B','C','aisle','D','E','F'].map((col, i) => {
                    if (col === 'aisle') return <div key="aisle" className="flex items-center justify-center text-xs text-slate-600">{row}</div>;
                    const seat = `${row}${col}`;
                    const occupied = OCCUPIED.includes(seat);
                    const selected = selectedSeat === seat;
                    return (
                      <button
                        key={seat}
                        type="button"
                        disabled={occupied}
                        onClick={() => setSelectedSeat(selected ? '' : seat)}
                        className={`h-8 rounded-lg text-xs font-bold transition-all ${
                          occupied ? 'bg-slate-700/60 text-slate-600 cursor-not-allowed' :
                          selected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' :
                          'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30'
                        }`}
                      >
                        {!occupied && seat}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {selectedSeat && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
              <span className="glass px-4 py-2 rounded-xl text-indigo-300 text-sm font-semibold border border-indigo-500/30">
                ✓ Seat {selectedSeat} selected
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Payment Note */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-dark rounded-2xl p-6 flex items-start gap-3"
        >
          <Info size={18} className="text-indigo-400 mt-0.5 flex-shrink-0" />
          <p className="text-slate-400 text-sm leading-relaxed">
            <span className="text-white font-semibold">Demo Mode:</span> Payment is simulated. Clicking "Confirm Booking" will instantly confirm your reservation — no real payment is processed.
          </p>
        </motion.div>
      </div>

      {/* Fare Summary Sidebar */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-7 sticky top-24 glow-card"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', border: '1px solid rgba(99,102,241,0.3)' }}
        >
          <h3 className="text-lg font-bold text-white mb-6 pb-4 border-b border-white/10">Fare Summary</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Base Fare</span>
              <span className="text-white font-semibold">${flight.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Taxes & Fees</span>
              <span className="text-white font-semibold">${taxes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Seat Selection</span>
              <span className="text-emerald-400 font-semibold">Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Baggage (7kg)</span>
              <span className="text-emerald-400 font-semibold">Included</span>
            </div>
            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Total Amount</span>
                <span className="text-3xl font-black text-white">${total}</span>
              </div>
            </div>
          </div>

          <button
            form="booking-form"
            type="submit"
            disabled={booking || !selectedSeat || !passengerName}
            className="w-full mt-6 btn-shimmer text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {booking ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>Confirm Booking <ChevronRight size={18} /></>
            )}
          </button>

          {!selectedSeat && (
            <p className="text-center text-slate-500 text-xs mt-3">Please select a seat to continue</p>
          )}
          {!passengerName && selectedSeat && (
            <p className="text-center text-slate-500 text-xs mt-3">Please enter passenger name</p>
          )}
        </motion.div>

        {/* Security badge */}
        <div className="glass-dark rounded-xl p-4 flex items-center gap-3 text-slate-400 text-xs">
          <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
          Secure & encrypted booking. Cancel anytime before 24h of departure.
        </div>
      </div>
    </div>
  );
}
