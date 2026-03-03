import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, GraduationCap, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { COLLEGES } from "@/data/colleges";
import { CollegeCard } from "@/components/colleges/CollegeCard";
import { CollegeDetail } from "@/components/colleges/CollegeDetail";

const CollegesExplorer = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const selectedCollege = useMemo(
    () => COLLEGES.find((c) => c.id === selectedCollegeId) ?? null,
    [selectedCollegeId]
  );

  const filteredColleges = useMemo(() => {
    if (!query.trim()) return COLLEGES;
    const q = query.toLowerCase();
    return COLLEGES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q)
    );
  }, [query]);

  const analytics = useMemo(() => {
    const all = COLLEGES.flatMap((c) => c.scholarships);
    const totalValue = all.reduce((s, i) => s + i.amount, 0);
    const totalSeats = all.reduce((s, i) => s + i.seats, 0);
    const avg = all.length ? Math.round(totalValue / all.length) : 0;
    return { totalPrograms: all.length, totalValue, totalSeats, avg };
  }, []);

  const copyText = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (selectedCollege ? setSelectedCollegeId(null) : navigate("/"))}
              className="rounded-lg border border-border bg-card p-2 hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 text-foreground" />
            </button>
            <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, hsl(214,100%,40%), hsl(141,68%,45%))' }}>
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-foreground truncate">
                {selectedCollege ? selectedCollege.name : "AP Colleges Explorer"}
              </h1>
              <p className="text-[11px] text-muted-foreground truncate">
                {selectedCollege ? selectedCollege.location : `${COLLEGES.length} institutions · ${analytics.totalPrograms} scholarships`}
              </p>
            </div>
          </div>
          <button onClick={() => navigate("/login")} className="gradient-btn px-4 py-2 text-sm shrink-0">
            Admin Login
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!selectedCollege ? (
          <motion.section
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-7xl px-4 py-6 sm:px-6"
          >
            {/* Search */}
            <div className="relative mb-6 max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, code, or location..."
                className="pl-10"
              />
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Colleges", value: COLLEGES.length },
                { label: "Programs", value: analytics.totalPrograms },
                { label: "Total Seats", value: analytics.totalSeats.toLocaleString() },
                { label: "Avg Award", value: `₹${analytics.avg.toLocaleString()}` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center shadow-sm">
                  <p className="text-[10px] text-muted-foreground uppercase font-medium">{s.label}</p>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            {/* College grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredColleges.map((college, i) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  index={i}
                  copied={copied}
                  onSelect={setSelectedCollegeId}
                  onCopy={copyText}
                />
              ))}
              {filteredColleges.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No colleges found for "{query}"
                </div>
              )}
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-7xl px-4 py-6 sm:px-6"
          >
            <CollegeDetail college={selectedCollege} copied={copied} onCopy={copyText} />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollegesExplorer;
