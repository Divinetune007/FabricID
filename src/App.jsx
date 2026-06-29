import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Verify from "./pages/Verify";
import Marketplace from "./pages/Marketplace";

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/marketplace" element={<Marketplace />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "12px",
                background: "#0f172a",
                color: "#fff",
                fontSize: "14px",
                padding: "12px 16px",
              },
            }}
          />
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}
