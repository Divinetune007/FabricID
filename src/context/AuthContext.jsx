import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("fabricid_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  function login(email, password, role) {
    const userData = {
      id: `user-${Date.now()}`,
      email,
      role,
      displayName: email.split("@")[0],
      createdAt: new Date().toISOString(),
    };

    if (role === "manufacturer") {
      userData.companyName = "";
      userData.location = "";
      userData.phone = "";
      userData.gstNumber = "";
      userData.specialization = "";
      userData.established = new Date().getFullYear();
      userData.verified = false;
      userData.rating = 0;
      userData.totalProducts = 0;
    }

    setUser(userData);
    localStorage.setItem("fabricid_user", JSON.stringify(userData));
    return userData;
  }

  function signup(formData) {
    const userData = {
      id: `user-${Date.now()}`,
      email: formData.email,
      role: formData.role,
      displayName: formData.name,
      createdAt: new Date().toISOString(),
    };

    if (formData.role === "manufacturer") {
      userData.companyName = formData.companyName || "";
      userData.location = formData.location || "";
      userData.phone = formData.phone || "";
      userData.gstNumber = formData.gstNumber || "";
      userData.specialization = formData.specialization || "";
      userData.established = formData.established || new Date().getFullYear();
      userData.verified = true;
      userData.rating = 4.5;
      userData.totalProducts = 0;
    }

    setUser(userData);
    localStorage.setItem("fabricid_user", JSON.stringify(userData));
    return userData;
  }

  function updateProfile(updates) {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("fabricid_user", JSON.stringify(updated));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("fabricid_user");
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isManufacturer: user?.role === "manufacturer",
    isBuyer: user?.role === "buyer",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
