import React from 'react';
import { useProfilePage } from '../hooks/useProfilePage';
import { profileDisplayService } from '../services/profile-display.service';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileCard } from '../components/ProfileCard';
import { SessionInfoCard } from '../components/SessionInfoCard';
import { SettingsCard } from '../components/SettingsCard';
import { ProfileEmptyState } from '../components/ProfileEmptyState';

export const ProfilePage: React.FC = () => {
  const {
    profile,
    isEmpty,
    settings,
    isSettingsEmpty,
    logout,
  } = useProfilePage();

  if (isEmpty || !profile) {
    return (
      <div className="flex flex-col gap-6 w-full animate-fade-in pb-10">
        <ProfileHeader onLogout={logout} />
        <ProfileEmptyState message={profileDisplayService.getEmptyProfileMessage()} />
      </div>
    );
  }

  const initials = profileDisplayService.getInitials(profile.fullName);
  const roleLabel = profileDisplayService.formatRole(profile.role);
  const rankLabel = profileDisplayService.formatRank(profile.rank);
  const statusLabel = profileDisplayService.formatActiveStatus(profile.isActive);
  const sessionSummary = profileDisplayService.getSessionSummary(profile);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-10">
      <ProfileHeader onLogout={logout} />

      <ProfileCard
        profile={profile}
        initials={initials}
        roleLabel={roleLabel}
        rankLabel={rankLabel}
        statusLabel={statusLabel}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SessionInfoCard
          profile={profile}
          roleLabel={roleLabel}
          statusLabel={statusLabel}
          sessionSummary={sessionSummary}
        />
        <SettingsCard
          settings={settings}
          isEmpty={isSettingsEmpty}
          emptyMessage={profileDisplayService.getEmptySettingsMessage()}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
