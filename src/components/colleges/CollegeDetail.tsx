import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Calendar, Building2, Copy, Check, Sparkles, IndianRupee,
  Users, Trophy, BookOpen, Briefcase, Globe
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CollegeItem, ScholarshipItem } from "@/data/colleges";

const TYPE_CONFIG: Record<string, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Merit: { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: BookOpen },
  Government: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: Building2 },
  Sports: { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: Trophy },
  Achievement: { color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", icon: Sparkles },
  Industry: { color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200", icon: Briefcase },
  Exchange: { color: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200", icon: Globe },
};

const FILTER_ALL = "All";

interface CollegeDetailProps {
  college: CollegeItem;
  copied: string | null;
  onCopy: (v: string) => void;
}

export const CollegeDetail = ({ college, copied, onCopy }: CollegeDetailProps) => {
  const [filter, setFilter] = useState(FILTER_ALL);
  const types = useMemo(() => [FILTER_ALL, ...new Set(college.scholarships.map((s) => s.type))], [college]);

  const filtered = useMemo(
    () => filter === FILTER_ALL ? college.scholarships : college.scholarships.filter((s) => s.type === filter),
    [filter, college]
  );

  const totalAmount = college.scholarships.reduce((s, i) => s + i.amount, 0);
  const totalSeats = college.scholarships.reduce((s, i) => s + i.seats, 0);
  const highestScholarship = college.scholarships.reduce((max, s) => s.amount > max.amount ? s : max, college.scholarships[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* College Info Card */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-base font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, hsl(214,100%,40%), hsl(141,68%,45%))' }}>
                {college.shortName.slice(0, 4)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{college.name}</h2>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{college.location}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />Est. {college.established}</span>
                  <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" />{college.university}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/50 p-3 inline-flex items-center gap-3">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground font-medium">College Code</p>
                <p className="font-mono text-lg font-bold text-foreground">{college.code}</p>
              </div>
              <button onClick={() => onCopy(college.code)} className="rounded-md border border-border p-2 hover:bg-background transition-colors">
                {copied === college.code ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">{college.adminNote}</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3 lg:w-64 shrink-0">
            <div className="rounded-xl border border-border bg-blue-50 p-3 text-center">
              <p className="text-[10px] text-blue-600 uppercase font-medium">Programs</p>
              <p className="text-xl font-bold text-blue-700">{college.scholarships.length}</p>
            </div>
            <div className="rounded-xl border border-border bg-emerald-50 p-3 text-center">
              <p className="text-[10px] text-emerald-600 uppercase font-medium">Total Seats</p>
              <p className="text-xl font-bold text-emerald-700">{totalSeats}</p>
            </div>
            <div className="rounded-xl border border-border bg-amber-50 p-3 text-center">
              <p className="text-[10px] text-amber-600 uppercase font-medium">Total Value</p>
              <p className="text-xl font-bold text-amber-700">₹{(totalAmount / 1000).toFixed(0)}K</p>
            </div>
            <div className="rounded-xl border border-border bg-purple-50 p-3 text-center">
              <p className="text-[10px] text-purple-600 uppercase font-medium">Top Award</p>
              <p className="text-xl font-bold text-purple-700">₹{(highestScholarship.amount / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filter === t
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/30"
            }`}
          >
            {t} {t !== FILTER_ALL && `(${college.scholarships.filter((s) => s.type === t).length})`}
          </button>
        ))}
      </div>

      {/* Scholarship cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item, i) => {
          const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.Merit;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-start gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground leading-tight">{item.name}</h3>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                  {item.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 ml-10">{item.criteria}</p>
              <div className="flex gap-3 ml-10">
                <div className="rounded-lg bg-muted/60 px-3 py-1.5 inline-flex items-center gap-1 text-xs">
                  <IndianRupee className="h-3 w-3 text-muted-foreground" />
                  <span className="font-semibold text-foreground">₹{item.amount.toLocaleString()}</span>
                </div>
                <div className="rounded-lg bg-muted/60 px-3 py-1.5 inline-flex items-center gap-1 text-xs">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{item.seats} seats</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
