import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Copy,
  GraduationCap,
  IndianRupee,
  MapPin,
  Search,
  Sparkles,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ScholarshipItem {
  id: string;
  name: string;
  type: "Merit" | "Government" | "Sports" | "Achievement" | "Industry";
  amount: number;
  criteria: string;
  seats: number;
}

interface CollegeItem {
  id: string;
  name: string;
  code: string;
  location: string;
  established: number;
  university: string;
  adminNote: string;
  scholarships: ScholarshipItem[];
}

const COLLEGES: CollegeItem[] = [
  {
    id: "gmrit",
    name: "GMR Institute of Technology (GMRIT)",
    code: "GMRIT-2024",
    location: "Rajam, Srikakulam",
    established: 1997,
    university: "JNTU-GV",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "gm1", name: "Merit Scholarship (CGPA + Attendance)", type: "Merit", amount: 10000, criteria: "CGPA 9.0+ and ~90% attendance", seats: 120 },
      { id: "gm2", name: "Sports Scholarship", type: "Sports", amount: 8000, criteria: "State/National level sports performers", seats: 25 },
      { id: "gm3", name: "Special Achievement Award", type: "Achievement", amount: 7000, criteria: "Hackathons, cultural fests, competitions", seats: 40 },
      { id: "gm4", name: "Premium Paris Internship Exposure", type: "Industry", amount: 150000, criteria: "4th year, 95% score, top recommendations", seats: 5 },
      { id: "gm5", name: "AP Vidya Deevena", type: "Government", amount: 35000, criteria: "Eligible AP fee reimbursement category", seats: 300 },
    ],
  },
  {
    id: "vignan",
    name: "Vignan's Institute of Information Technology",
    code: "VIGNAN-VZG",
    location: "Visakhapatnam",
    established: 2002,
    university: "JNTU-GV",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "vg1", name: "Academic Topper Award", type: "Merit", amount: 12000, criteria: "CGPA 9.0+", seats: 90 },
      { id: "vg2", name: "Girls in STEM Scholarship", type: "Achievement", amount: 9000, criteria: "Female students in core branches", seats: 50 },
      { id: "vg3", name: "Sports Excellence", type: "Sports", amount: 7000, criteria: "University/state medalists", seats: 20 },
      { id: "vg4", name: "AP Post-Matric (SC/ST)", type: "Government", amount: 30000, criteria: "As per AP social welfare norms", seats: 250 },
    ],
  },
  {
    id: "srkr",
    name: "SRKR Engineering College",
    code: "SRKR-BVR",
    location: "Bhimavaram",
    established: 1980,
    university: "JNTU-K",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "sr1", name: "Merit Fee Concession", type: "Merit", amount: 10000, criteria: "Top 10% branch rank", seats: 100 },
      { id: "sr2", name: "Innovation Grant", type: "Achievement", amount: 8500, criteria: "Patent/project competition winners", seats: 30 },
      { id: "sr3", name: "EBC Fee Reimbursement", type: "Government", amount: 25000, criteria: "Eligible EBC families", seats: 220 },
    ],
  },
  {
    id: "mvgr",
    name: "MVGR College of Engineering",
    code: "MVGR-VZN",
    location: "Vizianagaram",
    established: 1997,
    university: "JNTU-GV",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "mv1", name: "MVGR Merit Scholarship", type: "Merit", amount: 11000, criteria: "CGPA 8.8+ with no backlogs", seats: 80 },
      { id: "mv2", name: "Leadership & Clubs Award", type: "Achievement", amount: 6000, criteria: "Strong performance in campus clubs", seats: 35 },
      { id: "mv3", name: "AP Vidya Deevena", type: "Government", amount: 35000, criteria: "Eligible AP category", seats: 210 },
    ],
  },
  {
    id: "vrsec",
    name: "VR Siddhartha Engineering College",
    code: "VRSEC-VJA",
    location: "Vijayawada",
    established: 1977,
    university: "JNTU-K",
    adminNote: "Use your registered college-admin email and password after entering this code.",
    scholarships: [
      { id: "vr1", name: "Excellence Scholarship", type: "Merit", amount: 12000, criteria: "Semester topper awards", seats: 85 },
      { id: "vr2", name: "Industry Internship Fast Track", type: "Industry", amount: 9500, criteria: "High performers through T&P recommendations", seats: 25 },
      { id: "vr3", name: "AP Post-Matric", type: "Government", amount: 30000, criteria: "As per eligibility", seats: 260 },
    ],
  },
];

const CollegesExplorer = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const colleges = COLLEGES;

  const selectedCollege = useMemo(
    () => colleges.find((college) => college.id === selectedCollegeId) ?? null,
    [selectedCollegeId, colleges]
  );

  const filteredColleges = useMemo(() => {
    if (!query.trim()) return colleges;
    const q = query.toLowerCase();
    return colleges.filter(
      (college) =>
        college.name.toLowerCase().includes(q) ||
        college.code.toLowerCase().includes(q) ||
        college.location.toLowerCase().includes(q)
    );
  }, [query, colleges]);

  const analytics = useMemo(() => {
    const all = colleges.flatMap((c) => c.scholarships);
    const totalValue = all.reduce((sum, s) => sum + s.amount, 0);
    const totalSeats = all.reduce((sum, s) => sum + s.seats, 0);
    const average = all.length ? Math.round(totalValue / all.length) : 0;
    return { totalPrograms: all.length, totalValue, totalSeats, average };
  }, [colleges]);

  const copyText = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (selectedCollege ? setSelectedCollegeId(null) : navigate("/"))}
              className="rounded-lg border border-border bg-card p-2 hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 text-foreground" />
            </button>
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{selectedCollege ? selectedCollege.name : "AP Colleges"}</h1>
              <p className="text-xs text-muted-foreground">{selectedCollege ? selectedCollege.location : "Select a college to view unique code and scholarship analysis"}</p>
            </div>
          </div>
          <button onClick={() => navigate("/login")} className="gradient-btn px-4 py-2 text-sm">Admin Login</button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!selectedCollege ? (
          <motion.section
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto max-w-7xl px-4 py-8 sm:px-6"
          >
            <div className="relative mb-6 max-w-2xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search college by name, code, or location"
                className="pl-10"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Colleges</p><p className="text-2xl font-bold">{colleges.length}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Programs</p><p className="text-2xl font-bold">{analytics.totalPrograms}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Seats</p><p className="text-2xl font-bold">{analytics.totalSeats}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Avg Award</p><p className="text-2xl font-bold">₹{analytics.average.toLocaleString()}</p></CardContent></Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredColleges.map((college) => {
                const totalAmount = college.scholarships.reduce((sum, s) => sum + s.amount, 0);
                return (
                  <Card key={college.id} className="cursor-pointer border-border hover:border-primary/50 transition-colors" onClick={() => setSelectedCollegeId(college.id)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{college.name}</CardTitle>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{college.location}</div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary" className="font-mono">{college.code}</Badge>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyText(college.code);
                          }}
                          className="rounded-md border border-border p-1.5 hover:bg-muted"
                          aria-label="Copy college code"
                        >
                          {copied === college.code ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-md bg-muted p-2"><p className="text-muted-foreground">Programs</p><p className="font-semibold">{college.scholarships.length}</p></div>
                        <div className="rounded-md bg-muted p-2"><p className="text-muted-foreground">Total Value</p><p className="font-semibold">₹{totalAmount.toLocaleString()}</p></div>
                      </div>
                      <div className="text-primary text-xs font-medium flex items-center">View details <ArrowRight className="ml-1 h-3 w-3" /></div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto max-w-7xl px-4 py-8 sm:px-6"
          >
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">{selectedCollege.name}</h2>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{selectedCollege.location}</span>
                      <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />Est. {selectedCollege.established}</span>
                      <span className="inline-flex items-center gap-1"><Building2 className="h-4 w-4" />{selectedCollege.university}</span>
                    </div>
                    <div className="rounded-xl border border-border bg-muted p-3 inline-flex items-center gap-3">
                      <div>
                        <p className="text-[11px] uppercase text-muted-foreground">Unique College Code</p>
                        <p className="font-mono text-xl font-bold">{selectedCollege.code}</p>
                      </div>
                      <button onClick={() => copyText(selectedCollege.code)} className="rounded-md border border-border p-2 hover:bg-background">
                        {copied === selectedCollege.code ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedCollege.adminNote}</p>
                  </div>
                  <div className="rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary inline-flex items-center gap-2 h-fit">
                    <Sparkles className="h-4 w-4" />
                    Scholarship analysis ready
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {selectedCollege.scholarships.map((item) => (
                <Card key={item.id} className="border-border">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.criteria}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="rounded-md bg-muted p-2 inline-flex items-center gap-1"><IndianRupee className="h-4 w-4" />₹{item.amount.toLocaleString()}</div>
                      <div className="rounded-md bg-muted p-2">Seats: {item.seats}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollegesExplorer;
