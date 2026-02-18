import { Bell, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export const Navbar = () => {
  const { collegeName, adminName } = useAuth();
  const [notifCount] = useState(3);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      {/* Left: College name */}
      <div>
        <h2 className="text-lg font-semibold gradient-text-primary">{collegeName || "College Admin"}</h2>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border text-muted-foreground focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none w-40 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <Bell className="w-5 h-5" />
          {notifCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center animate-pulse">
              {notifCount}
            </span>
          )}
        </motion.button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: 'linear-gradient(135deg, hsl(214,100%,40%), hsl(141,68%,45%))' }}>
            {adminName.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">{adminName}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
