import React from 'react';
import { Card } from '@heroui/react';
import { Link } from 'react-router';

interface StatisticsCardProps {
  title: string;
  count: number;
  description: string;
  badgeColor?: 'red' | 'amber' | 'blue' | 'zinc';
  linkTo?: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  count,
  description,
  badgeColor = 'zinc',
  linkTo,
}) => {
  const getBadgeStyle = () => {
    switch (badgeColor) {
      case 'red':
        return {
          cardBorder: 'hover:border-red-900/60',
          badgeBg: 'bg-red-950/20 text-red-400 border-red-900/50 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
          pulseColor: 'bg-red-500',
        };
      case 'amber':
        return {
          cardBorder: 'hover:border-amber-900/60',
          badgeBg: 'bg-amber-950/20 text-amber-400 border-amber-900/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
          pulseColor: 'bg-amber-500',
        };
      case 'blue':
        return {
          cardBorder: 'hover:border-sky-900/60',
          badgeBg: 'bg-sky-950/20 text-sky-400 border-sky-900/50 shadow-[0_0_10px_rgba(14,165,233,0.1)]',
          pulseColor: 'bg-sky-500',
        };
      default:
        return {
          cardBorder: 'hover:border-zinc-800',
          badgeBg: 'bg-zinc-900/50 text-zinc-350 border-zinc-800',
          pulseColor: 'bg-zinc-400',
        };
    }
  };

  const styles = getBadgeStyle();

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    const classStr = `border border-zinc-900 bg-zinc-950/40 p-6 flex flex-col justify-between h-40 backdrop-blur-md transition-all duration-350 ${styles.cardBorder}`;
    if (linkTo) {
      return (
        <Link to={linkTo} className="block group">
          <Card className={`${classStr} group-hover:scale-[1.005] group-active:scale-[0.995]`}>
            {children}
          </Card>
        </Link>
      );
    }
    return <Card className={classStr}>{children}</Card>;
  };

  return (
    <CardWrapper>
      <div className="flex items-start justify-between">
        <span className="text-[10px] text-zinc-550 uppercase tracking-widest font-bold block mb-1">
          {title}
        </span>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-semibold ${styles.badgeBg}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${styles.pulseColor}`} />
          {count}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-black text-zinc-150 tracking-tight leading-none mb-2">
          {count}
        </h3>
        <p className="text-xs text-zinc-400 font-medium leading-normal">
          {description}
        </p>
      </div>
    </CardWrapper>
  );
};

export default StatisticsCard;
