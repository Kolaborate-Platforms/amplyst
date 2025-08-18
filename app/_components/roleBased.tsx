// components/RoleBasedRedirect.tsx
"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function RoleBased() {
  const { isSignedIn } = useUser();
  const role = useQuery(api.users.getMyRole);
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) return;
    if (!role) return;

    if (role === "influencer") {
      router.push("/influencer");
    } else if (role === "brand") {
      router.push("/brand");
    } else if (role === "agency") {
      router.push("/agency");
    }
  }, [isSignedIn, role, router]);

  return null;
}
