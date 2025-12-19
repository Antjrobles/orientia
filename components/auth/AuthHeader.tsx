import { cn } from "@/lib/utils";

type AuthHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function AuthHeader({
  title,
  subtitle,
  className,
}: AuthHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 sm:mb-8 text-center",
        className,
      )}
    >
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default AuthHeader;
