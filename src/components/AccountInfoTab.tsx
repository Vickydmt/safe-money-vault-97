
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

interface AccountInfoTabProps {
  accountType: string;
  accountNumber: string;
  balance: number;
  onWithdraw: () => void;
  onDeposit: () => void;
  onTransfer: () => void;
}

const AccountInfoTab = ({ 
  accountType, 
  accountNumber, 
  balance, 
  onWithdraw, 
  onDeposit, 
  onTransfer 
}: AccountInfoTabProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-1">{accountType}</h2>
      <p className="text-gray-600 mb-4">Account #{accountNumber}</p>
      
      <div className="mb-10">
        <p className="text-gray-600">Current Balance</p>
        <p className="text-3xl font-bold text-blue-600">${balance.toFixed(2)}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-6 h-auto" 
          onClick={onWithdraw}
        >
          <ArrowUp className="h-6 w-6 mb-2" />
          <span>Withdraw</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-6 h-auto" 
          onClick={onDeposit}
        >
          <ArrowDown className="h-6 w-6 mb-2" />
          <span>Deposit</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-6 h-auto" 
          onClick={onTransfer}
        >
          <ArrowRight className="h-6 w-6 mb-2" />
          <span>Transfer</span>
        </Button>
      </div>
    </div>
  );
};

export default AccountInfoTab;
