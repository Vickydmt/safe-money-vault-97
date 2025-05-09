
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { LogOut, ArrowDown, ArrowUp, CreditCard, DollarSign, Wallet } from "lucide-react";
import TransactionHistory from "./TransactionHistory";

const Dashboard = () => {
  const { user, logout, deposit, withdraw, transfer } = useAuth();
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  
  if (!user) return null;

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount) return;
    
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    const success = await deposit(amount);
    if (success) {
      setDepositAmount("");
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount) return;
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    const success = await withdraw(amount);
    if (success) {
      setWithdrawAmount("");
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferAmount || !transferRecipient) return;
    
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    const success = await transfer(transferRecipient, amount);
    if (success) {
      setTransferAmount("");
      setTransferRecipient("");
    }
  };

  return (
    <div className="container py-8 mx-auto max-w-4xl animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.fullName}</h1>
          <p className="text-gray-600">Manage your account and transactions</p>
        </div>
        <Button variant="outline" onClick={logout} className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="atm-card">
          <CardHeader className="bg-gradient-to-r from-atm-primary to-atm-secondary text-white">
            <CardTitle className="text-xl flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Account Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-4xl font-bold">${user.balance.toFixed(2)}</p>
            <p className="text-gray-500 text-sm mt-2">Available Balance</p>
          </CardContent>
        </Card>

        <Card className="atm-card">
          <CardHeader className="bg-gradient-to-r from-atm-primary to-atm-secondary text-white">
            <CardTitle className="text-xl flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Account Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div>
                <p className="text-gray-500 text-sm">Account Holder</p>
                <p className="font-medium">{user.fullName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Username</p>
                <p className="font-medium">{user.username}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Account ID</p>
                <p className="font-medium">{user.id.substring(0, 8)}...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="deposit" className="mt-8">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="deposit" className="flex items-center gap-2">
            <ArrowDown className="w-4 h-4" />
            Deposit
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex items-center gap-2">
            <ArrowUp className="w-4 h-4" />
            Withdraw
          </TabsTrigger>
          <TabsTrigger value="transfer" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Transfer
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Money</CardTitle>
              <CardDescription>Add money to your account balance.</CardDescription>
            </CardHeader>
            <form onSubmit={handleDeposit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="deposit-amount" className="text-sm font-medium">
                    Amount ($)
                  </label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="Enter amount to deposit"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Make Deposit
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Money</CardTitle>
              <CardDescription>Withdraw money from your account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleWithdraw}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="withdraw-amount" className="text-sm font-medium">
                    Amount ($)
                  </label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="Enter amount to withdraw"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    max={user.balance.toString()}
                    required
                    className="w-full"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Make Withdrawal
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="transfer">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Money</CardTitle>
              <CardDescription>Send money to another account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleTransfer}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="recipient-username" className="text-sm font-medium">
                    Recipient Username
                  </label>
                  <Input
                    id="recipient-username"
                    placeholder="Enter recipient's username"
                    value={transferRecipient}
                    onChange={(e) => setTransferRecipient(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="transfer-amount" className="text-sm font-medium">
                    Amount ($)
                  </label>
                  <Input
                    id="transfer-amount"
                    type="number"
                    placeholder="Enter amount to transfer"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    max={user.balance.toString()}
                    required
                    className="w-full"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Send Transfer
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      <TransactionHistory transactions={user.transactions} />
    </div>
  );
};

export default Dashboard;
