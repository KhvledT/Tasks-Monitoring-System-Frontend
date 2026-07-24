import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../shared/hooks/useAuth";
import { PageLoader } from "../shared/components/loading";
import { ROUTES } from "../constants/routes";

interface RoleGuardProps {
  allowedRoles: Array<"USER" | "ADMIN" | "SUPER_ADMIN">;
  children?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.WORKSPACE_HOME} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleGuard;
