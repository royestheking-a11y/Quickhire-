import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { getJobs, Job } from '../store';
import { JobCardFeatured } from '../components/JobCards';
import { JobCardSkeleton } from '../components/Skeleton';

export function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs().then(jobs => {
      setAllJobs(jobs);
      setLoading(false);
    });
  }, []);

  const initialQuery = searchParams.get('query') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || '';

  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allJobs.forEach(job => job.tags.forEach(tag => cats.add(tag)));
    return Array.from(cats);
  }, [allJobs]);

  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      const matchQuery = !query ||
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase());

      const matchLocation = !location ||
        job.location.toLowerCase().includes(location.toLowerCase());

      const matchCategory = !category ||
        job.tags.some(tag => tag.toLowerCase() === category.toLowerCase());

      return matchQuery && matchLocation && matchCategory;
    });
  }, [query, location, category, allJobs]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    setSearchParams(params);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header section */}
      <div className="bg-[#f8f8fd] py-16 px-6 lg:px-[124px] text-center">
        <h1 className="font-['Clash_Display',sans-serif] text-4xl lg:text-[48px] font-semibold text-[#25324b] mb-4">
          Find your <span className="text-[#26a4ff]">dream job</span>
        </h1>
        <p className="text-[#515b6f] text-lg max-w-2xl mx-auto">
          Browse through thousands of job openings and find the perfect match for your career goals.
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 lg:px-[124px] py-12 flex flex-col lg:flex-row gap-8 bg-white">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-1/4">
          <form onSubmit={handleFilter} className="bg-white border border-[#D6DDEB] p-6 rounded sticky top-6">
            <h3 className="font-bold text-[#25324b] text-xl mb-6">Filter Jobs</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#515b6f] mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" /> Search
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, keyword, company"
                className="w-full border border-[#D6DDEB] p-3 rounded text-[#25324b] outline-none focus:border-[#4640DE]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#515b6f] mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-[#D6DDEB] p-3 rounded text-[#25324b] outline-none focus:border-[#4640DE] bg-white"
              >
                <option value="">Any Location</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Madrid">Madrid</option>
                <option value="Berlin">Berlin</option>
                <option value="Paris">Paris</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-[#515b6f] mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[#D6DDEB] p-3 rounded text-[#25324b] outline-none focus:border-[#4640DE] bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="w-full bg-[#4640DE] text-white font-bold py-3 rounded hover:bg-[#4640DE]/90 transition-colors">
              Apply Filters
            </button>
            <button
              type="button"
              onClick={() => { setQuery(''); setLocation(''); setCategory(''); setSearchParams(new URLSearchParams()); }}
              className="w-full mt-3 bg-transparent text-[#4640DE] border border-[#4640DE] font-bold py-3 rounded hover:bg-[#4640DE]/5 transition-colors"
            >
              Clear Filters
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="w-full lg:w-3/4">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#25324b]">
              Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => <JobCardSkeleton key={i} />)}
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map(job => (
                <JobCardFeatured key={job.id} {...job} />
              ))}
            </div>
          ) : (
            <div className="bg-[#f8f8fd] p-12 text-center border border-[#D6DDEB] rounded">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-[#4640DE]">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#25324b] mb-2">No jobs found</h3>
              <p className="text-[#515b6f]">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
