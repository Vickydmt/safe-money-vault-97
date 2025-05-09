
import { cn } from "@/lib/utils";

interface AccountCardProps {
  type: 'Checking' | 'Savings';
  balance: number;
  accountNumber: string;
}

const AccountCard = ({ type, balance, accountNumber }: AccountCardProps) => {
  const lastFour = accountNumber.substring(accountNumber.length - 4);

  return (
    <div className="bg-blue-600 text-white rounded-lg p-6 mb-4 shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-bold text-xl">{type} Account</h3>
        <span className="bg-blue-700 px-2 py-1 rounded text-xs">BANK</span>
      </div>

      <div className="mb-4">
        <p className="text-sm opacity-80">Current Balance</p>
        <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
      </div>

      <div>
        <p className="text-sm opacity-80">Account Number</p>
        <p className="font-medium">xxxx-xxxx-xxxx-{lastFour}</p>
      </div>
    </div>
  );
};

export default AccountCard;
