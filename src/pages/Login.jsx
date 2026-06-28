import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Fingerprint, Mail, Lock, ArrowRight, Factory, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manufacturer");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 800));
      login(email, password, role);
      toast.success("Welcome back!");
      navigate(role === "manufacturer" ? "/dashboard" : "/marketplace");
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      <div className="absolute inset-0 gradient-bg opacity-5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
              <Fingerprint className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-text-secondary text-sm mt-1">Sign in to your FabricID account</p>
        </div>

        <div className="card">
          {/* Role selector */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole("manufacturer")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                role === "manufacturer"
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              <Factory className="w-4 h-4" />
              Manufacturer
            </button>
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                role === "buyer"
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Buyer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 !mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-text-muted">
            Demo: use any email/password to sign in
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-primary font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
