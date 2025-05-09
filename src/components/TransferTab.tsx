
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransferTabProps {
  balance: number;
  accountId: string;
  accountType: string;
  onTransfer: (recipientUsername: string, amount: number) => Promise<boolean>;
  onCancel: () => void;
}

const TransferTab = ({ 
  balance, 
  accountId, 
  accountType, 
  onTransfer, 
  onCancel 
}: TransferTabProps) => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0 || !recipient) return;

    setIsSubmitting(true);
    const success = await onTransfer(recipient, parseFloat(amount));
    setIsSubmitting(false);
    
    if (success) {
      setAmount("");
      setRecipient("");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold flex items-center mb-6">
        <ArrowRight className="mr-2" />
        Transfer Funds
      </h2>

      <div className="mb-6">
        <p className="font-medium mb-2">From Account</p>
        <div className="p-3 border rounded-md bg-gray-50">
          <p className="font-medium">{accountType} Account ({accountId.substring(accountId.length - 4)})</p>
          <p className="text-sm text-gray-600">Available Balance: ${balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="font-medium mb-2">To Account</p>
        <Select onValueChange={setRecipient} value={recipient}>
          <SelectTrigger>
            <SelectValue placeholder="Select destination account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="savings">Savings Account</SelectItem>
            <SelectItem value="external">External Account</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <p className="font-medium mb-2">Transfer Amount</p>
        <div className="flex items-center">
          <span className="text-lg mr-2">$</span>
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            max={balance.toString()}
            className="flex-1"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance || !recipient || isSubmitting}
          onClick={handleSubmit}
        >
          Transfer
        </Button>
      </div>
    </div>
  );
};

export default TransferTab;
