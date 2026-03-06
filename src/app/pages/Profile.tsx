import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
    User, Mail, Calendar, Briefcase, GraduationCap, Link as LinkIcon,
    Settings, LogOut, FileText, Bookmark, CheckCircle, Clock, ChevronRight,
    Edit2, Save, X
} from 'lucide-react';
import { getCurrentUser, updateProfile, getJobs, getApplications, Job, Application, logout } from '../store';
import { toast } from 'sonner';

export function Profile() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(getCurrentUser());
    const [activeTab, setActiveTab] = useState<'profile' | 'applied' | 'saved'>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Profile form state
    const [profileData, setProfileData] = useState({
        bio: currentUser?.profile?.bio || '',
        education: currentUser?.profile?.education || '',
        experience: currentUser?.profile?.experience || '',
        cvUrl: currentUser?.profile?.cvUrl || ''
    });

    const [appliedJobs, setAppliedJobs] = useState<(Application & { jobDetails?: Job })[]>([]);
    const [savedJobs, setSavedJobs] = useState<Job[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [allJobs, allApps] = await Promise.all([getJobs(), getApplications()]);

                // Filter jobs saved by user
                const savedIds = currentUser.savedJobs || [];
                setSavedJobs(allJobs.filter(j => savedIds.includes(j.id! || j._id!)));

                // Filter applications by user email
                const userApps = allApps.filter(a => a.email === currentUser.email);
                const appsWithDetails = userApps.map(app => ({
                    ...app,
                    jobDetails: allJobs.find(j => (j.id! || j._id!) === app.jobId)
                }));
                setAppliedJobs(appsWithDetails);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setDataLoading(false);
            }
        };

        fetchData();
    }, [currentUser, navigate]);

    const handleSaveProfile = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            await updateProfile(currentUser.email, profileData);
            setCurrentUser(getCurrentUser());
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success("Logged out successfully");
    };

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-[#f8f8fd] pb-20 font-['Epilogue',sans-serif]">
            {/* Header Banner */}
            <div className="h-48 bg-[#4640DE] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#26a4ff]/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Sidebar - Profile Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#D6DDEB]">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-[#4640DE] flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl">
                                    {currentUser.name.charAt(0)}
                                </div>
                                <h2 className="text-2xl font-bold text-[#25324b] mb-1">{currentUser.name}</h2>
                                <p className="text-[#515b6f] font-medium flex items-center gap-2 mb-6">
                                    <Mail className="w-4 h-4" /> {currentUser.email}
                                </p>

                                <div className="w-full flex justify-between items-center py-4 border-y border-[#D6DDEB] mb-6">
                                    <div className="text-center px-4">
                                        <p className="text-xl font-bold text-[#25324b]">{appliedJobs.length}</p>
                                        <p className="text-xs font-bold text-[#7c8493] uppercase tracking-wider">Applied</p>
                                    </div>
                                    <div className="w-px h-8 bg-[#D6DDEB]"></div>
                                    <div className="text-center px-4">
                                        <p className="text-xl font-bold text-[#25324b]">{savedJobs.length}</p>
                                        <p className="text-xs font-bold text-[#7c8493] uppercase tracking-wider">Saved</p>
                                    </div>
                                </div>

                                <div className="w-full space-y-3">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-[#4640DE] text-white' : 'text-[#515b6f] hover:bg-[#f8f8fd]'}`}
                                    >
                                        <User className="w-5 h-5" /> Profile Details
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('applied')}
                                        className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all ${activeTab === 'applied' ? 'bg-[#4640DE] text-white' : 'text-[#515b6f] hover:bg-[#f8f8fd]'}`}
                                    >
                                        <FileText className="w-5 h-5" /> My Applications
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('saved')}
                                        className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all ${activeTab === 'saved' ? 'bg-[#4640DE] text-white' : 'text-[#515b6f] hover:bg-[#f8f8fd]'}`}
                                    >
                                        <Bookmark className="w-5 h-5" /> Saved Jobs
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 p-4 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all mt-4"
                                    >
                                        <LogOut className="w-5 h-5" /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#D6DDEB]">
                            <h3 className="font-bold text-[#25324b] mb-4 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-[#4640DE]" /> Account Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#7c8493]">Joined</span>
                                    <span className="font-bold text-[#25324b]">{currentUser.dateJoined ? new Date(currentUser.dateJoined).toLocaleDateString() : 'Mar 6, 2026'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#7c8493]">Account Status</span>
                                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-[10px] font-bold uppercase tracking-wider">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-3xl shadow-sm border border-[#D6DDEB] overflow-hidden">
                                <div className="p-8 border-b border-[#D6DDEB] flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[#25324b]">Profile Overview</h2>
                                        <p className="text-[#515b6f]">Manage your CV and professional information</p>
                                    </div>
                                    <button
                                        onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-6 py-3 bg-[#4640DE] text-white rounded-xl font-bold hover:bg-[#4640DE]/90 transition-all shadow-lg shadow-[#4640DE]/20 disabled:opacity-70"
                                    >
                                        {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isEditing ? <><Save className="w-4 h-4" /> Save</> : <><Edit2 className="w-4 h-4" /> Edit Profile</>)}
                                    </button>
                                </div>

                                <div className="p-8 space-y-10">
                                    {/* Bio Section */}
                                    <section>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-[#25324b] flex items-center gap-2">
                                                <User className="w-5 h-5 text-[#4640DE]" /> About Me
                                            </h3>
                                            {isEditing && (
                                                <button onClick={() => setIsEditing(false)} className="text-[#7c8493] hover:text-[#25324b]"><X className="w-4 h-4" /></button>
                                            )}
                                        </div>
                                        {isEditing ? (
                                            <textarea
                                                value={profileData.bio}
                                                onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                                                className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-4 rounded-xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] transition-all font-medium h-32"
                                                placeholder="Tell us about yourself..."
                                            />
                                        ) : (
                                            <p className="text-[#515b6f] leading-relaxed bg-[#f8f8fd] p-6 rounded-2xl italic">
                                                {profileData.bio || "No bio added yet. Click edit to add your professional summary."}
                                            </p>
                                        )}
                                    </section>

                                    {/* Experience Section */}
                                    <section>
                                        <h3 className="text-lg font-bold text-[#25324b] flex items-center gap-2 mb-4">
                                            <Briefcase className="w-5 h-5 text-[#4640DE]" /> Work Experience
                                        </h3>
                                        {isEditing ? (
                                            <textarea
                                                value={profileData.experience}
                                                onChange={e => setProfileData({ ...profileData, experience: e.target.value })}
                                                className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-4 rounded-xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] transition-all font-medium h-32"
                                                placeholder="List your previous roles and achievements..."
                                            />
                                        ) : (
                                            <div className="bg-[#f8f8fd] p-6 rounded-2xl whitespace-pre-wrap text-[#515b6f]">
                                                {profileData.experience || "Add your work experience to boost your application success."}
                                            </div>
                                        )}
                                    </section>

                                    {/* Education Section */}
                                    <section>
                                        <h3 className="text-lg font-bold text-[#25324b] flex items-center gap-2 mb-4">
                                            <GraduationCap className="w-5 h-5 text-[#4640DE]" /> Education
                                        </h3>
                                        {isEditing ? (
                                            <textarea
                                                value={profileData.education}
                                                onChange={e => setProfileData({ ...profileData, education: e.target.value })}
                                                className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-4 rounded-xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] transition-all font-medium h-32"
                                                placeholder="List your educational background..."
                                            />
                                        ) : (
                                            <div className="bg-[#f8f8fd] p-6 rounded-2xl whitespace-pre-wrap text-[#515b6f]">
                                                {profileData.education || "Share your degrees and institutions."}
                                            </div>
                                        )}
                                    </section>

                                    {/* CV URL Section */}
                                    <section>
                                        <h3 className="text-lg font-bold text-[#25324b] flex items-center gap-2 mb-4">
                                            <LinkIcon className="w-5 h-5 text-[#4640DE]" /> Resume/CV Link
                                        </h3>
                                        {isEditing ? (
                                            <input
                                                type="url"
                                                value={profileData.cvUrl}
                                                onChange={e => setProfileData({ ...profileData, cvUrl: e.target.value })}
                                                className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-4 rounded-xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] transition-all font-medium"
                                                placeholder="https://docs.google.com/your-resume-link"
                                            />
                                        ) : (
                                            profileData.cvUrl ? (
                                                <a
                                                    href={profileData.cvUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-3 p-4 bg-blue-50 text-[#4640DE] rounded-xl font-bold hover:bg-blue-100 transition-all border border-blue-100"
                                                >
                                                    <FileText className="w-5 h-5" /> View Uploaded CV
                                                </a>
                                            ) : (
                                                <p className="text-[#7c8493] italic bg-[#f8f8fd] p-4 rounded-xl border border-dashed border-[#D6DDEB]">No CV link provided.</p>
                                            )
                                        )}
                                    </section>
                                </div>
                            </div>
                        )}

                        {activeTab === 'applied' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-[#25324b]">My Applications</h2>
                                    <span className="bg-[#4640DE]/10 text-[#4640DE] px-3 py-1 rounded-full text-sm font-bold">{appliedJobs.length} Positions</span>
                                </div>

                                {dataLoading ? (
                                    <div className="bg-white rounded-3xl p-12 text-center border border-[#D6DDEB]">
                                        <div className="w-12 h-12 border-4 border-[#4640DE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-[#515b6f]">Loading your applications...</p>
                                    </div>
                                ) : appliedJobs.length > 0 ? (
                                    appliedJobs.map((app) => (
                                        <div key={app.id || app._id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#D6DDEB] hover:shadow-md transition-all group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-[#f8f8fd] p-2 flex items-center justify-center border border-[#D6DDEB]">
                                                        {app.jobDetails?.logo ? (
                                                            <img src={app.jobDetails.logo} alt={app.jobDetails.company} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <div className="w-full h-full bg-[#4640DE] rounded-xl flex items-center justify-center text-white text-xs font-bold">QH</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[#25324b] text-lg group-hover:text-[#4640DE] transition-colors">{app.jobTitle}</h3>
                                                        <p className="text-[#515b6f] font-medium">{app.jobDetails?.company || "Company Undisclosed"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#4640DE] text-[10px] font-bold uppercase tracking-wider mb-2">Applied</span>
                                                    <span className="text-xs text-[#7c8493]">{new Date(app.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-3xl p-12 text-center border border-[#D6DDEB]">
                                        <FileText className="w-12 h-12 text-[#7c8493] mx-auto mb-4 opacity-20" />
                                        <h3 className="text-xl font-bold text-[#25324b] mb-2">No applications yet</h3>
                                        <p className="text-[#515b6f] mb-8">Ready to find your next career move?</p>
                                        <button onClick={() => navigate('/jobs')} className="bg-[#4640DE] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#4640DE]/90 transition-all shadow-xl shadow-[#4640DE]/20">Explore Jobs</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'saved' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-[#25324b]">Saved Jobs</h2>
                                    <span className="bg-[#4640DE]/10 text-[#4640DE] px-3 py-1 rounded-full text-sm font-bold">{savedJobs.length} Jobs</span>
                                </div>

                                {dataLoading ? (
                                    <div className="bg-white rounded-3xl p-12 text-center border border-[#D6DDEB]">
                                        <div className="w-12 h-12 border-4 border-[#4640DE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-[#515b6f]">Loading saved jobs...</p>
                                    </div>
                                ) : savedJobs.length > 0 ? (
                                    savedJobs.map((job) => (
                                        <div key={job.id || job._id} className="bg-white p-6 rounded-3xl shadow-sm border border-[#D6DDEB] hover:shadow-md transition-all group flex items-center justify-between cursor-pointer" onClick={() => navigate(`/jobs/${job.id || job._id}`)}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-[#f8f8fd] p-2 flex items-center justify-center border border-[#D6DDEB]">
                                                    <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#25324b] text-lg group-hover:text-[#4640DE] transition-colors">{job.title}</h3>
                                                    <p className="text-[#515b6f] font-medium">{job.company} • {job.location}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-6 h-6 text-[#7c8493] group-hover:text-[#4640DE] transition-all group-hover:translate-x-1" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-3xl p-12 text-center border border-[#D6DDEB]">
                                        <Bookmark className="w-12 h-12 text-[#7c8493] mx-auto mb-4 opacity-20" />
                                        <h3 className="text-xl font-bold text-[#25324b] mb-2">No saved jobs</h3>
                                        <p className="text-[#515b6f] mb-8">Save interesting jobs to view them later.</p>
                                        <button onClick={() => navigate('/jobs')} className="bg-[#4640DE] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#4640DE]/90 transition-all shadow-xl shadow-[#4640DE]/20">Find Jobs</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
