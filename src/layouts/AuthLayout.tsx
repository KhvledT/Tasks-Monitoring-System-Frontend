import React from "react";
import { Outlet } from "react-router";
import Login_Image from "../assets/Login_Image.webp";

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fa] text-text-dark font-sans relative overflow-hidden">
      {/* Left side: Collage / Branding */}
      <div className="hidden md:flex md:w-[60%] relative flex-col justify-between p-12 bg-zinc-900 text-white overflow-hidden select-none">
        {/* Background collage image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-85 z-0"
          style={{ backgroundImage: `url(${Login_Image})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60 z-10" />

        {/* Brand Header */}
        <div className="relative z-20 flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white border border-white/20 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5.5 h-5.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">MTMS</span>
        </div>

        {/* Main Title & Description */}
        <div className="relative z-20 max-w-xl my-auto flex flex-col gap-4">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Maritime Tasks
            <br />
            Monitoring System
          </h1>
          <p className="text-gray-200 text-sm leading-relaxed font-normal">
            A centralized platform for vessel operations, fleet logistics, and
            real-time maintenance monitoring. Designed for precision in the
            world's most demanding environments.
          </p>
        </div>

        {/* Footer info & status pills */}
        <div className="relative z-20 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-[10px] uppercase font-bold tracking-wider border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-pulse" />
              Fleet Status: Active Operational
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl text-[10px] uppercase font-bold tracking-wider border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              Sync Status: Live Data
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 font-medium font-mono">
            &copy; 2026 MARITIME MONITOR GLOBAL OPS CENTER
          </p>
        </div>
      </div>

      {/* Right side: Interactive Form Card container */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 z-10">
        <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm animate-fade-in flex flex-col justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
