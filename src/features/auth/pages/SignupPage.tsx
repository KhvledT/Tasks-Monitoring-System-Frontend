import { AuthCard } from '../components/AuthCard';
import { SignupForm } from '../components/SignupForm';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../constants/routes';

export const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <AuthCard title="Create Officer Profile" subtitle="Register to join vessel checklists watch.">
      {/* Tab Selectors */}
      <div className="flex border-b border-zinc-850 mb-2">
        <button
          type="button"
          onClick={() => navigate(ROUTES.LOGIN)}
          className="flex-1 pb-3 text-sm font-medium text-zinc-400 border-b-2 border-transparent hover:text-zinc-200 transition cursor-pointer"
        >
          Log In
        </button>
        <button
          className="flex-1 pb-3 text-sm font-semibold border-b-2 border-sky-500 text-sky-400 cursor-pointer"
        >
          Sign Up
        </button>
      </div>

      <SignupForm />
    </AuthCard>
  );
};
export default SignupPage;
