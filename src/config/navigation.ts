import { ROUTES } from "../constants/routes";

export interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  allowedRoles?: Array<"USER" | "ADMIN" | "SUPER_ADMIN">;
  vesselModes?: Array<"Personal" | "VIP">;
  requiresVessel?: boolean;
}

export const NAVIGATION_ITEMS: NavigationItem[] = [
  // Shared Workspace Home
  {
    label: "Workspace Home",
    path: ROUTES.WORKSPACE_HOME,
    icon: "Home",
    allowedRoles: ["USER", "ADMIN", "SUPER_ADMIN"],
    requiresVessel: false,
  },
  // Shared Dashboard (Renders role-specific view inside)
  {
    label: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: "Dashboard",
    allowedRoles: ["USER", "ADMIN", "SUPER_ADMIN"],
    requiresVessel: true,
  },

  // ==========================================
  // USER ONLY NAVIGATION ITEMS
  // ==========================================
  {
    label: "Checklists",
    path: ROUTES.CHECKLISTS,
    icon: "Checklist",
    allowedRoles: ["USER"],
    requiresVessel: true,
  },
  {
    label: "Issues",
    path: ROUTES.ISSUES,
    icon: "Warning",
    allowedRoles: ["USER"],
    requiresVessel: true,
  },
  {
    label: "Logbook History",
    path: ROUTES.HISTORY,
    icon: "History",
    allowedRoles: ["USER"],
    requiresVessel: true,
  },
  {
    label: "Reports & Exports",
    path: ROUTES.REPORTS,
    icon: "Reports",
    allowedRoles: ["USER"],
    requiresVessel: true,
  },

  // ==========================================
  // CAPTAIN (ADMIN) NAVIGATION ITEMS
  // ==========================================
  {
    label: "Crew Management",
    path: ROUTES.CREW,
    icon: "Crew",
    allowedRoles: ["ADMIN"],
    vesselModes: ["VIP"],
    requiresVessel: true,
  },
  {
    label: "Vessel Templates",
    path: ROUTES.TEMPLATES,
    icon: "Templates",
    allowedRoles: ["ADMIN"],
    vesselModes: ["VIP"],
    requiresVessel: true,
  },

  // ==========================================
  // SUPER ADMIN NAVIGATION ITEMS
  // ==========================================
  {
    label: "Users Directory",
    path: ROUTES.USERS_MANAGEMENT,
    icon: "Users",
    allowedRoles: ["SUPER_ADMIN"],
    requiresVessel: false,
  },
  {
    label: "VIP Vessels",
    path: ROUTES.VIP_VESSELS,
    icon: "VIP",
    allowedRoles: ["SUPER_ADMIN"],
    requiresVessel: false,
  },
  {
    label: "Global Templates",
    path: ROUTES.GLOBAL_TEMPLATES,
    icon: "GlobalTemplates",
    allowedRoles: ["SUPER_ADMIN"],
    requiresVessel: false,
  },
  {
    label: "System Health Check",
    path: ROUTES.HEALTH_CHECK,
    icon: "Dashboard",
    allowedRoles: ["SUPER_ADMIN"],
    requiresVessel: false,
  },

  // Shared Profile & Settings
  {
    label: "Profile & Settings",
    path: ROUTES.PROFILE,
    icon: "Profile",
    allowedRoles: ["USER", "ADMIN", "SUPER_ADMIN"],
    requiresVessel: false,
  },
];
