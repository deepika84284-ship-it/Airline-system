import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Flight } from '../types';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Users, ArrowRight, PlaneTakeoff, PlaneLanding } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function FlightSearchPage() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Seed data if no flights exist (for demo purposes)
  useEffect(() => {
    const checkAndSeed = async () => {
      const q = query(collection(db, 'flights'));
      const snap = await getDocs(q);
      if (snap.empty) {
        const sampleFlights = [
          { flightNumber: "SS101", airline: "SkyStream", source: "New York", destination: "London", departureTime: "2026-04-20T10:00:00Z", arrivalTime: "2026-04-20T22:00:00Z", price: 450, availableSeats: 120, totalSeats: 150 },
          { flightNumber: "SS202", airline: "SkyStream", source: "London", destination: "Paris", departureTime: "2026-04-21T08:00:00Z", arrivalTime: "2026-04-21T09:30:00Z", price: 120, availableSeats: 80, totalSeats: 100 },
          { flightNumber: "SS303", airline: "SkyStream", source: "Paris", destination: "Tokyo", departureTime: "2026-04-22T14:00:00Z", arrivalTime: "2026-04-23T09:00:00Z", price: 850, availableSeats: 200, totalSeats: 250 },
          { flightNumber: "SS404", airline: "SkyStream", source: "New York", destination: "Paris", departureTime: "2026-04-20T18:00:00Z", arrivalTime: "2026-04-21T06:00:00Z", price: 550, availableSeats: 50, totalSeats: 150 },
          { flightNumber: "SS505", airline: "SkyStream", source: "London", destination: "New York", departureTime: "2026-04-25T11:00:00Z", arrivalTime: "2026-04-25T14:00:00Z", price: 480, availableSeats: 100, totalSeats: 150 }
        ];
        for (const f of sampleFlights) {
          await addDoc(collection(db, 'flights'), f);
        }
      }
    };
    checkAndSeed();
  }, []);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      let q = query(collection(db, 'flights'));
      
      if (source) q = query(q, where('source', '==', source));
      if (destination) q = query(q, where('destination', '==', destination));

      const snap = await getDocs(q);
      const results = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Flight));
      
      // Client-side date filtering for simplicity in this demo
      const filtered = results.filter(f => {
        if (!date) return true;
        return f.departureTime.startsWith(date);
      });

      setFlights(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Search Header */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Search className="text-indigo-600" />
          Find Your Flight
        </h2>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-600 ml-1">From</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Source City"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-600 ml-1">To</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Destination City"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-600 ml-1">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Search Flights
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : flights.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {flights.map((flight) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-3xl shadow-md border border-slate-100 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      <PlaneTakeoff size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{flight.airline}</h3>
                      <p className="text-slate-500 text-sm">{flight.flightNumber}</p>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-center gap-12">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{format(new Date(flight.departureTime), 'HH:mm')}</p>
                      <p className="text-slate-500 font-medium">{flight.source}</p>
                    </div>
                    <div className="flex-1 max-w-[200px] relative flex items-center justify-center">
                      <div className="h-[2px] w-full bg-slate-200"></div>
                      <div className="absolute bg-white px-2">
                        <ArrowRight className="text-indigo-400" size={20} />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{format(new Date(flight.arrivalTime), 'HH:mm')}</p>
                      <p className="text-slate-500 font-medium">{flight.destination}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-3xl font-bold text-indigo-600">${flight.price}</p>
                      <p className="text-slate-400 text-sm">{flight.availableSeats} seats left</p>
                    </div>
                    <Link
                      to={`/book/${flight.id}`}
                      className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                      Select
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : searched ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">No flights found matching your criteria.</p>
            <button onClick={() => setSearched(false)} className="text-indigo-600 font-bold mt-2 hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-lg">Enter your travel details to search for flights.</p>
          </div>
        )}
      </div>
    </div>
  );
}
