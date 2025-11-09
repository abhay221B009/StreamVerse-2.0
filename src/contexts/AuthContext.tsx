import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("streamVerse-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsInitializing(false);
  }, []);

  const login = async (email: string, password: string) => {
    // This would be an API call in a real application
    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication logic for demo purposes
    if (email && password) {
      const mockUser: User = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        username: email.split("@")[0],
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${
          email.split("@")[0]
        }&background=random`,
      };

      setUser(mockUser);
      localStorage.setItem("streamVerse-user", JSON.stringify(mockUser));
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock signup logic
    if (username && email && password) {
      const mockUser: User = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        username,
        email,
        avatar: `https://ui-avatars.com/api/?name=${username}&background=random`,
      };

      setUser(mockUser);
      localStorage.setItem("streamVerse-user", JSON.stringify(mockUser));
    } else {
      throw new Error("All fields are required");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("streamVerse-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isInitializing,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
