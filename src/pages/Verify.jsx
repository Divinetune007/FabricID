import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { motion, AnimatePresence } from "framer-motion";
import QRGenerator from "../components/QRGenerator";
import {
  ScanLine, Search, Shield, ShieldAlert, ShieldCheck,
  Fingerprint, AlertTriangle, CheckCircle2, X, Eye,
  Loader2, ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Verify() {
  const [searchParams] = useSearchParams();
  const { getProductByFabricId, getManufacturer, incrementScanCount } = useProducts();
  const [fabricIdInput, setFabricIdInput] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const verifyFabric = useCallback(async function verifyFabric(id) {
    const fabricId = id || fabricIdInput.trim();
    if (!fabricId) {
      toast.error("Please enter a FabricID");
      return;
    }

    setVerifying(true);
    setVerificationResult(null);

    // Simulate verification delay
    await new Promise((r) => setTimeout(r, 2000));

    const product = getProductByFabricId(fabricId);

    if (product) {
      const manufacturer = getManufacturer(product.manufacturerId);
      incrementScanCount(fabricId);

      setVerificationResult({
        found: true,
        product,
        manufacturer,
        matchScore: 94 + Math.floor(Math.random() * 6),
        verifiedAt: new Date().toISOString(),
      });
      toast.success("Product verified successfully!");
    } else {
      setVerificationResult({
        found: false,
        fabricId,
      });
      toast.error("Product not found in registry");
    }

    setVerifying(false);
  }, [fabricIdInput, getProductByFabricId, getManufacturer, incrementScanCount]);

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setFabricIdInput(idFromUrl);
      verifyFabric(idFromUrl);
    }
  }, [searchParams, verifyFabric]);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ScanLine className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Verify Fabric Authenticity</h1>
          <p className="text-text-secondary">
            Enter a FabricID or scan a QR code to verify any textile product
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={fabricIdInput}
                onChange={(e) => setFabricIdInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && verifyFabric()}
                placeholder="Enter FabricID (e.g., FID-A3B7C9D2)"
                className="input-field pl-12 text-base"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => verifyFabric()}
                disabled={verifying}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                {verifying ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
                Verify
              </button>
              <button
                onClick={() => setShowScanner(true)}
                className="btn-outline flex items-center gap-2 whitespace-nowrap"
              >
                <ScanLine className="w-5 h-5" />
                Scan QR
              </button>
            </div>
          </div>

          {/* Quick demo links */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-text-muted mb-2">Try these demo FabricIDs:</p>
            <div className="flex flex-wrap gap-2">
              {["FID-A3B7C9D2", "FID-F4E8D1C5", "FID-B2C6D8E3", "FID-E7A1B5C9", "FID-C8D2E6F1"].map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    setFabricIdInput(id);
                    verifyFabric(id);
                  }}
                  className="px-3 py-1 bg-primary/5 text-primary text-xs font-mono rounded-full hover:bg-primary/10 transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Verifying animation */}
        <AnimatePresence>
          {verifying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card text-center py-12 mb-8"
            >
              <Fingerprint className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold mb-2">Verifying Fabric...</h3>
              <p className="text-text-secondary text-sm">
                Comparing digital fingerprint against the FabricID registry
              </p>
              <div className="w-64 h-2 bg-gray-100 rounded-full mx-auto mt-6 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 2 }}
                  className="h-full gradient-bg rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verification Result */}
        <AnimatePresence>
          {verificationResult && !verifying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {verificationResult.found ? (
                <div className="space-y-6">
                  {/* Trust Score */}
                  <div className="card overflow-hidden">
                    <div className="gradient-bg -mx-6 -mt-6 px-6 py-6 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-10 h-10 text-white" />
                          <div>
                            <h3 className="text-white font-bold text-xl">Authenticated</h3>
                            <p className="text-white/80 text-sm">
                              This fabric matches the registered FabricID
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-bold text-white">
                            {verificationResult.matchScore}%
                          </p>
                          <p className="text-white/70 text-xs">Trust Score</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Product Info */}
                      <div>
                        <h4 className="font-semibold text-sm text-primary uppercase tracking-wider mb-3">
                          Product Details
                        </h4>
                        <div className="space-y-2.5">
                          <div>
                            <p className="text-lg font-semibold">{verificationResult.product.productName}</p>
                            <p className="text-sm text-text-secondary mt-1">
                              {verificationResult.product.description}
                            </p>
                          </div>

                          {verificationResult.manufacturer && (
                            <div className="flex items-center gap-3 p-3 bg-surface rounded-xl">
                              <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center shrink-0">
                                <span className="text-white font-semibold">
                                  {verificationResult.manufacturer.companyName[0]}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {verificationResult.manufacturer.companyName}
                                </p>
                                <p className="text-xs text-text-muted">
                                  {verificationResult.manufacturer.location}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <div className="bg-surface rounded-xl p-3 text-center">
                              <p className="text-xs text-text-muted">Category</p>
                              <p className="font-medium text-sm">{verificationResult.product.category}</p>
                            </div>
                            <div className="bg-surface rounded-xl p-3 text-center">
                              <p className="text-xs text-text-muted">Price</p>
                              <p className="font-medium text-sm">
                                {verificationResult.product.price ? `₹${verificationResult.product.price}` : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Analysis Report */}
                      <div>
                        <h4 className="font-semibold text-sm text-primary uppercase tracking-wider mb-3">
                          AI Analysis Report
                        </h4>
                        <div className="space-y-2">
                          {[
                            { label: "Fabric Type", value: verificationResult.product.analysis.fabricType, match: true },
                            { label: "Weave Pattern", value: verificationResult.product.analysis.weavePattern, match: true },
                            { label: "Texture", value: verificationResult.product.analysis.textureProfile, match: true },
                            { label: "Thread Count", value: `${verificationResult.product.analysis.threadCount} TC`, match: true },
                            { label: "GSM Weight", value: `${verificationResult.product.analysis.gsmWeight} g/m²`, match: true },
                            { label: "Quality Score", value: `${verificationResult.product.analysis.qualityScore}%`, match: true },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50">
                              <span className="text-text-muted">{item.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{item.value}</span>
                                <CheckCircle2 className="w-4 h-4 text-success" />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Color Profile */}
                        <div className="mt-3">
                          <p className="text-xs text-text-muted mb-1.5">
                            Color Profile: {verificationResult.product.analysis.colorProfile.name}
                          </p>
                          <div className="flex h-3 rounded-full overflow-hidden">
                            <div className="flex-1" style={{ backgroundColor: verificationResult.product.analysis.colorProfile.dominant }} />
                            <div className="flex-1" style={{ backgroundColor: verificationResult.product.analysis.colorProfile.secondary }} />
                            <div className="flex-1" style={{ backgroundColor: verificationResult.product.analysis.colorProfile.accent }} />
                          </div>
                        </div>

                        {/* Fingerprint */}
                        <div className="mt-3">
                          <p className="text-xs text-text-muted mb-1">Digital Fingerprint</p>
                          <code className="text-xs font-mono text-primary bg-primary/5 px-3 py-1.5 rounded-lg block text-center">
                            {verificationResult.product.fingerprint}
                          </code>
                        </div>
                      </div>
                    </div>

                    {/* Scan stats */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-text-muted">
                        <Eye className="w-4 h-4" />
                        <span>Scanned {(verificationResult.product.scanCount || 0) + 1} times</span>
                      </div>
                      <code className="text-xs font-mono text-primary bg-primary/5 px-2 py-1 rounded">
                        {verificationResult.product.fabricId}
                      </code>
                    </div>
                  </div>

                  {/* QR Code for this product */}
                  <div className="card">
                    <h4 className="font-semibold mb-4 text-center">Product QR Code</h4>
                    <div className="flex justify-center">
                      <QRGenerator
                        fabricId={verificationResult.product.fabricId}
                        productName={verificationResult.product.productName}
                        size={160}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Not found */
                <div className="card text-center py-12">
                  <ShieldAlert className="w-16 h-16 text-danger mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-danger mb-2">Product Not Found</h3>
                  <p className="text-text-secondary max-w-md mx-auto">
                    No registered product matches the FabricID{" "}
                    <code className="font-mono text-sm bg-danger/10 text-danger px-2 py-0.5 rounded">
                      {verificationResult.fabricId}
                    </code>
                  </p>
                  <div className="mt-6 p-4 bg-warning/10 rounded-xl max-w-sm mx-auto">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                      <p className="text-sm text-warning text-left">
                        This product may be counterfeit or not yet registered.
                        Contact the manufacturer directly to verify.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No result yet */}
        {!verificationResult && !verifying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-16"
          >
            <ScanLine className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-semibold text-text-secondary mb-2">
              Enter a FabricID to get started
            </h3>
            <p className="text-text-muted text-sm">
              Type a FabricID code or scan a QR code from any registered textile product
            </p>
          </motion.div>
        )}
      </div>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowScanner(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Scan QR Code</h3>
                <button
                  onClick={() => setShowScanner(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-surface rounded-xl p-8 text-center">
                <ScanLine className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-sm text-text-secondary mb-4">
                  QR scanning requires camera access. For the prototype, use the
                  manual entry below:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fabricIdInput}
                    onChange={(e) => setFabricIdInput(e.target.value)}
                    placeholder="Enter FabricID"
                    className="input-field text-sm"
                  />
                  <button
                    onClick={() => {
                      setShowScanner(false);
                      verifyFabric();
                    }}
                    className="btn-primary !px-4 !py-2 text-sm whitespace-nowrap"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
