import React from 'react';
import { useNavigate } from 'react-router';
import { JobTag } from './JobTag';

interface JobCardFeaturedProps {
  id?: string;
  logo: string;
  company: string;
  location: string;
  title: string;
  description: string;
  tags: string[];
}

export function JobCardFeatured({ id, logo, company, location, title, description, tags }: JobCardFeaturedProps) {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => id && navigate(`/jobs/${id}`)}
      className="bg-white border border-[#D6DDEB] p-6 hover:shadow-lg transition-shadow flex flex-col h-full group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
          <img src={logo} alt={`${company} logo`} className="max-w-full max-h-full object-contain" />
        </div>
        <div className="px-3 py-1 border border-[#4640DE] text-[#4640DE] text-sm font-normal whitespace-nowrap">
          Full Time
        </div>
      </div>
      <h3 className="font-['Epilogue',sans-serif] font-semibold text-xl text-[#25324b] mb-2 group-hover:text-[#4640DE] transition-colors line-clamp-1">
        {title}
      </h3>
      <p className="text-[#515b6f] text-base mb-4 flex items-center gap-2 line-clamp-1">
        {company} <span className="w-1 h-1 bg-[#515b6f] rounded-full opacity-30"></span> {location}
      </p>
      <p className="text-[#7c8493] text-base leading-relaxed mb-6 line-clamp-2 flex-grow">
        {description}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag, i) => (
          <JobTag key={i} text={tag} type="solid" />
        ))}
      </div>
    </div>
  );
}

interface JobCardLatestProps {
  id?: string;
  logo: string;
  company: string;
  location: string;
  title: string;
  tags: string[];
}

export function JobCardLatest({ id, logo, company, location, title, tags }: JobCardLatestProps) {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => id && navigate(`/jobs/${id}`)}
      className="bg-white border border-[#D6DDEB] p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:shadow-lg transition-shadow group cursor-pointer"
    >
      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
        <img src={logo} alt={`${company} logo`} className="max-w-full max-h-full object-contain" />
      </div>
      <div className="flex flex-col flex-grow min-w-0">
        <h3 className="font-['Epilogue',sans-serif] font-semibold text-xl text-[#25324b] mb-2 group-hover:text-[#4640DE] transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-[#515b6f] text-base flex items-center gap-2 line-clamp-1">
          {company} <span className="w-1 h-1 bg-[#515b6f] rounded-full opacity-30"></span> {location}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 flex-shrink-0 sm:ml-auto">
        {tags.map((tag, i) => (
          <JobTag key={i} text={tag} type="outline" />
        ))}
      </div>
    </div>
  );
}
