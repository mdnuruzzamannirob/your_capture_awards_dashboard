'use client';

import AuthTitle from '@/components/common/AuthTitle';
import FormField from '@/components/common/FormField';
import { Spinner } from '@/components/ui/spinner';
import { defaultError } from '@/constants';
import { SigninFormData, signinSchema } from '@/lib/schemas/authSchema';
import { cn } from '@/lib/utils';
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
  const [isLoading] = useState(false);

  // const [signin, { isLoading }] = useSigninMutation();

  const router = useRouter();
  const signinForm = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const signInSubmit = async () => {
    try {
      // await signin({ email: data?.email, password: data?.password }).unwrap();

      toast.success('Sign In Successful', {
        description: 'Redirecting you to the dashboard.',
      });
      signinForm.reset();
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || defaultError.title,
        !(err?.data?.message && err?.message) ? { description: defaultError.body } : undefined,
      );
    }
  };

  return (
    <section className="flex min-h-dvh items-center justify-center p-5">
      <div className="w-full max-w-lg space-y-5 rounded-xl border border-gray-700 bg-gray-800 p-5 lg:p-10">
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
              className="absolute top-10 right-5 size-3"
            >
              {showPass ? (
                <AiOutlineEye className="size-5" />
              ) : (
                <AiOutlineEyeInvisible className="size-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={cn(
                'flex items-center gap-2 text-sm font-medium select-none',
                rememberMe ? 'text-primary' : 'text-gray-100',
              )}
            >
              {rememberMe ? (
                <IoCheckbox className="size-6" />
              ) : (
                <IoCheckboxOutline className="size-6" />
              )}
              Remember Me
            </button>
            <Link
              href="/forgot-password"
              className="text-primary text-sm font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 disabled:hover:bg-primary mt-4 flex w-full items-center justify-center rounded-sm py-[9px] text-white transition-all duration-300 disabled:cursor-default disabled:opacity-60"
          >
            {isLoading && (
              <span className="animate-[floatUp_1s_ease-in-out_infinite_alternate]">
                <Spinner />
              </span>
            )}

            <span
              className={cn(
                'transition-all duration-500',
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
