// app/register/complete/page.tsx
"use client";

import { useEffect, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

function CompleteRegistrationContent() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams?.get('role');

  useEffect(() => {
    if (user && role) {
      user.update({
        unsafeMetadata: { ...user.unsafeMetadata, role }
      }).then(() => {
        router.push(`/onboarding/${role}`);
      });
    }
  }, [user, role, router]);

  if (!role) {
    return <div>Invalid registration link. Please try again.</div>;
  }

  return <div>Completing your registration...</div>;
}

export default function CompleteRegistration() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompleteRegistrationContent />
    </Suspense>
  );
}