import { Navigate, Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";
import { useAuth } from "@/contexts/AuthContext";

export const DashboardLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 ml-[260px] transition-all duration-300">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
