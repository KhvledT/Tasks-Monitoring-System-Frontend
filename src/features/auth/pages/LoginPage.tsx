import { AuthCard } from '../components/AuthCard';
import { LoginForm } from '../components/LoginForm';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../constants/routes';

export const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <AuthCard title="Welcome Onboard" subtitle="Sign in to resume vessel duties.">
      {/* Tab Selectors */}
      <div className="flex border-b border-zinc-850 mb-2">
        <button
          className="flex-1 pb-3 text-sm font-semibold border-b-2 border-sky-500 text-sky-400 cursor-pointer"
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => navigate(ROUTES.SIGNUP)}
          className="flex-1 pb-3 text-sm font-medium text-zinc-400 border-b-2 border-transparent hover:text-zinc-200 transition cursor-pointer"
        >
          Sign Up
        </button>
      </div>

      <LoginForm />
    </AuthCard>
  );
};
export default LoginPage;
