import React from 'react';
import { Card } from '@heroui/react';

interface ProgressCardProps {
  title: string;
  description: string;
  type: 'circular' | 'linear';
  value: number; // Percentage value (0-100)
  subtitle?: string; // Count or other indicator
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  description,
  type,
  value,
  subtitle,
}) => {
  const roundedValue = Math.min(Math.max(Math.round(value), 0), 100);

  if (type === 'circular') {
    // SVG Circular Ring parameters
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (roundedValue / 100) * circumference;

    return (
      <Card className="border border-zinc-200 bg-white p-6 flex flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition duration-350">
        <div className="flex-1">
          <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold block mb-1">
            {title}
          </span>
          <h3 className="text-2xl font-black text-black tracking-tight leading-none mb-2">
            {roundedValue}%
          </h3>
          <p className="text-xs text-zinc-500 font-medium leading-normal">
            {description}
          </p>
        </div>
        <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background track circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-zinc-100"
              strokeWidth="6.5"
              fill="transparent"
            />
            {/* Progress ring track circle */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#0052CC"
              className="transition-all duration-700 ease-out"
              strokeWidth="6.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          {/* Centered label */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-sm font-extrabold text-black tracking-tighter">
              {roundedValue}%
            </span>
            <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-wider">
              SCORE
            </span>
          </div>
        </div>
      </Card>
    );
  }

  // Linear progress layout
  return (
    <Card className="border border-zinc-200 bg-white p-6 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition duration-350">
      <div>
        <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold block mb-1">
          {title}
        </span>
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-2xl font-black text-black tracking-tight leading-none">
            {roundedValue}%
          </h3>
          {subtitle && (
            <span className="text-xs font-semibold text-zinc-500 font-mono">
              {subtitle}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 font-medium leading-normal mb-3">
          {description}
        </p>
      </div>

      <div className="w-full">
        {/* Progress Bar Track */}
        <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
          <div
            className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${roundedValue}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProgressCard;
