import { AuthCard } from '../components/AuthCard';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  return (
    <AuthCard title="Sign In" subtitle="Access the Maritime Monitor control center.">
      <LoginForm />
    </AuthCard>
  );
};
export default LoginPage;
