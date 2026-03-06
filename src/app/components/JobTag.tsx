import React from 'react';

export const JobTag = ({ text, type = 'solid' }: { text: string; type?: 'solid' | 'outline' }) => {
  const getColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'design':
        return { text: '#56CDAD', bg: 'rgba(86,205,173,0.1)', border: '#56CDAD' };
      case 'marketing':
        return { text: '#FFB836', bg: 'rgba(255,184,54,0.1)', border: '#FFB836' };
      case 'business':
        return { text: '#4640DE', bg: 'rgba(70,64,222,0.1)', border: '#4640DE' };
      case 'technology':
        return { text: '#FF6550', bg: 'rgba(255,101,80,0.1)', border: '#FF6550' };
      case 'full-time':
      case 'full time':
        // For Latest Jobs Open, Full-Time is green, but let's make it primary colored for outline usually, or just match exactly:
        return { text: '#56CDAD', bg: 'rgba(86,205,173,0.1)', border: '#56CDAD' };
      default:
        return { text: '#4640DE', bg: 'rgba(70,64,222,0.1)', border: '#4640DE' };
    }
  };

  const colors = getColor(text);

  if (type === 'outline') {
    return (
      <div 
        className="px-3 py-1 rounded-full border border-solid text-sm font-semibold whitespace-nowrap"
        style={{ borderColor: colors.border, color: colors.text }}
      >
        {text}
      </div>
    );
  }

  return (
    <div 
      className="px-4 py-1 rounded-full text-[14px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {text}
    </div>
  );
};
