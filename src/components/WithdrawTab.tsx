
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp } from "lucide-react";

interface WithdrawTabProps {
  balance: number;
  onWithdraw: (amount: number) => Promise<boolean>;
  onCancel: () => void;
}

const WithdrawTab = ({ balance, onWithdraw, onCancel }: WithdrawTabProps) => {
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickSelect = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    const success = await onWithdraw(parseFloat(amount));
    setIsSubmitting(false);
    
    if (success) {
      setAmount("");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold flex items-center mb-6">
        <ArrowUp className="mr-2" />
        Withdraw Funds
      </h2>

      <div className="mb-6">
        <p className="text-gray-600">Current Balance</p>
        <p className="text-2xl font-bold text-blue-600">${balance.toFixed(2)}</p>
      </div>

      <div className="mb-6">
        <p className="font-medium mb-2">Withdrawal Amount</p>
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

      <div className="mb-6">
        <p className="font-medium mb-2">Quick Select</p>
        <div className="grid grid-cols-4 gap-2">
          {[20, 50, 100, 200].map((value) => (
            <Button
              key={value}
              type="button"
              variant="outline"
              onClick={() => handleQuickSelect(value)}
              disabled={value > balance}
            >
              ${value}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance || isSubmitting}
          onClick={handleSubmit}
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
};

export default WithdrawTab;
