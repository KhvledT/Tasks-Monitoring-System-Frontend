import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormData } from '../schemas/auth.schema';
import { useSignup } from '../hooks/useSignup';
import { FormInput } from '../../../shared/components/forms/FormInput';
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
      // Navigate to OTP check screen, preloading their email in Router location state
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
        <div className="p-3 bg-red-950/30 border border-red-800 text-red-400 text-xs rounded-xl flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      <FormInput
        label="Full Name"
        placeholder="Enter your full name"
        error={errors.fullName?.message}
        disabled={isLoading}
        {...register('fullName')}
      />

      <FormInput
        label="Email Address"
        placeholder="Enter your email"
        error={errors.email?.message}
        disabled={isLoading}
        {...register('email')}
      />

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

      <PasswordField
        label="Password"
        placeholder="Choose a strong password"
        error={errors.password?.message}
        disabled={isLoading}
        {...register('password')}
      />

      <PasswordField
        label="Confirm Password"
        placeholder="Retype password"
        error={errors.confirmPassword?.message}
        disabled={isLoading}
        {...register('confirmPassword')}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full mt-2 py-3 px-4 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 active:scale-[0.98] transition rounded-xl text-sm font-semibold flex items-center justify-center text-white cursor-pointer"
      >
        {isLoading && <ButtonLoader />}
        Register Account
      </button>

      <p className="text-center text-xs text-zinc-400 mt-4">
        Already registered?{' '}
        <Link to={ROUTES.LOGIN} className="text-sky-400 hover:underline">
          Sign in here
        </Link>
      </p>
    </form>
  );
};
export default SignupForm;
