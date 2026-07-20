import React from 'react';

interface ProfileHeaderProps {
  onEditClick?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onEditClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5 mb-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-sans">
          Officer Settings
        </h1>
      </div>

      {onEditClick && (
        <button
          onClick={onEditClick}
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-[#003fa3] text-white text-xs font-semibold rounded-xl transition duration-150 active:scale-[0.98] cursor-pointer shadow-sm"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default ProfileHeader;
