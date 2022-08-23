import { useAuthStore } from '@/stores/auth';
/**
 * This component creates a type-safe supabase client, acessible through 'supabase' in the project.
 *
 * Note: the type safety feature will be improved in a near future: supabase will ship with better typings
 * - Somewhat relevant Typescript issue: https://github.com/microsoft/TypeScript/issues/16936
 * - Supabase pull request: https://github.com/supabase/postgrest-js/pull/279
 */

import router from "@/router";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SupabaseQueryBuilder } from "@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder";
import type { definitions } from "./supabase-types";

// credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY, please set these in an .env file"
  );
}

// clients
export type SafeSupabaseClient = {
  from<T extends keyof definitions>(
    table: T
  ): SupabaseQueryBuilder<definitions[T]>;
};
export const supabase: SafeSupabaseClient & Omit<SupabaseClient, "from"> =
  createClient(supabaseUrl, supabaseAnonKey);

// authService
export function useAuthService() {
  const authStore = useAuthStore();

  // LOGIN
  const login = async (email: string) => {
    console.log("Called useAuthService.login()", email);

    // const result = await supabase.auth.signIn(
    //   { email },
    //   { redirectTo: window.location.href.split("#", 1)[0] } // works in dev and prod mode
    // );

    const result = await supabase.auth.signIn({ email });
    router.push("/");
    authStore.setUserStore(result.user);
  };

  // LOGOUT
  const logout = () => {
    console.log("Called useAuthService.logout()");
    supabase.auth.signOut();
    router.push("/login");
  };

  return {
    login,
    logout,
  };
}
