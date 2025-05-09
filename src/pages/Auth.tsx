
import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-atm-background">
      <div className="w-full max-w-md mb-10 text-center">
        <h1 className="text-4xl font-bold text-atm-primary mb-2">Safe Money Vault</h1>
        <p className="text-gray-600">Your Secure Digital Banking Solution</p>
      </div>
      
      {showLogin ? (
        <LoginForm onToggleForm={() => setShowLogin(false)} />
      ) : (
        <RegisterForm onToggleForm={() => setShowLogin(true)} />
      )}
    </div>
  );
};

export default Auth;
