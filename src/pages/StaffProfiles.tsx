import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Languages, 
  User as UserIcon,
  X,
  Upload,
  Loader2,
  ChevronDown,
  Trash2,
  Calendar,
  Briefcase,
  Home
} from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import { Staff } from '../types';

export default function StaffProfiles() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [formData, setFormData] = useState<Staff>({
    name: '',
    email: '',
    mobile: '',
    degree: '',
    skills: '',
    languages: '',
    father_name: '',
    mother_name: '',
    country: '',
    state: '',
    city: '',
    address: '',
    pincode: '',
    image: ''
  });

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    try {
      const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedStaff?.id === id) setSelectedStaff(null);
        // Optimistic update for immediate feedback
        setStaff(prev => prev.filter(s => s.id !== id));
        fetchStaff(); // Sync with server
      } else {
        const data = await res.json();
        alert('Error: ' + (data.message || 'Failed to delete'));
      }
    } catch (err) {
      console.error(err);
      alert('Network error occurred');
    }
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.isoCode === countryCode);
    setFormData({ ...formData, country: country?.name || '', state: '', city: '' });
    setStates(State.getStatesOfCountry(countryCode));
    setCities([]);
  };

  const handleStateChange = (stateCode: string) => {
    const country = countries.find(c => c.name === formData.country);
    const state = states.find(s => s.isoCode === stateCode);
    setFormData({ ...formData, state: state?.name || '', city: '' });
    if (country) {
      setCities(City.getCitiesOfState(country.isoCode, stateCode));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchStaff();
        setFormData({
          name: '', email: '', mobile: '', degree: '', skills: '', languages: '',
          father_name: '', mother_name: '', country: '', state: '', city: '',
          address: '', pincode: '', image: ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">Staff Profiles</h2>
          <p className="text-text-muted">Manage and view all NEXA team members.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-accent text-black font-black rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]"
        >
          <Plus size={20} /> Add New Staff
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-glass border border-glass-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent/50 transition-all"
        />
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <Loader2 className="animate-spin text-accent" size={40} />
          </div>
        ) : filteredStaff.length > 0 ? filteredStaff.map((person) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="glass rounded-3xl border-glass-border overflow-hidden card-3d group relative"
          >
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                console.log('Delete clicked for ID:', person.id);
                handleDelete(person.id!); 
              }}
              className="absolute top-4 right-4 z-20 p-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all shadow-xl border border-red-400 flex items-center justify-center"
              title="Delete Staff"
            >
              <Trash2 size={20} />
            </button>

            <div className="h-32 bg-gradient-to-r from-accent/20 to-blue-500/20 relative">
              <div className="absolute -bottom-12 left-6">
                <div className="w-24 h-24 rounded-2xl border-4 border-bg overflow-hidden bg-glass shadow-xl">
                  {person.image ? (
                    <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted/20">
                      <UserIcon size={40} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-16 p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold group-hover:text-accent transition-colors">{person.name}</h3>
                <p className="text-sm text-text-muted">{person.degree}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-text-muted">
                  <Mail size={14} className="text-accent" />
                  <span className="truncate">{person.email}</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  <Phone size={14} className="text-accent" />
                  <span>{person.mobile}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted/50">Skills</div>
                <div className="flex flex-wrap gap-2">
                  {person.skills.split(',').map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-glass border border-glass-border rounded-lg text-[10px] font-medium">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-glass-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <MapPin size={12} />
                  {person.city}, {person.country}
                </div>
                <button 
                  onClick={() => setSelectedStaff(person)}
                  className="text-xs font-bold text-accent hover:underline"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center text-text-muted">
            No staff members found matching your search.
          </div>
        )}
      </div>

      {/* Full Profile Modal */}
      <AnimatePresence>
        {selectedStaff && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStaff(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass rounded-[40px] border-glass-border shadow-2xl"
            >
              {/* Header with Image */}
              <div className="h-64 bg-gradient-to-br from-accent/20 via-blue-500/10 to-purple-500/20 relative">
                <button 
                  onClick={() => setSelectedStaff(null)}
                  className="absolute top-6 right-6 p-3 bg-black/20 hover:bg-black/40 rounded-full transition-all z-10"
                >
                  <X size={24} />
                </button>
                
                <div className="absolute -bottom-20 left-12 flex items-end gap-8">
                  <div className="w-48 h-48 rounded-[40px] border-8 border-bg overflow-hidden bg-glass shadow-2xl">
                    {selectedStaff.image ? (
                      <img src={selectedStaff.image} alt={selectedStaff.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted/20">
                        <UserIcon size={80} />
                      </div>
                    )}
                  </div>
                  <div className="pb-4">
                    <h3 className="text-5xl font-black tracking-tighter mb-2">{selectedStaff.name}</h3>
                    <div className="flex items-center gap-4 text-accent font-bold">
                      <GraduationCap size={20} />
                      {selectedStaff.degree}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="pt-28 p-12 grid md:grid-cols-3 gap-12">
                {/* Left Column: Contact & Personal */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Contact Info</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-glass rounded-2xl border border-glass-border">
                        <Mail className="text-accent" size={18} />
                        <span className="text-sm font-medium">{selectedStaff.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-glass rounded-2xl border border-glass-border">
                        <Phone className="text-accent" size={18} />
                        <span className="text-sm font-medium">{selectedStaff.mobile}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Family Details</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-glass rounded-2xl border border-glass-border">
                        <div className="text-[10px] uppercase font-bold text-text-muted mb-1">Father's Name</div>
                        <div className="text-sm font-bold">{selectedStaff.father_name}</div>
                      </div>
                      <div className="p-4 bg-glass rounded-2xl border border-glass-border">
                        <div className="text-[10px] uppercase font-bold text-text-muted mb-1">Mother's Name</div>
                        <div className="text-sm font-bold">{selectedStaff.mother_name}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle Column: Skills & Languages */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Technical Arsenal</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStaff.skills.split(',').map((skill, idx) => (
                        <div key={idx} className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl text-xs font-bold text-accent">
                          {skill.trim()}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Communication</h4>
                    <div className="flex items-center gap-3 p-4 bg-glass rounded-2xl border border-glass-border">
                      <Languages className="text-accent" size={18} />
                      <span className="text-sm font-bold">{selectedStaff.languages}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Address */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Location</h4>
                  <div className="p-6 bg-glass rounded-[32px] border border-glass-border space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/10 rounded-2xl">
                        <MapPin className="text-accent" size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold mb-1">{selectedStaff.address}</div>
                        <div className="text-xs text-text-muted">{selectedStaff.city}, {selectedStaff.state}</div>
                        <div className="text-xs text-text-muted">{selectedStaff.country} - {selectedStaff.pincode}</div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-glass-border">
                      <div className="flex items-center gap-3 text-text-muted">
                        <Home size={16} />
                        <span className="text-xs font-bold">Primary Residence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Staff Modal */}
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
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass rounded-3xl border-glass-border p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black tracking-tighter">Add New Staff Member</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div className="md:col-span-2 flex justify-center mb-4">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl border-2 border-dashed border-glass-border flex flex-col items-center justify-center overflow-hidden bg-glass hover:border-accent/50 transition-all">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload className="text-text-muted/20 mb-2" size={32} />
                          <span className="text-[10px] font-bold text-text-muted/40 uppercase">Upload Photo</span>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Full Name</label>
                    <input required className="w-full bg-glass border border-glass-border rounded-xl p-3 outline-none focus:border-accent/50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Email Address</label>
                    <input type="email" required className="w-full bg-glass border border-glass-border rounded-xl p-3 outline-none focus:border-accent/50" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Mobile Number</label>
                    <input required className="w-full bg-glass border border-glass-border rounded-xl p-3 outline-none focus:border-accent/50" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Degree Qualification</label>
                    <input required className="w-full bg-glass border border-glass-border rounded-xl p-3 outline-none focus:border-accent/50" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Skills (Comma separated)</label>
                    <input required className="w-full bg-glass border border-glass-border rounded-xl p-3 outline-none focus:border-accent/50" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Languages</label>
                    <input required className="w-full bg-glass border border-glass-border rounded-xl p-3 outline-none focus:border-accent/50" value={formData.languages} onChange={e => setFormData({...formData, languages: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Father's Name</label>
                    <input required className="w-full bg-glass border border-glass-border rounded-xl p-3 outline-none focus:border-accent/50" value={formData.father_name} onChange={e => setFormData({...formData, father_name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Mother's Name</label>
                    <input required className="w-full bg-glass border border-glass-border rounded-xl p-3 outline-none focus:border-accent/50" value={formData.mother_name} onChange={e => setFormData({...formData, mother_name: e.target.value})} />
                  </div>
                </div>

                {/* Location */}
                <div className="md:col-span-2 grid md:grid-cols-3 gap-4 pt-4 border-t border-glass-border">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Country</label>
                    <select 
                      required 
                      className="w-full bg-glass border border-glass-border rounded-xl p-3 outline-none focus:border-accent/50 appearance-none"
                      onChange={e => handleCountryChange(e.target.value)}
                    >
                      <option value="">Select Country</option>
                      {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">State</label>
                    <select 
                      required 
                      className="w-full bg-glass border border-glass-border rounded-xl p-3 outline-none focus:border-accent/50 appearance-none"
                      onChange={e => handleStateChange(e.target.value)}
                      disabled={!states.length}
                    >
                      <option value="">Select State</option>
                      {states.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">City</label>
                    <select 
                      required 
                      className="w-full bg-glass border border-glass-border rounded-xl p-3 outline-none focus:border-accent/50 appearance-none"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      disabled={!cities.length}
                    >
                      <option value="">Select City</option>
                      {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Address</label>
                    <input required className="w-full bg-glass border border-glass-border rounded-xl p-3 outline-none focus:border-accent/50" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Pincode</label>
                    <input required className="w-full bg-glass border border-glass-border rounded-xl p-3 outline-none focus:border-accent/50" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                  </div>
                </div>

                <div className="md:col-span-2 pt-6">
                  <button type="submit" className="w-full bg-accent text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    Save Staff Member
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
