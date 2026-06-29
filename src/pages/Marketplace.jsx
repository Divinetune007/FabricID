import { useState } from "react";
import { useProducts } from "../context/ProductContext";
import { motion, AnimatePresence } from "framer-motion";
import FabricCard from "../components/FabricCard";
import {
  Store, Search, MapPin, Star, Shield,
  Package, ChevronRight, X, Users, Building,
} from "lucide-react";

const CATEGORIES = [
  "All", "Sarees", "Fabric Rolls", "Dupattas", "Stoles & Scarves", "Dress Material", "Home Textiles",
];

const LOCATIONS = [
  "All Locations", "Coimbatore, Tamil Nadu", "Surat, Gujarat",
  "Tirupur, Tamil Nadu", "Bhagalpur, Bihar", "Varanasi, Uttar Pradesh",
];

export default function Marketplace() {
  const { products, manufacturers, getManufacturer } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [activeTab, setActiveTab] = useState("products");
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.analysis.fabricType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.fabricId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const filteredManufacturers = manufacturers.filter((m) => {
    const matchesSearch =
      !searchQuery ||
      m.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.specialization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      selectedLocation === "All Locations" || m.location === selectedLocation;

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen pt-20 pb-12 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Verified Textile Marketplace</h1>
          <p className="text-text-secondary">
            Discover authenticated MSME textile manufacturers and their verified products
          </p>
        </motion.div>

        {/* Search & Filters */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, manufacturers, fabric types..."
                className="input-field pl-12"
              />
            </div>
            {activeTab === "manufacturers" && (
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="input-field w-auto"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            )}
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "products"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              <Package className="w-4 h-4" />
              Products ({filteredProducts.length})
            </button>
            <button
              onClick={() => setActiveTab("manufacturers")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "manufacturers"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              <Users className="w-4 h-4" />
              Manufacturers ({filteredManufacturers.length})
            </button>
          </div>

          {/* Category filters (for products) */}
          {activeTab === "products" && (
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-accent text-white"
                      : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {activeTab === "products" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <FabricCard
                  product={product}
                  manufacturer={getManufacturer(product.manufacturerId)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Manufacturers Grid */}
        {activeTab === "manufacturers" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredManufacturers.map((mfr, i) => (
              <motion.div
                key={mfr.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedManufacturer(mfr)}
                className="card cursor-pointer group hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <span className="text-white font-bold text-lg">
                      {mfr.companyName[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{mfr.companyName}</h3>
                      {mfr.verified && (
                        <Shield className="w-4 h-4 text-success shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-text-muted">{mfr.ownerName}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <MapPin className="w-4 h-4 text-text-muted" />
                    {mfr.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Building className="w-4 h-4 text-text-muted" />
                    {mfr.specialization}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      <span className="text-sm font-semibold">{mfr.rating}</span>
                    </div>
                    <span className="text-xs text-text-muted">
                      {mfr.totalProducts} products
                    </span>
                  </div>
                  <span className="text-xs text-text-muted">
                    Est. {mfr.established}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {((activeTab === "products" && filteredProducts.length === 0) ||
          (activeTab === "manufacturers" && filteredManufacturers.length === 0)) && (
          <div className="card text-center py-16">
            <Search className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
            <h3 className="font-semibold text-lg mb-2">No results found</h3>
            <p className="text-text-secondary text-sm">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Manufacturer Detail Modal */}
      <AnimatePresence>
        {selectedManufacturer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedManufacturer(null)}
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
                  <h2 className="text-xl font-bold">Manufacturer Profile</h2>
                  <button
                    onClick={() => setSelectedManufacturer(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-center mb-6">
                  <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-white font-bold text-2xl">
                      {selectedManufacturer.companyName[0]}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{selectedManufacturer.companyName}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    {selectedManufacturer.verified && (
                      <span className="flex items-center gap-1 text-success text-sm font-medium">
                        <Shield className="w-4 h-4" />
                        Verified Manufacturer
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Owner", value: selectedManufacturer.ownerName },
                    { label: "Location", value: selectedManufacturer.location },
                    { label: "Specialization", value: selectedManufacturer.specialization },
                    { label: "Established", value: selectedManufacturer.established },
                    { label: "GST Number", value: selectedManufacturer.gstNumber },
                    { label: "Phone", value: selectedManufacturer.phone },
                    { label: "Email", value: selectedManufacturer.email },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-sm py-2 border-b border-gray-50">
                      <span className="text-text-muted">{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="bg-surface rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-primary">{selectedManufacturer.totalProducts}</p>
                    <p className="text-xs text-text-muted">Products</p>
                  </div>
                  <div className="bg-surface rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-accent flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-warning fill-warning" />
                      {selectedManufacturer.rating}
                    </p>
                    <p className="text-xs text-text-muted">Rating</p>
                  </div>
                  <div className="bg-surface rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-success">
                      {new Date().getFullYear() - selectedManufacturer.established}yr
                    </p>
                    <p className="text-xs text-text-muted">Experience</p>
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
