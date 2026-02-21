import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, Send, Loader2, Sparkles, User as UserIcon, Briefcase } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Staff } from '../types';
import { analyzeProjectDistribution } from '../services/geminiService';

export default function AIProjectDistribution() {
  const [projectDescription, setProjectDescription] = useState('');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      const res = await fetch('/api/staff');
      setStaff(await res.json());
    };
    fetchStaff();
  }, []);

  const handleAnalyze = async () => {
    if (!projectDescription.trim()) return;
    setLoading(true);
    setAnalysis(null);
    
    const result = await analyzeProjectDistribution(projectDescription, staff);
    setAnalysis(result || "Analysis failed.");
    setLoading(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto border border-accent/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
          <Cpu className="text-accent" size={40} />
        </div>
        <h2 className="text-4xl font-black tracking-tighter">AI Project Distributor</h2>
        <p className="text-text-muted max-w-lg mx-auto">
          Input your project details and let NEXA AI analyze your staff skills to perfectly distribute tasks.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl border-glass-border p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted">
              <Briefcase size={14} /> Project Details
            </div>
            <textarea
              rows={8}
              placeholder="Describe the new project, its requirements, and key milestones..."
              className="w-full bg-glass border border-glass-border rounded-2xl p-4 outline-none focus:border-accent/50 transition-all resize-none"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !projectDescription.trim()}
              className="w-full bg-accent text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={20} /> Analyze & Distribute</>}
            </button>
          </div>

          <div className="glass rounded-3xl border-glass-border p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted">
              <Users size={14} /> Available Staff ({staff.length})
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {staff.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-glass rounded-xl border border-glass-border">
                  <div className="w-8 h-8 rounded-full bg-glass overflow-hidden">
                    {s.image ? <img src={s.image} className="w-full h-full object-cover" /> : <UserIcon size={14} className="m-auto mt-2" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{s.name}</span>
                    <span className="text-[10px] text-text-muted truncate max-w-[150px]">{s.skills}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-3">
          <div className="glass rounded-3xl border-glass-border p-8 min-h-[500px] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest rounded-full">
                AI Output
              </div>
            </div>

            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4 py-20">
                <Loader2 className="animate-spin text-accent" size={48} />
                <p className="text-text-muted animate-pulse">Analyzing project requirements and staff skills...</p>
              </div>
            ) : analysis ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-invert max-w-none prose-p:text-text-muted prose-headings:text-text-main prose-strong:text-accent prose-ul:text-text-muted"
              >
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                <div className="w-16 h-16 bg-glass rounded-full flex items-center justify-center text-text-muted/20">
                  <Cpu size={32} />
                </div>
                <div>
                  <h4 className="font-bold text-text-muted">Ready for Analysis</h4>
                  <p className="text-sm text-text-muted/20 max-w-xs mx-auto">
                    Fill in the project details and click analyze to see the AI's distribution plan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { Users } from 'lucide-react';
