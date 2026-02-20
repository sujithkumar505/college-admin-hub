import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, CheckCircle, Loader2, Mail, Eye, EyeOff, UserPlus, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const FloatingOrbs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="orb w-72 h-72 top-[10%] left-[10%]" style={{ backgroundColor: 'hsl(214,100%,60%)' }} />
    <div className="orb w-96 h-96 top-[60%] right-[5%]" style={{ backgroundColor: 'hsl(141,68%,55%)' }} />
    <div className="orb w-48 h-48 bottom-[20%] left-[30%]" style={{ backgroundColor: 'hsl(179,100%,50%)' }} />
    <div className="orb w-64 h-64 top-[30%] right-[25%]" style={{ backgroundColor: 'hsl(247,75%,64%)' }} />
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, verifyCollegeCode, login, signup } = useAuth();
  const [step, setStep] = useState(1);
  const [collegeCode, setCollegeCode] = useState("");
  const [verifiedCollege, setVerifiedCollege] = useState<{ id: string; name: string } | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shakeError, setShakeError] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const triggerShake = () => {
    setShakeError(true);
    setTimeout(() => setShakeError(false), 500);
  };

  const handleVerify = async () => {
    if (!collegeCode.trim()) {
      setError("Please enter a college code");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");
    const college = await verifyCollegeCode(collegeCode);
    setLoading(false);
    if (!college) {
      setError("Invalid college code. Please check and try again.");
      triggerShake();
      return;
    }
    setVerifiedCollege({ id: college.id, name: college.name });
    setStep(2);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      triggerShake();
      return;
    }
    if (isSignup && !fullName.trim()) {
      setError("Please enter your full name");
      triggerShake();
      return;
    }
    if (!verifiedCollege) return;

    setLoading(true);
    setError("");

    let result;
    if (isSignup) {
      result = await signup(email, password, fullName, verifiedCollege.id);
    } else {
      result = await login(email, password, verifiedCollege.id);
    }

    setLoading(false);

    if (result.error) {
      setError(result.error);
      triggerShake();
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  const inputClasses = "w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(214,40%,96%), hsl(210,20%,98%), hsl(141,30%,96%))' }}>
      <FloatingOrbs />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md mx-4 bg-card/90 backdrop-blur-xl rounded-2xl p-8 border border-border shadow-xl relative z-10 ${shakeError ? "animate-shake" : ""}`}
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
              <div className="flex justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, hsl(214,100%,40%), hsl(141,68%,45%))', boxShadow: '0 8px 25px hsla(214,100%,40%,0.3)' }}
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
                  placeholder="e.g., GMRIT-2024"
                  value={collegeCode}
                  onChange={(e) => setCollegeCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                />
              </div>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <button
                onClick={handleVerify}
                disabled={loading}
                className="w-full py-3 gradient-btn flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify College</>}
              </button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Available codes: GMRIT-2024, VIGNAN-VZG, SRKR-BVR, MVGR-VZN, VRSEC-VJA, etc.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="badge-success flex items-center gap-2 px-4 py-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{verifiedCollege?.name}</span>
                </motion.div>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(214,100%,40%), hsl(141,68%,45%))' }}>
                    {isSignup ? <UserPlus className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-white" />}
                  </div>
                </div>
                <h1 className="text-2xl font-bold gradient-text">
                  {isSignup ? "Create Admin Account" : "Admin Login"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {isSignup ? "Register as college admin" : "Sign in to your admin account"}
                </p>
              </div>

              <div className="space-y-4">
                {isSignup && (
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
                onClick={handleAuth}
                disabled={loading}
                className="w-full py-3 gradient-btn shimmer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>{isSignup ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />} {isSignup ? "Sign Up" : "Sign In"}</>
                )}
              </button>

              <div className="text-center space-y-2">
                <button
                  onClick={() => { setIsSignup(!isSignup); setError(""); }}
                  className="text-sm text-primary hover:underline"
                >
                  {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </button>
                <br />
                <button
                  onClick={() => { setStep(1); setError(""); setVerifiedCollege(null); }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Change college code
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
