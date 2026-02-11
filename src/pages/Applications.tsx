import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, CheckCircle, XCircle, Eye, Users } from "lucide-react";

type Application = {
  id: number;
  name: string;
  rollNo: string;
  cgpa: number;
  income: number;
  aiScore: number;
  status: "Pending" | "Approved" | "Rejected";
  scholarship: string;
};

const mockApps: Application[] = [
  { id: 1, name: "Aarav Sharma", rollNo: "CS2024001", cgpa: 9.2, income: 300000, aiScore: 92, status: "Pending", scholarship: "Merit Excellence" },
  { id: 2, name: "Priya Patel", rollNo: "EC2024015", cgpa: 8.7, income: 450000, aiScore: 85, status: "Approved", scholarship: "Need-Based Aid" },
  { id: 3, name: "Rahul Kumar", rollNo: "ME2024008", cgpa: 7.5, income: 250000, aiScore: 78, status: "Pending", scholarship: "Sports Achievement" },
  { id: 4, name: "Sneha Reddy", rollNo: "CS2024022", cgpa: 9.5, income: 600000, aiScore: 95, status: "Approved", scholarship: "Merit Excellence" },
  { id: 5, name: "Vikram Singh", rollNo: "EE2024003", cgpa: 6.8, income: 200000, aiScore: 65, status: "Rejected", scholarship: "Research Grant" },
  { id: 6, name: "Ananya Gupta", rollNo: "IT2024011", cgpa: 8.9, income: 350000, aiScore: 88, status: "Pending", scholarship: "STEM Scholarship" },
];

const AIScoreCircle = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
        <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono text-foreground">{score}</span>
    </div>
  );
};

const Applications = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = mockApps.filter((a) => {
    if (statusFilter !== "All" && a.status !== statusFilter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleSelect = (id: number) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Applications</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground" />
        </div>
        <div className="flex gap-2">
          {["All", "Pending", "Approved", "Rejected"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === s ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions bar */}
      {selected.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card !py-3 flex items-center justify-between">
          <span className="text-sm text-foreground">{selected.length} selected</span>
          <div className="flex gap-2">
            <button className="gradient-btn-success px-4 py-2 text-sm">Approve Selected</button>
            <button className="gradient-btn-danger px-4 py-2 text-sm">Reject Selected</button>
          </div>
        </motion.div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={selected.includes(app.id)} onChange={() => toggleSelect(app.id)} className="accent-primary w-4 h-4" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {app.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-medium text-foreground">{app.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{app.rollNo}</p>
                </div>
              </div>
              <span className={app.status === "Approved" ? "badge-success" : app.status === "Rejected" ? "badge-danger" : "badge-warning"}>{app.status}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 rounded-lg bg-white/5">
                <p className="text-xs text-muted-foreground">CGPA</p>
                <p className={`text-lg font-bold font-mono ${app.cgpa >= 8 ? "text-emerald-400" : app.cgpa >= 6 ? "text-amber-400" : "text-red-400"}`}>{app.cgpa}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-white/5">
                <p className="text-xs text-muted-foreground">Income</p>
                <p className="text-sm font-semibold text-foreground font-mono">₹{(app.income / 100000).toFixed(1)}L</p>
              </div>
              <div className="flex flex-col items-center p-2 rounded-lg bg-white/5">
                <p className="text-xs text-muted-foreground mb-1">AI Score</p>
                <AIScoreCircle score={app.aiScore} />
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3">Applied for: <span className="text-foreground">{app.scholarship}</span></p>

            <div className="flex gap-2">
              <button className="flex-1 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-colors flex items-center justify-center gap-1"><Eye className="w-3 h-3" /> View</button>
              {app.status === "Pending" && (
                <>
                  <button className="py-2 px-3 text-sm rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                  <button className="py-2 px-3 text-sm rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"><XCircle className="w-4 h-4" /></button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-semibold text-foreground">No applications found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default Applications;
