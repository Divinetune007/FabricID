import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Fingerprint, Shield, ScanLine, Store, ArrowRight,
  ChevronRight, Zap, Globe, TrendingUp, Award, Users, Package,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="absolute inset-0 gradient-bg opacity-5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              className="max-w-xl"
            >
              <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                AI-Powered Textile Authentication
              </motion.div>

              <motion.h1 custom={1} variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Protect Your
                <span className="gradient-text block">Textile Identity</span>
              </motion.h1>

              <motion.p custom={2} variants={fadeUp} className="mt-6 text-lg text-text-secondary leading-relaxed">
                FabricID creates tamper-proof digital fingerprints for your textile products.
                AI-powered analysis of weave patterns, texture, and color profiles to
                authenticate and verify MSME-manufactured fabrics.
              </motion.p>

              <motion.div custom={3} variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
                <Link to="/signup" className="btn-primary flex items-center gap-2 text-base">
                  Register Your Products
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/verify" className="btn-outline flex items-center gap-2 text-base">
                  <ScanLine className="w-5 h-5" />
                  Verify a Product
                </Link>
              </motion.div>

              <motion.div custom={4} variants={fadeUp} className="mt-10 flex items-center gap-8">
                <div>
                  <p className="text-2xl font-bold text-primary">500+</p>
                  <p className="text-sm text-text-muted">MSMEs Registered</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-primary">10K+</p>
                  <p className="text-sm text-text-muted">Products Verified</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-primary">98%</p>
                  <p className="text-sm text-text-muted">Accuracy Rate</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main card */}
                <div className="glass-card p-8 max-w-sm mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
                      <Fingerprint className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">FabricID Certificate</p>
                      <p className="text-xs text-text-muted">Digital Fingerprint</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Weave Pattern</span>
                      <span className="font-medium">Jacquard</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Thread Count</span>
                      <span className="font-medium">200 TC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Quality Score</span>
                      <span className="font-medium text-success">96%</span>
                    </div>
                  </div>

                  <div className="flex h-2 rounded-full overflow-hidden">
                    <div className="flex-1" style={{ backgroundColor: "#8E44AD" }} />
                    <div className="flex-1" style={{ backgroundColor: "#3498DB" }} />
                    <div className="flex-1" style={{ backgroundColor: "#1ABC9C" }} />
                  </div>

                  <div className="mt-4 text-center">
                    <code className="text-xs font-mono text-primary bg-primary/5 px-3 py-1 rounded-full">
                      FID-A3B7C9D2
                    </code>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -top-4 -right-4 bg-success text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Authenticated
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5 }}
                  className="absolute -bottom-4 -left-4 bg-white text-text-primary px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1 border border-gray-100"
                >
                  <ScanLine className="w-3.5 h-3.5 text-accent" />
                  145 scans
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p custom={0} variants={fadeUp} className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">
              How It Works
            </motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-4xl font-bold">
              Three Simple Steps
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: "Upload Fabric Photos",
                desc: "Upload 3 photos of your textile product. Our AI analyzes weave pattern, texture, thread count, and color profile.",
                step: "01",
                color: "primary",
              },
              {
                icon: Fingerprint,
                title: "Get FabricID Certificate",
                desc: "System generates a unique digital fingerprint and tamper-proof FabricID Certificate with a scannable QR code.",
                step: "02",
                color: "accent",
              },
              {
                icon: ScanLine,
                title: "Verify & Authenticate",
                desc: "Buyers scan the QR code to instantly verify authenticity with an AI-powered trust score and quality report.",
                step: "03",
                color: "success",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="card relative group hover:shadow-xl transition-shadow"
              >
                <div className="absolute -top-3 -left-3 w-10 h-10 gradient-bg rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {item.step}
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                  item.color === "primary" ? "bg-primary/10" :
                  item.color === "accent" ? "bg-accent/10" : "bg-success/10"
                }`}>
                  <item.icon className={`w-7 h-7 ${
                    item.color === "primary" ? "text-primary" :
                    item.color === "accent" ? "text-accent" : "text-success"
                  }`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p custom={0} variants={fadeUp} className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">
              Why FabricID
            </motion.p>
            <motion.h2 custom={1} variants={fadeUp} className="text-3xl md:text-4xl font-bold">
              Built for India&apos;s Textile MSMEs
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Anti-Counterfeiting", desc: "Tamper-proof digital fingerprints make it impossible to replicate your products" },
              { icon: Globe, title: "Marketplace Access", desc: "Connect directly with verified buyers - no middlemen diluting quality" },
              { icon: TrendingUp, title: "Revenue Protection", desc: "Protect your brand from cheap knockoffs eroding your market share" },
              { icon: Award, title: "Quality Certification", desc: "AI-verified quality scores build buyer confidence in your products" },
              { icon: Users, title: "MSME First", desc: "Affordable pricing designed for small manufacturers in Coimbatore, Surat, Tirupur" },
              { icon: Zap, title: "Instant Verification", desc: "Buyers verify in seconds with a simple QR scan - no app needed" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="card hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-semibold text-base mb-1">{feature.title}</h3>
                <p className="text-text-secondary text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAyMEwyMCAwTDQwIDIwTDIwIDQweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 custom={0} variants={fadeUp} className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Protect Your Textiles?
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of MSME manufacturers who trust FabricID to authenticate
              their products and connect with verified buyers.
            </motion.p>
            <motion.div custom={2} variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link
                to="/signup"
                className="bg-white text-primary px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Get Started Free
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to="/marketplace"
                className="border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Store className="w-5 h-5" />
                Browse Marketplace
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
