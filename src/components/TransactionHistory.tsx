
import { Transaction } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your transaction history will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">No transactions yet.</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDown className="w-5 h-5 text-green-500" />;
      case "withdrawal":
        return <ArrowUp className="w-5 h-5 text-red-500" />;
      case "transfer":
        return <DollarSign className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Your recent account activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden">
          <div className="rounded-md border">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`transaction-item ${transaction.type}`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-full">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.timestamp)}
                    </p>
                  </div>
                </div>
                <div className={`font-bold ${transaction.type === 'deposit' ? 'text-green-600' : transaction.type === 'withdrawal' ? 'text-red-600' : 'text-blue-600'}`}>
                  {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
