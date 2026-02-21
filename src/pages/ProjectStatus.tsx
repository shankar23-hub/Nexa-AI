import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  User as UserIcon,
  X,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { Staff, Project } from '../types';

export default function ProjectStatus() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    head_id: '',
    completion_date: '',
    member_ids: [] as number[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/staff')
      ]);
      setProjects(await pRes.json());
      setStaff(await sRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        // Optimistic update
        setProjects(prev => prev.filter(p => p.id !== id));
        fetchData();
      } else {
        const data = await res.json();
        alert('Error: ' + (data.message || 'Failed to delete'));
      }
    } catch (err) {
      console.error(err);
      alert('Network error occurred');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          head_id: parseInt(formData.head_id),
          member_ids: formData.member_ids
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
        setFormData({ name: '', description: '', head_id: '', completion_date: '', member_ids: [] });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMember = (id: number) => {
    setFormData(prev => ({
      ...prev,
      member_ids: prev.member_ids.includes(id) 
        ? prev.member_ids.filter(m => m !== id)
        : [...prev.member_ids, id]
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Project Status</h2>
          <p className="text-text-muted">Track progress and manage team allocations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-accent text-black font-black rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]"
        >
          <Plus size={20} /> Create New Project
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="animate-spin text-accent" size={40} />
          </div>
        ) : projects.length > 0 ? projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="glass rounded-3xl border-glass-border p-8 space-y-6 card-3d group relative"
          >
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                handleDelete(project.id!); 
              }}
              className="absolute top-4 right-4 z-20 p-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all shadow-xl border border-red-400 flex items-center justify-center"
              title="Delete Project"
            >
              <Trash2 size={20} />
            </button>

            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight group-hover:text-accent transition-colors">{project.name}</h3>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <UserIcon size={14} className="text-accent" />
                  <span>Project Head: <span className="text-text-main font-bold">{project.head_name || 'Unassigned'}</span></span>
                </div>
              </div>
              <div className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                project.status === 'Completed' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
              )}>
                {project.status}
              </div>
            </div>

            <p className="text-text-muted leading-relaxed">{project.description}</p>

            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted/50">Team Members ({project.members?.length || 0})</div>
                <div className="flex -space-x-3">
                  {project.members?.slice(0, 5).map((m, idx) => (
                    <div key={idx} className="w-10 h-10 rounded-full border-2 border-bg bg-glass overflow-hidden" title={m.name}>
                      {m.image ? <img src={m.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><UserIcon size={16} /></div>}
                    </div>
                  ))}
                  {(project.members?.length || 0) > 5 && (
                    <div className="w-10 h-10 rounded-full border-2 border-bg bg-glass flex items-center justify-center text-[10px] font-bold">
                      +{(project.members?.length || 0) - 5}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted/50">Completion Date</div>
                <div className="flex items-center gap-3 p-3 bg-glass border border-glass-border rounded-2xl">
                  <Calendar size={18} className="text-accent" />
                  <span className="font-mono font-bold">{project.completion_date}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-glass-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock size={14} />
                  <span>2 weeks left</span>
                </div>
              </div>
              <button className="px-6 py-2 bg-glass border border-glass-border rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                Project Details
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center text-text-muted">
            No projects found. Start by creating a new one.
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-3xl border-white/10 p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black tracking-tighter">Create New Project</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Project Name</label>
                  <input required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-green-500/50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Description</label>
                  <textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-green-500/50" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Project Head</label>
                    <select required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-green-500/50" value={formData.head_id} onChange={e => setFormData({...formData, head_id: e.target.value})}>
                      <option value="">Select Head</option>
                      {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Completion Date</label>
                    <input type="date" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-green-500/50" value={formData.completion_date} onChange={e => setFormData({...formData, completion_date: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Assign Members</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-white/5 rounded-xl border border-white/10">
                    {staff.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleMember(s.id!)}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg text-sm transition-all",
                          formData.member_ids.includes(s.id!) ? "bg-green-500/20 text-green-500 border border-green-500/30" : "hover:bg-white/5"
                        )}
                      >
                        <div className="w-6 h-6 rounded-full bg-white/10 overflow-hidden">
                          {s.image ? <img src={s.image} className="w-full h-full object-cover" /> : <UserIcon size={12} className="m-auto" />}
                        </div>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" className="w-full bg-green-500 text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    Launch Project
                  </button>
                </div>
              </form>
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
