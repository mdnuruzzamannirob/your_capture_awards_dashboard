'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

type AuthTitleProps = {
  title: string;
  description: string;
  className?: string;
};

const AuthTitle = ({ title, description, className }: AuthTitleProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', className)}>
      <Link href="/signin" className="mb-5 inline-flex items-center justify-center">
        <Image
          src="/images/logo.png"
          alt="Your Capture Awards"
          width={142}
          height={54}
          priority
          className="h-9 w-auto"
        />
      </Link>

      <h1 className="text-lg leading-tight font-semibold  md:text-xl">
        {title}
      </h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-[13px]">{description}</p>
    </div>
  );
};

export default AuthTitle;
