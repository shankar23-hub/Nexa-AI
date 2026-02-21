import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PasswordChange() {
  const [formData, setFormData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/settings'), 2000);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto space-y-8 pt-12">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
          <Lock className="text-blue-500" size={32} />
        </div>
        <h2 className="text-3xl font-black tracking-tighter">Security Update</h2>
        <p className="text-white/40">Update your account password to maintain security.</p>
      </div>

      <div className="glass rounded-3xl border-white/10 p-8 shadow-2xl">
        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="text-green-500" size={32} />
            </div>
            <div className="font-bold text-green-500">Password Updated Successfully</div>
            <p className="text-sm text-white/40">Redirecting to settings...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Current Password</label>
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:border-blue-500/50 transition-all"
                placeholder="••••••••"
                value={formData.current}
                onChange={e => setFormData({...formData, current: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">New Password</label>
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:border-blue-500/50 transition-all"
                placeholder="••••••••"
                value={formData.new}
                onChange={e => setFormData({...formData, new: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">Confirm New Password</label>
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:border-blue-500/50 transition-all"
                placeholder="••••••••"
                value={formData.confirm}
                onChange={e => setFormData({...formData, confirm: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Update Password <ChevronRight size={20} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
