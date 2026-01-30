import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Alert } from 'react-native';
import { authApi } from '../api/authApi'; 

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  loginSuccess: (userData: User) => void;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm loginSuccess để set user trực tiếp (dùng cho ForgotPassword)
  const loginSuccess = (userData: User) => {
    setUser(userData);
  };

  const login = async (email: string, pass: string) => {
    try {
      setIsLoading(true);
      // Gọi API, truyền đúng object payload
      const response: any = await authApi.login({ email, password: pass });
      
      if (response.data && response.data.user) {
        setUser(response.data.user); // ✅ Set đúng User object
        return true;
      }
      return false;
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Đăng nhập thất bại');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      setIsLoading(true);
      // Gọi API, truyền đúng object payload
      const response: any = await authApi.register({ fullName: name, email, password: pass });

      if (response.data && response.data.user) {
        setUser(response.data.user); // ✅ Set đúng User object
        return true;
      }
      return false;
    } catch (error: any) {
      Alert.alert("Lỗi", "Đăng ký thất bại");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => { setUser(null); };

  return (
    <AuthContext.Provider value={{ user, login, loginSuccess, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};