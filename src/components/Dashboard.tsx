
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import AccountCard from "./AccountCard";
import AccountInfoTab from "./AccountInfoTab";
import DepositTab from "./DepositTab";
import WithdrawTab from "./WithdrawTab";
import TransferTab from "./TransferTab";
import EnhancedTransactionHistory from "./EnhancedTransactionHistory";

const Dashboard = () => {
  const { user, logout, deposit, withdraw, transfer } = useAuth();
  const [activeTab, setActiveTab] = useState("info");
  const [actionType, setActionType] = useState<"none" | "deposit" | "withdraw" | "transfer">("none");
  
  if (!user) return null;

  // Generate a demo savings account
  const savingsAccount = {
    id: "savings-" + user.id,
    balance: 5000.50,
    accountNumber: user.id.substring(0, 4) + "4321"
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setActionType("none");
  };

  const handleActionSelect = (action: "deposit" | "withdraw" | "transfer") => {
    setActionType(action);
  };

  const handleCancel = () => {
    setActionType("none");
  };

  const handleDeposit = async (amount: number, description: string) => {
    const success = await deposit(amount);
    if (success) {
      setActionType("none");
    }
    return success;
  };

  const handleWithdraw = async (amount: number) => {
    const success = await withdraw(amount);
    if (success) {
      setActionType("none");
    }
    return success;
  };

  const handleTransfer = async (recipient: string, amount: number) => {
    const success = await transfer(recipient, amount);
    if (success) {
      setActionType("none");
    }
    return success;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">ATM System</h1>
            <p className="text-gray-600">Welcome, {user.fullName}</p>
          </div>
          <Button variant="outline" onClick={logout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar with accounts */}
          <div className="w-full lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">Your Accounts</h2>
            <div>
              <AccountCard 
                type="Checking" 
                balance={user.balance} 
                accountNumber={user.id + "7890"} 
              />
              
              <AccountCard 
                type="Savings" 
                balance={savingsAccount.balance} 
                accountNumber={savingsAccount.accountNumber} 
              />
            </div>
          </div>
          
          {/* Right content area */}
          <div className="w-full lg:w-2/3">
            <Tabs 
              defaultValue="info" 
              value={activeTab} 
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="info">Account Info</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="history">Transaction History</TabsTrigger>
              </TabsList>
              
              <div className="bg-white rounded-md border p-6">
                <TabsContent value="info" className="mt-0">
                  {actionType === "none" && (
                    <AccountInfoTab 
                      accountType="Checking Account"
                      accountNumber="1234567890"
                      balance={user.balance}
                      onWithdraw={() => handleActionSelect("withdraw")}
                      onDeposit={() => handleActionSelect("deposit")}
                      onTransfer={() => handleActionSelect("transfer")}
                    />
                  )}
                  
                  {actionType === "deposit" && (
                    <DepositTab 
                      balance={user.balance}
                      onDeposit={handleDeposit}
                      onCancel={handleCancel}
                    />
                  )}
                  
                  {actionType === "withdraw" && (
                    <WithdrawTab 
                      balance={user.balance}
                      onWithdraw={handleWithdraw}
                      onCancel={handleCancel}
                    />
                  )}
                  
                  {actionType === "transfer" && (
                    <TransferTab 
                      balance={user.balance}
                      accountId={user.id}
                      accountType="Checking"
                      onTransfer={handleTransfer}
                      onCancel={handleCancel}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="actions" className="mt-0">
                  {actionType === "none" && (
                    <div className="flex flex-col gap-6">
                      <button 
                        onClick={() => handleActionSelect("deposit")}
                        className="text-left p-4 border rounded-lg hover:bg-gray-50 flex items-center"
                      >
                        <span className="bg-blue-100 p-2 rounded-full mr-4">
                          <span className="text-2xl">↓</span>
                        </span>
                        <div>
                          <h3 className="font-bold text-lg">Deposit Funds</h3>
                          <p className="text-gray-600">Add money to your account</p>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => handleActionSelect("withdraw")}
                        className="text-left p-4 border rounded-lg hover:bg-gray-50 flex items-center"
                      >
                        <span className="bg-blue-100 p-2 rounded-full mr-4">
                          <span className="text-2xl">↑</span>
                        </span>
                        <div>
                          <h3 className="font-bold text-lg">Withdraw Funds</h3>
                          <p className="text-gray-600">Take money from your account</p>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => handleActionSelect("transfer")}
                        className="text-left p-4 border rounded-lg hover:bg-gray-50 flex items-center"
                      >
                        <span className="bg-blue-100 p-2 rounded-full mr-4">
                          <span className="text-2xl">→</span>
                        </span>
                        <div>
                          <h3 className="font-bold text-lg">Transfer Funds</h3>
                          <p className="text-gray-600">Move money between accounts</p>
                        </div>
                      </button>
                    </div>
                  )}
                  
                  {actionType === "deposit" && (
                    <DepositTab 
                      balance={user.balance}
                      onDeposit={handleDeposit}
                      onCancel={handleCancel}
                    />
                  )}
                  
                  {actionType === "withdraw" && (
                    <WithdrawTab 
                      balance={user.balance}
                      onWithdraw={handleWithdraw}
                      onCancel={handleCancel}
                    />
                  )}
                  
                  {actionType === "transfer" && (
                    <TransferTab 
                      balance={user.balance}
                      accountId={user.id}
                      accountType="Checking"
                      onTransfer={handleTransfer}
                      onCancel={handleCancel}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="history" className="mt-0">
                  <EnhancedTransactionHistory transactions={user.transactions} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
