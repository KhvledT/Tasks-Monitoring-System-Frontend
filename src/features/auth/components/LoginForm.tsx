import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';
import { useLogin } from '../hooks/useLogin';
import { FormInput } from '../../../shared/components/forms/FormInput';
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

  const handleGoogleLogin = () => {
    toast.error('Google OAuth is not configured for this ship context.');
  };

  const isLoading = loginMutation.isPending;

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
        disabled={isLoading}
        {...register('email')}
      />

      <PasswordField
        label="Password"
        placeholder="Enter your password"
        error={errors.password?.message}
        disabled={isLoading}
        {...register('password')}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3 px-4 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 active:scale-[0.98] transition rounded-xl text-sm font-semibold flex items-center justify-center text-white cursor-pointer"
      >
        {isLoading && <ButtonLoader />}
        Sign In
      </button>

      <div className="relative my-2 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800"></div>
        </div>
        <span className="relative px-3 bg-[#111115] text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
          Or continue with
        </span>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 transition rounded-xl text-xs font-semibold flex items-center justify-center gap-2 text-zinc-200 cursor-pointer"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google Account
      </button>

      <p className="text-center text-xs text-zinc-400 mt-4">
        Need an officer account?{' '}
        <Link to={ROUTES.SIGNUP} className="text-sky-400 hover:underline">
          Sign up here
        </Link>
      </p>
    </form>
  );
};
export default LoginForm;
