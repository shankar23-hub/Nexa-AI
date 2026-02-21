import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Cpu, Users, Briefcase, Shield } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xl">N</span>
          </div>
          <span className="text-2xl font-black tracking-tighter">NEXA</span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/login" className="text-sm font-medium hover:text-green-500 transition-colors">Login</Link>
          <Link to="/create" className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-green-500 hover:text-black transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold uppercase tracking-widest mb-6">
              <Cpu size={14} />
              AI-Powered Management
            </div>
            <h1 className="text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              NEXT GEN <br />
              <span className="text-green-500 neon-text">IT SOLUTIONS.</span>
            </h1>
            <p className="text-xl text-white/60 max-w-lg mb-10 leading-relaxed">
              NEXA is a high-performance management portal designed for modern IT companies. 
              Automate project distribution, track staff performance, and scale with AI.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/create" className="px-8 py-4 bg-green-500 text-black rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                Launch Portal <ChevronRight size={20} />
              </Link>
              <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all">
                View Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 glass rounded-3xl p-8 border-white/10 shadow-2xl animate-float">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-xs text-white/40 font-mono">NEXA_DASHBOARD_V1.0</div>
              </div>
              <div className="space-y-6">
                <div className="h-4 w-3/4 bg-white/10 rounded-full" />
                <div className="h-4 w-1/2 bg-white/10 rounded-full" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-20 bg-green-500/20 rounded-2xl border border-green-500/30" />
                  <div className="h-20 bg-blue-500/20 rounded-2xl border border-blue-500/30" />
                  <div className="h-20 bg-purple-500/20 rounded-2xl border border-purple-500/30" />
                </div>
                <div className="h-32 bg-white/5 rounded-2xl border border-white/10" />
              </div>
            </div>
            {/* Decorative 3D elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: Users, title: "Staff Profiling", desc: "Detailed tracking of skills, experience, and availability." },
            { icon: Briefcase, title: "Real-time Projects", desc: "Live status updates and member allocation tracking." },
            { icon: Shield, title: "Secure Portal", desc: "Enterprise-grade security for your company data." }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-all group"
            >
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4">{f.title}</h3>
              <p className="text-white/40 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-sm">N</span>
            </div>
            <span className="text-xl font-black tracking-tighter">NEXA</span>
          </div>
          <div className="text-white/40 text-sm">
            © 2026 NEXA IT Solutions. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
