import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap, FileText, DollarSign, Users, TrendingUp, TrendingDown,
  Brain, PlusCircle, ClipboardCheck, ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Area, AreaChart,
  CartesianGrid, XAxis, YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";

const useCountUp = (end: number, duration = 1500) => {
  const [count, setCount] = useState(0);
  const ref = useRef<number>();
  useEffect(() => {
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [end, duration]);
  return count;
};

const StatCard = ({ stat, index }: { stat: { title: string; value: number; icon: any; trend: string; up: boolean; gradient: string; suffix?: string }; index: number }) => {
  const count = useCountUp(stat.value);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }} className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{stat.title}</p>
          <p className="text-3xl font-bold text-foreground mt-1 font-mono">
            {stat.title.includes("Budget") ? "₹" : ""}{count.toLocaleString()}{stat.suffix || ""}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: stat.gradient }}>
          <stat.icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className={`flex items-center gap-1 mt-3 text-sm ${stat.up ? "text-emerald-600" : "text-red-500"}`}>
        {stat.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span className="font-medium">{stat.trend}</span>
        <span className="text-muted-foreground">vs last month</span>
      </div>
    </motion.div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card rounded-lg p-3 text-sm border border-border shadow-lg">
      <p className="text-muted-foreground">{label}</p>
      <p className="text-foreground font-semibold">{payload[0].value} applications</p>
    </div>
  );
};

const Dashboard = () => {
  const { collegeName, adminName } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ scholarships: 0, applications: 0, budget: 0, students: 0 });
  const [statusData, setStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [recentApps, setRecentApps] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch scholarships count and budget
      const { data: scholarships } = await supabase.from("scholarships").select("id, amount, total_seats, filled_seats");
      const totalScholarships = scholarships?.length || 0;
      const totalBudget = scholarships?.reduce((sum, s) => sum + Number(s.amount || 0), 0) || 0;

      // Fetch applications
      const { data: applications } = await supabase.from("applications").select("id, status, student_name");
      const totalApps = applications?.length || 0;
      const approved = applications?.filter(a => a.status === "Approved").length || 0;
      const pending = applications?.filter(a => a.status === "Pending").length || 0;
      const rejected = applications?.filter(a => a.status === "Rejected").length || 0;

      // Unique students
      const uniqueStudents = new Set(applications?.map(a => a.student_name)).size;

      setStats({
        scholarships: totalScholarships,
        applications: totalApps,
        budget: Math.round(totalBudget / 100000),
        students: uniqueStudents,
      });

      setStatusData([
        { name: "Approved", value: approved, color: "hsl(141, 68%, 45%)" },
        { name: "Pending", value: pending, color: "hsl(51, 100%, 50%)" },
        { name: "Rejected", value: rejected, color: "hsl(0, 84%, 60%)" },
      ]);

      setRecentApps(applications?.slice(0, 5) || []);
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: "Scholarships", value: stats.scholarships, icon: GraduationCap, trend: "+12%", up: true, gradient: "linear-gradient(135deg, hsl(214,100%,40%), hsl(179,100%,40%))" },
    { title: "Applications", value: stats.applications, icon: FileText, trend: "+23%", up: true, gradient: "linear-gradient(135deg, hsl(141,68%,40%), hsl(179,100%,35%))" },
    { title: "Budget (₹)", value: stats.budget, suffix: "L", icon: DollarSign, trend: "-5%", up: false, gradient: "linear-gradient(135deg, hsl(51,100%,50%), hsl(33,100%,50%))" },
    { title: "Students", value: stats.students, icon: Users, trend: "+8%", up: true, gradient: "linear-gradient(135deg, hsl(247,75%,64%), hsl(179,100%,40%))" },
  ];

  const lineData = [
    { month: "Aug", apps: Math.round(stats.applications * 0.3) },
    { month: "Sep", apps: Math.round(stats.applications * 0.45) },
    { month: "Oct", apps: Math.round(stats.applications * 0.6) },
    { month: "Nov", apps: Math.round(stats.applications * 0.75) },
    { month: "Dec", apps: Math.round(stats.applications * 0.85) },
    { month: "Jan", apps: stats.applications },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, <span className="gradient-text">{adminName}</span>
        </h1>
        <p className="text-muted-foreground">{collegeName}</p>
        <motion.div initial={{ width: 0 }} animate={{ width: "6rem" }} transition={{ delay: 0.5, duration: 0.8 }} className="h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, hsl(214,100%,40%), hsl(141,68%,45%))' }} />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => <StatCard key={stat.title} stat={stat} index={i} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Application Status</h3>
          <div className="flex items-center justify-center gap-8">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-semibold text-foreground font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Application Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(214,100%,40%)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(141,68%,45%)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
              <XAxis dataKey="month" stroke="hsl(215,14%,45%)" fontSize={12} />
              <YAxis stroke="hsl(215,14%,45%)" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="apps" stroke="hsl(214,100%,40%)" fill="url(#colorApps)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Applications</h3>
            <button onClick={() => navigate("/applications")} className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentApps.map((app: any, i: number) => (
              <motion.div key={app.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.1 }} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ background: 'linear-gradient(135deg, hsl(214,100%,40%), hsl(141,68%,45%))' }}>
                    {app.student_name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-medium">{app.student_name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{app.student_roll}</p>
                  </div>
                </div>
                <span className={app.status === "Approved" ? "badge-success" : app.status === "Rejected" ? "badge-danger" : "badge-warning"}>
                  {app.status}
                </span>
              </motion.div>
            ))}
            {recentApps.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No applications yet</p>}
          </div>
        </div>

        <div className="glass-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate("/scholarships")} className="w-full py-3 px-4 gradient-btn flex items-center gap-3">
              <PlusCircle className="w-5 h-5" /> Create Scholarship
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate("/applications")} className="w-full py-3 px-4 gradient-btn-success flex items-center gap-3">
              <ClipboardCheck className="w-5 h-5" /> Review Applications
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate("/ai-allocation")} className="w-full py-3 px-4 gradient-btn-tech flex items-center gap-3">
              <Brain className="w-5 h-5" /> Run AI Allocation
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
