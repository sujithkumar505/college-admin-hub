import { motion } from "framer-motion";
import { MapPin, ArrowRight, Copy, Check, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CollegeItem } from "@/data/colleges";

interface CollegeCardProps {
  college: CollegeItem;
  index: number;
  copied: string | null;
  onSelect: (id: string) => void;
  onCopy: (code: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  Merit: "bg-blue-50 text-blue-700 border-blue-200",
  Government: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Sports: "bg-orange-50 text-orange-700 border-orange-200",
  Achievement: "bg-purple-50 text-purple-700 border-purple-200",
  Industry: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Exchange: "bg-pink-50 text-pink-700 border-pink-200",
};

export const CollegeCard = ({ college, index, copied, onSelect, onCopy }: CollegeCardProps) => {
  const totalAmount = college.scholarships.reduce((sum, s) => sum + s.amount, 0);
  const totalSeats = college.scholarships.reduce((sum, s) => sum + s.seats, 0);
  const types = [...new Set(college.scholarships.map((s) => s.type))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => onSelect(college.id)}
      className="group cursor-pointer rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, hsl(214,100%,40%), hsl(141,68%,45%))' }}>
          {college.shortName.slice(0, 4)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground text-sm leading-tight truncate">{college.name}</h3>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{college.location}</span>
          </div>
        </div>
      </div>

      {/* Code badge */}
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary" className="font-mono text-xs px-2 py-1">{college.code}</Badge>
        <button
          onClick={(e) => { e.stopPropagation(); onCopy(college.code); }}
          className="rounded-md border border-border p-1.5 hover:bg-muted transition-colors"
          aria-label="Copy code"
        >
          {copied === college.code ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="rounded-lg bg-muted/60 p-2 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Programs</p>
          <p className="text-sm font-bold text-foreground">{college.scholarships.length}</p>
        </div>
        <div className="rounded-lg bg-muted/60 p-2 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Total Seats</p>
          <p className="text-sm font-bold text-foreground">{totalSeats}</p>
        </div>
        <div className="rounded-lg bg-muted/60 p-2 text-center">
          <p className="text-[10px] text-muted-foreground uppercase">Value</p>
          <p className="text-sm font-bold text-foreground">₹{(totalAmount / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Type pills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {types.map((t) => (
          <span key={t} className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${TYPE_COLORS[t] ?? "bg-muted text-foreground"}`}>
            {t}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
        View scholarships <ArrowRight className="h-3 w-3" />
      </div>
    </motion.div>
  );
};
