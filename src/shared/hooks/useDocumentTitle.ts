import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { ROUTES } from '../../constants/routes';

const TITLE_MAP: Record<string, string> = {
  [ROUTES.LOGIN]: 'Sign In',
  [ROUTES.SIGNUP]: 'Register',
  [ROUTES.VERIFY_EMAIL]: 'Verify Email',
  [ROUTES.FORGOT_PASSWORD]: 'Forgot Password',
  [ROUTES.SELECT_VESSEL]: 'Vessel Selection',
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.CHECKLISTS]: 'Checklists',
  [ROUTES.ISSUES]: 'Defect Logbook',
  [ROUTES.HISTORY]: 'History Timeline',
  [ROUTES.PROFILE]: 'Officer Settings',
  [ROUTES.REPORTS]: 'Export Configuration',
};

export const useDocumentTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const title = TITLE_MAP[pathname] || 'Control Center';
    document.title = `Maritime Monitor | ${title}`;
  }, [pathname]);
};

export default useDocumentTitle;
