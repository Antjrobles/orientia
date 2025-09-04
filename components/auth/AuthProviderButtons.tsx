"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

interface Props {
  isLoading?: boolean;
  callbackUrl?: string;
}

export function AuthProviderButtons({ isLoading, callbackUrl = "/profile" }: Props) {
  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={() => signIn("google", { callbackUrl })}
        disabled={isLoading}
        variant="outline"
        size="icon"
        aria-label="Acceder con Google"
      >
        <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
      </Button>
      <Button
        onClick={() => signIn("facebook", { callbackUrl })}
        disabled={isLoading}
        variant="outline"
        size="icon"
        aria-label="Acceder con Facebook"
      >
        <Image src="/icons/facebook.svg" alt="Facebook" width={20} height={20} />
      </Button>
      <Button
        onClick={() => signIn("apple", { callbackUrl })}
        disabled={isLoading}
        variant="outline"
        size="icon"
        aria-label="Acceder con Apple"
      >
        <Image src="/icons/apple.svg" alt="Apple" width={20} height={20} />
      </Button>
    </div>
  );
}

