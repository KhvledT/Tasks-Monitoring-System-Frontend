import { AuthCard } from '../components/AuthCard';
import { SignupForm } from '../components/SignupForm';

export const SignupPage = () => {
  return (
    <AuthCard title="Register" subtitle="Create your ship officer profile.">
      <SignupForm />
    </AuthCard>
  );
};
export default SignupPage;
