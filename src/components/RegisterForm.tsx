
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm = ({ onToggleForm }: RegisterFormProps) => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register(username, fullName, pin, confirmPin);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create Your Account</CardTitle>
        <CardDescription className="text-center">
          Enter your details to create an ATM account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              placeholder="Choose a username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="pin" className="text-sm font-medium">
              PIN
            </label>
            <Input
              id="pin"
              type="password"
              placeholder="Choose a 4-digit PIN"
              required
              minLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPin" className="text-sm font-medium">
              Confirm PIN
            </label>
            <Input
              id="confirmPin"
              type="password"
              placeholder="Confirm your PIN"
              required
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              className="w-full"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Create Account
              </span>
            )}
          </Button>
          <p className="text-center mt-2 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onToggleForm}
              className="text-atm-primary hover:underline font-medium"
            >
              Login
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default RegisterForm;
