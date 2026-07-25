'use client';

import AuthTitle from '@/components/common/AuthTitle';
import FormField from '@/components/common/FormField';
import { Spinner } from '@/components/ui/spinner';
import { DEFAULT_ERROR } from '@/lib/constants';
import { SigninFormData, signinSchema } from '@/lib/schemas/authSchema';
import { cn } from '@/lib/utils';
import { useSigninMutation } from '@/store/features/auth/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { IoCheckbox, IoCheckboxOutline } from 'react-icons/io5';
import { toast } from 'sonner';

const Signin = () => {
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [signin, { isLoading }] = useSigninMutation();

  const router = useRouter();
  const signinForm = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const signInSubmit = async (data: SigninFormData) => {
    try {
      await signin({
        email: data?.email,
        password: data?.password,
        remember_me: rememberMe,
      }).unwrap();

      toast.success('Sign In Successful', {
        description: 'Redirecting you to the dashboard.',
      });
      router.push('/dashboard');
      signinForm.reset();
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || DEFAULT_ERROR.title,
        !err?.data?.message && !err?.message ? { description: DEFAULT_ERROR.body } : undefined,
      );
    }
  };

  return (
    <section className="flex min-h-dvh items-center justify-center p-5">
      <div className="border-border-default bg-surface-secondary w-full max-w-105 space-y-5 rounded-xl border p-5 shadow-(--shadow-xl) sm:p-8">
        <AuthTitle
          title="Sign In"
          description="Please enter your email and password to continue."
        />

        <form onSubmit={signinForm.handleSubmit(signInSubmit)} className="flex flex-col gap-3">
          <FormField<SigninFormData>
            label="Email"
            id="email"
            type="email"
            placeholder="Enter email"
            register={signinForm.register}
            error={signinForm.formState.errors.email?.message as string}
          />
          <div className="relative">
            <FormField<SigninFormData>
              label="Password"
              id="password"
              type={showPass ? 'text' : 'password'}
              placeholder="Enter password"
              register={signinForm.register}
              error={signinForm.formState.errors.password?.message as string}
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const input = document.getElementById('password') as HTMLInputElement;
                const start = input?.selectionStart || 0;
                const end = input?.selectionEnd || 0;

                setShowPass(!showPass);
                // Restore cursor on next tick
                setTimeout(() => {
                  input?.setSelectionRange(start, end);
                }, 0);
              }}
              className="text-muted-foreground hover:bg-surface-tertiary hover:text-foreground absolute top-7 right-2.5 flex size-5 items-center justify-center rounded-sm transition-colors"
            >
              {showPass ? (
                <AiOutlineEye className="size-4" />
              ) : (
                <AiOutlineEyeInvisible className="size-4" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium select-none',
                rememberMe ? 'text-primary' : 'text-foreground',
              )}
            >
              {rememberMe ? (
                <IoCheckbox className="size-4" />
              ) : (
                <IoCheckboxOutline className="size-4" />
              )}
              Remember Me
            </button>
            <Link
              href="/forgot-password"
              className="text-primary hover:text-primary-hover text-xs font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="border-primary bg-primary text-primary-foreground hover:border-primary-hover hover:bg-primary-hover mt-3 flex h-9.5 w-full items-center justify-center rounded-md border px-4 text-sm font-semibold shadow-(--shadow-brand) transition-[background-color,border-color,box-shadow] duration-150 focus-visible:shadow-(--focus-shadow) disabled:cursor-default disabled:opacity-50"
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
              {isLoading ? 'Signing in...' : 'Sign In'}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default Signin;
