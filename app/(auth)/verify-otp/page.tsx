'use client';

import AuthTitle from '@/components/common/AuthTitle';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const VerifyOtp = () => {
  const otpLength = 6;
  const [otp, setOtp] = useState<string[]>(new Array(otpLength).fill(''));
  const [resendCoolDown, setResendCoolDown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (resendCoolDown <= 0) return;
    const interval = setInterval(() => {
      setResendCoolDown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCoolDown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < otpLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < otpLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('Text').trim();
    if (!/^\d+$/.test(pasted)) return;
    const chars = pasted.split('').slice(0, otpLength);
    setOtp((prev) => prev.map((_, i) => chars[i] || ''));
    inputsRef.current[Math.min(chars.length - 1, otpLength - 1)]?.focus();
    e.preventDefault();
  };

  const handleResend = async () => {
    if (resendCoolDown > 0) return;
    try {
      setIsResendLoading(true);
      // ===== Replace this block with real API call =====
      // await resendOtpApi({ email });
      await new Promise((res) => setTimeout(res, 1000)); // dummy delay
      // =================================================
      toast.success('OTP resent successfully. Check your inbox.');
      setResendCoolDown(30);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to resend OTP.');
    } finally {
      setIsResendLoading(false);
    }
  };

  const verifyOtpSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < otpLength) {
      toast.error('Please enter the complete OTP.');
      return;
    }
    try {
      setIsLoading(true);
      await new Promise((res) => setTimeout(res, 1000));

      toast.success('Verification Complete', {
        description: 'You can now set your new password.',
      });
      // router.push('/reset-password');
    } catch (err: any) {
      toast.error(err?.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-dvh items-center justify-center p-5">
      <div className="w-full max-w-lg space-y-5 rounded-xl border border-gray-700 bg-gray-800 p-5 lg:p-10">
        <AuthTitle
          title="Verify Code"
          description="A 6-digit verification code has been sent to your email. Please enter it below."
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            verifyOtpSubmit();
          }}
          className="flex flex-col gap-3"
        >
          <div className="flex w-full items-center justify-center gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={handlePaste}
                className="size-8 rounded border border-gray-500 bg-transparent text-center outline-none focus:border-orange-500 md:size-10"
              />
            ))}
          </div>

          {/* Resend OTP */}
          <p className="mb-4 text-center text-xs text-gray-400">
            Didn&apos;t receive a code?{' '}
            <button
              type="button"
              disabled={resendCoolDown > 0 || isResendLoading}
              onClick={handleResend}
              className="text-primary underline disabled:opacity-50"
            >
              {resendCoolDown > 0
                ? `Resend in ${resendCoolDown}s`
                : isResendLoading
                  ? 'Sending...'
                  : 'Resend'}
            </button>
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 disabled:hover:bg-primary mt-4 flex w-full items-center justify-center rounded-sm py-[9px] text-white transition-all duration-300 disabled:cursor-default disabled:opacity-60"
          >
            {isLoading && (
              <span className="mr-2 animate-[floatUp_1s_ease-in-out_infinite_alternate]">
                <Spinner />
              </span>
            )}
            <span
              className={cn(
                'transition-all duration-500',
                isLoading ? 'translate-x-2' : 'translate-x-0',
              )}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default VerifyOtp;
