import { z } from 'zod';

export const signinSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
});

export const verifyOtpSchema = z.object({
  code: z.string().min(6, 'Code must be at least 6 characters long.'),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters long.'),
    confirmNewPassword: z.string().min(8, 'Confirm your password.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: 'Passwords do not match.',
  });

export type SigninFormData = z.infer<typeof signinSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
