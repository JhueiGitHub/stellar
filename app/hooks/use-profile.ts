// hooks/use-profile.ts
import { useState, useEffect } from "react";
import { Profile } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const fetchedProfile = await currentProfile();
        setProfile(fetchedProfile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading };
};
