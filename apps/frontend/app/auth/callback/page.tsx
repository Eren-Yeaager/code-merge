"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { setAuthToken } from "../../../lib/auth";

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      console.error("Auth error:", error);
      router.push("/?error=auth_failed");
      return;
    }

    if (token) {
      setAuthToken(token);
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg">Completing authentication...</p>
      </div>
    </div>
  );
}
