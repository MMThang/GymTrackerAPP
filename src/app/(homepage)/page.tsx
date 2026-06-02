"use client";

import { useRouter } from "next/navigation";
import { getSession } from "../actions/user-actions";
import { useUserStore } from "../store/userStore";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (session) {
        useUserStore.subscribe((state: any) => state.setUserId);
        useUserStore.setState({ userId: session.sid });
        router.push("/calendar");
      } else {
        router.push("/login");
      }
      setLoading(false);
    };

    checkSession();
  }, [router]); // ✅ Empty dependency array = run only once on mount

  // Optional: show loading while checking
  if (loading) {
    return null; // or a loading spinner
  }

  return null;
}
