import React, { useState } from 'react';
import { useProfilePage } from '../hooks/useProfilePage';
import { profileDisplayService } from '../services/profile-display.service';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileCard } from '../components/ProfileCard';
import { SessionInfoCard } from '../components/SessionInfoCard';
import { SettingsCard } from '../components/SettingsCard';
import { ProfileEmptyState } from '../components/ProfileEmptyState';
import { EditProfileModal } from '../components/EditProfileModal';

export const ProfilePage: React.FC = () => {
  const {
    profile,
    isEmpty,
  } = useProfilePage();

  const [isEditOpen, setIsEditOpen] = useState(false);

  if (isEmpty || !profile) {
    return (
      <div className="flex flex-col gap-6 w-full animate-fade-in pb-10">
        <ProfileHeader />
        <ProfileEmptyState message={profileDisplayService.getEmptyProfileMessage()} />
      </div>
    );
  }

  const initials = profileDisplayService.getInitials(profile.fullName);
  const rankLabel = profileDisplayService.formatRank(profile.rank);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-10">
      <ProfileHeader onEditClick={() => setIsEditOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Profile Card */}
        <div className="lg:col-span-1">
          <ProfileCard
            profile={profile}
            initials={initials}
            rankLabel={rankLabel}
          />
        </div>

        {/* Right column - Settings and Sessions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <SettingsCard />
          <SessionInfoCard />
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
      />
    </div>
  );
};

export default ProfilePage;
