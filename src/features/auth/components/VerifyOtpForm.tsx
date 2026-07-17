import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, type OtpFormData } from '../schemas/auth.schema';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import { useResendConfirmationOtp } from '../hooks/useResendConfirmationOtp';
import { FormInput } from '../../../shared/components/forms/FormInput';
import { ButtonLoader } from '../../../shared/components/loading/ButtonLoader';
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { ROUTES } from '../../../constants/routes';
import { toast } from 'react-hot-toast';

export const VerifyOtpForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendConfirmationOtp();
  const [serverError, setServerError] = useState<string | null>(null);

  const preloadedEmail = location.state?.email || '';

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: preloadedEmail,
      otp: '',
    },
  });

  const onSubmit = async (data: OtpFormData) => {
    setServerError(null);
    try {
      await verifyMutation.mutateAsync({
        email: data.email,
        otp: data.otp,
      });
      toast.success('Email verified successfully! You can now log in.');
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      const backendMessage = err.response?.data?.message || 'Invalid or expired OTP.';
      setServerError(backendMessage);
      toast.error(backendMessage);
    }
  };

  const handleResendOtp = async () => {
    setServerError(null);
    const email = getValues('email');
    if (!email) {
      toast.error('Please enter your email address first.');
      return;
    }

    try {
      await resendMutation.mutateAsync({ email });
      toast.success('A new OTP has been sent to your email.');
    } catch (err: any) {
      const backendMessage = err.response?.data?.message || 'Failed to resend OTP. Please try again.';
      setServerError(backendMessage);
      toast.error(backendMessage);
    }
  };

  const isLoading = verifyMutation.isPending || resendMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {serverError && (
        <div className="p-3 bg-red-950/30 border border-red-800 text-red-400 text-xs rounded-xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      <FormInput
        label="Email Address"
        placeholder="Enter your email"
        error={errors.email?.message}
        disabled={isLoading || !!preloadedEmail}
        {...register('email')}
      />

      <FormInput
        label="OTP Verification Code"
        placeholder="Enter 6-digit code"
        maxLength={6}
        error={errors.otp?.message}
        disabled={isLoading}
        {...register('otp')}
      />

      <div className="flex flex-col gap-2 mt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 active:scale-[0.98] transition rounded-xl text-sm font-semibold flex items-center justify-center text-white cursor-pointer"
        >
          {verifyMutation.isPending && <ButtonLoader />}
          Verify Email
        </button>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 disabled:opacity-50 transition rounded-xl text-xs font-semibold flex items-center justify-center text-zinc-200 cursor-pointer"
        >
          {resendMutation.isPending && <ButtonLoader />}
          Resend OTP Code
        </button>
      </div>

      <p className="text-center text-xs text-zinc-400 mt-4">
        Back to{' '}
        <Link to={ROUTES.LOGIN} className="text-sky-400 hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
};
export default VerifyOtpForm;
