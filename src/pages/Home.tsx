import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, BookOpen, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-classroom.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="Classroom" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(214,100%,20%)]/80 via-[hsl(214,100%,20%)]/60 to-[hsl(214,100%,20%)]/90" />
        </div>

        {/* Navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, hsl(214,100%,40%), hsl(141,68%,45%))' }}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ScholarConnect</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hidden sm:block text-sm text-white/80 hover:text-white transition-colors">
              Features
            </a>
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-lg font-medium text-sm text-white transition-all hover:shadow-lg" style={{ background: 'linear-gradient(135deg, hsl(51,100%,50%), hsl(33,100%,50%))' }}
            >
              Admin Login
            </button>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold text-white leading-tight max-w-4xl"
          >
            ScholarConnect
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, hsl(179,100%,60%), hsl(141,68%,65%), hsl(51,100%,70%))' }}>
              Scholarships
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl"
          >
            Empowering merit & need-based students through education.
            AI-powered scholarship management for modern institutions.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className="mt-10 px-10 py-4 rounded-full font-semibold text-lg flex items-center gap-3 shadow-2xl transition-all text-white"
            style={{ background: 'linear-gradient(135deg, hsl(214,100%,40%), hsl(141,68%,45%))', boxShadow: '0 8px 30px hsla(214,100%,40%,0.35)' }}
          >
            Let's Go <ArrowRight className="w-5 h-5" />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-8 left-6 text-sm text-white/40 max-w-sm text-left"
          >
            Trusted by leading institutions for intelligent scholarship allocation since 2024
          </motion.p>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6 md:px-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Why <span className="gradient-text">ScholarConnect</span>?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            A complete platform for managing scholarships, applications, and AI-driven allocations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: BookOpen, title: "Smart Management", desc: "Create and manage scholarships with multi-step criteria, budgets, and timelines effortlessly." },
            { icon: Users, title: "Student Applications", desc: "Review, approve, and track applications with detailed student profiles and AI scoring." },
            { icon: Award, title: "AI Allocation", desc: "Intelligent ranking engine considers academics, financial need, and extracurriculars." },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card text-center hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, hsl(214,100%,40%), hsl(141,68%,45%))' }}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/login")}
            className="gradient-btn-cta px-8 py-3 text-lg"
          >
            Get Started →
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default Home;
