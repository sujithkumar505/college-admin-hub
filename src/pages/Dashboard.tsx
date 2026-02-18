import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Brain,
  PlusCircle,
  ClipboardCheck,
  Activity,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

// Animated counter hook
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

const statCards = [
  { title: "Scholarships", value: 24, icon: GraduationCap, trend: "+12%", up: true, gradient: "linear-gradient(135deg, hsl(214,100%,40%), hsl(179,100%,40%))" },
  { title: "Applications", value: 1847, icon: FileText, trend: "+23%", up: true, gradient: "linear-gradient(135deg, hsl(141,68%,40%), hsl(179,100%,35%))" },
  { title: "Budget (₹)", value: 52, suffix: "L", icon: DollarSign, trend: "-5%", up: false, gradient: "linear-gradient(135deg, hsl(51,100%,50%), hsl(33,100%,50%))" },
  { title: "Students", value: 3256, icon: Users, trend: "+8%", up: true, gradient: "linear-gradient(135deg, hsl(247,75%,64%), hsl(179,100%,40%))" },
];

const pieData = [
  { name: "Approved", value: 45, color: "hsl(141, 68%, 45%)" },
  { name: "Pending", value: 30, color: "hsl(51, 100%, 50%)" },
  { name: "Rejected", value: 25, color: "hsl(0, 84%, 60%)" },
];

const lineData = [
  { month: "Aug", apps: 120 },
  { month: "Sep", apps: 180 },
  { month: "Oct", apps: 250 },
  { month: "Nov", apps: 310 },
  { month: "Dec", apps: 280 },
  { month: "Jan", apps: 420 },
];

const recentActivity = [
  { text: "New scholarship 'Merit Award 2024' created", time: "2 hours ago", icon: PlusCircle, color: "text-blue-600" },
  { text: "12 applications approved for 'Sports Excellence'", time: "4 hours ago", icon: ClipboardCheck, color: "text-emerald-600" },
  { text: "AI allocation completed for 'Need-Based Fund'", time: "6 hours ago", icon: Brain, color: "text-violet-600" },
  { text: "Budget updated for Q2 scholarships", time: "1 day ago", icon: DollarSign, color: "text-amber-600" },
  { text: "3 new student registrations", time: "1 day ago", icon: Users, color: "text-cyan-600" },
];

const StatCard = ({ stat, index }: { stat: typeof statCards[0]; index: number }) => {
  const count = useCountUp(stat.value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{stat.title}</p>
          <p className="text-3xl font-bold text-foreground mt-1 font-mono">
            {stat.title === "Budget (₹)" ? "₹" : ""}{count.toLocaleString()}{stat.suffix || ""}
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
  const { collegeName } = useAuth();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, <span className="gradient-text">Admin</span>
        </h1>
        <p className="text-muted-foreground">{collegeName}</p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "6rem" }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-0.5 rounded-full"
          style={{ background: 'linear-gradient(90deg, hsl(214,100%,40%), hsl(141,68%,45%))' }}
        />
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <StatCard key={stat.title} stat={stat} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Application Status</h3>
          <div className="flex items-center justify-center gap-8">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-semibold text-foreground font-mono">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card"
        >
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

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
            <button className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div className={`mt-0.5 ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 px-4 gradient-btn flex items-center gap-3">
              <PlusCircle className="w-5 h-5" />
              Create Scholarship
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 px-4 gradient-btn-success flex items-center gap-3">
              <ClipboardCheck className="w-5 h-5" />
              Review Applications
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-3 px-4 gradient-btn-tech flex items-center gap-3">
              <Brain className="w-5 h-5" />
              Run AI Allocation
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
