import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  Fingerprint, Mail, Lock, ArrowRight, Factory, ShoppingBag,
  User, Phone, MapPin, Building, Hash,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "manufacturer",
    companyName: "",
    phone: "",
    location: "",
    gstNumber: "",
    specialization: "",
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      signup(formData);
      toast.success("Account created successfully!");
      navigate(formData.role === "manufacturer" ? "/dashboard" : "/marketplace");
    } catch {
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isManufacturer = formData.role === "manufacturer";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      <div className="absolute inset-0 gradient-bg opacity-5" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
              <Fingerprint className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Create Your Account</h1>
          <p className="text-text-secondary text-sm mt-1">
            {isManufacturer
              ? "Register your textile business on FabricID"
              : "Start verifying textile products instantly"}
          </p>
        </div>

        <div className="card">
          {/* Role selector */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => updateField("role", "manufacturer")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                isManufacturer
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              <Factory className="w-4 h-4" />
              Manufacturer
            </button>
            <button
              type="button"
              onClick={() => updateField("role", "buyer")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                !isManufacturer
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Buyer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Your name"
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@company.com"
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="Create a password"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            {/* Manufacturer-specific fields */}
            {isManufacturer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-gray-100"
              >
                <p className="text-sm font-semibold text-primary">Business Details</p>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => updateField("companyName", e.target.value)}
                      placeholder="Your textile company"
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+91-xxx-xxxxxxx"
                        className="input-field pl-11"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        placeholder="City, State"
                        className="input-field pl-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">GST Number</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <input
                        type="text"
                        value={formData.gstNumber}
                        onChange={(e) => updateField("gstNumber", e.target.value)}
                        placeholder="GST Number"
                        className="input-field pl-11"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Specialization</label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => updateField("specialization", e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select type</option>
                      <option value="Cotton Fabrics">Cotton Fabrics</option>
                      <option value="Silk & Silk Blends">Silk & Silk Blends</option>
                      <option value="Synthetic Fabrics">Synthetic Fabrics</option>
                      <option value="Handloom & Khadi">Handloom & Khadi</option>
                      <option value="Knitted Fabrics">Knitted Fabrics</option>
                      <option value="Denim & Workwear">Denim & Workwear</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 !mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-text-muted">
            Demo mode: registration works without real Firebase
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
