import { ROUTES } from '../constants/routes';

export interface NavigationItem {
  label: string;
  path: string;
  icon: string;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'Dashboard',
  },
  {
    label: 'Checklists',
    path: ROUTES.CHECKLISTS,
    icon: 'Checklist',
  },
  {
    label: 'Issues',
    path: ROUTES.ISSUES,
    icon: 'Warning',
  },
  {
    label: 'Logbook History',
    path: ROUTES.HISTORY,
    icon: 'History',
  },
  {
    label: 'Profile',
    path: ROUTES.PROFILE,
    icon: 'Profile',
  },
  {
    label: 'Reports & Exports',
    path: ROUTES.REPORTS,
    icon: 'Reports',
  },
];
