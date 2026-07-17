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
      <Card className="border border-zinc-900 bg-zinc-950/40 p-6 flex flex-row items-center justify-between gap-6 backdrop-blur-md hover:border-zinc-800 transition duration-350">
        <div className="flex-1">
          <span className="text-[10px] text-zinc-550 uppercase tracking-widest font-bold block mb-1">
            {title}
          </span>
          <h3 className="text-2xl font-black text-zinc-150 tracking-tight leading-none mb-2">
            {roundedValue}%
          </h3>
          <p className="text-xs text-zinc-400 font-medium leading-normal">
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
              className="stroke-zinc-900"
              strokeWidth="6.5"
              fill="transparent"
            />
            {/* Progress ring track circle with linear gradient */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-sky-500 transition-all duration-700 ease-out"
              strokeWidth="6.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          {/* Centered label */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-sm font-extrabold text-zinc-200 tracking-tighter">
              {roundedValue}%
            </span>
            <span className="text-[7px] text-zinc-500 font-bold uppercase tracking-wider">
              SCORE
            </span>
          </div>
        </div>
      </Card>
    );
  }

  // Linear progress layout
  return (
    <Card className="border border-zinc-900 bg-zinc-950/40 p-6 flex flex-col justify-between gap-4 backdrop-blur-md hover:border-zinc-800 transition duration-350">
      <div>
        <span className="text-[10px] text-zinc-550 uppercase tracking-widest font-bold block mb-1">
          {title}
        </span>
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-2xl font-black text-zinc-150 tracking-tight leading-none">
            {roundedValue}%
          </h3>
          {subtitle && (
            <span className="text-xs font-semibold text-zinc-450 font-mono">
              {subtitle}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-400 font-medium leading-normal mb-3">
          {description}
        </p>
      </div>

      <div className="w-full">
        {/* Progress Bar Track */}
        <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${roundedValue}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProgressCard;
