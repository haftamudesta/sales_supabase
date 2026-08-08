import { createContext, useContext, useEffect, useMemo, useState } from "react";
import supabase from "../supabase-client";

const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign In
  async function signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        console.error("Supabase sign-in error:", error.message);

        return {
          success: false,
          error: error.message,
        };
      }

      console.log("Supabase sign-in success:", data);

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Unexpected error during sign-in:", error.message);

      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }

  // Sign Up
  async function signUp(name, email, password, accountType) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            name,
            account_type: accountType,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        data,
      };
    } catch {
      return {
        success: false,
        error: "An unexpected error occurred.",
      };
    }
  }

  // Sign Out
  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: "Unable to sign out.",
      };
    }
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthContextProvider");
  }

  return context;
}
