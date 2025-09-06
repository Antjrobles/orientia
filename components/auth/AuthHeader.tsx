import Image from 'next/image';
import { cn } from '@/lib/utils';

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  logoSrc?: string;
  className?: string;
};

export function AuthHeader({ title, subtitle, logoSrc = '/icons/orientia.svg', className }: AuthHeaderProps) {
  return (
    <div className={cn('mb-6 sm:mb-8 flex flex-col items-center gap-3 text-center', className)}>
      {logoSrc && <Image src={logoSrc} alt="Logo" width={200} height={33} priority />}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

export default AuthHeader;
