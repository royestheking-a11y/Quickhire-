import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    circle?: boolean;
}

export function Skeleton({ className = "", width, height, circle = false }: SkeletonProps) {
    const style: React.CSSProperties = {
        width: width,
        height: height,
        borderRadius: circle ? '50%' : undefined,
    };

    return (
        <div
            className={`skeleton ${className}`}
            style={style}
        />
    );
}

export function JobCardSkeleton() {
    return (
        <div className="p-8 border border-[#D6DDEB] rounded-lg bg-white">
            <div className="flex justify-between items-start mb-6">
                <Skeleton width={64} height={64} />
                <Skeleton width={80} height={24} />
            </div>
            <Skeleton width="80%" height={28} className="mb-3" />
            <Skeleton width="100%" height={24} className="mb-6" />
            <div className="flex gap-2">
                <Skeleton width={60} height={28} />
                <Skeleton width={60} height={28} />
            </div>
        </div>
    );
}

export function JobRowSkeleton() {
    return (
        <div className="p-6 bg-white border border-[#D6DDEB] rounded-lg flex items-center gap-6">
            <Skeleton width={64} height={64} />
            <div className="flex-1">
                <Skeleton width="40%" height={24} className="mb-2" />
                <Skeleton width="60%" height={20} />
            </div>
            <div className="hidden md:flex gap-2">
                <Skeleton width={80} height={32} />
                <Skeleton width={80} height={32} />
            </div>
        </div>
    );
}

export function CompanyCardSkeleton() {
    return (
        <div className="border border-[#D6DDEB] p-8 rounded-2xl bg-white">
            <div className="flex items-center gap-6 mb-8">
                <Skeleton width={64} height={64} className="rounded-xl" />
                <div className="flex-1">
                    <Skeleton width="60%" height={24} className="mb-2" />
                    <Skeleton width="40%" height={20} />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <Skeleton width={80} height={24} className="rounded-full" />
                    <Skeleton width={80} height={24} className="rounded-full" />
                </div>
                <Skeleton width={24} height={24} />
            </div>
        </div>
    );
}

export function JobDetailSkeleton() {
    return (
        <div className="bg-white flex-1 flex flex-col">
            <div className="bg-[#f8f8fd] py-12 px-6 lg:px-[124px]">
                <Skeleton width={100} height={24} className="mb-8" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Skeleton width={80} height={80} className="rounded-2xl" />
                        <div>
                            <Skeleton width={300} height={32} className="mb-2" />
                            <Skeleton width={200} height={20} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-6 lg:px-[124px] py-16 flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto w-full">
                <div className="flex-1">
                    <Skeleton width={200} height={32} className="mb-6" />
                    <Skeleton width="100%" height={20} className="mb-2" />
                    <Skeleton width="100%" height={20} className="mb-2" />
                    <Skeleton width="80%" height={20} className="mb-10" />
                    <Skeleton width={200} height={32} className="mb-6" />
                    <Skeleton width="100%" height={100} />
                </div>
                <div className="w-full lg:w-1/3">
                    <Skeleton width="100%" height={400} className="rounded-3xl" />
                </div>
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number, cols?: number }) {
    return (
        <div className="bg-white rounded-2xl border border-[#D6DDEB] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#f8f8fd] border-b border-[#D6DDEB]">
                            {Array.from({ length: cols }).map((_, i) => (
                                <th key={i} className="p-5"><Skeleton width={80} height={20} /></th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D6DDEB]">
                        {Array.from({ length: rows }).map((_, i) => (
                            <tr key={i}>
                                {Array.from({ length: cols }).map((_, j) => (
                                    <td key={j} className="p-5"><Skeleton width="100%" height={24} /></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
