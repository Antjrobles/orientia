import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SpinnerProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'responsive' | number;
  variant?: 'inline' | 'centered' | 'fullscreen';
  className?: string;
  colorClassName?: string;
  'aria-label'?: string;
};

type NamedSizes = Exclude<NonNullable<SpinnerProps['size']>, number | 'responsive'>;
const sizeClassMap: Record<NamedSizes, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

export function Spinner({
  size = 'responsive',
  variant = 'inline',
  className,
  colorClassName = 'text-emerald-600',
  'aria-label': ariaLabel = 'Cargando',
}: SpinnerProps) {
  const isNumeric = typeof size === 'number';
  const isResponsive = size === 'responsive';
  const responsiveSize = 'h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24';
  const sizeClass = isResponsive
    ? responsiveSize
    : !isNumeric
    ? sizeClassMap[size as NamedSizes]
    : undefined;
  const style = isNumeric ? ({ width: size, height: size } as React.CSSProperties) : undefined;

  const SpinnerIcon = (
    <Loader2
      className={cn('animate-spin', colorClassName, sizeClass, className)}
      style={style}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    />
  );

  if (variant === 'fullscreen') {
    return (
      <div className={cn('min-h-screen w-full flex items-center justify-center')}>{SpinnerIcon}</div>
    );
  }
  if (variant === 'centered') {
    return <div className={cn('w-full flex items-center justify-center py-8')}>{SpinnerIcon}</div>;
  }
  return SpinnerIcon;
}

export default Spinner;
