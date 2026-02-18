import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  X,
  Calendar,
  DollarSign,
  Users as UsersIcon,
} from "lucide-react";

type Scholarship = {
  id: number;
  title: string;
  type: string;
  amount: number;
  seats: { filled: number; total: number };
  status: "Active" | "Draft" | "Expired";
};

const mockScholarships: Scholarship[] = [
  { id: 1, title: "Merit Excellence Award", type: "Merit", amount: 50000, seats: { filled: 12, total: 20 }, status: "Active" },
  { id: 2, title: "Need-Based Financial Aid", type: "Need", amount: 75000, seats: { filled: 8, total: 15 }, status: "Active" },
  { id: 3, title: "Sports Achievement Fund", type: "Sports", amount: 30000, seats: { filled: 5, total: 10 }, status: "Active" },
  { id: 4, title: "Research Innovation Grant", type: "Merit", amount: 100000, seats: { filled: 3, total: 5 }, status: "Draft" },
  { id: 5, title: "Community Service Award", type: "Need", amount: 25000, seats: { filled: 20, total: 20 }, status: "Expired" },
  { id: 6, title: "STEM Scholarship", type: "Merit", amount: 60000, seats: { filled: 7, total: 12 }, status: "Active" },
];

const statusColors: Record<string, string> = {
  Active: "badge-success",
  Draft: "badge-warning",
  Expired: "badge-danger",
};

const inputClasses = "w-full mt-1 px-4 py-3 rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

const CreateModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40 }}
          className="bg-card rounded-2xl p-6 border border-border shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold gradient-text">Create Scholarship</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"><X className="w-5 h-5" /></button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`w-3 h-3 rounded-full transition-all duration-300 ${s <= step ? "bg-primary scale-110" : "bg-muted"}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div><label className="text-sm text-muted-foreground">Title</label><input className={inputClasses} placeholder="Scholarship title" /></div>
              <div><label className="text-sm text-muted-foreground">Description</label><textarea className={`${inputClasses} resize-none h-24`} placeholder="Describe the scholarship..." /></div>
              <div><label className="text-sm text-muted-foreground">Type</label><select className={inputClasses}><option>Merit</option><option>Need-Based</option><option>Sports</option></select></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div><label className="text-sm text-muted-foreground">Amount (₹)</label><input type="number" className={inputClasses} placeholder="50000" /></div>
              <div><label className="text-sm text-muted-foreground">Total Seats</label><input type="number" className={inputClasses} placeholder="20" /></div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div><label className="text-sm text-muted-foreground">Minimum CGPA</label><input type="range" min="0" max="10" step="0.1" className="w-full mt-1 accent-primary" /><div className="flex justify-between text-xs text-muted-foreground"><span>0</span><span>10</span></div></div>
              <div><label className="text-sm text-muted-foreground">Categories</label><div className="flex flex-wrap gap-2 mt-1">{["General","SC","ST","OBC","EWS"].map(c => (<label key={c} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border cursor-pointer hover:bg-muted transition-colors text-sm text-foreground"><input type="checkbox" className="accent-primary" />{c}</label>))}</div></div>
              <div><label className="text-sm text-muted-foreground">Max Family Income (₹)</label><input type="number" className={inputClasses} placeholder="500000" /></div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <div><label className="text-sm text-muted-foreground">Application Start Date</label><input type="date" className={inputClasses} /></div>
              <div><label className="text-sm text-muted-foreground">Application End Date</label><input type="date" className={inputClasses} /></div>
              <div><label className="text-sm text-muted-foreground">Result Date</label><input type="date" className={inputClasses} /></div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground disabled:opacity-30 hover:bg-muted transition-colors">Previous</button>
            {step < 4 ? (
              <button onClick={() => setStep(step + 1)} className="px-6 py-2 gradient-btn">Next</button>
            ) : (
              <button onClick={onClose} className="px-6 py-2 gradient-btn-success">Create</button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Scholarships = () => {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const filtered = mockScholarships.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Scholarships</h1>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowCreate(true)} className="gradient-btn px-4 py-2.5 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New
        </motion.button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary border border-border focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search scholarships..." className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground" />
        </div>
        <select className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm outline-none">
          <option>All Status</option><option>Active</option><option>Draft</option><option>Expired</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Seats</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{s.title}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{s.type}</td>
                  <td className="px-6 py-4 text-sm text-foreground font-mono">₹{s.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{s.seats.filled}/{s.seats.total}</td>
                  <td className="px-6 py-4"><span className={statusColors[s.status]}>{s.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">{filtered.length} scholarships</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm text-primary font-medium px-3 py-1 rounded-lg bg-primary/10">1</span>
            <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <CreateModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
};

export default Scholarships;
