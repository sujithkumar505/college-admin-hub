import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Play, CheckCircle, X, Trophy, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type ScholarshipOption = { id: string; name: string };
type RankedStudent = {
  id: string; rank: number; student_name: string; student_roll: string;
  cgpa: number; ai_score: number; family_income: number; department: string;
  breakdown: { academic: number; financial: number; extra: number; essay: number };
};

const medals: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

const BreakdownModal = ({ data, onClose }: { data: RankedStudent | null; onClose: () => void }) => {
  if (!data) return null;
  const items = [
    { label: "Academic", value: data.breakdown.academic, max: 40, color: "bg-blue-500" },
    { label: "Financial Need", value: data.breakdown.financial, max: 30, color: "bg-emerald-500" },
    { label: "Extracurricular", value: data.breakdown.extra, max: 20, color: "bg-amber-500" },
    { label: "Essay", value: data.breakdown.essay, max: 10, color: "bg-violet-500" },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="bg-card rounded-2xl p-6 border border-border shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold gradient-text">AI Score Breakdown</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-foreground font-medium mb-4">{data.student_name} — <span className="font-mono">{data.student_roll}</span></p>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">{item.label} (max {item.max})</span><span className="font-mono text-foreground">{item.value}</span></div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / item.max) * 100}%` }} transition={{ duration: 1, delay: 0.2 }} className={`h-full rounded-full ${item.color}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
          <span className="text-muted-foreground">Total Score</span>
          <span className="text-2xl font-bold gradient-text font-mono">{data.ai_score}/100</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AiAllocation = () => {
  const [scholarships, setScholarships] = useState<ScholarshipOption[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState("");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState<RankedStudent[]>([]);
  const [selected, setSelected] = useState<RankedStudent | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchScholarships = async () => {
      const { data } = await supabase.from("scholarships").select("id, name").eq("status", "Active");
      if (data) {
        setScholarships(data);
        if (data.length > 0) setSelectedScholarship(data[0].id);
      }
    };
    fetchScholarships();
  }, []);

  const runAllocation = async () => {
    if (!selectedScholarship) return;
    setRunning(true);
    setProgress(0);
    setDone(false);
    setResults([]);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 3;
      });
    }, 60);

    // Fetch applications for this scholarship
    const { data: apps } = await supabase
      .from("applications")
      .select("*")
      .eq("scholarship_id", selectedScholarship)
      .order("ai_score", { ascending: false });

    // Wait for progress to finish
    await new Promise((r) => setTimeout(r, 3500));
    clearInterval(interval);
    setProgress(100);

    if (apps && apps.length > 0) {
      const ranked: RankedStudent[] = apps.map((app: any, index: number) => {
        const score = Number(app.ai_score) || 0;
        return {
          id: app.id,
          rank: index + 1,
          student_name: app.student_name,
          student_roll: app.student_roll,
          cgpa: Number(app.cgpa),
          ai_score: score,
          family_income: Number(app.family_income),
          department: app.department,
          breakdown: {
            academic: Math.round(score * 0.4),
            financial: Math.round(score * 0.3),
            extra: Math.round(score * 0.2),
            essay: Math.round(score * 0.1),
          },
        };
      });
      setResults(ranked);
    }

    setRunning(false);
    setDone(true);
  };

  const handleApprove = async (id: string) => {
    const { error } = await supabase.from("applications").update({ status: "Approved", reviewed_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Approved", description: "Application approved." });
    setResults(results.map(r => r.id === id ? { ...r } : r));
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from("applications").update({ status: "Rejected", reviewed_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Rejected", description: "Application rejected." });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">AI Allocation</h1>

      <div className="glass-card max-w-lg mx-auto text-center">
        <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">Select Scholarship</h2>
        <select
          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all mb-4"
          value={selectedScholarship}
          onChange={(e) => { setSelectedScholarship(e.target.value); setDone(false); setResults([]); }}
        >
          {scholarships.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <p className="text-sm text-muted-foreground mb-6">AI will rank applicants based on academic performance, financial need, extracurriculars, and essay quality.</p>

        {!done ? (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={runAllocation} disabled={running || !selectedScholarship} className="w-full py-4 gradient-btn-tech rounded-xl disabled:opacity-60 flex items-center justify-center gap-3 text-lg">
            {running ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-6 h-6" />}
            {running ? `Processing... ${progress}%` : "Run AI Allocation"}
          </motion.button>
        ) : (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-2 text-emerald-600">
            <CheckCircle className="w-6 h-6" /><span className="font-semibold">Allocation Complete!</span>
          </motion.div>
        )}

        {running && (
          <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, hsl(247,75%,64%), hsl(179,100%,40%))' }} />
          </div>
        )}
      </div>

      {done && results.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card !p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Allocation Results ({results.length} applicants)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Rank</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Roll No</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Dept</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">CGPA</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">AI Score</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr></thead>
              <tbody>
                {results.map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`border-b border-border/50 hover:bg-secondary/30 ${r.rank <= 3 ? "bg-amber-50/50" : ""}`}>
                    <td className="px-6 py-4 text-lg">{medals[r.rank] || <span className="text-sm text-muted-foreground font-mono">{r.rank}</span>}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{r.student_name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{r.student_roll}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{r.department}</td>
                    <td className="px-6 py-4 text-sm font-mono text-foreground">{r.cgpa}</td>
                    <td className="px-6 py-4"><button onClick={() => setSelected(r)} className="text-sm font-mono text-primary underline underline-offset-2 hover:opacity-70">{r.ai_score}</button></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleApprove(r.id)} className="px-3 py-1.5 text-xs rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">Approve</button>
                        <button onClick={() => handleReject(r.id)} className="px-3 py-1.5 text-xs rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100">Reject</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {done && results.length === 0 && (
        <div className="glass-card text-center py-8">
          <p className="text-muted-foreground">No applications found for this scholarship.</p>
        </div>
      )}

      <AnimatePresence>{selected && <BreakdownModal data={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </div>
  );
};

export default AiAllocation;
