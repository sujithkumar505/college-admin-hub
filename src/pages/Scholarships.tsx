import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

type Scholarship = {
  id: string;
  name: string;
  type: string;
  amount: number;
  total_seats: number;
  filled_seats: number;
  status: string;
  description: string;
  min_cgpa: number | null;
  max_income: number | null;
  deadline: string | null;
};

const statusColors: Record<string, string> = {
  Active: "badge-success",
  Draft: "badge-warning",
  Expired: "badge-danger",
};

const inputClasses = "w-full mt-1 px-4 py-3 rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

const CreateModal = ({ open, onClose, onCreated, collegeId }: { open: boolean; onClose: () => void; onCreated: () => void; collegeId: string }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", type: "Merit-based", amount: "", totalSeats: "", minCgpa: "", maxIncome: "", deadline: "" });
  const { toast } = useToast();

  if (!open) return null;

  const handleCreate = async () => {
    if (!form.name.trim()) { toast({ title: "Error", description: "Title is required", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.from("scholarships").insert({
      college_id: collegeId,
      name: form.name,
      description: form.description,
      type: form.type,
      amount: Number(form.amount) || 0,
      total_seats: Number(form.totalSeats) || 0,
      min_cgpa: form.minCgpa ? Number(form.minCgpa) : null,
      max_income: form.maxIncome ? Number(form.maxIncome) : null,
      deadline: form.deadline || null,
      status: "Active",
    });
    setLoading(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Success", description: "Scholarship created successfully!" });
    onCreated();
    onClose();
    setForm({ name: "", description: "", type: "Merit-based", amount: "", totalSeats: "", minCgpa: "", maxIncome: "", deadline: "" });
    setStep(1);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="bg-card rounded-2xl p-6 border border-border shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold gradient-text">Create Scholarship</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => <div key={s} className={`w-3 h-3 rounded-full transition-all duration-300 ${s <= step ? "bg-primary scale-110" : "bg-muted"}`} />)}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div><label className="text-sm text-muted-foreground">Title *</label><input className={inputClasses} placeholder="Scholarship title" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><label className="text-sm text-muted-foreground">Description</label><textarea className={`${inputClasses} resize-none h-24`} placeholder="Describe..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><label className="text-sm text-muted-foreground">Type</label><select className={inputClasses} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Merit-based</option><option>Government</option><option>Need-based</option><option>Sports</option></select></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div><label className="text-sm text-muted-foreground">Amount (₹)</label><input type="number" className={inputClasses} placeholder="50000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
              <div><label className="text-sm text-muted-foreground">Total Seats</label><input type="number" className={inputClasses} placeholder="20" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} /></div>
              <div><label className="text-sm text-muted-foreground">Min CGPA</label><input type="number" step="0.1" className={inputClasses} placeholder="7.5" value={form.minCgpa} onChange={(e) => setForm({ ...form, minCgpa: e.target.value })} /></div>
              <div><label className="text-sm text-muted-foreground">Max Family Income (₹)</label><input type="number" className={inputClasses} placeholder="500000" value={form.maxIncome} onChange={(e) => setForm({ ...form, maxIncome: e.target.value })} /></div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div><label className="text-sm text-muted-foreground">Application Deadline</label><input type="date" className={inputClasses} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
              <div className="glass-card !bg-secondary/50 space-y-2">
                <h4 className="font-medium text-foreground">Summary</h4>
                <p className="text-sm text-muted-foreground"><strong>Title:</strong> {form.name || "—"}</p>
                <p className="text-sm text-muted-foreground"><strong>Type:</strong> {form.type}</p>
                <p className="text-sm text-muted-foreground"><strong>Amount:</strong> ₹{Number(form.amount || 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground"><strong>Seats:</strong> {form.totalSeats || "—"}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1} className="px-4 py-2 rounded-lg bg-secondary border border-border text-foreground disabled:opacity-30 hover:bg-muted transition-colors">Previous</button>
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="px-6 py-2 gradient-btn">Next</button>
            ) : (
              <button onClick={handleCreate} disabled={loading} className="px-6 py-2 gradient-btn-success flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Create
              </button>
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
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const { college } = useAuth();
  const { toast } = useToast();

  const fetchScholarships = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("scholarships").select("*").order("created_at", { ascending: false });
    if (!error && data) setScholarships(data as Scholarship[]);
    setLoading(false);
  };

  useEffect(() => { fetchScholarships(); }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("scholarships").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Deleted", description: "Scholarship deleted." });
    fetchScholarships();
  };

  const filtered = scholarships.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Scholarships</h1>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowCreate(true)} className="gradient-btn px-4 py-2.5 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary border border-border focus-within:border-primary/50 transition-colors">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search scholarships..." className="bg-transparent text-sm outline-none flex-1 text-foreground placeholder:text-muted-foreground" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
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
                  <motion.tr key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.name}</p>
                        {s.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.description}</p>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{s.type}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-mono">₹{Number(s.amount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{s.filled_seats}/{s.total_seats}</td>
                    <td className="px-6 py-4"><span className={statusColors[s.status] || "badge-primary"}>{s.status}</span></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">{filtered.length} scholarships</p>
          </div>
        </div>
      )}

      <CreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={fetchScholarships} collegeId={college?.id || ""} />
    </div>
  );
};

export default Scholarships;
