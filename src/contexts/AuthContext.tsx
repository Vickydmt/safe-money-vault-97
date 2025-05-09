
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

type User = {
  id: string;
  username: string;
  fullName: string;
  pin: string;
  balance: number;
  transactions: Transaction[];
};

export type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  recipientId?: string;
  senderId?: string;
  timestamp: number;
};

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (username: string, pin: string) => Promise<boolean>;
  register: (username: string, fullName: string, pin: string, confirmPin: string) => Promise<boolean>;
  logout: () => void;
  deposit: (amount: number) => Promise<boolean>;
  withdraw: (amount: number) => Promise<boolean>;
  transfer: (recipientUsername: string, amount: number) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  // Load users from localStorage on initial render
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Initialize with a demo account if no users exist
      const demoUser = {
        id: "demo1",
        username: "demo",
        fullName: "Demo User",
        pin: "1234",
        balance: 1000,
        transactions: [
          {
            id: "init1",
            type: "deposit",
            amount: 1000,
            description: "Initial deposit",
            timestamp: Date.now(),
          },
        ],
      };
      setUsers([demoUser]);
      localStorage.setItem("users", JSON.stringify([demoUser]));
    }

    // Check for logged in user
    const loggedInUser = localStorage.getItem("currentUser");
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  // Save users to localStorage whenever users state changes
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);

  // Update current user in localStorage and state when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      // Also update the user in the users array
      setUsers((prevUsers) => 
        prevUsers.map((u) => (u.id === user.id ? user : u))
      );
    }
  }, [user]);

  const login = async (username: string, pin: string): Promise<boolean> => {
    const foundUser = users.find(
      (u) => u.username === username && u.pin === pin
    );

    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.fullName}!`,
      });
      return true;
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or PIN",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (
    username: string,
    fullName: string,
    pin: string,
    confirmPin: string
  ): Promise<boolean> => {
    // Validate inputs
    if (!username || !fullName || !pin) {
      toast({
        title: "Registration Failed",
        description: "All fields are required",
        variant: "destructive",
      });
      return false;
    }

    if (pin !== confirmPin) {
      toast({
        title: "Registration Failed",
        description: "PINs do not match",
        variant: "destructive",
      });
      return false;
    }

    if (pin.length < 4) {
      toast({
        title: "Registration Failed",
        description: "PIN must be at least 4 digits",
        variant: "destructive",
      });
      return false;
    }

    // Check if username already exists
    if (users.some((u) => u.username === username)) {
      toast({
        title: "Registration Failed",
        description: "Username already exists",
        variant: "destructive",
      });
      return false;
    }

    // Create new user
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      fullName,
      pin,
      balance: 100, // Start with $100
      transactions: [
        {
          id: crypto.randomUUID(),
          type: "deposit",
          amount: 100,
          description: "Welcome bonus",
          timestamp: Date.now(),
        },
      ],
    };

    // Add user to users array
    setUsers((prevUsers) => [...prevUsers, newUser]);
    
    // Log in new user
    setUser(newUser);
    setIsAuthenticated(true);
    
    toast({
      title: "Registration Successful",
      description: "Your account has been created",
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const deposit = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    if (amount <= 0) {
      toast({
        title: "Deposit Failed",
        description: "Amount must be greater than zero",
        variant: "destructive",
      });
      return false;
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: "deposit",
      amount,
      description: "Deposit",
      timestamp: Date.now(),
    };

    const updatedUser = {
      ...user,
      balance: user.balance + amount,
      transactions: [transaction, ...user.transactions],
    };

    setUser(updatedUser);
    
    toast({
      title: "Deposit Successful",
      description: `$${amount.toFixed(2)} has been added to your account`,
    });
    return true;
  };

  const withdraw = async (amount: number): Promise<boolean> => {
    if (!user) return false;
    if (amount <= 0) {
      toast({
        title: "Withdrawal Failed",
        description: "Amount must be greater than zero",
        variant: "destructive",
      });
      return false;
    }

    if (amount > user.balance) {
      toast({
        title: "Withdrawal Failed",
        description: "Insufficient funds",
        variant: "destructive",
      });
      return false;
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: "withdrawal",
      amount,
      description: "Withdrawal",
      timestamp: Date.now(),
    };

    const updatedUser = {
      ...user,
      balance: user.balance - amount,
      transactions: [transaction, ...user.transactions],
    };

    setUser(updatedUser);
    
    toast({
      title: "Withdrawal Successful",
      description: `$${amount.toFixed(2)} has been withdrawn from your account`,
    });
    return true;
  };

  const transfer = async (recipientUsername: string, amount: number): Promise<boolean> => {
    if (!user) return false;
    if (amount <= 0) {
      toast({
        title: "Transfer Failed",
        description: "Amount must be greater than zero",
        variant: "destructive",
      });
      return false;
    }

    if (amount > user.balance) {
      toast({
        title: "Transfer Failed",
        description: "Insufficient funds",
        variant: "destructive",
      });
      return false;
    }

    if (recipientUsername === user.username) {
      toast({
        title: "Transfer Failed",
        description: "You cannot transfer money to yourself",
        variant: "destructive",
      });
      return false;
    }

    // Find recipient user
    const recipientUser = users.find(u => u.username === recipientUsername);
    if (!recipientUser) {
      toast({
        title: "Transfer Failed",
        description: "Recipient not found",
        variant: "destructive",
      });
      return false;
    }

    // Create transactions for both users
    const senderTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: "transfer",
      amount,
      description: `Transfer to ${recipientUser.username}`,
      recipientId: recipientUser.id,
      timestamp: Date.now(),
    };

    const recipientTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: "deposit",
      amount,
      description: `Transfer from ${user.username}`,
      senderId: user.id,
      timestamp: Date.now(),
    };

    // Update sender (current user)
    const updatedUser = {
      ...user,
      balance: user.balance - amount,
      transactions: [senderTransaction, ...user.transactions],
    };

    // Update recipient
    const updatedRecipient = {
      ...recipientUser,
      balance: recipientUser.balance + amount,
      transactions: [recipientTransaction, ...recipientUser.transactions],
    };

    // Update users array with recipient update
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === recipientUser.id ? updatedRecipient : u))
    );

    // Update current user
    setUser(updatedUser);
    
    toast({
      title: "Transfer Successful",
      description: `$${amount.toFixed(2)} has been transferred to ${recipientUser.username}`,
    });
    return true;
  };

  const value = {
    user,
    users,
    isAuthenticated,
    login,
    register,
    logout,
    deposit,
    withdraw,
    transfer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
