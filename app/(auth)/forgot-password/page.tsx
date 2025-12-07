'use client';

import AuthTitle from '@/components/common/AuthTitle';
import FormField from '@/components/common/FormField';
import { Spinner } from '@/components/ui/spinner';
import { DEFAULT_ERROR } from '@/constants';
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/lib/schemas/authSchema';
import { cn } from '@/lib/utils';
import { useForgotPasswordMutation } from '@/store/features/auth/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const router = useRouter();
  const resetForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword({ email: data.email }).unwrap();

      toast.success('Code Sent Successfully', {
        description: 'Check your email for the verification code.',
      });
      router.push('/verify-otp');
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
      <div className="w-full max-w-lg space-y-5 rounded-xl border border-gray-700 bg-gray-800 p-5 lg:p-10">
        <AuthTitle
          title="Forgot Password"
          description="Enter your registered email address to receive a verification code."
        />

        <form
          onSubmit={resetForm.handleSubmit(forgotPasswordSubmit)}
          className="flex flex-col gap-3"
        >
          <FormField
            label="Email Address"
            id="email"
            type="email"
            placeholder="Enter email address"
            register={resetForm.register}
            error={resetForm.formState.errors.email?.message as string}
          />

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
                'transition-all duration-300',
                isLoading ? 'translate-x-2' : 'translate-x-0',
              )}
            >
              {isLoading ? 'Sending...' : 'Send Code'}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
