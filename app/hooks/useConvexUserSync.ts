// src/hooks/useConvexUserSync.ts
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export function useConvexUserSync() {
  const { isSignedIn, user } = useUser();
  const createOrGetUser = useMutation(api.users.createOrGetUser);

  useEffect(() => {
    if (isSignedIn && user?.publicMetadata?.role) {
      createOrGetUser().catch((err) => {
        console.error("Failed to sync user to Convex:", err);
      });
    }
  }, [isSignedIn, user, createOrGetUser]);

}
