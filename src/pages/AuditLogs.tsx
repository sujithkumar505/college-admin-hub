import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Shield, Edit, Trash2, LogIn, Plus, ChevronDown, ChevronUp } from "lucide-react";

const actionIcons: Record<string, any> = { Create: Plus, Update: Edit, Delete: Trash2, Login: LogIn };
const actionColors: Record<string, string> = { Create: "text-emerald-600", Update: "text-amber-600", Delete: "text-red-500", Login: "text-blue-600" };

const mockLogs = [
  { id: 1, action: "Create", description: "Created scholarship 'Merit Excellence Award'", user: "Admin", timestamp: "2 hours ago", ip: "192.168.1.45", details: "Type: Merit, Amount: ₹50,000, Seats: 20" },
  { id: 2, action: "Login", description: "Admin logged in successfully", user: "Admin", timestamp: "3 hours ago", ip: "192.168.1.45", details: "Browser: Chrome 120, OS: Windows 11" },
  { id: 3, action: "Update", description: "Updated application status to 'Approved'", user: "Admin", timestamp: "5 hours ago", ip: "192.168.1.45", details: "Application #1234, Student: Aarav Sharma" },
  { id: 4, action: "Delete", description: "Deleted expired scholarship 'Old Grant 2023'", user: "Admin", timestamp: "1 day ago", ip: "192.168.1.45", details: "Scholarship had 0 active applications" },
  { id: 5, action: "Create", description: "Created scholarship 'Sports Achievement Fund'", user: "Admin", timestamp: "1 day ago", ip: "192.168.1.45", details: "Type: Sports, Amount: ₹30,000, Seats: 10" },
  { id: 6, action: "Update", description: "Updated college profile settings", user: "Admin", timestamp: "2 days ago", ip: "192.168.1.45", details: "Changed notification preferences" },
  { id: 7, action: "Login", description: "Admin logged in from new device", user: "Admin", timestamp: "3 days ago", ip: "10.0.0.22", details: "Browser: Firefox, OS: macOS" },
];

const AuditLogs = () => {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = mockLogs.filter((l) => {
    if (actionFilter !== "All" && l.action !== actionFilter) return false;
    if (search && !l.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const exportCSV = () => {
    const headers = "Timestamp,Action,User,IP,Description,Details\n";
    const rows = mockLogs.map(l => `${l.timestamp},${l.action},${l.user},${l.ip},"${l.description}","${l.details}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "audit-logs.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={exportCSV} className="gradient-btn px-4 py-2.5 flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary border border-border focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs..." className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground" />
        </div>
        <div className="flex gap-2">
          {["All", "Create", "Update", "Delete", "Login"].map((a) => (
            <button key={a} onClick={() => setActionFilter(a)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${actionFilter === a ? "bg-primary/10 text-primary border border-primary/30" : "bg-secondary border border-border text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-4">
          {filtered.map((log, i) => {
            const Icon = actionIcons[log.action] || Shield;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative pl-14"
              >
                <div className={`absolute left-4 top-4 w-5 h-5 rounded-full bg-card border-2 border-border flex items-center justify-center z-10 ${actionColors[log.action]}`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className={`glass-card cursor-pointer transition-all hover:shadow-md hover:border-primary/20 ${i % 2 === 0 ? "" : "bg-secondary/30"}`} onClick={() => setExpanded(expanded === log.id ? null : log.id)}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{log.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{log.user}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground font-mono">{log.ip}</span>
                      </div>
                    </div>
                    {expanded === log.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  {expanded === log.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
