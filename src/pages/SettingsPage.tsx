import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  HelpCircle, 
  MessageSquare, 
  RefreshCw, 
  Lock, 
  LogOut,
  ChevronRight,
  Globe,
  Palette
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SettingsPage({ isDark, setIsDark }: { isDark: boolean, setIsDark: (v: boolean) => void }) {
  const [accentColor, setAccentColor] = useState('Nexa Green');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  const handleAccentChange = () => {
    const colors = ['Nexa Green', 'Electric Blue', 'Cyber Purple', 'Neon Red'];
    const currentIndex = colors.indexOf(accentColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    const nextColor = colors[nextIndex];
    setAccentColor(nextColor);
    
    // Apply accent color to CSS variable
    const colorMap: Record<string, string> = {
      'Nexa Green': '#00FF00',
      'Electric Blue': '#00D1FF',
      'Cyber Purple': '#BC00FF',
      'Neon Red': '#FF003D'
    };
    document.documentElement.style.setProperty('--accent', colorMap[nextColor]);
  };

  const sections = [
    {
      title: 'Appearance',
      items: [
        { 
          icon: isDark ? Moon : Sun, 
          label: 'Dark Mode', 
          desc: 'Toggle between light and dark themes',
          action: () => setIsDark(!isDark),
          toggle: true,
          value: isDark
        },
        { 
          icon: Palette, 
          label: 'Accent Color', 
          desc: 'Customize the primary brand color',
          action: handleAccentChange,
          value: accentColor
        }
      ]
    },
    {
      title: 'Security & Account',
      items: [
        { 
          icon: Lock, 
          label: 'Password Change', 
          desc: 'Update your account security credentials',
          path: '/password-change'
        },
        { 
          icon: Shield, 
          label: 'Two-Factor Auth', 
          desc: 'Add an extra layer of security',
          toggle: true,
          value: false
        }
      ]
    },
    {
      title: 'Support & Feedback',
      items: [
        { 
          icon: RefreshCw, 
          label: 'Check for Updates', 
          desc: 'Current Version: v1.0.4 (Stable)',
          action: () => alert('You are on the latest version.')
        },
        { 
          icon: MessageSquare, 
          label: 'Send Feedback', 
          desc: 'Help us improve the NEXA experience',
          action: () => setShowFeedback(true)
        },
        { 
          icon: HelpCircle, 
          label: 'Help Center', 
          desc: 'Browse documentation and tutorials',
          action: () => setShowHelp(true)
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black tracking-tighter">Settings</h2>
        <p className={cn(isDark ? "text-white/40" : "text-black/40")}>Configure your portal preferences and account security.</p>
      </div>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <div key={i} className="space-y-4">
            <h3 className={cn("text-xs font-bold uppercase tracking-widest ml-4", isDark ? "text-white/20" : "text-black/20")}>{section.title}</h3>
            <div className={cn("glass rounded-3xl border overflow-hidden", isDark ? "border-white/10" : "border-black/10")}>
              {section.items.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => item.path ? navigate(item.path) : item.action?.()}
                  className={cn(
                    "flex items-center justify-between p-6 transition-all cursor-pointer group",
                    isDark ? "hover:bg-white/5" : "hover:bg-black/5",
                    idx !== section.items.length - 1 && (isDark ? "border-b border-white/10" : "border-b border-black/10")
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-2xl transition-all",
                      isDark ? "bg-white/5 text-white/60 group-hover:text-green-500 group-hover:bg-green-500/10" : "bg-black/5 text-black/60 group-hover:text-green-600 group-hover:bg-green-600/10"
                    )}>
                      <item.icon size={24} />
                    </div>
                    <div>
                      <div className="font-bold">{item.label}</div>
                      <div className={cn("text-sm", isDark ? "text-white/40" : "text-black/40")}>{item.desc}</div>
                    </div>
                  </div>
                  
                  {item.toggle ? (
                    <div className={cn(
                      "w-12 h-6 rounded-full p-1 transition-all",
                      item.value ? "bg-green-500" : (isDark ? "bg-white/10" : "bg-black/10")
                    )}>
                      <div className={cn(
                        "w-4 h-4 bg-white rounded-full transition-all",
                        item.value ? "translate-x-6" : "translate-x-0"
                      )} />
                    </div>
                  ) : item.value ? (
                    <span className={cn("text-sm font-bold", isDark ? "text-green-500" : "text-green-600")}>{item.value}</span>
                  ) : (
                    <ChevronRight size={20} className={isDark ? "text-white/20" : "text-black/20"} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-8">
          <button 
            onClick={() => {
              localStorage.removeItem('nexa_user');
              window.location.href = '/';
            }}
            className={cn(
              "w-full flex items-center justify-center gap-2 p-6 glass rounded-3xl border font-bold transition-all",
              isDark ? "border-red-500/20 text-red-500 hover:bg-red-500/10" : "border-red-600/20 text-red-600 hover:bg-red-600/10"
            )}
          >
            <LogOut size={20} /> Logout from NEXA
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFeedback(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={cn("relative w-full max-w-lg glass rounded-3xl border p-8 shadow-2xl", isDark ? "border-white/10" : "border-black/10")}>
              <h3 className="text-2xl font-black tracking-tighter mb-4">Send Feedback</h3>
              <textarea rows={4} className={cn("w-full rounded-2xl p-4 outline-none border transition-all mb-4", isDark ? "bg-white/5 border-white/10 focus:border-green-500/50" : "bg-black/5 border-black/10 focus:border-green-600/50")} placeholder="Tell us what you think..." />
              <div className="flex gap-4">
                <button onClick={() => setShowFeedback(false)} className="flex-1 py-3 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
                <button onClick={() => { alert('Feedback sent!'); setShowFeedback(false); }} className="flex-1 py-3 rounded-xl font-bold bg-green-500 text-black hover:scale-[1.02] transition-all">Submit</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowHelp(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={cn("relative w-full max-w-lg glass rounded-3xl border p-8 shadow-2xl", isDark ? "border-white/10" : "border-black/10")}>
              <h3 className="text-2xl font-black tracking-tighter mb-4">Help Center</h3>
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-bold mb-1">How to add staff?</div>
                  <div className="text-sm text-white/40">Go to Staff Profiles and click "Add New Staff".</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="font-bold mb-1">AI Project Distribution</div>
                  <div className="text-sm text-white/40">Paste your project description and click analyze.</div>
                </div>
              </div>
              <button onClick={() => setShowHelp(false)} className="w-full py-3 rounded-xl font-bold bg-green-500 text-black hover:scale-[1.02] transition-all">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
