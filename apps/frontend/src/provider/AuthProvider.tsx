import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { api } from "../helpers/api";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken_] = useState<string | null>(localStorage.getItem("token"));

  const setToken = (newToken: string | null) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.defaults.headers.common["Content-Type"] = "application/json";
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const intervalId = setInterval(async () => {
      try {
        const {data} = await api.get('/api/auth/me');
        localStorage.set('email', data.user?.email);
        
      } catch (error: any) {
        if (error.response?.status === 401) {
          setToken(null);
          localStorage.removeItem('token');
        }
      }
    }, 10000); // 5 min

    return () => clearInterval(intervalId);
  }, [token]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


export default AuthProvider;
