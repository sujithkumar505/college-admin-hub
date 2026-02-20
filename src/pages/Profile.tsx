import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Lock, Save, Shield, Bell, BellOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const inputClasses = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

const Profile = () => {
  const { adminName, collegeName, collegeCode, user, adminProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(adminName);
  const [saving, setSaving] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const pwStrength = newPw.length === 0 ? 0 : newPw.length < 6 ? 1 : newPw.length < 10 ? 2 : 3;
  const strengthLabels = ["", "Weak", "Medium", "Strong"];
  const strengthColors = ["", "bg-red-500", "bg-amber-500", "bg-emerald-500"];

  const handleSaveProfile = async () => {
    if (!adminProfile) return;
    setSaving(true);
    const { error } = await supabase
      .from("admin_profiles")
      .update({ full_name: name })
      .eq("id", adminProfile.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Profile updated successfully." });
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPw || newPw !== confirmPw) {
      toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
      return;
    }
    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: "Password changed successfully." });
      setNewPw("");
      setConfirmPw("");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold" style={{ background: 'linear-gradient(135deg, hsl(214,100%,40%), hsl(141,68%,45%))' }}>
                {name.charAt(0)}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={`${inputClasses} mt-1`} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <div className="relative">
                <input value={user?.email || ""} disabled className={`${inputClasses} mt-1 cursor-not-allowed opacity-60 pr-10`} />
                <Lock className="absolute right-3 top-1/2 translate-y-[-30%] w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1"><label className="text-sm text-muted-foreground">College</label><div className="mt-1 badge-primary px-4 py-2 text-sm">{collegeName || "—"}</div></div>
              <div className="flex-1"><label className="text-sm text-muted-foreground">Code</label><div className="mt-1 badge-primary px-4 py-2 text-sm font-mono">{collegeCode || "—"}</div></div>
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSaveProfile} disabled={saving} className="w-full py-3 gradient-btn flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
          </motion.button>
        </div>

        <div className="space-y-6">
          <div className="glass-card space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Change Password</h3>
            <div>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="New password" className={inputClasses} />
              {newPw && (
                <div className="mt-2">
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(pwStrength / 3) * 100}%` }} className={`h-full rounded-full ${strengthColors[pwStrength]}`} />
                  </div>
                  <p className={`text-xs mt-1 ${pwStrength === 1 ? "text-red-500" : pwStrength === 2 ? "text-amber-600" : "text-emerald-600"}`}>{strengthLabels[pwStrength]}</p>
                </div>
              )}
            </div>
            <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Confirm new password" className={inputClasses} />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleUpdatePassword} disabled={pwLoading} className="w-full py-3 gradient-btn flex items-center justify-center gap-2">
              {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Update Password
            </motion.button>
          </div>

          <div className="glass-card space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <div className="flex items-center gap-3"><Bell className="w-5 h-5 text-muted-foreground" /><span className="text-sm text-foreground">Email Notifications</span></div>
              <button onClick={() => setEmailNotif(!emailNotif)} className={`w-12 h-6 rounded-full transition-colors relative ${emailNotif ? "bg-primary" : "bg-muted"}`}>
                <motion.div animate={{ x: emailNotif ? 24 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
              <div className="flex items-center gap-3"><BellOff className="w-5 h-5 text-muted-foreground" /><span className="text-sm text-foreground">Push Notifications</span></div>
              <button onClick={() => setPushNotif(!pushNotif)} className={`w-12 h-6 rounded-full transition-colors relative ${pushNotif ? "bg-primary" : "bg-muted"}`}>
                <motion.div animate={{ x: pushNotif ? 24 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
