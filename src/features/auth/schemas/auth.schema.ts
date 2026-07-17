import { z } from 'zod';
import { REGEX } from '../../../constants/regex';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    email: z.string().trim().min(1, 'Email is required').email('Invalid email format'),
    fullName: z
      .string()
      .trim()
      .min(3, 'Full Name must be at least 3 characters')
      .max(50, 'Full Name is too long'),
    rank: z.string().min(1, 'Rank is required'),
    signOnDate: z.string().min(1, 'Sign-on date is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        REGEX.PASSWORD,
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      ),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export const otpSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email format'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must contain numbers only'),
});

export type OtpFormData = z.infer<typeof otpSchema>;
