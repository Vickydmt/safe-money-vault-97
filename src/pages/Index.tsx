
import { useAuth } from "@/contexts/AuthContext";
import Auth from "./Auth";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-atm-background">
      {isAuthenticated ? <Dashboard /> : <Auth />}
    </div>
  );
};

export default Index;
