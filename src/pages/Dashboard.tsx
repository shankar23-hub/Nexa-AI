import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Staff, Project } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStaff: 0,
    activeProjects: 0,
    completionRate: 85,
    uptime: '99.9%'
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, projectsRes] = await Promise.all([
          fetch('/api/staff'),
          fetch('/api/projects')
        ]);
        const staff = await staffRes.json();
        const projects = await projectsRes.json();
        
        setStats({
          totalStaff: staff.length,
          activeProjects: projects.filter((p: Project) => p.status !== 'Completed').length,
          completionRate: 85,
          uptime: '99.9%'
        });
        setRecentProjects(projects.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Staff', value: stats.totalStaff, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12%' },
    { label: 'Active Projects', value: stats.activeProjects, icon: Briefcase, color: 'text-green-500', bg: 'bg-green-500/10', trend: '+5%' },
    { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: '+2%' },
    { label: 'System Uptime', value: stats.uptime, icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10', trend: 'Stable' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">System Overview</h2>
          <p className="text-text-muted">Real-time performance metrics for NEXA IT Solutions.</p>
        </div>
        <div className="flex items-center gap-2 bg-glass border border-glass-border rounded-full px-4 py-2 text-sm">
          <Clock size={16} className="text-accent" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 glass rounded-3xl border-glass-border card-3d group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-3 rounded-2xl", stat.bg)}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                stat.trend.startsWith('+') ? "bg-green-500/10 text-green-500" : "bg-glass text-text-muted"
              )}>
                {stat.trend.startsWith('+') ? <ArrowUpRight size={12} /> : null}
                {stat.trend}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-text-muted text-sm font-medium">{stat.label}</span>
              <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Tech & Health */}
        <div className="space-y-8">
          {/* Core Technologies */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Core Technologies</h3>
            <div className="glass rounded-3xl border-glass-border p-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'HTML5', color: 'text-orange-500' },
                  { name: 'CSS3', color: 'text-blue-500' },
                  { name: 'Java', color: 'text-red-500' },
                  { name: 'JavaScript', color: 'text-yellow-500' },
                  { name: 'Python', color: 'text-blue-400' },
                  { name: 'SQL', color: 'text-purple-500' },
                  { name: 'XML', color: 'text-orange-400' },
                  { name: 'Markdown', color: 'text-text-muted' }
                ].map((tech, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-glass rounded-xl border border-glass-border hover:border-accent/30 transition-all group">
                    <div className={cn("w-2 h-2 rounded-full", tech.color.replace('text-', 'bg-'))} />
                    <span className="text-sm font-bold">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold">System Health</h3>
            <div className="glass rounded-3xl border-glass-border p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">CPU Usage</span>
                  <span className="font-bold">24%</span>
                </div>
                <div className="h-2 bg-glass rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '24%' }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Memory</span>
                  <span className="font-bold">4.2GB / 16GB</span>
                </div>
                <div className="h-2 bg-glass rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '35%' }}
                    className="h-full bg-purple-500"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-glass-border">
                <div className="flex items-center gap-4 p-4 bg-accent/10 rounded-2xl border border-accent/20">
                  <Shield className="text-accent" size={24} />
                  <div>
                    <div className="text-sm font-bold text-accent">Security Active</div>
                    <div className="text-xs text-accent/60">All systems operational</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Projects */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent Projects</h3>
            <button className="text-sm text-accent font-bold hover:underline flex items-center gap-1">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="glass rounded-3xl border-glass-border overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-glass-border bg-glass">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Project Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Head</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Deadline</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {recentProjects.length > 0 ? recentProjects.map((project, i) => (
                  <tr key={i} className="hover:bg-glass transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="font-bold group-hover:text-accent transition-colors">{project.name}</div>
                      <div className="text-xs text-text-muted truncate max-w-[200px]">{project.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">{project.head_name || 'Unassigned'}</td>
                    <td className="px-6 py-4 text-sm font-mono">{project.completion_date}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        project.status === 'Completed' ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                      )}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-muted">No projects found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import { Shield } from 'lucide-react';
