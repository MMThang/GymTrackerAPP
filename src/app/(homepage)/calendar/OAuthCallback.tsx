"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { oauthCodeExchange } from "@/app/actions/user-actions";

/**
 * Runs the OAuth code exchange as a real client-initiated Server Action
 * (via startTransition), so that Next.js permits cookie mutation inside
 * oauthCodeExchange. Calling the action directly from a Server Component
 * render scope would throw "Cookies can only be modified in a Server Action
 * or Route Handler".
 */
export default function OAuthCallback({ code }: { code: string }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await oauthCodeExchange(code);

        if (res.status === 200) {
          const month = new Date().getMonth() + 1;
          const year = new Date().getFullYear();
          router.replace(`/calendar/${year}/${month}`);
        } else {
          router.replace("/login?error=up");
        }
      } catch {
        router.replace("/login?error=catched");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return <p>Signing you in...</p>;
}
