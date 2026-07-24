import React from 'react';

interface RolePermissionsCardProps {
  role?: string;
}

export const RolePermissionsCard: React.FC<RolePermissionsCardProps> = ({ role }) => {
  const getPermissionsList = () => {
    if (role === 'SUPER_ADMIN') {
      return [
        { label: 'Global Platform Governance & User Directory', desc: 'Full control over user activation, suspension & reset' },
        { label: 'Promote Users to Captains & Demote Privileges', desc: 'SaaS user promotion and role authorization' },
        { label: 'Reassign Vessel Ownership & Lifecycle States', desc: 'Manage VIP vessels, transfer ownership & draft states' },
        { label: 'Fleet-wide Analytics & Live Telemetry', desc: 'Monitor active vessels, completed checks & defects' },
        { label: 'System Security Audit Log Timeline', desc: 'Trace administrative actions with timestamped logs' },
      ];
    }

    if (role === 'ADMIN') {
      return [
        { label: 'Command Shipboard Crew Roster & Ranks', desc: 'Oversee officers, reassign rank weights & inspect drawers' },
        { label: 'Approve or Reject Crew Join Applications', desc: 'Manage pending officer applications and access' },
        { label: 'Custom Vessel Checklist Templates & Categories', desc: 'Design shipboard task definitions & measurement units' },
        { label: 'Inspect Defect Telemetry & Export PDF Reports', desc: 'Monitor machinery breakdown alarms & generate logbooks' },
        { label: 'Generate Invitation Codes & QR Passes', desc: 'Print shipboard joining passes for onboarding' },
      ];
    }

    return [
      { label: 'Execute Watch & Daily Checklist Tasks', desc: 'Sign off routine inspection checks & enter measurements' },
      { label: 'Log & Report Machinery Issues', desc: 'Submit defect alarms with department taxonomy' },
      { label: 'Inspect Logbook History Timeline', desc: 'View past completed watch sessions & records' },
      { label: 'Join VIP Vessels via Invite Code or QR', desc: 'Apply to join captain-managed vessels' },
      { label: 'Personal Vessel Auto-Task Provisioning', desc: 'Create private personal vessels with auto-cloned templates' },
    ];
  };

  const permissions = getPermissionsList();

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4 font-sans justify-between">
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
          Account Capabilities
        </span>
        <h3 className="text-base font-extrabold text-black tracking-tight mt-1.5">
          Role Permissions Summary
        </h3>
        <p className="text-xs text-zinc-400">
          Authorized capabilities granted to your account role.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {permissions.map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-zinc-50/70 border border-zinc-150 rounded-2xl flex items-start gap-3 transition hover:bg-zinc-50"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">
              ✓
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-black">{item.label}</span>
              <span className="text-[11px] text-zinc-500 font-medium">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolePermissionsCard;
