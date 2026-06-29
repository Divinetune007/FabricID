import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { analyzeFabricImages } from "../utils/fabricAnalysis";
import { motion, AnimatePresence } from "framer-motion";
import QRGenerator from "../components/QRGenerator";
import FabricCard from "../components/FabricCard";
import {
  Plus, Upload, X, Image, Loader2, CheckCircle2,
  Package, Eye, Shield, TrendingUp, Fingerprint,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const { products, addProduct, getProductsByManufacturer } = useProducts();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [uploadState, setUploadState] = useState("idle"); // idle | uploading | analyzing | done
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    category: "Sarees",
    price: "",
    images: [],
    imagePreviews: [],
  });
  const fileInputRef = useRef(null);

  const myProducts = user ? getProductsByManufacturer(user.id) : [];

  const stats = {
    totalProducts: myProducts.length || products.length,
    totalScans: (myProducts.length > 0 ? myProducts : products).reduce((s, p) => s + (p.scanCount || 0), 0),
    avgQuality: Math.round(
      (myProducts.length > 0 ? myProducts : products).reduce((s, p) => s + (p.analysis?.qualityScore || 0), 0) /
      Math.max(1, (myProducts.length > 0 ? myProducts : products).length)
    ),
    verified: (myProducts.length > 0 ? myProducts : products).filter((p) => p.status === "verified").length,
  };

  function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));
  }

  function removeImage(index) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.productName) {
      toast.error("Please enter a product name");
      return;
    }
    if (formData.images.length === 0) {
      toast.error("Please upload at least one fabric photo");
      return;
    }

    setUploadState("uploading");
    await new Promise((r) => setTimeout(r, 1500));

    setUploadState("analyzing");
    await new Promise((r) => setTimeout(r, 2000));

    const analysisResult = analyzeFabricImages(formData.images, {
      companyName: user?.companyName || user?.displayName || "Demo",
    });

    const newProduct = {
      id: `prod-${Date.now()}`,
      manufacturerId: user?.id || "demo",
      fabricId: analysisResult.fabricId,
      productName: formData.productName,
      description: formData.description,
      images: formData.imagePreviews,
      analysis: analysisResult.analysis,
      fingerprint: analysisResult.fingerprint,
      price: formData.price,
      currency: "INR",
      category: formData.category,
      createdAt: new Date().toISOString(),
      status: "verified",
      scanCount: 0,
    };

    addProduct(newProduct);
    setUploadState("done");
    setSelectedProduct(newProduct);

    toast.success("FabricID Certificate generated!");

    setTimeout(() => {
      setShowUpload(false);
      setUploadState("idle");
      setFormData({
        productName: "",
        description: "",
        category: "Sarees",
        price: "",
        images: [],
        imagePreviews: [],
      });
    }, 500);
  }

  const displayProducts = myProducts.length > 0 ? myProducts : products;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Manufacturer Dashboard</h1>
            <p className="text-text-secondary text-sm mt-1">
              Welcome back, {user?.displayName || user?.companyName || "Manufacturer"}
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="btn-primary flex items-center gap-2 self-start"
          >
            <Plus className="w-5 h-5" />
            Register New Fabric
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Products", value: stats.totalProducts, icon: Package, color: "primary" },
            { label: "Total Scans", value: stats.totalScans.toLocaleString(), icon: Eye, color: "accent" },
            { label: "Avg Quality", value: `${stats.avgQuality}%`, icon: TrendingUp, color: "success" },
            { label: "Verified", value: stats.verified, icon: Shield, color: "primary" },
          ].map((stat) => (
            <div key={stat.label} className="card">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  stat.color === "primary" ? "bg-primary/10" :
                  stat.color === "accent" ? "bg-accent/10" : "bg-success/10"
                }`}>
                  <stat.icon className={`w-5 h-5 ${
                    stat.color === "primary" ? "text-primary" :
                    stat.color === "accent" ? "text-accent" : "text-success"
                  }`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Products grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Registered Products</h2>
          <span className="text-sm text-text-muted">{displayProducts.length} products</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProducts.map((product) => (
            <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
              <FabricCard product={product} showManufacturer={false} />
            </div>
          ))}
        </div>

        {displayProducts.length === 0 && (
          <div className="card text-center py-16">
            <Package className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No products yet</h3>
            <p className="text-text-secondary text-sm mb-6">
              Upload your first fabric to get a FabricID certificate
            </p>
            <button onClick={() => setShowUpload(true)} className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Register Your First Fabric
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => uploadState === "idle" && setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Register New Fabric</h2>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={uploadState !== "idle"}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {uploadState === "idle" ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.productName}
                        onChange={(e) => setFormData((p) => ({ ...p, productName: e.target.value }))}
                        placeholder="e.g., Premium Cotton Saree - Temple Border"
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                        placeholder="Describe your fabric product..."
                        className="input-field min-h-[80px] resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                          className="input-field"
                        >
                          <option>Sarees</option>
                          <option>Fabric Rolls</option>
                          <option>Dupattas</option>
                          <option>Stoles & Scarves</option>
                          <option>Dress Material</option>
                          <option>Home Textiles</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">
                          Price (INR)
                        </label>
                        <input
                          type="text"
                          value={formData.price}
                          onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                          placeholder="e.g., 2,500"
                          className="input-field"
                        />
                      </div>
                    </div>

                    {/* Image upload */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Fabric Photos * (up to 3)
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {formData.imagePreviews.map((preview, i) => (
                          <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                            <img src={preview} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute top-1 right-1 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {formData.images.length < 3 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-text-muted hover:border-primary hover:text-primary transition-colors"
                          >
                            <Image className="w-6 h-6" />
                            <span className="text-xs">Add</span>
                          </button>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 !mt-6">
                      <Upload className="w-5 h-5" />
                      Analyze & Generate FabricID
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    {uploadState === "uploading" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                        <h3 className="font-semibold text-lg">Uploading Images...</h3>
                        <p className="text-text-secondary text-sm mt-1">Processing your fabric photos</p>
                        <div className="w-48 h-2 bg-gray-100 rounded-full mx-auto mt-4 overflow-hidden">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "60%" }}
                            transition={{ duration: 1.5 }}
                            className="h-full gradient-bg rounded-full"
                          />
                        </div>
                      </motion.div>
                    )}
                    {uploadState === "analyzing" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Fingerprint className="w-12 h-12 text-accent mx-auto mb-4 animate-pulse" />
                        <h3 className="font-semibold text-lg">AI Analyzing Fabric...</h3>
                        <p className="text-text-secondary text-sm mt-1">
                          Detecting weave pattern, texture, thread count & color profile
                        </p>
                        <div className="w-48 h-2 bg-gray-100 rounded-full mx-auto mt-4 overflow-hidden">
                          <motion.div
                            initial={{ width: "60%" }}
                            animate={{ width: "95%" }}
                            transition={{ duration: 2 }}
                            className="h-full gradient-bg rounded-full"
                          />
                        </div>
                      </motion.div>
                    )}
                    {uploadState === "done" && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
                        <h3 className="font-semibold text-lg">FabricID Generated!</h3>
                        <p className="text-text-secondary text-sm mt-1">
                          Your fabric has been authenticated and registered
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">{selectedProduct.productName}</h2>
                    <p className="text-sm text-text-muted mt-0.5">FabricID Certificate</p>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center bg-surface rounded-xl p-6">
                    <QRGenerator
                      fabricId={selectedProduct.fabricId}
                      productName={selectedProduct.productName}
                      size={180}
                    />
                  </div>

                  {/* Analysis Details */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-primary uppercase tracking-wider">
                      AI Analysis Report
                    </h3>
                    <div className="space-y-2">
                      {[
                        { label: "Fabric Type", value: selectedProduct.analysis.fabricType },
                        { label: "Weave Pattern", value: selectedProduct.analysis.weavePattern },
                        { label: "Texture", value: selectedProduct.analysis.textureProfile },
                        { label: "Thread Count", value: `${selectedProduct.analysis.threadCount} TC` },
                        { label: "GSM Weight", value: `${selectedProduct.analysis.gsmWeight} g/m²` },
                        { label: "Quality Score", value: `${selectedProduct.analysis.qualityScore}%` },
                        { label: "Durability", value: `${"★".repeat(selectedProduct.analysis.durabilityRating)}${"☆".repeat(5 - selectedProduct.analysis.durabilityRating)}` },
                        { label: "Colorfastness", value: `${"★".repeat(selectedProduct.analysis.colorfastness)}${"☆".repeat(5 - selectedProduct.analysis.colorfastness)}` },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                          <span className="text-text-muted">{item.label}</span>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Color Profile */}
                    <div className="pt-2">
                      <p className="text-sm text-text-muted mb-2">Color Profile: {selectedProduct.analysis.colorProfile.name}</p>
                      <div className="flex h-4 rounded-full overflow-hidden">
                        <div className="flex-1" style={{ backgroundColor: selectedProduct.analysis.colorProfile.dominant }} />
                        <div className="flex-1" style={{ backgroundColor: selectedProduct.analysis.colorProfile.secondary }} />
                        <div className="flex-1" style={{ backgroundColor: selectedProduct.analysis.colorProfile.accent }} />
                      </div>
                    </div>

                    {/* Fingerprint */}
                    <div className="pt-2">
                      <p className="text-xs text-text-muted mb-1">Digital Fingerprint</p>
                      <code className="text-sm font-mono text-primary bg-primary/5 px-3 py-1.5 rounded-lg block text-center">
                        {selectedProduct.fingerprint}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
