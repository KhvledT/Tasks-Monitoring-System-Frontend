import React from 'react';
import { NavigationCard, type NavCardItem } from './NavigationCard';
import { ROUTES } from '../../../constants/routes';

interface QuickActionGridProps {
  role?: string;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = ({ role }) => {
  const getNavCards = (): NavCardItem[] => {
    // ----------------------------------------------------
    // SUPER ADMIN CARDS
    // ----------------------------------------------------
    if (role === 'SUPER_ADMIN') {
      return [
        {
          id: 'admin-dashboard',
          title: 'Platform Command Portal',
          description: 'Super Admin master dashboard with system health, zero vessel cards & platform telemetry.',
          path: ROUTES.DASHBOARD,
          buttonText: 'Open Command Portal',
          badgeText: 'Master View',
          badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
          iconBg: 'bg-purple-50',
          iconColor: 'text-purple-600',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          ),
        },
        {
          id: 'admin-users',
          title: 'Users Directory & Promotion',
          description: 'Manage registered user accounts, reset credentials, and promote Officers to Captain.',
          path: ROUTES.USERS_MANAGEMENT,
          buttonText: 'Manage Users Roster',
          badgeText: 'Promotions',
          badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          iconBg: 'bg-indigo-50',
          iconColor: 'text-indigo-600',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6 0 3.375 3.375 0 0 1 6 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          ),
        },
        {
          id: 'admin-captains',
          title: 'Captains Management Roster',
          description: 'View active Captains, suspend credentials, and execute vessel ownership transfers.',
          path: ROUTES.CAPTAINS_MANAGEMENT,
          buttonText: 'Manage Captains',
          badgeText: 'Governance',
          badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
          iconBg: 'bg-sky-50',
          iconColor: 'text-sky-600',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          ),
        },
        {
          id: 'admin-vip',
          title: 'VIP Vessels & Lifecycle',
          description: 'Inspect VIP vessels, monitor captain assignments, and transition vessel states.',
          path: ROUTES.VIP_VESSELS,
          buttonText: 'Inspect VIP Fleet',
          badgeText: 'VIP Fleet',
          badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
          iconBg: 'bg-amber-50',
          iconColor: 'text-amber-600',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          ),
        },
        {
          id: 'admin-templates',
          title: 'Global Master Templates',
          description: 'Define system-wide master checklist templates and rank assignment version mappings.',
          path: ROUTES.GLOBAL_TEMPLATES,
          buttonText: 'Manage Global Templates',
          badgeText: 'Master Checklists',
          badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          ),
        },
        {
          id: 'admin-health',
          title: 'System Health Check',
          description: 'Real-time database ping, process uptime, memory telemetry, and server health status.',
          path: ROUTES.HEALTH_CHECK,
          buttonText: 'Inspect System Health',
          badgeText: 'Live Telemetry',
          badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          ),
        },
        {
          id: 'profile-settings',
          title: 'Account Settings & Profile',
          description: 'Update custodian profile credentials, email preferences, and security passwords.',
          path: ROUTES.PROFILE,
          buttonText: 'Open Profile Settings',
          badgeText: 'Account',
          badgeStyle: 'bg-zinc-100 text-zinc-600 border-zinc-200',
          iconBg: 'bg-zinc-100',
          iconColor: 'text-zinc-700',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          ),
        },
      ];
    }

    // ----------------------------------------------------
    // CAPTAIN (ADMIN) CARDS
    // ----------------------------------------------------
    if (role === 'ADMIN') {
      return [
        {
          id: 'captain-dashboard',
          title: 'Captain Command Dashboard',
          description: 'Vessel management cockpit with defect alarm overview & pending crew applications queue.',
          path: ROUTES.DASHBOARD,
          buttonText: 'Open Command Dashboard',
          badgeText: 'Captain Cockpit',
          badgeStyle: 'bg-sky-50 text-sky-700 border-sky-200',
          iconBg: 'bg-sky-50',
          iconColor: 'text-sky-600',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          ),
        },
        {
          id: 'select-vessel',
          title: 'Select & Manage VIP Vessels',
          description: 'Choose active vessel context, configure VIP ship settings, or launch First-Time Captain Wizard.',
          path: ROUTES.SELECT_VESSEL,
          buttonText: 'Manage VIP Ships',
          badgeText: 'Ship Selector',
          badgeStyle: 'bg-[#0055d4]/10 text-[#0055d4] border-[#0055d4]/20',
          iconBg: 'bg-blue-50',
          iconColor: 'text-[#0055d4]',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
            </svg>
          ),
        },
        {
          id: 'crew-management',
          title: 'Crew Management Roster',
          description: 'Inspect shipboard roster, assign officer ranks, view officer performance & rank weights.',
          path: ROUTES.CREW,
          buttonText: 'Manage Crew Roster',
          badgeText: 'Ship Roster',
          badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          iconBg: 'bg-indigo-50',
          iconColor: 'text-indigo-600',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6 0 3.375 3.375 0 0 1 6 0Z" />
            </svg>
          ),
        },
        {
          id: 'join-requests',
          title: 'Pending Join Requests',
          description: 'Review officer applications wanting to join your vessel and approve or reject access.',
          path: ROUTES.CREW_REQUESTS,
          buttonText: 'Authorize Applicants',
          badgeText: 'Applications',
          badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          iconBg: 'bg-emerald-50',
          iconColor: 'text-emerald-600',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6 0 3.375 3.375 0 0 1 6 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.765Z" />
            </svg>
          ),
        },
        {
          id: 'qr-invite',
          title: 'Shipboard QR Invite Pass',
          description: 'Generate join codes and printable QR invitation passes for seamless crew onboarding.',
          path: ROUTES.QR_INVITE,
          buttonText: 'Generate Join Pass',
          badgeText: 'QR Code Pass',
          badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
          iconBg: 'bg-amber-50',
          iconColor: 'text-amber-600',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
            </svg>
          ),
        },
        {
          id: 'vessel-templates',
          title: 'Vessel Checklist Templates',
          description: 'Design and customize shipboard inspection templates and versioning definitions.',
          path: ROUTES.TEMPLATES,
          buttonText: 'Build Custom Templates',
          badgeText: 'Checklist Builder',
          badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
          iconBg: 'bg-purple-50',
          iconColor: 'text-purple-600',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          ),
        },
        {
          id: 'reports',
          title: 'Reports & Compliance PDF',
          description: 'Generate compliance logbook exports and inspection summary PDFs for maritime audits.',
          path: ROUTES.REPORTS,
          buttonText: 'Export Vessel Reports',
          badgeText: 'PDF Exports',
          badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
          iconBg: 'bg-rose-50',
          iconColor: 'text-rose-600',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          ),
        },
        {
          id: 'profile-settings',
          title: 'Captain Profile & Settings',
          description: 'Manage captain profile parameters, notification preferences, and security settings.',
          path: ROUTES.PROFILE,
          buttonText: 'Open Profile Settings',
          badgeText: 'Account',
          badgeStyle: 'bg-zinc-100 text-zinc-600 border-zinc-200',
          iconBg: 'bg-zinc-100',
          iconColor: 'text-zinc-700',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          ),
        },
      ];
    }

    // ----------------------------------------------------
    // USER (OFFICER) CARDS
    // ----------------------------------------------------
    return [
      {
        id: 'user-dashboard',
        title: 'Operational Workspace Dashboard',
        description: 'Shipboard task cockpit with watch progress visualization, postponed tasks & critical alarms.',
        path: ROUTES.DASHBOARD,
        buttonText: 'Open Task Dashboard',
        badgeText: 'Operational',
        badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
        iconSvg: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
          </svg>
        ),
      },
      {
        id: 'select-vessel',
        title: 'Select or Join Vessel',
        description: 'Choose active vessel context, create personal vessel, or submit application code to join VIP ship.',
        path: ROUTES.SELECT_VESSEL,
        buttonText: 'Select / Switch Vessel',
        badgeText: 'Workspace Context',
        badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200',
        iconBg: 'bg-blue-50',
        iconColor: 'text-[#0055d4]',
        iconSvg: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
          </svg>
        ),
      },
      {
        id: 'checklists',
        title: 'Daily Checklist Execution',
        description: 'Execute routine watchkeeping checks, log machinery measurements, and complete shift sign-offs.',
        path: ROUTES.CHECKLISTS,
        buttonText: 'Execute Inspection Checks',
        badgeText: 'Checklist Execution',
        badgeStyle: 'bg-[#0055d4]/10 text-[#0055d4] border-[#0055d4]/20',
        iconBg: 'bg-sky-50',
        iconColor: 'text-sky-600',
        iconSvg: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0 1 12 3c1.2 0 2.392.049 3.57.145m-7.377 0a48.474 48.474 0 0 0-1.123.08A2.25 2.25 0 0 0 4.5 6.108V16.5A2.25 2.25 0 0 0 6.75 18.75h3.75M8.25 21h8.25" />
          </svg>
        ),
      },
      {
        id: 'issues',
        title: 'Machinery Defect Alarms',
        description: 'Report machinery breakdown alarms, upload defect notes, and track resolution status.',
        path: ROUTES.ISSUES,
        buttonText: 'Log Machinery Issue',
        badgeText: 'Alarms & Defects',
        badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-600',
        iconSvg: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        ),
      },
      {
        id: 'history',
        title: 'Logbook History Timeline',
        description: 'Inspect past completed watch sessions, historical measurements, and sign-off records.',
        path: ROUTES.HISTORY,
        buttonText: 'Open History Timeline',
        badgeText: 'Audit Trail',
        badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        iconBg: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
        iconSvg: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        ),
      },
      {
        id: 'reports',
        title: 'Reports & Exports',
        description: 'Generate compliance logbook exports and PDF inspection summaries.',
        path: ROUTES.REPORTS,
        buttonText: 'Generate Logbook PDF',
        badgeText: 'PDF Exports',
        badgeStyle: 'bg-rose-50 text-rose-700 border-rose-200',
        iconBg: 'bg-rose-50',
        iconColor: 'text-rose-600',
        iconSvg: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        ),
      },
      {
        id: 'profile-settings',
        title: 'Officer Profile & Settings',
        description: 'Manage personal officer profile credentials, email options, and security settings.',
        path: ROUTES.PROFILE,
        buttonText: 'Open Officer Profile',
        badgeText: 'Account',
        badgeStyle: 'bg-zinc-100 text-zinc-600 border-zinc-200',
        iconBg: 'bg-zinc-100',
        iconColor: 'text-zinc-700',
        iconSvg: (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        ),
      },
    ];
  };

  const navCards = getNavCards();

  return (
    <div className="flex flex-col gap-4 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0055d4] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            Navigation Hub
          </span>
          <h2 className="text-xl font-extrabold text-black tracking-tight mt-1">
            Available Workspace Modules & Destinations
          </h2>
        </div>
        <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
          {navCards.length} Modules Available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {navCards.map((item) => (
          <NavigationCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default QuickActionGrid;
