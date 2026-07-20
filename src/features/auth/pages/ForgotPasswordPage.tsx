import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthCard } from '../components/AuthCard';
import { FormInput } from '../../../shared/components/forms/FormInput';
import { PasswordField } from '../components/PasswordField';
import { ButtonLoader } from '../../../shared/components/loading/ButtonLoader';
import { authApi } from '../api/auth.api';
import { ROUTES } from '../../../constants/routes';
import { toast } from 'react-hot-toast';

type Step = 'email' | 'otp' | 'reset' | 'success';

const stepTitles: Record<Step, { title: string; subtitle: string }> = {
  email: {
    title: 'Forgot Password?',
    subtitle: 'Enter your email to receive a 6-digit OTP code.',
  },
  otp: {
    title: 'Verify OTP Code',
    subtitle: 'Enter the 6-digit code sent to your email.',
  },
  reset: {
    title: 'Set New Password',
    subtitle: 'Create a new, strong password for your account.',
  },
  success: {
    title: 'Password Reset',
    subtitle: 'Your password has been changed successfully.',
  },
};

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // ── Step 1: Request OTP ──
  const handleSendOtp = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await authApi.sendForgotPasswordOtp(email.trim());
      toast.success('OTP code sent to your email.');
      setStep('otp');
      setResendCooldown(60);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResendOtp = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await authApi.resendForgotPasswordOtp(email.trim());
      toast.success('New OTP code sent.');
      setResendCooldown(60);
      setOtp(Array(6).fill(''));
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to resend OTP.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Verify OTP ──
  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await authApi.verifyForgotPasswordOtp(email.trim(), otpValue);
      toast.success('OTP verified successfully.');
      setStep('reset');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP code.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 3: Reset Password ──
  const handleResetPassword = async () => {
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await authApi.resetPassword({
        email: email.trim(),
        otp: otp.join(''),
        password,
        confirmPassword,
      });
      toast.success('Password reset successfully!');
      setStep('success');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Password reset failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP input handler ──
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const { title, subtitle } = stepTitles[step];

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <AuthCard title={title} subtitle={subtitle}>
      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-950/30 border border-red-800 text-red-400 text-xs rounded-xl flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* ── STEP: Email ── */}
        {step === 'email' && (
          <motion.div key="email" {...slideVariants} className="flex flex-col gap-4">
            <FormInput
              label="Email Address"
              placeholder="officer@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full mt-1 py-3 px-4 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 active:scale-[0.98] transition rounded-xl text-sm font-semibold flex items-center justify-center text-white cursor-pointer"
            >
              {isLoading && <ButtonLoader />}
              Send OTP Code
            </button>
          </motion.div>
        )}

        {/* ── STEP: OTP ── */}
        {step === 'otp' && (
          <motion.div key="otp" {...slideVariants} className="flex flex-col gap-5">
            <div className="flex items-center justify-center gap-2.5" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  disabled={isLoading}
                  className="w-11 h-13 text-center text-lg font-bold bg-zinc-900/40 border border-zinc-800 rounded-xl text-zinc-100 outline-none focus:border-sky-500 transition"
                />
              ))}
            </div>

            <p className="text-center text-[11px] text-zinc-500">
              Sent to <span className="text-zinc-300 font-semibold">{email}</span>
            </p>

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 active:scale-[0.98] transition rounded-xl text-sm font-semibold flex items-center justify-center text-white cursor-pointer"
            >
              {isLoading && <ButtonLoader />}
              Verify Code
            </button>

            <div className="flex items-center justify-center gap-1 text-xs">
              <span className="text-zinc-500">Didn't receive the code?</span>
              {resendCooldown > 0 ? (
                <span className="text-zinc-600 font-medium">Resend in {resendCooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-sky-400 hover:underline font-semibold cursor-pointer disabled:opacity-50"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── STEP: Reset Password ── */}
        {step === 'reset' && (
          <motion.div key="reset" {...slideVariants} className="flex flex-col gap-4">
            <PasswordField
              label="New Password"
              placeholder="Enter new password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <PasswordField
              label="Confirm Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full mt-1 py-3 px-4 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 active:scale-[0.98] transition rounded-xl text-sm font-semibold flex items-center justify-center text-white cursor-pointer"
            >
              {isLoading && <ButtonLoader />}
              Reset Password
            </button>
          </motion.div>
        )}

        {/* ── STEP: Success ── */}
        {step === 'success' && (
          <motion.div key="success" {...slideVariants} className="flex flex-col items-center gap-5 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-300 text-center leading-relaxed">
              Your password has been reset successfully.
              <br />
              You can now sign in with your new password.
            </p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 active:scale-[0.98] transition rounded-xl text-sm font-semibold text-white cursor-pointer"
            >
              Return to Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to login link (shown on all steps except success) */}
      {step !== 'success' && (
        <p className="text-center text-xs text-zinc-400 mt-2">
          Remember your password?{' '}
          <Link to={ROUTES.LOGIN} className="text-sky-400 hover:underline">
            Sign in
          </Link>
        </p>
      )}
    </AuthCard>
  );
};

export default ForgotPasswordPage;
