
import { Transaction } from "@/contexts/AuthContext";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

interface EnhancedTransactionHistoryProps {
  transactions: Transaction[];
}

const EnhancedTransactionHistory = ({ transactions }: EnhancedTransactionHistoryProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No transactions yet.</p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDown className="w-5 h-5 text-green-500" />;
      case "withdrawal":
        return <ArrowUp className="w-5 h-5 text-red-500" />;
      case "transfer":
        return <ArrowRight className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Transaction History</h2>
      <div className="space-y-4">
        {transactions.slice(0, 10).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border-b"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-2 rounded-full">
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-gray-500 text-sm">
                  {formatDate(transaction.timestamp)}
                </p>
              </div>
            </div>
            <div 
              className={`font-bold ${
                transaction.type === 'deposit' 
                  ? 'text-green-600' 
                  : transaction.type === 'withdrawal' 
                    ? 'text-red-600' 
                    : 'text-blue-600'
              }`}
            >
              {transaction.type === 'withdrawal' || transaction.type === 'transfer' ? '-' : ''}
              ${transaction.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedTransactionHistory;
