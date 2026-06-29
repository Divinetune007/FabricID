import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Eye, Star, ArrowRight } from "lucide-react";

export default function FabricCard({ product, manufacturer, showManufacturer = true }) {
  const qualityColor = product.analysis.qualityScore >= 90
    ? "text-success"
    : product.analysis.qualityScore >= 75
      ? "text-warning"
      : "text-danger";

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
      className="card overflow-hidden group cursor-pointer"
    >
      {/* Color preview bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-4">
        <div
          className="flex-1"
          style={{ backgroundColor: product.analysis.colorProfile.dominant }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: product.analysis.colorProfile.secondary }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: product.analysis.colorProfile.accent }}
        />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary truncate text-base">
            {product.productName}
          </h3>
          {showManufacturer && manufacturer && (
            <p className="text-sm text-text-muted mt-0.5">{manufacturer.companyName}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <Shield className="w-4 h-4 text-success" />
          <span className="text-xs font-medium text-success">Verified</span>
        </div>
      </div>

      {/* Analysis chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
          {product.analysis.fabricType}
        </span>
        <span className="px-2.5 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium">
          {product.analysis.weavePattern}
        </span>
        <span className="px-2.5 py-1 bg-gray-100 text-text-secondary text-xs rounded-full font-medium">
          {product.analysis.threadCount} TC
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            <span className={`text-sm font-semibold ${qualityColor}`}>
              {product.analysis.qualityScore}%
            </span>
          </div>
          <div className="flex items-center gap-1 text-text-muted">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-xs">{product.scanCount} scans</span>
          </div>
        </div>
        <Link
          to={`/verify?id=${product.fabricId}`}
          className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
        >
          View
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* FabricID badge */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <code className="text-xs text-text-muted font-mono bg-gray-50 px-2 py-1 rounded">
          {product.fabricId}
        </code>
      </div>
    </motion.div>
  );
}
