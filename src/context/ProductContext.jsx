import { createContext, useContext, useState, useEffect } from "react";
import { DEMO_PRODUCTS, DEMO_MANUFACTURERS } from "../utils/demoData";

const ProductContext = createContext(null);

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem("fabricid_products");
    const savedManufacturers = localStorage.getItem("fabricid_manufacturers");

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(DEMO_PRODUCTS);
      localStorage.setItem("fabricid_products", JSON.stringify(DEMO_PRODUCTS));
    }

    if (savedManufacturers) {
      setManufacturers(JSON.parse(savedManufacturers));
    } else {
      setManufacturers(DEMO_MANUFACTURERS);
      localStorage.setItem("fabricid_manufacturers", JSON.stringify(DEMO_MANUFACTURERS));
    }
  }, []);

  function addProduct(product) {
    const updated = [product, ...products];
    setProducts(updated);
    localStorage.setItem("fabricid_products", JSON.stringify(updated));
  }

  function getProductByFabricId(fabricId) {
    return products.find((p) => p.fabricId === fabricId);
  }

  function getProductsByManufacturer(manufacturerId) {
    return products.filter((p) => p.manufacturerId === manufacturerId);
  }

  function getManufacturer(manufacturerId) {
    return manufacturers.find((m) => m.id === manufacturerId);
  }

  function incrementScanCount(fabricId) {
    const updated = products.map((p) =>
      p.fabricId === fabricId ? { ...p, scanCount: (p.scanCount || 0) + 1 } : p
    );
    setProducts(updated);
    localStorage.setItem("fabricid_products", JSON.stringify(updated));
  }

  const value = {
    products,
    manufacturers,
    addProduct,
    getProductByFabricId,
    getProductsByManufacturer,
    getManufacturer,
    incrementScanCount,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}
