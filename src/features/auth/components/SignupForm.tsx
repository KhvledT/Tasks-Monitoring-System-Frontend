import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '../schemas/auth.schema';
import { useSignup } from '../hooks/useSignup';
import { FormSelect, type SelectOption } from '../../../shared/components/forms/FormSelect';
import { DatePicker } from '../../../shared/components/forms/DatePicker';
import { PasswordField } from './PasswordField';
import { ButtonLoader } from '../../../shared/components/loading/ButtonLoader';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { ROUTES } from '../../../constants/routes';
import { toast } from 'react-hot-toast';

const RANK_OPTIONS: SelectOption[] = [
  { value: 'Second Officer', label: 'Second Officer' },
  { value: 'Third Officer', label: 'Third Officer' },
  { value: 'Chief Officer', label: 'Chief Officer' },
  { value: 'Master', label: 'Master' },
  { value: 'Chief Engineer', label: 'Chief Engineer' },
  { value: 'Second Engineer', label: 'Second Engineer' },
];

export const SignupForm = () => {
  const navigate = useNavigate();
  const signupMutation = useSignup();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      fullName: '',
      rank: '',
      signOnDate: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    try {
      await signupMutation.mutateAsync({
        email: data.email,
        fullName: data.fullName,
        rank: data.rank,
        signOnDate: new Date(data.signOnDate).toISOString(),
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      
      toast.success('Registration successful! Please verify your email.');
      navigate(ROUTES.VERIFY_EMAIL, { state: { email: data.email } });
    } catch (err: any) {
      const backendMessage = err.response?.data?.message || 'Email already exists or network is unavailable.';
      setServerError(backendMessage);
      toast.error(backendMessage);
    }
  };

  const isLoading = signupMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      {/* Full Name field */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-zinc-650 text-xs font-bold tracking-wide">
          Full Name
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          disabled={isLoading}
          className={`w-full bg-white border ${
            errors.fullName?.message ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-primary'
          } rounded-xl px-3.5 py-2.5 text-sm text-black outline-none transition placeholder-zinc-350`}
          {...register('fullName')}
        />
        {errors.fullName?.message && <span className="text-xs text-red-500 mt-1">{errors.fullName?.message}</span>}
      </div>

      {/* Email Address field */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-zinc-650 text-xs font-bold tracking-wide">
          Email Address
        </label>
        <input
          type="email"
          placeholder="chief.engineer@atlanticstar.com"
          disabled={isLoading}
          className={`w-full bg-white border ${
            errors.email?.message ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-primary'
          } rounded-xl px-3.5 py-2.5 text-sm text-black outline-none transition placeholder-zinc-350`}
          {...register('email')}
        />
        {errors.email?.message && <span className="text-xs text-red-500 mt-1">{errors.email?.message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          label="Rank"
          options={RANK_OPTIONS}
          error={errors.rank?.message}
          disabled={isLoading}
          {...register('rank')}
        />

        <DatePicker
          label="Sign-On Date"
          error={errors.signOnDate?.message}
          disabled={isLoading}
          {...register('signOnDate')}
        />
      </div>

      {/* Password field */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-zinc-650 text-xs font-bold tracking-wide">
          Password
        </label>
        <PasswordField
          placeholder="••••••••••••"
          disabled={isLoading}
          className={`w-full bg-white border ${
            errors.password?.message ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-primary'
          } rounded-xl px-3.5 py-2.5 text-sm text-black outline-none transition placeholder-zinc-350`}
          {...register('password')}
        />
        {errors.password?.message && <span className="text-xs text-red-500 mt-1">{errors.password?.message}</span>}
      </div>

      {/* Confirm Password field */}
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-zinc-650 text-xs font-bold tracking-wide">
          Confirm Password
        </label>
        <PasswordField
          placeholder="••••••••••••"
          disabled={isLoading}
          className={`w-full bg-white border ${
            errors.confirmPassword?.message ? 'border-red-400 focus:border-red-500' : 'border-zinc-200 focus:border-primary'
          } rounded-xl px-3.5 py-2.5 text-sm text-black outline-none transition placeholder-zinc-350`}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword?.message && <span className="text-xs text-red-500 mt-1">{errors.confirmPassword?.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3 px-4 bg-primary hover:bg-[#003fa3] disabled:opacity-50 active:scale-[0.98] transition rounded-xl text-sm font-semibold flex items-center justify-center text-white cursor-pointer gap-2"
      >
        {isLoading && <ButtonLoader />}
        Register Account
      </button>

      <p className="text-center text-xs text-zinc-500 mt-2">
        Already registered?{' '}
        <Link to={ROUTES.LOGIN} className="text-[#0055d4] hover:underline font-bold">
          Sign In
        </Link>
      </p>
    </form>
  );
};
export default SignupForm;
