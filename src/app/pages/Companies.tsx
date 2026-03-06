import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Building2, Search, ArrowRight } from 'lucide-react';
import { getJobs, Job } from '../store';
import { CompanyCardSkeleton } from '../components/Skeleton';

export function Companies() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJobs().then(data => {
            setJobs(data);
            setLoading(false);
        });
    }, []);

    const companyStats = useMemo(() => {
        const stats: Record<string, { logo: string, jobCount: number }> = {};
        jobs.forEach(job => {
            if (!stats[job.company]) {
                stats[job.company] = { logo: job.logo, jobCount: 0 };
            }
            stats[job.company].jobCount++;
        });
        return Object.entries(stats).map(([name, data]) => ({ name, ...data }));
    }, [jobs]);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="bg-[#f8f8fd] py-16 px-6 lg:px-[124px] text-center border-b border-[#D6DDEB]">
                <h1 className="font-['Clash_Display',sans-serif] text-4xl lg:text-[48px] font-semibold text-[#25324b] mb-4">
                    Browse <span className="text-[#26a4ff]">Companies</span>
                </h1>
                <p className="text-[#515b6f] text-lg max-w-2xl mx-auto">
                    Discover your next employer from our curated list of top startups and established tech giants.
                </p>
            </div>

            <div className="bg-white px-6 lg:px-[124px] py-16 max-w-7xl mx-auto w-full">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => <CompanyCardSkeleton key={i} />)}
                    </div>
                ) : companyStats.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {companyStats.map((company) => (
                            <div key={company.name} className="border border-[#D6DDEB] p-8 rounded-2xl hover:border-[#4640DE] hover:shadow-xl transition-all group cursor-pointer" onClick={() => navigate(`/jobs?query=${company.name}`)}>
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-16 h-16 bg-white border border-[#D6DDEB] p-3 rounded-xl flex items-center justify-center group-hover:border-[#4640DE]/30">
                                        <img src={company.logo} alt={company.name} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="font-['Clash_Display',sans-serif] text-2xl font-semibold text-[#25324b]">{company.name}</h3>
                                        <p className="text-[#4640DE] font-semibold">{company.jobCount} Jobs Open</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <span className="bg-[#f8f8fd] px-3 py-1 rounded-full text-xs font-semibold text-[#515b6f]">Technology</span>
                                        <span className="bg-[#f8f8fd] px-3 py-1 rounded-full text-xs font-semibold text-[#515b6f]">Startup</span>
                                    </div>
                                    <button className="text-[#4640DE] opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-[#7c8493]">No companies found.</div>
                )}
            </div>
        </div>
    );
}
