import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, CheckCircle, Loader2, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const FloatingOrbs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="orb w-72 h-72 bg-indigo-600 top-[10%] left-[10%]" style={{ animationDelay: "0s" }} />
    <div className="orb w-96 h-96 bg-purple-600 top-[60%] right-[5%]" style={{ animationDelay: "2s" }} />
    <div className="orb w-48 h-48 bg-pink-600 bottom-[20%] left-[30%]" style={{ animationDelay: "4s" }} />
    <div className="orb w-64 h-64 bg-indigo-500 top-[30%] right-[25%]" style={{ animationDelay: "1s" }} />
    <div className="orb w-40 h-40 bg-violet-600 bottom-[10%] right-[40%]" style={{ animationDelay: "3s" }} />
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [step, setStep] = useState(1);
  const [collegeCode, setCollegeCode] = useState("");
  const [verifiedCollege, setVerifiedCollege] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shakeError, setShakeError] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleVerify = async () => {
    if (!collegeCode.trim()) {
      setError("Please enter a college code");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setVerifiedCollege("National Institute of Technology");
    setLoading(false);
    setStep(2);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1000));
    login(verifiedCollege, collegeCode);
    navigate("/dashboard");
  };

  const triggerShake = () => {
    setShakeError(true);
    setTimeout(() => setShakeError(false), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <FloatingOrbs />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md mx-4 glass-card relative z-10 ${shakeError ? "animate-shake" : ""}`}
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Shield Icon */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25"
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              <div className="text-center">
                <h1 className="text-2xl font-bold gradient-text">Enter College Code</h1>
                <p className="text-sm text-muted-foreground mt-2">Verify your institution to continue</p>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="e.g., NIT-2024"
                  value={collegeCode}
                  onChange={(e) => setCollegeCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all"
                />
              </div>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full py-3 gradient-btn flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Verify</>
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Verified badge */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="badge-success flex items-center gap-2 px-4 py-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{verifiedCollege}</span>
                </motion.div>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold gradient-text">Admin Login</h1>
                <p className="text-sm text-muted-foreground mt-1">Sign in to your admin account</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 gradient-btn shimmer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Sign In</>
                )}
              </button>

              <button
                onClick={() => { setStep(1); setError(""); }}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
              >
                ← Change college code
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
