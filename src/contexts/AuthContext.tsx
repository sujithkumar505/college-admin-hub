import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface CollegeInfo {
  id: string;
  name: string;
  code: string;
  location: string;
  university: string;
  type: string;
  established_year: number;
  website: string;
}

interface AdminProfile {
  id: string;
  full_name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  session: Session | null;
  college: CollegeInfo | null;
  adminProfile: AdminProfile | null;
  collegeName: string;
  collegeCode: string;
  adminName: string;
  verifyCollegeCode: (code: string) => Promise<CollegeInfo | null>;
  login: (email: string, password: string, collegeId: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, fullName: string, collegeId: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [college, setCollege] = useState<CollegeInfo | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch admin profile and college info
          setTimeout(async () => {
            if (!isMounted) return;
            const { data: profile } = await supabase
              .from("admin_profiles")
              .select("*")
              .eq("user_id", session.user.id)
              .single();

            if (profile && isMounted) {
              setAdminProfile({
                id: profile.id,
                full_name: profile.full_name,
                email: profile.email,
              });

              const { data: collegeData } = await supabase
                .from("colleges")
                .select("*")
                .eq("id", profile.college_id)
                .single();

              if (collegeData && isMounted) {
                setCollege(collegeData as CollegeInfo);
              }
            }
          }, 0);
        } else {
          setAdminProfile(null);
          setCollege(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const verifyCollegeCode = async (code: string): Promise<CollegeInfo | null> => {
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .single();

    if (error || !data) return null;
    return data as CollegeInfo;
  };

  const login = async (email: string, password: string, collegeId: string): Promise<{ error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    // Verify this user belongs to the selected college
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("*")
      .eq("user_id", data.user.id)
      .eq("college_id", collegeId)
      .single();

    if (!profile) {
      await supabase.auth.signOut();
      return { error: "This account is not associated with the selected college." };
    }

    return {};
  };

  const signup = async (email: string, password: string, fullName: string, collegeId: string): Promise<{ error?: string }> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (!data.user) return { error: "Signup failed. Please try again." };

    // Create admin profile
    const { error: profileError } = await supabase
      .from("admin_profiles")
      .insert({
        user_id: data.user.id,
        college_id: collegeId,
        full_name: fullName,
        email: email,
      });

    if (profileError) {
      return { error: profileError.message };
    }

    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setCollege(null);
    setAdminProfile(null);
  };

  const isAuthenticated = !!session && !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        session,
        college,
        adminProfile,
        collegeName: college?.name || "",
        collegeCode: college?.code || "",
        adminName: adminProfile?.full_name || "Admin",
        verifyCollegeCode,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
