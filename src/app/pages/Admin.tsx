import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Trash2, Plus, AlertCircle, LogOut, Home, Briefcase, FileText, Users,
  TrendingUp, Activity, CheckCircle, Search, Menu, X, ArrowUpRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { getJobs, addJob, deleteJob, updateJob, getApplications, getUsers, banUser, Job, Application, User } from '../store';
import { toast } from 'sonner';
import * as assets from '../assets';
import { TableSkeleton, Skeleton } from '../components/Skeleton';


export function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'applications' | 'users'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [jobsData, appsData, usersData] = await Promise.all([
        getJobs(),
        getApplications(),
        getUsers()
      ]);
      setJobs(jobsData);
      setApplications(appsData);
      setUsers(usersData);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const chartData = React.useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayApps = applications.filter(app => {
        if (!app.date) return false;
        const appDate = new Date(app.date);
        return appDate.getDate() === d.getDate() && appDate.getMonth() === d.getMonth() && appDate.getFullYear() === d.getFullYear();
      }).length;
      data.push({ name: dayStr, applications: dayApps });
    }
    return data;
  }, [applications]);

  const totalViews = React.useMemo(() => {
    return (jobs.length * 150) + (applications.length * 42);
  }, [jobs.length, applications.length]);
  const [viewingApp, setViewingApp] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '', company: '', location: '', description: '', tags: '', type: 'Full Time'
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        await deleteJob(id);
        await loadData();
        toast.success('Job deleted successfully');
      } catch (err) {
        toast.error('Error deleting job');
      }
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      tags: job.tags.join(', '),
      type: job.type
    });
    setIsAdding(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

    try {
      if (editingJob) {
        await updateJob({
          ...editingJob,
          title: formData.title,
          company: formData.company,
          location: formData.location,
          description: formData.description,
          tags: tagsArray.length > 0 ? tagsArray : ['General'],
          type: formData.type,
        });
        toast.success('Job updated successfully');
      } else {
        await addJob({
          title: formData.title,
          company: formData.company,
          location: formData.location,
          description: formData.description,
          tags: tagsArray.length > 0 ? tagsArray : ['General'],
          type: formData.type,
          logo: assets.imgCompany
        });
        toast.success('Job posted successfully');
      }

      await loadData();
      setIsAdding(false);
      setEditingJob(null);
      setFormData({ title: '', company: '', location: '', description: '', tags: '', type: 'Full Time' });
    } catch (err) {
      toast.error('Failed to save job');
    }
  };

  const handleBanUser = async (user: User) => {
    const id = user.id! || (user as any)._id;
    try {
      const result = await banUser(id);
      await loadData();
      toast.success(`User ${result.isBanned ? 'banned' : 'unbanned'} successfully`);
    } catch (err) {
      toast.error('Failed to change user status');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Job Listings', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-[#f8f8fd] flex flex-col md:flex-row font-['Epilogue',sans-serif]">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-[#D6DDEB] px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#4640DE] flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full relative">
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#4640DE] rounded-full translate-x-1/4 translate-y-1/4"></div>
            </div>
          </div>
          <span className="font-['Red_Hat_Display'] font-bold text-xl tracking-tight">QuickHire</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[#25324b]">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-[#D6DDEB] z-10 flex flex-col
        shadow-[4px_0_24px_rgba(0,0,0,0.02)]
      `}>
        <div className="hidden md:flex items-center gap-2 px-8 py-8">
          <div className="w-8 h-8 rounded-full bg-[#4640DE] flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full relative">
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#4640DE] rounded-full translate-x-1/4 translate-y-1/4"></div>
            </div>
          </div>
          <span className="font-['Red_Hat_Display'] font-bold text-2xl tracking-tight text-[#25324b]">QuickHire</span>
        </div>

        <div className="flex-1 px-4 py-6 md:py-0 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${activeTab === item.id
                  ? 'bg-[#4640DE]/10 text-[#4640DE]'
                  : 'text-[#515b6f] hover:bg-[#f8f8fd] hover:text-[#25324b]'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#D6DDEB] mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-semibold hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-6 lg:p-12 max-w-7xl mx-auto">

          {loading ? (
            <div className="space-y-8 animate-pulse">
              <div className="h-10 w-48 skeleton rounded-lg"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl"></div>)}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-[400px] skeleton rounded-2xl"></div>
                <div className="h-[400px] skeleton rounded-2xl"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h1 className="font-['Clash_Display',sans-serif] text-3xl font-semibold text-[#25324b]">Overview</h1>
                      <p className="text-[#515b6f]">Here is what's happening with your platform today.</p>
                    </div>
                    <button onClick={() => { setActiveTab('jobs'); setIsAdding(true) }} className="bg-[#4640DE] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#4640DE]/90 transition-all shadow-lg hover:shadow-[#4640DE]/30 flex items-center gap-2">
                      <Plus className="w-5 h-5" /> Post Job
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Active Jobs', value: jobs.length, icon: Briefcase, color: 'bg-blue-100 text-blue-600', trend: '+12%' },
                      { label: 'Total Applications', value: applications.length, icon: FileText, color: 'bg-indigo-100 text-[#4640DE]', trend: '+24%' },
                      { label: 'Registered Users', value: users.length, icon: Users, color: 'bg-purple-100 text-purple-600', trend: '+8%' },
                      { label: 'Total Views', value: totalViews.toLocaleString(), icon: Activity, color: 'bg-orange-100 text-orange-500', trend: '+15%' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-[#D6DDEB] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                            <stat.icon className="w-6 h-6" />
                          </div>
                          <span className="flex items-center text-sm font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
                            <TrendingUp className="w-3 h-3 mr-1" /> {stat.trend}
                          </span>
                        </div>
                        <p className="text-[#515b6f] font-medium text-sm mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-[#25324b]">{stat.value}</h3>
                      </div>
                    ))}
                  </div>

                  {/* Charts Area */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-[#D6DDEB] shadow-sm lg:col-span-2">
                      <h3 className="font-bold text-lg text-[#25324b] mb-6">Application Activity</h3>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs key="defs-grad">
                              <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4640DE" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#4640DE" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#7c8493', fontSize: 12 }} dy={10} />
                            <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fill: '#7c8493', fontSize: 12 }} />
                            <Tooltip
                              key="tooltip"
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                            />
                            <Area key="area" type="monotone" dataKey="applications" stroke="#4640DE" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-[#D6DDEB] shadow-sm flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-[#25324b]">Recent Applicants</h3>
                        <button onClick={() => setActiveTab('applications')} className="text-[#4640DE] text-sm font-semibold hover:underline">View All</button>
                      </div>
                      <div className="flex-1 flex flex-col gap-4">
                        {applications.slice(0, 4).map((app, i) => (
                          <div key={app.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#f8f8fd] transition-colors cursor-pointer border border-transparent hover:border-[#D6DDEB]">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 text-[#4640DE] font-bold flex items-center justify-center flex-shrink-0">
                              {app.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[#25324b] text-sm truncate">{app.name}</p>
                              <p className="text-[#515b6f] text-xs truncate">Applied for {app.jobTitle}</p>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-[#7c8493]" />
                          </div>
                        ))}
                        {applications.length === 0 && <p className="text-center text-[#7c8493] text-sm py-4">No recent applications.</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Jobs Tab */}
              {activeTab === 'jobs' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-[#D6DDEB]">
                    <h2 className="font-['Clash_Display',sans-serif] text-2xl font-semibold text-[#25324b]">Manage Jobs</h2>
                    <button
                      onClick={() => {
                        if (isAdding) {
                          setEditingJob(null);
                          setFormData({ title: '', company: '', location: '', description: '', tags: '', type: 'Full Time' });
                        }
                        setIsAdding(!isAdding);
                      }}
                      className="flex items-center gap-2 bg-[#4640DE] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#4640DE]/90 transition-all shadow-md"
                    >
                      {isAdding ? 'Cancel' : <><Plus className="w-5 h-5" /> Post New Job</>}
                    </button>
                  </div>

                  {isAdding && (
                    <div className="bg-white p-8 rounded-2xl border border-[#D6DDEB] shadow-lg animate-in fade-in zoom-in-95 duration-300">
                      <h3 className="text-xl font-bold text-[#25324b] mb-6 border-b border-[#D6DDEB] pb-4">
                        {editingJob ? 'Modify Job Listing' : 'Create Job Listing'}
                      </h3>
                      <form onSubmit={handleSaveJob} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-[#25324b] mb-2">Job Title *</label>
                            <input
                              type="text" required
                              value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                              className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-3.5 rounded-xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] focus:ring-2 focus:ring-[#4640DE]/20 transition-all"
                              placeholder="e.g. Senior Product Designer"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#25324b] mb-2">Company Name *</label>
                            <input
                              type="text" required
                              value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })}
                              className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-3.5 rounded-xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] focus:ring-2 focus:ring-[#4640DE]/20 transition-all"
                              placeholder="e.g. Figma Make"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#25324b] mb-2">Location *</label>
                            <input
                              type="text" required
                              value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                              className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-3.5 rounded-xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] focus:ring-2 focus:ring-[#4640DE]/20 transition-all"
                              placeholder="e.g. Remote, or New York"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#25324b] mb-2">Job Type *</label>
                            <select
                              value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                              className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-3.5 rounded-xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] focus:ring-2 focus:ring-[#4640DE]/20 transition-all cursor-pointer"
                            >
                              <option>Full Time</option>
                              <option>Part Time</option>
                              <option>Contract</option>
                              <option>Freelance</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#25324b] mb-2">Tags / Categories (comma separated)</label>
                          <input
                            type="text"
                            value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-3.5 rounded-xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] focus:ring-2 focus:ring-[#4640DE]/20 transition-all"
                            placeholder="e.g. Design, Marketing, Remote"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#25324b] mb-2">Job Description *</label>
                          <textarea
                            required rows={5}
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-3.5 rounded-xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] focus:ring-2 focus:ring-[#4640DE]/20 transition-all resize-y"
                            placeholder="Describe the role and responsibilities..."
                          />
                        </div>
                        <div className="flex justify-end pt-4">
                          <button type="submit" className="bg-[#4640DE] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#4640DE]/90 transition-all shadow-lg hover:shadow-[#4640DE]/30">
                            {editingJob ? 'Update Job' : 'Publish Job'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-[#D6DDEB] shadow-sm overflow-hidden">
                    {loading ? (
                      <TableSkeleton rows={8} cols={4} />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead>
                            <tr className="bg-[#f8f8fd] text-[#515b6f] text-sm uppercase tracking-wider font-semibold border-b border-[#D6DDEB]">
                              <th className="p-5">Job Details</th>
                              <th className="p-5">Location</th>
                              <th className="p-5">Type</th>
                              <th className="p-5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#D6DDEB]">
                            {jobs.map((job) => (
                              <tr key={job.id} state-loading={loading ? 'true' : 'false'} className="hover:bg-gray-50 transition-colors">
                                <td className="p-5">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white border border-[#D6DDEB] rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                                      <img src={job.logo} alt={job.company} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-[#25324b] text-base mb-1">{job.title}</p>
                                      <p className="text-[#515b6f] text-sm font-medium">{job.company}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-5 text-[#515b6f] font-medium">
                                  {job.location}
                                </td>
                                <td className="p-5">
                                  <span className="bg-indigo-50 text-[#4640DE] px-3 py-1.5 rounded-md text-sm font-bold">
                                    {job.type}
                                  </span>
                                </td>
                                <td className="p-5 text-right">
                                  <div className="flex justify-end items-center gap-2">
                                    <button
                                      onClick={() => handleEditJob(job)}
                                      className="text-[#4640DE] hover:text-[#4640DE]/80 p-2 hover:bg-[#4640DE]/5 rounded-lg transition-colors border border-transparent hover:border-[#4640DE]/20"
                                      title="Edit Job"
                                    >
                                      <FileText className="w-5 h-5" />
                                    </button>
                                    <button
                                      onClick={() => { const id = job.id || (job as any)._id; if (id) handleDeleteJob(id); }}
                                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                      title="Delete Job"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {jobs.length === 0 && (
                              <tr>
                                <td colSpan={4} className="p-12 text-center text-[#515b6f]">
                                  <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                  <p className="font-medium text-lg">No jobs posted yet</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Applications Tab */}
              {activeTab === 'applications' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#D6DDEB]">
                    <h2 className="font-['Clash_Display',sans-serif] text-2xl font-semibold text-[#25324b]">Job Applications</h2>
                    <p className="text-[#515b6f] mt-1">Review candidates who applied to your listings.</p>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#D6DDEB] shadow-sm overflow-hidden">
                    {loading ? (
                      <TableSkeleton rows={8} cols={4} />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                          <thead>
                            <tr className="bg-[#f8f8fd] text-[#515b6f] text-sm uppercase tracking-wider font-semibold border-b border-[#D6DDEB]">
                              <th className="p-5">Candidate</th>
                              <th className="p-5">Applied For</th>
                              <th className="p-5">Date</th>
                              <th className="p-5 text-right">Resume</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#D6DDEB]">
                            {applications.map((app) => (
                              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-5">
                                  <p className="font-bold text-[#25324b] text-base">{app.name}</p>
                                  <p className="text-[#515b6f] text-sm">{app.email}</p>
                                </td>
                                <td className="p-5">
                                  <span className="font-medium text-[#25324b]">{app.jobTitle}</span>
                                </td>
                                <td className="p-5 text-[#515b6f] text-sm">
                                  {new Date(app.date).toLocaleDateString()}
                                </td>
                                <td className="p-5 text-right">
                                  <button
                                    onClick={() => setViewingApp(app)}
                                    className="inline-flex items-center gap-1.5 text-[#4640DE] font-semibold bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                                  >
                                    <Search className="w-4 h-4" /> View Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {applications.length === 0 && (
                              <tr>
                                <td colSpan={4} className="p-12 text-center text-[#515b6f]">
                                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                  <p className="font-medium text-lg">No applications received yet</p>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#D6DDEB] flex justify-between items-center">
                    <div>
                      <h2 className="font-['Clash_Display',sans-serif] text-2xl font-semibold text-[#25324b]">Registered Users</h2>
                      <p className="text-[#515b6f] mt-1">Manage platform users and administrators.</p>
                    </div>
                    <div className="bg-indigo-50 text-[#4640DE] font-bold px-4 py-2 rounded-lg flex items-center gap-2">
                      <Users className="w-5 h-5" /> {users.length} Total
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#D6DDEB] shadow-sm overflow-hidden">
                    {loading ? (
                      <TableSkeleton rows={8} cols={4} />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead>
                            <tr className="bg-[#f8f8fd] text-[#515b6f] text-sm uppercase tracking-wider font-semibold border-b border-[#D6DDEB]">
                              <th className="p-5">User</th>
                              <th className="p-5">Role</th>
                              <th className="p-5">Joined Date</th>
                              <th className="p-5 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#D6DDEB]">
                            {users.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#4640DE]/10 text-[#4640DE] font-bold flex items-center justify-center flex-shrink-0">
                                      {user.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-bold text-[#25324b] text-base">{user.name}</p>
                                      <p className="text-[#515b6f] text-sm">{user.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-5">
                                  <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {user.role}
                                  </span>
                                </td>
                                <td className="p-5 text-[#515b6f] text-sm">
                                  {new Date(user.dateJoined).toLocaleDateString()}
                                </td>
                                <td className="p-5 text-right">
                                  <button
                                    onClick={() => handleBanUser(user)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold transition-all ${user.isBanned
                                      ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                      : 'text-green-600 bg-green-50 hover:bg-green-100'
                                      }`}
                                  >
                                    {user.isBanned ? (
                                      <><AlertCircle className="w-4 h-4" /> Banned</>
                                    ) : (
                                      <><CheckCircle className="w-4 h-4" /> Active</>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </>
          )}

        </div>
      </main>

      {/* Application Details Modal */}
      {viewingApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#25324b]/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-[#D6DDEB] flex items-center justify-between bg-[#f8f8fd]">
              <h3 className="font-['Clash_Display',sans-serif] text-2xl font-semibold text-[#25324b]">Application Details</h3>
              <button
                onClick={() => setViewingApp(null)}
                className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-[#D6DDEB]"
              >
                <X className="w-6 h-6 text-[#7c8493]" />
              </button>
            </div>
            <div className="p-10 space-y-8 overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7c8493] block mb-2">FULL NAME</label>
                  <p className="text-lg font-bold text-[#25324b]">{viewingApp.name}</p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7c8493] block mb-2">EMAIL ADDRESS</label>
                  <p className="text-lg font-bold text-[#25324b]">{viewingApp.email}</p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7c8493] block mb-2">APPLIED FOR</label>
                  <p className="text-lg font-bold text-[#4640DE]">{viewingApp.jobTitle}</p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#7c8493] block mb-2">DATE APPLIED</label>
                  <p className="text-lg font-bold text-[#25324b]">{new Date(viewingApp.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t border-[#D6DDEB] pt-8">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7c8493] block mb-3">COVER NOTE</label>
                <div className="bg-[#f8f8fd] p-6 rounded-2xl text-[#515b6f] italic border border-[#D6DDEB] leading-relaxed">
                  "{viewingApp.coverNote || 'No cover note provided.'}"
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <a
                  href={viewingApp.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#4640DE] text-white font-bold py-4 rounded-2xl hover:bg-[#4640DE]/90 transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-[#4640DE]/20"
                >
                  <FileText className="w-5 h-5" /> View Resume
                </a>
                <button
                  onClick={() => setViewingApp(null)}
                  className="flex-1 bg-white border border-[#D6DDEB] text-[#515b6f] font-bold py-4 rounded-2xl hover:bg-[#f8f8fd] transition-all"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
