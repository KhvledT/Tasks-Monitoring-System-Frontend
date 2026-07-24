import React, { useState } from "react";
import { Card } from "@heroui/react";
import { motion } from "framer-motion";
import { UserAvatar } from "./UserAvatar";
import type { Profile } from "../types/profile.types";
import { useActiveVessel } from "../../../shared/hooks/useActiveVessel";
import { ImagePreviewModal } from "../../../shared/components/ImagePreviewModal";

interface ProfileCardProps {
  profile: Profile;
  initials: string;
  rankLabel: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  initials,
  rankLabel,
}) => {
  const { activeVessel } = useActiveVessel();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const formatDisplayDate = (isoStr?: string) => {
    if (!isoStr) return "N/A";
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return isoStr;
    }
  };

  const avatarUrl = (profile as any).avatarUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border border-zinc-200 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
        <div className="flex flex-col items-center gap-5">
          <UserAvatar
            initials={initials}
            fullName={profile.fullName}
            avatarUrl={avatarUrl}
          />

          {avatarUrl && (
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="text-xs font-bold text-primary hover:text-blue-700 transition flex items-center gap-1.5 cursor-pointer -mt-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              Preview Profile Picture
            </button>
          )}

          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              {profile.fullName || "Unnamed Officer"}
            </h2>
            <p className="text-sm text-zinc-500 font-semibold mt-0.5">
              {rankLabel}
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b border-zinc-100">
              <span className="text-xs text-zinc-400 font-bold">Email</span>
              <span className="text-xs font-bold text-gray-800">
                {profile.email}
              </span>
            </div>
            {profile.signOnDate && (
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <span className="text-xs text-zinc-400 font-bold">
                  Sign-on Date
                </span>
                <span className="text-xs font-bold text-gray-800">
                  {formatDisplayDate(profile.signOnDate)}
                </span>
              </div>
            )}
            {(profile as any).phone && (
              <div className="flex items-center justify-between py-2 border-b border-zinc-100">
                <span className="text-xs text-zinc-400 font-bold">
                  Phone Number
                </span>
                <span className="text-xs font-bold text-gray-800 font-mono">
                  {(profile as any).phone}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-zinc-400 font-bold">
                Active Vessel
              </span>
              <span className="text-xs font-bold text-gray-800 font-mono">
                {activeVessel?.name || "No Active Vessel"}
              </span>
            </div>
          </div>

          {/* Dynamic Account Verification Status Card */}
          <div className="w-full bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-5 h-5 text-emerald-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-extrabold text-emerald-950">
                Account Status
              </h4>
              <p className="text-[11px] text-emerald-800 font-medium mt-0.5 leading-relaxed">
                {(profile as any).isVerified !== false
                  ? "Your officer account credentials and session tokens are active and verified."
                  : "Email verification is pending."}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <ImagePreviewModal
        isOpen={isPreviewOpen}
        src={avatarUrl || null}
        title={`${profile.fullName || "Officer"} - Profile Picture`}
        onClose={() => setIsPreviewOpen(false)}
      />
    </motion.div>
  );
};

export default ProfileCard;
