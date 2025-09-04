import { cn } from '@/lib/utils';
import type { PropsWithChildren } from 'react';

type AuthDividerProps = PropsWithChildren<{
  className?: string;
}>;

export function AuthDivider({ children, className }: AuthDividerProps) {
  return (
    <div className={cn('relative my-2', className)}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-200 dark:border-gray-600" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">{children}</span>
      </div>
    </div>
  );
}

export default AuthDivider;

