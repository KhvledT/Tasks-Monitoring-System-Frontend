import React from 'react';
import { Link } from 'react-router';

export interface NavCardItem {
  id: string;
  title: string;
  description: string;
  path: string;
  buttonText: string;
  badgeText?: string;
  badgeStyle?: string;
  iconBg: string;
  iconColor: string;
  iconSvg: React.ReactNode;
}

interface NavigationCardProps {
  item: NavCardItem;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({ item }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-5 transition hover:border-[#0055d4]/40 hover:shadow-md font-sans group">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className={`w-12 h-12 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center font-bold text-xl shadow-2xs group-hover:scale-105 transition-transform`}>
            {item.iconSvg}
          </div>
          {item.badgeText && (
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${item.badgeStyle || 'bg-zinc-100 text-zinc-600 border-zinc-200'}`}>
              {item.badgeText}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <h3 className="text-base font-extrabold text-black tracking-tight group-hover:text-[#0055d4] transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-zinc-500 font-medium leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      <Link
        to={item.path}
        className="w-full py-2.5 px-4 bg-zinc-50 hover:bg-[#0055d4] text-zinc-700 hover:text-white border border-zinc-200 hover:border-[#0055d4] text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs group-hover:shadow-sm"
      >
        <span>{item.buttonText}</span>
        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
      </Link>
    </div>
  );
};

export default NavigationCard;
