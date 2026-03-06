import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, MapPin, ChevronDown, ArrowRight, PenTool, TrendingUp, Megaphone, Wallet, Monitor, Code, Briefcase, Users } from 'lucide-react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { VodafoneLogo, IntelLogo, TeslaLogo, AmdLogo, TalkitLogo } from '../components/Logos';
import { JobCardFeatured, JobCardLatest } from '../components/JobCards';
import * as assets from '../assets';
import { getJobs, Job } from '../store';
import { JobCardSkeleton, JobRowSkeleton } from '../components/Skeleton';

export function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs().then(jobs => {
      setAllJobs(jobs);
      setLoading(false);
    });
  }, []);

  const featuredJobs = allJobs.filter(j => j.featured).slice(0, 8);
  const latestJobs = allJobs.filter(j => j.latest).slice(0, 8);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('query', searchQuery);
    if (searchLocation) params.append('location', searchLocation);
    navigate(`/jobs?${params.toString()}`);
  };

  const handleCategoryClick = (cat: string) => {
    navigate(`/jobs?category=${encodeURIComponent(cat)}`);
  };

  return (
    <>
      {/* Header & Hero Area */}
      <div className="bg-[#f8f8fd] relative">
        {/* Background Patterns (Simulated) */}
        <div className="absolute right-0 top-0 w-2/3 h-full pointer-events-none hidden lg:block overflow-hidden">
          <svg className="w-full h-full opacity-60" fill="none" viewBox="0 0 1123 1185">
            <path d="M-100 200 L1200 -200" stroke="#CCCCF5" strokeWidth="4" />
            <path d="M-100 250 L1200 -150" stroke="#CCCCF5" strokeWidth="4" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 lg:px-[124px] pt-12 pb-24 lg:pt-24 lg:pb-32 flex flex-col lg:flex-row items-center min-h-[600px]">
          <div className="w-full lg:w-[60%] flex flex-col gap-6 lg:gap-8 z-20">
            <h1 className="font-['Clash_Display',sans-serif] text-5xl lg:text-[72px] font-semibold leading-[1.1] text-[#25324b]">
              Discover more than <br />
              <span className="text-[#26a4ff] relative inline-block">
                5000+ Jobs
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 455 39" fill="none">
                  <path d="M2 20 Q 100 5, 200 25 T 450 15" stroke="#26A4FF" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-lg lg:text-[20px] text-[#515b6f] opacity-70 leading-relaxed max-w-lg mb-2">
              Great platform for the job seeker that searching for new career heights and passionate about startups.
            </p>

            {/* Search Box - Moved Up into Hero Content */}
            <div className="w-full max-w-3xl mt-4">
              <form onSubmit={handleSearch} className="bg-white p-4 rounded-xl shadow-[0_30px_60px_-15px_rgba(70,64,222,0.15)] flex flex-col lg:flex-row items-stretch lg:items-center w-full border border-gray-100">
                <div className="flex-[1.5] flex items-center gap-4 px-4 py-4 lg:py-2 border-b lg:border-b-0 lg:border-r border-[#D6DDEB]">
                  <Search className="w-6 h-6 text-[#25324b] stroke-2" />
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-[16px] outline-none text-[#25324b] placeholder-[#7c8493] opacity-50 focus:opacity-100 bg-transparent"
                  />
                </div>
                <div className="flex-[1.2] flex items-center gap-4 px-4 py-4 lg:py-2 border-b lg:border-b-0 lg:border-r border-[#D6DDEB] lg:ml-2">
                  <MapPin className="w-6 h-6 text-[#25324b] stroke-2" />
                  <div className="flex-1 flex items-center justify-between relative">
                    <select
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full text-[16px] bg-transparent outline-none text-[#25324b] appearance-none cursor-pointer opacity-90 z-10"
                    >
                      <option value="">Any Location</option>
                      <option value="Florence, Italy">Florence, Italy</option>
                      <option value="Madrid, Spain">Madrid, Spain</option>
                      <option value="San Francisco, US">San Francisco, US</option>
                      <option value="Berlin, Germany">Berlin, Germany</option>
                      <option value="Remote">Remote</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#7c8493] absolute right-0 pointer-events-none" />
                  </div>
                </div>
                <button type="submit" className="bg-[#4640DE] text-white text-[16px] font-bold px-8 py-4 lg:py-3 lg:ml-4 mt-4 lg:mt-0 w-full lg:w-auto rounded hover:bg-[#4640DE]/90 transition-all">
                  Search my job
                </button>
              </form>

              {/* Popular Links under Search Box */}
              <p className="text-[#202430] opacity-70 text-[16px] mt-6">
                Popular : <span className="font-medium cursor-pointer hover:underline" onClick={() => handleCategoryClick('Design')}>UI Designer</span>, <span className="font-medium cursor-pointer hover:underline" onClick={() => handleCategoryClick('Engineering')}>UX Researcher</span>, <span className="font-medium cursor-pointer hover:underline" onClick={() => handleCategoryClick('Technology')}>Android</span>
              </p>
            </div>
          </div>

          <div className="w-full lg:w-[40%] absolute right-0 bottom-0 h-full hidden lg:block pointer-events-none z-10">
            <img src={assets.heroImg} alt="Happy job seeker" className="w-full h-full object-contain object-right-bottom" />
          </div>
        </div>
      </div>

      {/* Companies Section */}
      <div className="pb-12 pt-4 px-6 lg:px-[124px] bg-white overflow-hidden">
        <p className="text-[#202430] opacity-50 mb-8 text-[18px]">Companies we helped grow</p>
        <div className="relative w-full max-w-7xl mx-auto flex overflow-hidden">
          {/* Fading Edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap min-w-full">
            <div className="flex items-center justify-between min-w-full gap-8 px-4">
              <VodafoneLogo />
              <IntelLogo />
              <TeslaLogo />
              <AmdLogo />
              <TalkitLogo />
            </div>
            <div className="flex items-center justify-between min-w-full gap-8 px-4" aria-hidden="true">
              <VodafoneLogo />
              <IntelLogo />
              <TeslaLogo />
              <AmdLogo />
              <TalkitLogo />
            </div>
          </div>
        </div>
      </div>

      {/* Explore by Category */}
      <div className="py-16 px-6 lg:px-[124px] bg-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 gap-6">
          <h2 className="font-['Clash_Display',sans-serif] text-4xl lg:text-[48px] font-semibold text-[#25324b] leading-[1.1]">
            Explore by <span className="text-[#26a4ff]">category</span>
          </h2>
          <button onClick={() => navigate('/jobs')} className="flex items-center gap-4 text-[#4640DE] font-semibold hover:opacity-80 transition-opacity">
            Show all jobs <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Design", icon: PenTool },
            { name: "Sales", icon: TrendingUp },
            { name: "Marketing", icon: Megaphone },
            { name: "Finance", icon: Wallet },
            { name: "Technology", icon: Monitor },
            { name: "Engineering", icon: Code },
            { name: "Business", icon: Briefcase },
            { name: "Human Resource", icon: Users },
          ].map((cat, i) => {
            const jobCount = allJobs.filter(job =>
              job.tags && job.tags.some(tag => tag.toLowerCase() === cat.name.toLowerCase())
            ).length;

            return (
              <div
                key={i}
                onClick={() => handleCategoryClick(cat.name)}
                className="group p-8 border border-[#D6DDEB] cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-[#4640DE]/20 hover:border-transparent rounded-lg bg-white hover:bg-[#4640DE]"
              >
                <div className="mb-8">
                  <cat.icon className="w-12 h-12 text-[#4640DE] group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <h3 className="font-['Clash_Display',sans-serif] text-2xl font-semibold mb-3 text-[#25324b] group-hover:text-white transition-colors">
                  {cat.name}
                </h3>
                <div className="flex items-center gap-4 text-[#7c8493] group-hover:text-white group-hover:opacity-90 transition-all">
                  <p className="text-lg">{jobCount} {jobCount === 1 ? 'job' : 'jobs'} available</p>
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-6 lg:px-[124px] bg-white">
        <div className="bg-[#4640DE] rounded-2xl overflow-hidden relative flex flex-col lg:flex-row min-h-[558px]">
          <div className="p-12 lg:p-24 relative z-10 lg:w-1/2 flex flex-col items-start justify-center">
            <h2 className="font-['Clash_Display',sans-serif] text-4xl lg:text-[48px] font-semibold text-white leading-[1.1] mb-6">
              Start posting jobs today
            </h2>
            <p className="text-white font-medium text-lg mb-8 opacity-90">
              Start posting jobs for only $10.
            </p>
            <button onClick={() => navigate('/admin')} className="bg-white text-[#4640DE] font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-lg">
              Sign Up For Free
            </button>
          </div>
          <div className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-full">
            <div className="absolute top-1/2 lg:-translate-y-1/2 left-6 lg:left-0 right-[-20%] bg-white rounded-l-xl p-6 shadow-2xl h-[400px] border border-gray-100 flex flex-col gap-4">
              <div className="flex gap-4 mb-4">
                <div className="w-48 bg-[#F8F8FD] rounded p-4">
                  <div className="text-[#515b6f] text-sm mb-2">Total jobs</div>
                  <div className="text-3xl font-bold text-[#25324b]">76</div>
                </div>
                <div className="w-48 bg-[#F8F8FD] rounded p-4">
                  <div className="text-[#515b6f] text-sm mb-2">Applicants</div>
                  <div className="text-3xl font-bold text-[#25324b]">3<span className="text-sm font-normal text-green-500 ml-2">+12%</span></div>
                </div>
                <div className="w-48 bg-[#F8F8FD] rounded p-4">
                  <div className="text-[#515b6f] text-sm mb-2">Views</div>
                  <div className="text-3xl font-bold text-[#25324b]">24k</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 bg-[#F8F8FD] rounded p-4 h-48 flex items-end gap-2">
                  <div className="w-1/6 bg-[#FFB836] h-[60%] rounded-t"></div>
                  <div className="w-1/6 bg-[#56CDAD] h-[80%] rounded-t"></div>
                  <div className="w-1/6 bg-[#4640DE] h-[100%] rounded-t"></div>
                  <div className="w-1/6 bg-[#FF6550] h-[40%] rounded-t"></div>
                  <div className="w-1/6 bg-blue-400 h-[70%] rounded-t"></div>
                  <div className="w-1/6 bg-purple-400 h-[50%] rounded-t"></div>
                </div>
                <div className="w-48 flex flex-col gap-4">
                  <div className="bg-[#F8F8FD] rounded p-4 flex-1 flex flex-col justify-center">
                    <div className="text-xl font-bold mb-1">12</div>
                    <div className="text-xs text-gray-500">Unread Applications</div>
                  </div>
                  <div className="bg-[#F8F8FD] rounded p-4 flex-1 flex flex-col justify-center">
                    <div className="text-xl font-bold mb-1">67</div>
                    <div className="text-xs text-gray-500">Shortlisted</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="py-16 px-6 lg:px-[124px] bg-white">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 gap-6">
          <h2 className="font-['Clash_Display',sans-serif] text-4xl lg:text-[48px] font-semibold text-[#25324b] leading-[1.1]">
            Featured <span className="text-[#26a4ff]">jobs</span>
          </h2>
          <button onClick={() => navigate('/jobs')} className="flex items-center gap-4 text-[#4640DE] font-semibold hover:opacity-80 transition-opacity">
            Show all jobs <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <JobCardSkeleton key={i} />)
          ) : featuredJobs.length > 0 ? (
            featuredJobs.map((job) => (
              <JobCardFeatured key={job.id} {...job} />
            ))
          ) : (
            <p className="col-span-full text-center text-[#7c8493]">No featured jobs configured.</p>
          )}
        </div>
      </div>

      {/* Latest Jobs Open */}
      <div className="py-24 px-6 lg:px-[124px] bg-[#F8F8FD] relative">
        <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-none hidden lg:block overflow-hidden">
          <svg className="w-full h-full opacity-30" fill="none" viewBox="0 0 1123 1185">
            <path d="M-100 200 L1200 -200" stroke="#CCCCF5" strokeWidth="4" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 gap-6">
          <h2 className="font-['Clash_Display',sans-serif] text-4xl lg:text-[48px] font-semibold text-[#25324b] leading-[1.1]">
            Latest <span className="text-[#26a4ff]">jobs open</span>
          </h2>
          <button onClick={() => navigate('/jobs')} className="flex items-center gap-4 text-[#4640DE] font-semibold hover:opacity-80 transition-opacity">
            Show all jobs <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <JobRowSkeleton key={i} />)
          ) : latestJobs.length > 0 ? (
            latestJobs.map((job) => (
              <JobCardLatest key={job.id} {...job} />
            ))
          ) : (
            <p className="col-span-full text-center text-[#7c8493]">No latest jobs configured.</p>
          )}
        </div>
      </div>
    </>
  );
}
