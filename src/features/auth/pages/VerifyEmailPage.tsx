import { AuthCard } from '../components/AuthCard';
import { VerifyOtpForm } from '../components/VerifyOtpForm';

export const VerifyEmailPage = () => {
  return (
    <AuthCard title="Verify Your Account" subtitle="Enter the 6-digit confirmation code sent to your email.">
      <VerifyOtpForm />
    </AuthCard>
  );
};
export default VerifyEmailPage;
