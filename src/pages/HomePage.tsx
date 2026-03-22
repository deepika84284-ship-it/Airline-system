import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Shield, Clock, Globe, ArrowRight, Star, Zap, TrendingUp, MapPin, Users } from 'lucide-react';

const destinations = [
  { city: 'Dubai', country: 'UAE', fare: '$299', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', code: 'DXB' },
  { city: 'Tokyo', country: 'Japan', fare: '$699', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80', code: 'NRT' },
  { city: 'Paris', country: 'France', fare: '$399', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', code: 'CDG' },
  { city: 'New York', country: 'USA', fare: '$449', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80', code: 'JFK' },
  { city: 'Singapore', country: 'Singapore', fare: '$549', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80', code: 'SIN' },
  { city: 'London', country: 'UK', fare: '$379', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80', code: 'LHR' },
  { city: 'Sydney', country: 'Australia', fare: '$799', img: 'https://images.unsplash.com/photo-1506374322094-6021fc3926f1?auto=format&fit=crop&w=600&q=80', code: 'SYD' },
  { city: 'Bangkok', country: 'Thailand', fare: '$389', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80', code: 'BKK' },
];

const deals = [
  { from: 'Mumbai', to: 'Dubai', price: 149, oldPrice: 280, airline: 'SkyStream', seats: 12, tag: 'Flash Sale' },
  { from: 'Delhi', to: 'Singapore', price: 289, oldPrice: 450, airline: 'BlueJet', seats: 5, tag: 'Hot Deal' },
  { from: 'Mumbai', to: 'London', price: 499, oldPrice: 720, airline: 'AirEagle', seats: 20, tag: 'Best Value' },
  { from: 'Chennai', to: 'Bangkok', price: 199, oldPrice: 350, airline: 'StarWings', seats: 8, tag: 'Limited' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Frequent Traveler', review: 'SkyStream made booking so easy! The interface is clean and I got my ticket in under 2 minutes. Absolutely love it!', rating: 5, avatar: 'PS' },
  { name: 'Rahul Mehta', role: 'Business Traveler', review: 'The best flight booking experience I\'ve had. Great deals and the seat selection is intuitive. Will use again!', rating: 5, avatar: 'RM' },
  { name: 'Aisha Khan', role: 'Travel Blogger', review: 'Found flights to Bangkok for an unbeatable price. The booking history page keeps everything organized. Highly recommend!', rating: 4, avatar: 'AK' },
];

const stats = [
  { value: '150+', label: 'Destinations', icon: Globe },
  { value: '2M+', label: 'Passengers', icon: Users },
  { value: '98%', label: 'On-Time', icon: Clock },
  { value: '4.9★', label: 'App Rating', icon: Star },
];

export default function HomePage() {
  return (
    <div className="space-y-24 pb-24">

      {/* ── Hero Section ── */}
      <section className="relative h-[90vh] min-h-[600px] rounded-3xl overflow-hidden -mt-8 mx-0">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=1920&q=80"
          alt="Airplane soaring through clouds"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Floating orbs */}
        <div className="absolute top-20 right-32 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-64 w-40 h-40 bg-purple-600/10 rounded-full blur-2xl animate-pulse" />

        <div className="absolute inset-0 flex items-center px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-8"
          >
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-indigo-300 border border-indigo-500/30"
            >
              <Zap size={14} className="text-yellow-400 fill-yellow-400" />
              Over 150 destinations. Best fares guaranteed.
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight text-white">
              Fly Beyond<br />
              <span className="gradient-text">Every Horizon</span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
              Book flights to 150+ destinations worldwide. Instant confirmation, unbeatable prices, and a seamless experience from search to landing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/search"
                className="btn-shimmer text-white px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all flex items-center gap-2 group glow-indigo"
              >
                <Search size={20} />
                Search Flights
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#destinations"
                className="glass border border-white/10 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <MapPin size={20} />
                Explore Destinations
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* ── Stats Bar ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-dark rounded-2xl p-6 text-center card-hover"
          >
            <stat.icon className="mx-auto mb-3 text-indigo-400" size={28} />
            <p className="text-3xl font-black text-white stat-number">{stat.value}</p>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* ── Popular Destinations ── */}
      <section id="destinations" className="space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-2">Where to next?</p>
            <h2 className="text-4xl font-black text-white">Popular Destinations</h2>
            <p className="text-slate-400 mt-2">Explore our most booked routes this month</p>
          </div>
          <Link to="/search" className="flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            View all routes <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.map((dest, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative h-72 rounded-2xl overflow-hidden cursor-pointer group shadow-xl"
            >
              <img
                src={dest.img}
                alt={dest.city}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Fare badge */}
              <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-xl text-white text-sm font-bold border border-white/10">
                From {dest.fare}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-300 font-semibold uppercase tracking-widest">{dest.code}</p>
                    <h3 className="text-2xl font-black text-white">{dest.city}</h3>
                    <p className="text-slate-300 text-sm">{dest.country}</p>
                  </div>
                  <Link
                    to="/search"
                    className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-500 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <ArrowRight size={16} className="text-white" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Trending Deals ── */}
      <section className="space-y-10">
        <div>
          <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-2">Limited Time</p>
          <h2 className="text-4xl font-black text-white flex items-center gap-3">
            <TrendingUp className="text-indigo-400" size={36} />
            Trending Deals
          </h2>
          <p className="text-slate-400 mt-2">Grab these offers before they fly away</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map((deal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-dark rounded-2xl p-6 card-hover relative overflow-hidden"
            >
              {/* Tag */}
              <span className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full ${
                deal.tag === 'Flash Sale' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                deal.tag === 'Hot Deal' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                deal.tag === 'Limited' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                'bg-green-500/20 text-green-300 border border-green-500/30'
              }`}>
                {deal.tag}
              </span>

              <div className="mb-4">
                <p className="text-slate-400 text-xs uppercase font-semibold tracking-widest">{deal.airline}</p>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <p className="text-slate-200 font-bold">{deal.from}</p>
                <ArrowRight size={14} className="text-indigo-400 flex-shrink-0" />
                <p className="text-slate-200 font-bold">{deal.to}</p>
              </div>

              <div className="flex items-end gap-2 mb-3">
                <p className="text-3xl font-black text-white">${deal.price}</p>
                <p className="text-slate-500 line-through text-sm mb-1">${deal.oldPrice}</p>
              </div>

              <p className="text-xs text-slate-500 mb-4">{deal.seats} seats left</p>

              <Link
                to="/search"
                className="w-full glass border border-indigo-500/30 text-indigo-300 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                Book Now <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="space-y-10">
        <div className="text-center">
          <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-2">Why Choose Us</p>
          <h2 className="text-4xl font-black text-white">The SkyStream Difference</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'Safe & Secure', desc: 'Your safety is our priority. International safety standards, every flight.', color: 'from-indigo-500 to-blue-600' },
            { icon: Clock, title: '98% On-Time', desc: 'We value your time. Industry-leading on-time arrival performance.', color: 'from-purple-500 to-indigo-600' },
            { icon: Globe, title: '150+ Destinations', desc: 'Connecting you to the world across 6 continents with seamless connectivity.', color: 'from-sky-500 to-cyan-600' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-dark rounded-2xl p-8 card-hover group"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <f.icon className="text-white" size={26} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="space-y-10">
        <div className="text-center">
          <p className="text-indigo-400 font-semibold text-sm uppercase tracking-widest mb-2">Travelers Love Us</p>
          <h2 className="text-4xl font-black text-white">What Our Passengers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-dark rounded-2xl p-8 card-hover"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 italic">"{t.review}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)' }}
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative px-8 py-16 text-center">
            <h2 className="text-4xl font-black text-white mb-4">Ready to Take Flight?</h2>
            <p className="text-indigo-200 text-lg mb-8 max-w-lg mx-auto">
              Search, compare and book flights to over 150 destinations. Sign up for exclusive deals.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-white text-indigo-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-2xl"
            >
              <Search size={20} />
              Find Your Flight
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
