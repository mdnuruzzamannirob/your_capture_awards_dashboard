'use client';

import AuthTitle from '@/components/common/AuthTitle';
import FormField from '@/components/common/FormField';
import { Spinner } from '@/components/ui/spinner';
import { DEFAULT_ERROR } from '@/lib/constants';
import useAuth from '@/hooks/useAuth';
import { ResetPasswordFormData, resetPasswordSchema } from '@/lib/schemas/authSchema';
import { cn } from '@/lib/utils';
import { useResetPasswordMutation } from '@/store/features/auth/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const { tempEmail, tempToken } = useAuth();

  const router = useRouter();
  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetPasswordSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPassword({
        password: data.newPassword,
        confirmPassword: data.confirmNewPassword,
        token: tempToken ?? '',
        email: tempEmail ?? '',
      }).unwrap();

      toast.success('Password Updated', {
        description: 'Use your new password to sign in.',
      });
      router.push('/signin');
      resetForm.reset();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || DEFAULT_ERROR.title,
        !err?.data?.message && !err?.message ? { description: DEFAULT_ERROR.body } : undefined,
      );
    }
  };

  return (
    <section className="flex min-h-dvh items-center justify-center p-5">
      <div className="border-border-default bg-surface-secondary w-full max-w-[420px] space-y-5 rounded-xl border p-5 shadow-[var(--shadow-xl)] sm:p-8">
        <AuthTitle
          title="Reset Password"
          description="Enter your new password below. Ensure it is strong and secure."
        />

        <form
          onSubmit={resetForm.handleSubmit(resetPasswordSubmit)}
          className="flex flex-col gap-3"
        >
          <div className="relative">
            <FormField<ResetPasswordFormData>
              label="New Password"
              id="newPassword"
              type={showPass ? 'text' : 'password'}
              placeholder="Enter new password"
              register={resetForm.register}
              error={resetForm.formState.errors.newPassword?.message as string}
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const input = document.getElementById('newPassword') as HTMLInputElement;
                const start = input?.selectionStart || 0;
                const end = input?.selectionEnd || 0;

                setShowPass(!showPass);
                // Restore cursor on next tick
                setTimeout(() => {
                  input?.setSelectionRange(start, end);
                }, 0);
              }}
              className="text-muted-foreground hover:bg-surface-tertiary hover:text-foreground absolute top-[31px] right-2.5 flex size-7 items-center justify-center rounded-sm transition-colors"
            >
              {showPass ? (
                <AiOutlineEye className="size-5" />
              ) : (
                <AiOutlineEyeInvisible className="size-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <FormField<ResetPasswordFormData>
              label="Confirm New Password"
              id="confirmNewPassword"
              type={showConfirmPass ? 'text' : 'password'}
              placeholder="Re-enter new password"
              register={resetForm.register}
              error={resetForm.formState.errors.confirmNewPassword?.message as string}
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const input = document.getElementById('confirmNewPassword') as HTMLInputElement;
                const start = input?.selectionStart || 0;
                const end = input?.selectionEnd || 0;

                setShowConfirmPass(!showConfirmPass);
                // Restore cursor on next tick
                setTimeout(() => {
                  input?.setSelectionRange(start, end);
                }, 0);
              }}
              className="text-muted-foreground hover:bg-surface-tertiary hover:text-foreground absolute top-[31px] right-2.5 flex size-7 items-center justify-center rounded-sm transition-colors"
            >
              {showConfirmPass ? (
                <AiOutlineEye className="size-5" />
              ) : (
                <AiOutlineEyeInvisible className="size-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="border-primary bg-primary text-primary-foreground hover:border-primary-hover hover:bg-primary-hover mt-3 flex h-9.5 w-full items-center justify-center rounded-md border px-4 text-sm font-semibold shadow-[var(--shadow-brand)] transition-[background-color,border-color,box-shadow] duration-150 focus-visible:shadow-[var(--focus-shadow)] disabled:cursor-default disabled:opacity-50"
          >
            {isLoading && (
              <span className="animate-[floatUp_1s_ease-in-out_infinite_alternate]">
                <Spinner />
              </span>
            )}

            <span
              className={cn(
                'transition-all duration-300',
                isLoading ? 'translate-x-2' : 'translate-x-0',
              )}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
