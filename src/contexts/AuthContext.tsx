import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  collegeName: string;
  collegeCode: string;
  adminName: string;
  login: (collegeName: string, collegeCode: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("auth_token")
  );
  const [collegeName, setCollegeName] = useState(
    () => localStorage.getItem("college_name") || ""
  );
  const [collegeCode, setCollegeCode] = useState(
    () => localStorage.getItem("college_code") || ""
  );
  const adminName = "Admin";

  const login = (name: string, code: string) => {
    localStorage.setItem("auth_token", "demo-jwt-token");
    localStorage.setItem("college_name", name);
    localStorage.setItem("college_code", code);
    setCollegeName(name);
    setCollegeCode(code);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("college_name");
    localStorage.removeItem("college_code");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, collegeName, collegeCode, adminName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
