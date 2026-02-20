import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Download, Shield, Edit, Trash2, LogIn, Plus, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const actionIcons: Record<string, any> = { Create: Plus, Update: Edit, Delete: Trash2, Login: LogIn };
const actionColors: Record<string, string> = { Create: "text-emerald-600", Update: "text-amber-600", Delete: "text-red-500", Login: "text-blue-600" };

const AuditLogs = () => {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      setLogs(data || []);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const filtered = logs.filter((l) => {
    if (actionFilter !== "All" && l.action !== actionFilter) return false;
    if (search && !JSON.stringify(l.details || {}).toLowerCase().includes(search.toLowerCase()) && !l.action.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const exportCSV = () => {
    const headers = "Timestamp,Action,IP,Details\n";
    const rows = filtered.map(l => `${l.created_at},${l.action},${l.ip_address || ""},"${JSON.stringify(l.details || {})}"`).join("\n");
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

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card text-center py-12">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-semibold text-foreground">No audit logs yet</p>
          <p className="text-sm text-muted-foreground">Activity will appear here as you use the system</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-4">
            {filtered.map((log, i) => {
              const Icon = actionIcons[log.action] || Shield;
              const timeAgo = new Date(log.created_at).toLocaleString();
              return (
                <motion.div key={log.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="relative pl-14">
                  <div className={`absolute left-4 top-4 w-5 h-5 rounded-full bg-card border-2 border-border flex items-center justify-center z-10 ${actionColors[log.action] || "text-muted-foreground"}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="glass-card cursor-pointer transition-all hover:shadow-md hover:border-primary/20" onClick={() => setExpanded(expanded === log.id ? null : log.id)}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{log.action} — {log.entity_type || "System"}</p>
                        <p className="text-xs text-muted-foreground mt-1">{timeAgo} {log.ip_address ? `• ${log.ip_address}` : ""}</p>
                      </div>
                      {expanded === log.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    {expanded === log.id && log.details && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-3 pt-3 border-t border-border">
                        <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">{JSON.stringify(log.details, null, 2)}</pre>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
