import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, CheckCircle, FileText, Send, Mail, User, Link as LinkIcon, FileSignature, MapPin, Briefcase, Zap, Loader2 } from 'lucide-react';
import { getJobById, addApplication, hasApplied, Job, getCurrentUser } from '../store';
import { toast } from 'sonner';
import { Skeleton } from '../components/Skeleton';

export function Apply() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    const [applied, setApplied] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        resume: '',
        coverNote: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPremiumProcessing, setShowPremiumProcessing] = useState(false);
    const [currentUser] = useState(getCurrentUser());

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name,
                email: currentUser.email,
                resume: currentUser.profile?.cvUrl || '',
                coverNote: ''
            });
        }
    }, [currentUser]);

    useEffect(() => {
        if (id) {
            getJobById(id).then(data => {
                setJob(data);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white font-['Epilogue',sans-serif]">
                <div className="w-10 h-10 border-4 border-[#4640DE] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white font-['Epilogue',sans-serif]">
                <h2 className="text-2xl font-bold text-[#25324b] mb-4">Job not found</h2>
                <button onClick={() => navigate('/jobs')} className="text-[#4640DE] font-semibold hover:underline flex items-center gap-2">
                    <ChevronLeft className="w-5 h-5" /> Back to all jobs
                </button>
            </div>
        );
    }

    const handleApply = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!formData.name || !formData.email || !formData.resume) {
            toast.error("Please provide your name, email, and a resume link.");
            return;
        }

        setIsSubmitting(true);
        if (currentUser) {
            setShowPremiumProcessing(true);
            // Artificial delay for premium feel
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        try {
            await addApplication({
                jobId: job.id! || (job as any)._id,
                jobTitle: job.title,
                name: formData.name,
                email: formData.email,
                resume: formData.resume,
                coverNote: formData.coverNote
            });
            setApplied(true);
            toast.success("Application sent successfully!");
        } catch (error) {
            console.error("Failed to apply:", error);
            toast.error("Failed to submit application");
        } finally {
            setIsSubmitting(false);
            setShowPremiumProcessing(false);
        }
    };

    return (
        <div className="bg-[#f8f8fd] min-h-screen flex flex-col font-['Epilogue',sans-serif]">
            <div className="px-6 lg:px-[124px] py-12 max-w-6xl mx-auto w-full flex-1 flex flex-col">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#515b6f] hover:text-[#4640DE] mb-8 transition-colors font-semibold w-fit">
                    <ChevronLeft className="w-5 h-5" /> Back
                </button>

                {applied ? (
                    <div className="bg-white border border-[#D6DDEB] p-12 lg:p-20 rounded-[40px] text-center flex flex-col items-center shadow-2xl animate-in zoom-in-95 duration-500 my-auto">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
                            <CheckCircle className="w-12 h-12 text-green-500" />
                        </div>
                        <h2 className="font-['Clash_Display',sans-serif] text-4xl font-semibold text-[#25324b] mb-4">Application Submitted!</h2>
                        <p className="text-[#515b6f] text-lg max-w-md mx-auto mb-10 leading-relaxed">
                            Thank you for applying. Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been successfully received.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={() => navigate('/jobs')} className="bg-[#4640DE] text-white font-bold px-10 py-4 rounded-2xl hover:bg-[#4640DE]/90 transition-all shadow-xl shadow-[#4640DE]/20">
                                Browse More Jobs
                            </button>
                            <button onClick={() => navigate('/')} className="text-[#4640DE] font-bold px-10 py-4 rounded-2xl border-2 border-[#4640DE] hover:bg-[#4640DE]/5 transition-all">
                                Back Home
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-[#D6DDEB] rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row flex-1 min-h-[700px] animate-in slide-in-from-bottom-8 duration-700">
                        {/* Left Sidebar - Job Info */}
                        <div className="lg:w-[35%] bg-[#4640DE] p-10 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-white p-4 rounded-3xl shadow-xl flex items-center justify-center mb-10 animate-in zoom-in-75 duration-500 delay-200">
                                    <img src={job.logo} alt={job.company} className="max-w-full max-h-full object-contain" />
                                </div>

                                <h1 className="font-['Clash_Display',sans-serif] text-4xl font-bold mb-4 leading-tight">
                                    {job.title}
                                </h1>
                                <p className="text-blue-100 text-xl font-medium mb-12 opacity-90">{job.company}</p>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-blue-200" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-blue-200 font-bold">Location</p>
                                            <p className="font-bold">{job.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                            <Briefcase className="w-5 h-5 text-blue-200" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-blue-200 font-bold">Job Type</p>
                                            <p className="font-bold">{job.type}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 pt-12 border-t border-white/10 mt-12">
                                <p className="text-sm text-blue-100 opacity-60">
                                    Apply now and join the team at {job.company}. We're excited to hear from you!
                                </p>
                            </div>
                        </div>

                        {/* Right Content - Application Form */}
                        <div className="lg:w-[65%] p-10 lg:p-16 flex flex-col bg-white">
                            <div className="mb-12">
                                <div className="flex items-center gap-3 text-[#4640DE] mb-3">
                                    <FileSignature className="w-6 h-6" />
                                    <span className="font-bold uppercase tracking-widest text-xs">Job Application</span>
                                </div>
                                <h2 className="font-['Clash_Display',sans-serif] text-4xl font-bold text-[#25324b]">
                                    Candidate Details
                                </h2>
                            </div>

                            {showPremiumProcessing ? (
                                <div className="space-y-8 flex-1 animate-in fade-in duration-500">
                                    <div className="bg-blue-50 p-8 rounded-[32px] border border-blue-100 flex flex-col items-center text-center">
                                        <div className="w-16 h-16 bg-[#4640DE] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-[#4640DE]/20 animate-bounce">
                                            <Zap className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-[#25324b] mb-2">Premium Processing</h3>
                                        <p className="text-[#515b6f] max-w-xs mx-auto mb-8">Synchronizing your profile with <strong>{job.company}'s</strong> recruitment engine...</p>

                                        <div className="w-full space-y-4">
                                            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#4640DE] animate-progress-fast"></div>
                                            </div>
                                            <div className="flex justify-between text-xs font-bold text-[#7c8493] uppercase tracking-wider">
                                                <span>Analyzing Fit</span>
                                                <span>94% Success Probability</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Skeleton height="60px" />
                                        <Skeleton height="60px" />
                                        <Skeleton height="120px" />
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleApply} className="space-y-8 flex-1">
                                    {currentUser && (
                                        <div className="bg-[#4640DE]/5 p-6 rounded-3xl border border-[#4640DE]/10 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#D6DDEB] shrink-0">
                                                    <User className="w-6 h-6 text-[#4640DE]" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#25324b] break-all sm:break-normal">Fast Apply as {currentUser.name}</p>
                                                    <p className="text-xs text-[#515b6f]">Using your saved profile details</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleApply()}
                                                disabled={isSubmitting}
                                                className="w-full sm:w-auto bg-[#4640DE] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4640DE]/90 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Zap className="w-4 h-4 shrink-0" /> One-Click Apply
                                            </button>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-bold text-[#25324b] ml-1 flex items-center gap-2 group-focus-within:text-[#4640DE] transition-colors">
                                                <User className="w-4 h-4" /> Full Name *
                                            </label>
                                            <input
                                                type="text" required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-5 rounded-2xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] focus:ring-8 focus:ring-[#4640DE]/5 transition-all font-medium text-lg disabled:opacity-50"
                                                placeholder="Jane Doe"
                                                disabled={!!currentUser}
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-bold text-[#25324b] ml-1 flex items-center gap-2 group-focus-within:text-[#4640DE] transition-colors">
                                                <Mail className="w-4 h-4" /> Email Address *
                                            </label>
                                            <input
                                                type="email" required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-5 rounded-2xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] focus:ring-8 focus:ring-[#4640DE]/5 transition-all font-medium text-lg disabled:opacity-50"
                                                placeholder="jane@example.com"
                                                disabled={!!currentUser}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2 group">
                                            <label className="text-sm font-bold text-[#25324b] ml-1 flex items-center gap-2 group-focus-within:text-[#4640DE] transition-colors">
                                                <LinkIcon className="w-4 h-4" /> Resume Link (URL) *
                                            </label>
                                            <input
                                                type="url" required
                                                value={formData.resume}
                                                onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                                                className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-5 rounded-2xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] focus:ring-8 focus:ring-[#4640DE]/5 transition-all font-medium text-lg"
                                                placeholder="https://linkedin.com/in/janedoe or Drive link"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2 group">
                                            <label className="text-sm font-bold text-[#25324b] ml-1 flex items-center gap-2 group-focus-within:text-[#4640DE] transition-colors">
                                                <FileText className="w-4 h-4" /> Cover Note
                                            </label>
                                            <textarea
                                                rows={5}
                                                value={formData.coverNote}
                                                onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                                                className="w-full bg-[#f8f8fd] border border-[#D6DDEB] p-5 rounded-2xl text-[#25324b] outline-none focus:bg-white focus:border-[#4640DE] focus:ring-8 focus:ring-[#4640DE]/5 transition-all resize-none font-medium text-lg leading-relaxed"
                                                placeholder="Briefly explain why you're a fit for this role..."
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="pt-8">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-[#4640DE] text-white font-bold py-6 rounded-[24px] hover:bg-[#4640DE]/90 active:scale-[0.98] transition-all shadow-2xl shadow-[#4640DE]/30 flex items-center justify-center gap-4 text-xl disabled:opacity-70"
                                        >
                                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-6 h-6" /> Submit Application</>}
                                        </button>
                                        <p className="text-center text-[#7c8493] mt-6 text-sm font-medium">
                                            By clicking submit, you're agreeing to our <span className="text-[#4640DE] cursor-pointer hover:underline">Terms of Service</span>.
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
