import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { useLogin } from '../hooks/useLogin';
import { PasswordField } from './PasswordField';
import { ButtonLoader } from '../../../shared/components/loading/ButtonLoader';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ROUTES } from '../../../constants/routes';
import { toast } from 'react-hot-toast';

export const LoginForm = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      toast.success('Logged in successfully!');
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      const backendMessage = err.response?.data?.message || 'Network unavailable. Please check connection.';
      setServerError(backendMessage);
      toast.error(backendMessage);
    }
  };

  const isLoading = loginMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      {/* Work Email field */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-zinc-650 text-xs font-bold tracking-wide">
          Work Email
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-[13px] text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4.5 h-4.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </span>
          <input
            type="email"
            placeholder="chief.engineer@atlanticstar.com"
            disabled={isLoading}
            className={`w-full bg-white border ${
              errors.email?.message ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-primary'
            } rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-black outline-none transition placeholder-zinc-350`}
            {...register('email')}
          />
        </div>
        {errors.email?.message && <span className="text-xs text-red-500 mt-1">{errors.email?.message}</span>}
      </div>

      {/* Password field */}
      <div className="flex flex-col gap-1.5 w-full relative">
        <div className="flex justify-between items-center">
          <label className="text-zinc-650 text-xs font-bold tracking-wide">
            Password
          </label>
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-[11px] text-[#0055d4] hover:underline font-semibold">
            Forgot Password?
          </Link>
        </div>
        <div className="relative">
          <span className="absolute left-3.5 top-[13px] text-zinc-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4.5 h-4.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0V10.5m-2.25 13.5h13.5c.621 0 1.125-.504 1.125-1.125V11.25c0-.621-.504-1.125-1.125-1.125H5.25c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </span>
          <PasswordField
            placeholder="••••••••••••"
            disabled={isLoading}
            className={`w-full bg-white border ${
              errors.password?.message ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-primary'
            } rounded-xl pl-10 pr-10 py-2.5 text-sm text-black outline-none transition placeholder-zinc-350`}
            {...register('password')}
          />
        </div>
        {errors.password?.message && <span className="text-xs text-red-500 mt-1">{errors.password?.message}</span>}
      </div>

      {/* Remember Me Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remember-station"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="w-4 h-4 rounded border-zinc-300 text-primary focus:ring-primary/20 cursor-pointer"
        />
        <label htmlFor="remember-station" className="text-xs text-zinc-550 select-none cursor-pointer">
          Remember this station
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3 px-4 bg-primary hover:bg-[#003fa3] disabled:opacity-50 active:scale-[0.98] transition rounded-xl text-sm font-semibold flex items-center justify-center text-white cursor-pointer gap-2"
      >
        {isLoading && <ButtonLoader />}
        Sign In to Center &rarr;
      </button>

      <p className="text-center text-xs text-zinc-500 mt-2">
        Don't have an account?{' '}
        <Link to={ROUTES.SIGNUP} className="text-[#0055d4] hover:underline font-bold">
          Sign Up
        </Link>
      </p>

      <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400 border-t border-zinc-100 pt-4 mt-2">
        <a href="#help" className="hover:text-zinc-650 transition">Help Desk</a>
        <span>&bull;</span>
        <span className="cursor-pointer hover:text-zinc-650 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" />
          </svg>
          EN (US)
        </span>
      </div>
    </form>
  );
};
export default LoginForm;
