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
          cardBorder: 'hover:border-red-300',
          badgeBg: 'bg-red-50 text-red-600 border-red-200',
          pulseColor: 'bg-red-500',
          iconBg: 'bg-red-100 text-red-600',
        };
      case 'amber':
        return {
          cardBorder: 'hover:border-amber-300',
          badgeBg: 'bg-amber-50 text-amber-600 border-amber-200',
          pulseColor: 'bg-amber-500',
          iconBg: 'bg-amber-100 text-amber-600',
        };
      case 'blue':
        return {
          cardBorder: 'hover:border-blue-300',
          badgeBg: 'bg-blue-50 text-primary border-blue-200',
          pulseColor: 'bg-primary',
          iconBg: 'bg-blue-100 text-primary',
        };
      default:
        return {
          cardBorder: 'hover:border-zinc-300',
          badgeBg: 'bg-zinc-50 text-zinc-600 border-zinc-200',
          pulseColor: 'bg-zinc-400',
          iconBg: 'bg-zinc-100 text-zinc-600',
        };
    }
  };

  const styles = getBadgeStyle();

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    const classStr = `border border-zinc-200 bg-white p-6 flex flex-col justify-between h-40 shadow-sm transition-all duration-350 ${styles.cardBorder} hover:shadow-md`;
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
        <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold block mb-1">
          {title}
        </span>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-semibold ${styles.badgeBg}`}>
          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${styles.pulseColor}`} />
          {count}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-black text-black tracking-tight leading-none mb-2">
          {count}
        </h3>
        <p className="text-xs text-zinc-500 font-medium leading-normal">
          {description}
        </p>
      </div>
    </CardWrapper>
  );
};

export default StatisticsCard;
