import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Play, CheckCircle, X, Trophy } from "lucide-react";

const mockResults = [
  { rank: 1, name: "Sneha Reddy", rollNo: "CS2024022", cgpa: 9.5, aiScore: 95, breakdown: { academic: 38, financial: 28, extra: 18, essay: 11 } },
  { rank: 2, name: "Aarav Sharma", rollNo: "CS2024001", cgpa: 9.2, aiScore: 92, breakdown: { academic: 37, financial: 25, extra: 19, essay: 11 } },
  { rank: 3, name: "Ananya Gupta", rollNo: "IT2024011", cgpa: 8.9, aiScore: 88, breakdown: { academic: 35, financial: 26, extra: 17, essay: 10 } },
  { rank: 4, name: "Priya Patel", rollNo: "EC2024015", cgpa: 8.7, aiScore: 85, breakdown: { academic: 34, financial: 27, extra: 16, essay: 8 } },
  { rank: 5, name: "Rahul Kumar", rollNo: "ME2024008", cgpa: 7.5, aiScore: 78, breakdown: { academic: 30, financial: 25, extra: 15, essay: 8 } },
];

const medals: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

const BreakdownModal = ({ data, onClose }: { data: typeof mockResults[0] | null; onClose: () => void }) => {
  if (!data) return null;
  const items = [
    { label: "Academic", value: data.breakdown.academic, max: 40, color: "bg-indigo-500" },
    { label: "Financial Need", value: data.breakdown.financial, max: 30, color: "bg-emerald-500" },
    { label: "Extracurricular", value: data.breakdown.extra, max: 20, color: "bg-amber-500" },
    { label: "Essay", value: data.breakdown.essay, max: 10, color: "bg-pink-500" },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }} className="glass-card w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold gradient-text">AI Score Breakdown</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-foreground font-medium mb-4">{data.name} — <span className="font-mono">{data.rollNo}</span></p>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">{item.label} (max {item.max})</span><span className="font-mono text-foreground">{item.value}</span></div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / item.max) * 100}%` }} transition={{ duration: 1, delay: 0.2 }} className={`h-full rounded-full ${item.color}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-muted-foreground">Total Score</span>
          <span className="text-2xl font-bold gradient-text font-mono">{data.aiScore}/100</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AiAllocation = () => {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [selected, setSelected] = useState<typeof mockResults[0] | null>(null);

  const runAllocation = () => {
    setRunning(true);
    setProgress(0);
    setDone(false);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setRunning(false); setDone(true); return 100; }
        return p + 2;
      });
    }, 60);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">AI Allocation</h1>

      {/* Scholarship Selector */}
      <div className="glass-card max-w-lg mx-auto text-center">
        <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">Select Scholarship</h2>
        <select className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground outline-none focus:border-primary/50 transition-all mb-4">
          <option>Merit Excellence Award</option>
          <option>Need-Based Financial Aid</option>
          <option>Sports Achievement Fund</option>
        </select>
        <p className="text-sm text-muted-foreground mb-6">AI will rank applicants based on academic performance, financial need, extracurriculars, and essay quality.</p>

        {!done ? (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={runAllocation} disabled={running} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-60 flex items-center justify-center gap-3 text-lg">
            {running ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play className="w-6 h-6" />}
            {running ? `Processing... ${progress}%` : "Run AI Allocation"}
          </motion.button>
        ) : (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center justify-center gap-2 text-emerald-400">
            <CheckCircle className="w-6 h-6" />
            <span className="font-semibold">Allocation Complete!</span>
          </motion.div>
        )}

        {running && (
          <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {/* Results Table */}
      {done && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass-card !p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" /> Allocation Results</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-white/10">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Rank</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Roll No</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">CGPA</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">AI Score</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr></thead>
              <tbody>
                {mockResults.map((r, i) => (
                  <motion.tr key={r.rank} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`border-b border-white/5 hover:bg-white/[0.03] ${r.rank <= 3 ? "bg-gradient-to-r from-amber-500/5 to-transparent" : ""}`}>
                    <td className="px-6 py-4 text-lg">{medals[r.rank] || <span className="text-sm text-muted-foreground font-mono">{r.rank}</span>}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{r.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{r.rollNo}</td>
                    <td className="px-6 py-4 text-sm font-mono text-foreground">{r.cgpa}</td>
                    <td className="px-6 py-4"><button onClick={() => setSelected(r)} className="text-sm font-mono text-primary underline underline-offset-2 hover:text-indigo-300">{r.aiScore}</button></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3 py-1.5 text-xs rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">Approve</button>
                        <button className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20">Reject</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <AnimatePresence>{selected && <BreakdownModal data={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </div>
  );
};

export default AiAllocation;
