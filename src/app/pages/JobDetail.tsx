import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { MapPin, Briefcase, Calendar, ChevronLeft, CheckCircle, Heart } from 'lucide-react';
import { getJobById, isJobSaved, toggleSaveJob, getApplications, Job } from '../store';
import { JobTag } from '../components/JobTag';
import { JobDetailSkeleton } from '../components/Skeleton';

export function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const [isSaved, setIsSaved] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      const fetchedJob = await getJobById(id);
      setJob(fetchedJob);

      if (fetchedJob) {
        const saved = await isJobSaved(fetchedJob.id!, 'user@example.com'); // TODO: Replace with real user session email
        setIsSaved(saved);

        const apps = await getApplications();
        const hasApplied = apps.some(app => app.jobId === fetchedJob.id);
        setAlreadyApplied(hasApplied);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) {
    return <JobDetailSkeleton />;
  }

  if (!job) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white">
        <h2 className="text-2xl font-bold text-[#25324b] mb-4">Job not found</h2>
        <button onClick={() => navigate('/jobs')} className="text-[#4640DE] font-semibold hover:underline">
          Back to all jobs
        </button>
      </div>
    );
  }

  const handleToggleSave = async () => {
    if (!job.id) return;
    const res = await toggleSaveJob(job.id, 'user@example.com'); // TODO: Real user
    setIsSaved(res.isSaved);
  };

  return (
    <div className="bg-white flex-1 flex flex-col font-['Epilogue',sans-serif]">
      {/* Header */}
      <div className="bg-[#f8f8fd] border-b border-[#D6DDEB] py-12 px-6 lg:px-[124px]">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#515b6f] hover:text-[#4640DE] mb-8 transition-colors font-semibold">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white border border-[#D6DDEB] p-2 flex items-center justify-center rounded-2xl shadow-sm">
              <img src={job.logo} alt={job.company} className="max-w-full max-h-full object-contain" />
            </div>
            <div>
              <h1 className="font-['Clash_Display',sans-serif] text-3xl font-semibold text-[#25324b] mb-2 leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-[#515b6f] text-sm">
                <span className="font-bold text-[#25324b]">{job.company}</span>
                <span className="w-1 h-1 bg-[#515b6f] rounded-full opacity-30"></span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                <span className="w-1 h-1 bg-[#515b6f] rounded-full opacity-30"></span>
                <span className="flex items-center gap-1 text-[#56CDAD] font-bold uppercase tracking-wider text-[10px] bg-[#56CDAD]/10 px-2.5 py-1 rounded">
                  {job.type}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleSave}
              className={`p-3 rounded-xl border transition-all ${isSaved
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-[#D6DDEB] text-[#4640DE] hover:bg-[#4640DE]/5'
                }`}
              title={isSaved ? "Remove from saved" : "Save Job"}
            >
              <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            {alreadyApplied ? (
              <div className="bg-[#56CDAD]/10 text-[#56CDAD] font-bold px-8 py-4 rounded-xl flex items-center gap-2 border border-[#56CDAD]/20">
                <CheckCircle className="w-5 h-5" /> Applied
              </div>
            ) : (
              <Link
                to={`/jobs/${job.id}/apply`}
                className="bg-[#4640DE] text-white font-bold px-10 py-4 rounded-xl hover:bg-[#4640DE]/90 transition-all shadow-xl shadow-[#4640DE]/20"
              >
                Apply Now
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-[124px] py-16 flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto w-full">
        {/* Job Description */}
        <div className="flex-1">
          <div className="prose prose-blue max-w-none">
            <h3 className="font-['Clash_Display',sans-serif] text-2xl font-semibold text-[#25324b] mb-6">Description</h3>
            <p className="text-[#515b6f] leading-relaxed mb-10 text-lg opacity-80">
              {job.description}
              <br /><br />
              We are looking for a passionate professional who can bring fresh ideas and energy to our growing team. You will have the opportunity to work on cutting-edge features that impact millions of users worldwide.
            </p>

            <h3 className="font-['Clash_Display',sans-serif] text-2xl font-semibold text-[#25324b] mb-6">Responsibilities</h3>
            <ul className="list-none text-[#515b6f] leading-relaxed mb-10 space-y-4 pl-0 border-l-2 border-[#D6DDEB] pl-6">
              <li className="relative">
                Collaborate with cross-functional teams to define, design, and ship new features.
              </li>
              <li>Work on bug fixing and improving application performance.</li>
              <li>Continuously discover, evaluate, and implement new technologies to maximize development efficiency.</li>
              <li>Unit-test code for robustness, including edge cases, usability, and general reliability.</li>
            </ul>

            <h3 className="font-['Clash_Display',sans-serif] text-2xl font-semibold text-[#25324b] mb-6">Qualifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {[
                "Bachelor's degree in Computer Science or related field",
                "3+ years of professional experience",
                "Strong understanding of modern frameworks",
                "Excellent problem solving skills",
                "Fluent in English (written and verbal)",
                "Experience with Cloud infrastructure"
              ].map((qual, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#f8f8fd] p-4 rounded-xl border border-[#D6DDEB]">
                  <CheckCircle className="w-5 h-5 text-[#56CDAD] flex-shrink-0" />
                  <span className="text-[#515b6f] text-sm font-medium">{qual}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-8">
          <div className="border border-[#D6DDEB] p-8 rounded-3xl bg-white shadow-sm sticky top-8">
            <h3 className="font-['Clash_Display',sans-serif] text-xl font-semibold text-[#25324b] mb-6">About this role</h3>
            <div className="space-y-6">
              <div className="flex flex-col gap-1 border-b border-[#D6DDEB] pb-4">
                <span className="text-[#7c8493] text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-[#4640DE]" /> Date Posted</span>
                <span className="font-bold text-[#25324b]">March 6, 2026</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-[#D6DDEB] pb-4">
                <span className="text-[#7c8493] text-sm flex items-center gap-2"><MapPin className="w-4 h-4 text-[#4640DE]" /> Location</span>
                <span className="font-bold text-[#25324b]">{job.location}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-[#D6DDEB] pb-4">
                <span className="text-[#7c8493] text-sm flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#4640DE]" /> Job Type</span>
                <span className="font-bold text-[#25324b]">{job.type}</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-[#7c8493] text-[13px] font-bold uppercase tracking-wider mb-4">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, i) => (
                  <span key={i} className="bg-[#4640DE]/5 text-[#4640DE] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#4640DE]/10 hover:bg-[#4640DE]/10 transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-[#D6DDEB]">
              {!alreadyApplied && (
                <Link
                  to={`/jobs/${job.id}/apply`}
                  className="w-full inline-block text-center bg-[#4640DE] text-white font-bold py-4 rounded-xl hover:bg-[#4640DE]/90 transition-all shadow-lg"
                >
                  Apply for this job
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

