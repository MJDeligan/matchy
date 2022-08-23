import { useAuthStore } from "@/stores/auth";
import { supabase } from "./supabase";

export interface Profile {
  email?: string;
  fullName?: string;
  description?: string;
}

export function useProfileService() {
  const authStore = useAuthStore();

  // SELECT
  async function readProfile() {
    console.log("Called useProfileService.readProfile()");

    if (!authStore.user || !authStore.user.email) {
      throw Error("User is not logged in");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select(`full_name, description, email`)
      .eq("user_id", authStore.user.id)
      .maybeSingle();
    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("Fetching profile unsuccessful");
    }
    const retArg: Profile = {
      email: data.email,
      fullName: data.full_name,
      description: data.description,
    };
    return retArg;
  }

  // UPDATE
  async function updateProfile(newProfile: Profile) {
    console.log("Called useProfileService.updateProfile()", newProfile);

    if (!authStore.user || !authStore.user.email) {
      throw Error("User is not logged in");
    }
    if (!newProfile.fullName) {
      throw Error("Argument object is missing 'fullName' attribute");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: newProfile.fullName,
        description: newProfile.description,
      })
      .match({ user_id: authStore.user.id })
      .maybeSingle();
    if (error) {
      throw error;
    }
    if (!data) {
      throw Error("Update of profile unsuccessful");
    }
    const retArg: Profile = {
      email: data.email,
      fullName: data.full_name,
      description: data.description,
    };

    // update store
    authStore.setProfileStore(retArg);
    return retArg;
  }

  return {
    readProfile,
    updateProfile,
  };
}
