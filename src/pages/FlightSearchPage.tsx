import { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Flight } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Calendar, ArrowRight, PlaneTakeoff, PlaneLanding, Filter, ChevronDown, Users, Clock, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const AIRPORTS = [
  { code: 'BOM', city: 'Mumbai', country: 'India', flag: '🇮🇳' },
  { code: 'DEL', city: 'Delhi', country: 'India', flag: '🇮🇳' },
  { code: 'MAA', city: 'Chennai', country: 'India', flag: '🇮🇳' },
  { code: 'BLR', city: 'Bengaluru', country: 'India', flag: '🇮🇳' },
  { code: 'DXB', city: 'Dubai', country: 'UAE', flag: '🇦🇪' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
  { code: 'LHR', city: 'London', country: 'UK', flag: '🇬🇧' },
  { code: 'JFK', city: 'New York', country: 'USA', flag: '🇺🇸' },
  { code: 'NRT', city: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { code: 'CDG', city: 'Paris', country: 'France', flag: '🇫🇷' },
  { code: 'SYD', city: 'Sydney', country: 'Australia', flag: '🇦🇺' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', flag: '🇹🇭' },
  { code: 'IST', city: 'Istanbul', country: 'Turkey', flag: '🇹🇷' },
  { code: 'YYZ', city: 'Toronto', country: 'Canada', flag: '🇨🇦' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', flag: '🇶🇦' },
];

const SAMPLE_FLIGHTS = [
  { flightNumber: 'SS101', airline: 'SkyStream', source: 'Mumbai', destination: 'Dubai', departureTime: '2026-04-20T06:00:00Z', arrivalTime: '2026-04-20T09:30:00Z', price: 149, availableSeats: 22, totalSeats: 180, stops: 0 },
  { flightNumber: 'SS202', airline: 'SkyStream', source: 'Delhi', destination: 'Singapore', departureTime: '2026-04-21T08:00:00Z', arrivalTime: '2026-04-21T18:30:00Z', price: 289, availableSeats: 8, totalSeats: 200, stops: 0 },
  { flightNumber: 'AE303', airline: 'AirEagle', source: 'Mumbai', destination: 'London', departureTime: '2026-04-22T23:00:00Z', arrivalTime: '2026-04-23T05:30:00Z', price: 499, availableSeats: 35, totalSeats: 250, stops: 0 },
  { flightNumber: 'BJ404', airline: 'BlueJet', source: 'Chennai', destination: 'Bangkok', departureTime: '2026-04-20T14:00:00Z', arrivalTime: '2026-04-20T20:00:00Z', price: 199, availableSeats: 60, totalSeats: 180, stops: 1 },
  { flightNumber: 'SW505', airline: 'StarWings', source: 'Mumbai', destination: 'Tokyo', departureTime: '2026-04-23T01:00:00Z', arrivalTime: '2026-04-23T14:00:00Z', price: 699, availableSeats: 15, totalSeats: 220, stops: 1 },
  { flightNumber: 'SS606', airline: 'SkyStream', source: 'Delhi', destination: 'Dubai', departureTime: '2026-04-24T10:30:00Z', arrivalTime: '2026-04-24T13:00:00Z', price: 189, availableSeats: 50, totalSeats: 180, stops: 0 },
  { flightNumber: 'AE707', airline: 'AirEagle', source: 'Bengaluru', destination: 'Singapore', departureTime: '2026-04-25T07:00:00Z', arrivalTime: '2026-04-25T14:30:00Z', price: 320, availableSeats: 30, totalSeats: 200, stops: 0 },
  { flightNumber: 'BJ808', airline: 'BlueJet', source: 'Mumbai', destination: 'Paris', departureTime: '2026-04-26T20:00:00Z', arrivalTime: '2026-04-27T01:30:00Z', price: 580, availableSeats: 12, totalSeats: 250, stops: 1 },
  { flightNumber: 'SW909', airline: 'StarWings', source: 'Delhi', destination: 'London', departureTime: '2026-04-27T22:00:00Z', arrivalTime: '2026-04-28T04:00:00Z', price: 540, availableSeats: 40, totalSeats: 220, stops: 0 },
  { flightNumber: 'SS010', airline: 'SkyStream', source: 'Chennai', destination: 'Dubai', departureTime: '2026-04-28T05:00:00Z', arrivalTime: '2026-04-28T08:00:00Z', price: 169, availableSeats: 75, totalSeats: 180, stops: 0 },
  { flightNumber: 'AE111', airline: 'AirEagle', source: 'Mumbai', destination: 'Sydney', departureTime: '2026-04-29T02:00:00Z', arrivalTime: '2026-04-29T22:00:00Z', price: 899, availableSeats: 5, totalSeats: 280, stops: 1 },
  { flightNumber: 'BJ212', airline: 'BlueJet', source: 'Bengaluru', destination: 'Bangkok', departureTime: '2026-04-30T11:00:00Z', arrivalTime: '2026-04-30T17:30:00Z', price: 249, availableSeats: 48, totalSeats: 200, stops: 0 },
];

const AIRLINE_COLORS: Record<string, string> = {
  'SkyStream': 'from-indigo-500 to-purple-600',
  'AirEagle': 'from-sky-500 to-blue-600',
  'BlueJet': 'from-cyan-500 to-teal-600',
  'StarWings': 'from-amber-500 to-orange-600',
};

function getDuration(dep: string, arr: string) {
  const diff = (new Date(arr).getTime() - new Date(dep).getTime()) / (1000 * 60);
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${h}h ${m > 0 ? m + 'm' : ''}`.trim();
}

interface AirportDropdownProps {
  value: string;
  onChange: (city: string) => void;
  placeholder: string;
  exclude?: string;
}

function AirportDropdown({ value, onChange, placeholder, exclude }: AirportDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = AIRPORTS.filter(a =>
    a.city !== exclude &&
    (a.city.toLowerCase().includes(search.toLowerCase()) ||
     a.code.toLowerCase().includes(search.toLowerCase()) ||
     a.country.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = AIRPORTS.find(a => a.city === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen(!open); setSearch(''); }}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all"
        style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.25)', color: '#e2e8f0' }}
      >
        <MapPin size={16} className="text-indigo-400 flex-shrink-0" />
        {selected ? (
          <span className="flex items-center gap-2 font-medium">
            <span>{selected.flag}</span>
            <span>{selected.city}</span>
            <span className="text-slate-500 text-sm">{selected.code}</span>
          </span>
        ) : (
          <span className="text-slate-500">{placeholder}</span>
        )}
        <ChevronDown size={14} className={`ml-auto text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.3)' }}
          >
            <div className="p-2">
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search city or code..."
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(99,102,241,0.2)', color: '#e2e8f0' }}
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.map(a => (
                <button
                  key={a.code}
                  type="button"
                  onClick={() => { onChange(a.city); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-500/10 transition-colors text-left"
                >
                  <span className="text-lg">{a.flag}</span>
                  <div>
                    <p className="text-slate-200 font-medium text-sm">{a.city}</p>
                    <p className="text-slate-500 text-xs">{a.code} · {a.country}</p>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-slate-500 py-4 text-sm">No airports found</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FlightSearchPage() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price');

  // Seed flights to Firebase
  useEffect(() => {
    const seed = async () => {
      const q = query(collection(db, 'flights'));
      const snap = await getDocs(q);
      if (snap.empty) {
        for (const f of SAMPLE_FLIGHTS) {
          await addDoc(collection(db, 'flights'), f);
        }
      }
    };
    seed();
  }, []);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      // Use local dummy data for instant results
      let results = SAMPLE_FLIGHTS.map((f, i) => ({ ...f, id: `local-${i}` })) as any[];

      if (source) results = results.filter(f => f.source.toLowerCase() === source.toLowerCase());
      if (destination) results = results.filter(f => f.destination.toLowerCase() === destination.toLowerCase());
      if (date) results = results.filter(f => f.departureTime.startsWith(date));

      // Also query Firestore
      try {
        let q = query(collection(db, 'flights'));
        if (source) q = query(q, where('source', '==', source));
        if (destination) q = query(q, where('destination', '==', destination));
        const snap = await getDocs(q);
        const dbFlights = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Flight));
        // Merge, avoiding duplicates
        const dbIds = new Set(dbFlights.map(f => f.flightNumber));
        const localUnique = results.filter((f: any) => !dbIds.has(f.flightNumber));
        results = [...dbFlights, ...localUnique];
      } catch (_) {}

      setFlights(results as Flight[]);
    } catch (err) {
      console.error(err);
      setFlights(SAMPLE_FLIGHTS.map((f, i) => ({ ...f, id: `local-${i}` })) as any[]);
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...flights].sort((a: any, b: any) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'duration') {
      return (new Date(a.arrivalTime).getTime() - new Date(a.departureTime).getTime()) -
             (new Date(b.arrivalTime).getTime() - new Date(b.departureTime).getTime());
    }
    return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
  });

  return (
    <div className="space-y-8">
      {/* Search Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark rounded-3xl p-8 shadow-2xl"
      >
        {/* Trip Type Toggle */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="text-indigo-400" size={24} />
            Find Your Flight
          </h2>
          <div className="ml-auto flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(15,23,42,0.6)' }}>
            {(['one-way', 'round-trip'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTripType(type)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                  tripType === type ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* From */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">From</label>
            <AirportDropdown value={source} onChange={setSource} placeholder="Origin city" exclude={destination} />
          </div>

          {/* To */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">To</label>
            <AirportDropdown value={destination} onChange={setDestination} placeholder="Destination city" exclude={source} />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Depart</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="input-dark pl-9"
              />
            </div>
          </div>

          {/* Passengers */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Passengers</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(99,102,241,0.25)' }}>
              <Users size={16} className="text-indigo-400" />
              <button type="button" onClick={() => setPassengers(Math.max(1, passengers - 1))} className="text-slate-400 hover:text-white w-5 h-5 flex items-center justify-center rounded">−</button>
              <span className="flex-1 text-center text-white font-semibold">{passengers}</span>
              <button type="button" onClick={() => setPassengers(Math.min(9, passengers + 1))} className="text-slate-400 hover:text-white w-5 h-5 flex items-center justify-center rounded">+</button>
            </div>
          </div>

          {/* Search button */}
          <div className="lg:col-span-5 flex justify-end">
            <button
              type="submit"
              className="btn-shimmer text-white px-10 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
            >
              <Search size={18} />
              Search Flights
            </button>
          </div>
        </form>
      </motion.div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4" />
          <p className="text-slate-400">Searching for the best flights...</p>
        </div>
      ) : flights.length > 0 ? (
        <div className="space-y-5">
          {/* Sort Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-slate-400">
              <span className="text-white font-bold">{sorted.length}</span> flights found
            </p>
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-slate-500" />
              <span className="text-slate-400 text-sm">Sort:</span>
              {(['price', 'duration', 'departure'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                    sortBy === s ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Flight Cards */}
          {sorted.map((flight: any, idx) => (
            <motion.div
              key={flight.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-dark rounded-2xl p-6 card-hover"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Airline */}
                <div className="flex items-center gap-3 min-w-[160px]">
                  <div className={`w-11 h-11 bg-gradient-to-br ${AIRLINE_COLORS[flight.airline] || 'from-indigo-500 to-purple-600'} rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg`}>
                    {flight.airline.split(' ').map((w: string) => w[0]).join('')}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{flight.airline}</p>
                    <p className="text-slate-500 text-xs">{flight.flightNumber}</p>
                  </div>
                </div>

                {/* Route */}
                <div className="flex-1 flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">{format(new Date(flight.departureTime), 'HH:mm')}</p>
                    <p className="text-slate-400 text-sm font-medium">{flight.source}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <p className="text-slate-500 text-xs font-medium">{getDuration(flight.departureTime, flight.arrivalTime)}</p>
                    <div className="relative w-full">
                      <div className="h-px bg-slate-600 w-full" />
                      <PlaneTakeoff size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400" />
                    </div>
                    <p className="text-slate-600 text-xs">{(flight as any).stops === 0 ? 'Non-stop' : `${(flight as any).stops} stop`}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">{format(new Date(flight.arrivalTime), 'HH:mm')}</p>
                    <p className="text-slate-400 text-sm font-medium">{flight.destination}</p>
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center gap-6 lg:ml-auto">
                  <div className="text-right">
                    <p className="text-3xl font-black text-white">${flight.price}</p>
                    <p className="text-slate-500 text-xs">per person</p>
                    <p className="text-xs mt-1">
                      <span className={flight.availableSeats < 15 ? 'text-red-400' : 'text-emerald-400'}>
                        {flight.availableSeats} seats left
                      </span>
                    </p>
                  </div>
                  <Link
                    to={`/book/${flight.id}`}
                    className="btn-shimmer text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2 whitespace-nowrap"
                  >
                    Select <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : searched ? (
        <div className="glass-dark rounded-3xl p-16 text-center">
          <div className="text-6xl mb-4">✈️</div>
          <p className="text-white text-xl font-bold mb-2">No flights found</p>
          <p className="text-slate-400 mb-6">Try different dates or locations.</p>
          <button onClick={() => { setSearched(false); setFlights([]); }} className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Clear Filters
          </button>
        </div>
      ) : (
        // Default: show all flights on load
        <div className="glass-dark rounded-3xl p-10 text-center">
          <div className="text-5xl mb-4 animate-float">🌍</div>
          <p className="text-white text-xl font-bold mb-2">Where would you like to go?</p>
          <p className="text-slate-400">Select your origin, destination, and date above to find flights.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['Mumbai → Dubai', 'Delhi → Singapore', 'Mumbai → London', 'Chennai → Bangkok'].map(route => (
              <button key={route} onClick={() => {
                const [src, dst] = route.split(' → ');
                setSource(src);
                setDestination(dst);
              }} className="glass px-4 py-2 rounded-full text-sm text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/10 transition-all">
                {route}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
