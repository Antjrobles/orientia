import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

type AuthCardProps = PropsWithChildren<{
  className?: string;
}>;

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        'w-full rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-8',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default AuthCard;

