import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, Search, MapPin, Building2, Globe, Calendar,
  ArrowLeft, ArrowRight, Award, Trophy, Briefcase, BookOpen,
  IndianRupee, Users, TrendingUp, ChevronDown, ChevronUp,
  Star, Zap, Plane, Shield, Copy, Check, X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface College {
  id: string;
  name: string;
  code: string;
  location: string;
  university: string | null;
  type: string | null;
  established_year: number | null;
  website: string | null;
}

interface Scholarship {
  id: string;
  name: string;
  description: string | null;
  type: string;
  amount: number | null;
  min_cgpa: number | null;
  max_income: number | null;
  total_seats: number | null;
  filled_seats: number | null;
  status: string | null;
  college_id: string;
}

const typeIcon: Record<string, typeof Award> = {
  "Merit-based": Star,
  "Government": Shield,
  "Need-based": Users,
  "Sports": Trophy,
};

const typeColor: Record<string, string> = {
  "Merit-based": "from-blue-500 to-cyan-500",
  "Government": "from-emerald-500 to-teal-500",
  "Need-based": "from-amber-500 to-orange-500",
  "Sports": "from-purple-500 to-pink-500",
};

const CollegesExplorer = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: c }, { data: s }] = await Promise.all([
        supabase.from("colleges").select("*").order("name"),
        supabase.from("scholarships").select("*").order("amount", { ascending: false }),
      ]);
      setColleges((c as College[]) || []);
      setScholarships((s as Scholarship[]) || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return colleges;
    const q = search.toLowerCase();
    return colleges.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
    );
  }, [colleges, search]);

  const getCollegeScholarships = (collegeId: string) =>
    scholarships.filter((s) => s.college_id === collegeId);

  const getStats = (collegeId: string) => {
    const cs = getCollegeScholarships(collegeId);
    const totalAmount = cs.reduce((sum, s) => sum + (s.amount || 0), 0);
    const totalSeats = cs.reduce((sum, s) => sum + (s.total_seats || 0), 0);
    return { count: cs.length, totalAmount, totalSeats };
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const collegeScholarships = selectedCollege
    ? getCollegeScholarships(selectedCollege.id).filter(
        (s) => filterType === "all" || s.type === filterType
      )
    : [];

  const scholarshipTypes = selectedCollege
    ? [...new Set(getCollegeScholarships(selectedCollege.id).map((s) => s.type))]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (selectedCollege ? setSelectedCollege(null) : navigate("/"))}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, hsl(214,100%,40%), hsl(141,68%,45%))",
                }}
              >
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight">
                  {selectedCollege ? selectedCollege.name : "AP Colleges Explorer"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {selectedCollege
                    ? selectedCollege.location
                    : `${colleges.length} Institutions · Andhra Pradesh`}
                </p>
              </div>
            </div>
          </div>
          {!selectedCollege && (
            <button
              onClick={() => navigate("/login")}
              className="gradient-btn px-4 py-2 text-sm"
            >
              Admin Login
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedCollege ? (
          /* ==================== COLLEGE LIST VIEW ==================== */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -40 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
          >
            {/* Search */}
            <div className="relative mb-8 max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, code, or location..."
                className="pl-12 h-12 rounded-2xl text-base border-border bg-card shadow-sm focus:shadow-md transition-shadow"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: "Colleges", value: colleges.length, icon: Building2, gradient: "from-blue-500 to-cyan-500" },
                { label: "Scholarships", value: scholarships.length, icon: Award, gradient: "from-emerald-500 to-teal-500" },
                { label: "Total Seats", value: scholarships.reduce((s, x) => s + (x.total_seats || 0), 0).toLocaleString(), icon: Users, gradient: "from-amber-500 to-orange-500" },
                { label: "Max Award", value: `₹${Math.max(...scholarships.map((s) => s.amount || 0)).toLocaleString()}`, icon: IndianRupee, gradient: "from-purple-500 to-pink-500" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shrink-0`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* College Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((college, i) => {
                const stats = getStats(college.id);
                return (
                  <motion.div
                    key={college.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedCollege(college)}
                    className="cursor-pointer group"
                  >
                    <Card className="h-full border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden">
                      {/* Gradient strip */}
                      <div
                        className="h-1.5"
                        style={{
                          background: "linear-gradient(90deg, hsl(214,100%,40%), hsl(141,68%,45%), hsl(51,100%,50%))",
                        }}
                      />
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                              {college.name}
                            </CardTitle>
                            <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
                              <MapPin className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-xs truncate">{college.location}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyCode(college.code);
                            }}
                            className="ml-2 px-2.5 py-1.5 rounded-lg bg-muted text-xs font-mono font-bold text-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-1.5 shrink-0"
                          >
                            {copiedCode === college.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            {college.code}
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {college.established_year && (
                            <Badge variant="secondary" className="text-xs gap-1">
                              <Calendar className="w-3 h-3" /> Est. {college.established_year}
                            </Badge>
                          )}
                          {college.type && (
                            <Badge variant="outline" className="text-xs">
                              {college.type}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                          <div className="text-center">
                            <p className="text-lg font-bold text-foreground font-mono">{stats.count}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Scholarships</p>
                          </div>
                          <div className="text-center border-x border-border">
                            <p className="text-lg font-bold text-foreground font-mono">{stats.totalSeats.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Seats</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold gradient-text font-mono">₹{(stats.totalAmount / 1000).toFixed(0)}K</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Value</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-end text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No colleges found matching "{search}"</p>
              </div>
            )}
          </motion.div>
        ) : (
          /* ==================== COLLEGE DETAIL VIEW ==================== */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
          >
            {/* College Hero Card */}
            <Card className="mb-6 overflow-hidden border-border">
              <div
                className="h-2"
                style={{
                  background: "linear-gradient(90deg, hsl(214,100%,40%), hsl(141,68%,45%), hsl(51,100%,50%))",
                }}
              />
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-extrabold text-foreground mb-1">{selectedCollege.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{selectedCollege.location}</span>
                      {selectedCollege.established_year && (
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Est. {selectedCollege.established_year}</span>
                      )}
                      {selectedCollege.university && (
                        <span className="flex items-center gap-1"><Building2 className="w-4 h-4" />{selectedCollege.university}</span>
                      )}
                      {selectedCollege.website && (
                        <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                          <Globe className="w-4 h-4" />Website
                        </a>
                      )}
                    </div>

                    {/* Admin Login Code Card */}
                    <div className="inline-flex items-center gap-3 bg-muted rounded-xl px-4 py-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">College Code for Admin Login</p>
                        <p className="text-xl font-mono font-extrabold text-foreground">{selectedCollege.code}</p>
                      </div>
                      <button
                        onClick={() => copyCode(selectedCollege.code)}
                        className="p-2 rounded-lg hover:bg-background transition-colors"
                      >
                        {copiedCode === selectedCollege.code ? (
                          <Check className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {(() => {
                      const stats = getStats(selectedCollege.id);
                      return [
                        { label: "Scholarships", value: stats.count, gradient: "from-blue-500 to-cyan-500" },
                        { label: "Total Seats", value: stats.totalSeats, gradient: "from-emerald-500 to-teal-500" },
                        { label: "Total Value", value: `₹${(stats.totalAmount / 1000).toFixed(0)}K`, gradient: "from-amber-500 to-orange-500" },
                      ].map((s) => (
                        <div key={s.label} className="text-center p-3 rounded-xl bg-muted/50">
                          <p className={`text-xl font-extrabold font-mono bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>{s.value}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filterType === "all"
                    ? "bg-foreground text-background shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                All ({getCollegeScholarships(selectedCollege.id).length})
              </button>
              {scholarshipTypes.map((type) => {
                const Icon = typeIcon[type] || Award;
                const count = getCollegeScholarships(selectedCollege.id).filter((s) => s.type === type).length;
                return (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                      filterType === type
                        ? "bg-foreground text-background shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {type} ({count})
                  </button>
                );
              })}
            </div>

            {/* Scholarships Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collegeScholarships.map((scholarship, i) => {
                const Icon = typeIcon[scholarship.type] || Award;
                const gradient = typeColor[scholarship.type] || "from-gray-500 to-gray-600";
                const fillPercent = scholarship.total_seats
                  ? Math.round(((scholarship.filled_seats || 0) / scholarship.total_seats) * 100)
                  : 0;

                return (
                  <motion.div
                    key={scholarship.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card className="border-border hover:border-primary/20 hover:shadow-md transition-all duration-300 h-full">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-foreground text-sm leading-snug">{scholarship.name}</h3>
                            <Badge variant="outline" className="text-[10px] mt-1">{scholarship.type}</Badge>
                          </div>
                          {scholarship.amount ? (
                            <div className="text-right shrink-0">
                              <p className="text-lg font-extrabold font-mono gradient-text">
                                ₹{scholarship.amount.toLocaleString()}
                              </p>
                              <p className="text-[10px] text-muted-foreground">per year</p>
                            </div>
                          ) : (
                            <Badge className="bg-primary/10 text-primary border-0 text-xs shrink-0">
                              <Briefcase className="w-3 h-3 mr-1" /> Opportunity
                            </Badge>
                          )}
                        </div>

                        {scholarship.description && (
                          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{scholarship.description}</p>
                        )}

                        <div className="flex flex-wrap gap-2 mb-3">
                          {scholarship.min_cgpa && (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                              <TrendingUp className="w-3 h-3" /> Min CGPA: {scholarship.min_cgpa}
                            </span>
                          )}
                          {scholarship.max_income && (
                            <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                              <IndianRupee className="w-3 h-3" /> Max Income: ₹{(scholarship.max_income / 1000).toFixed(0)}K
                            </span>
                          )}
                        </div>

                        {scholarship.total_seats ? (
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                              <span>{scholarship.filled_seats || 0} / {scholarship.total_seats} seats filled</span>
                              <span className="font-mono font-bold">{fillPercent}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${fillPercent}%` }}
                                transition={{ duration: 0.8, delay: i * 0.05 }}
                                className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                              />
                            </div>
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {collegeScholarships.length === 0 && (
              <div className="text-center py-12">
                <Award className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground">No scholarships found for this filter.</p>
              </div>
            )}

            {/* Admin Login CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 text-center"
            >
              <Card className="inline-block border-primary/20 bg-primary/5">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
                  <div className="text-left">
                    <h3 className="font-bold text-foreground">Are you the admin of {selectedCollege.name}?</h3>
                    <p className="text-sm text-muted-foreground">
                      Use code <span className="font-mono font-bold text-primary">{selectedCollege.code}</span> to login and manage scholarships.
                    </p>
                  </div>
                  <button onClick={() => navigate("/login")} className="gradient-btn px-6 py-2.5 text-sm whitespace-nowrap">
                    Admin Login <ArrowRight className="w-4 h-4 inline ml-1" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollegesExplorer;
