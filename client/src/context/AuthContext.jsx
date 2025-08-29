import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthController } from "../controllers/authController";
import { setAccessToken } from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("auth_user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));
    else localStorage.removeItem("auth_user");
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      async login(email, password) {
        const u = await AuthController.login(email, password);
        setUser(u);
        return u;
      },
      async register(payload) {
        const u = await AuthController.register(payload);
        setUser(u);
        return u;
      },
      async logout() {
        await AuthController.logout();
        setAccessToken(null);
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
