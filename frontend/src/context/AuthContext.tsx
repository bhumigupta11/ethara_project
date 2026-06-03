import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, authEndpoints } from "../services/api";

interface AuthState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    token: null,
    email: null,
    isAuthenticated: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const email = localStorage.getItem("auth_email");
    if (token) {
      setState({ token, email, isAuthenticated: true });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post(authEndpoints.login, { email, password });
    localStorage.setItem("auth_token", response.data.access_token);
    localStorage.setItem("auth_email", email);
    setState({ token: response.data.access_token, email, isAuthenticated: true });
    navigate("/dashboard");
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post(authEndpoints.register, { name, email, password });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_email");
    setState({ token: null, email: null, isAuthenticated: false });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
