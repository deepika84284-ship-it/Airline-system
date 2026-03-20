import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Shield, Clock, Globe, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&w=1920&q=80"
          alt="Airplane in sky"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-transparent flex items-center px-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl text-white space-y-6"
          >
            <h1 className="text-6xl font-bold leading-tight">
              Fly Beyond Your <br />
              <span className="text-indigo-400">Imagination</span>
            </h1>
            <p className="text-xl text-slate-200 leading-relaxed">
              Experience luxury and comfort at 30,000 feet. Book your next journey with SkyStream and explore the world like never before.
            </p>
            <div className="flex gap-4 pt-4">
              <Link
                to="/search"
                className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 group"
              >
                Book a Flight
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <Shield className="text-indigo-600" size={32} />,
            title: "Safe & Secure",
            desc: "Your safety is our priority. We follow international safety standards for every flight."
          },
          {
            icon: <Clock className="text-indigo-600" size={32} />,
            title: "On-Time Arrival",
            desc: "We value your time. Our flights maintain a 98% on-time arrival record globally."
          },
          {
            icon: <Globe className="text-indigo-600" size={32} />,
            title: "Global Network",
            desc: "Connecting you to over 150 destinations across 6 continents with ease."
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Popular Destinations */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Popular Destinations</h2>
            <p className="text-slate-500">Explore our most booked routes this month</p>
          </div>
          <Link to="/search" className="text-indigo-600 font-semibold hover:underline">View all routes</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { city: "Paris", country: "France", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80" },
            { city: "Tokyo", country: "Japan", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80" },
            { city: "New York", country: "USA", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80" },
            { city: "London", country: "UK", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80" }
          ].map((dest, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-lg"
            >
              <img
                src={dest.img}
                alt={dest.city}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <h4 className="text-2xl font-bold">{dest.city}</h4>
                <p className="text-slate-300">{dest.country}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
