import { History } from "lucide-react";

export default function TransactionsPage() {
  return (
    <div className="max-w-7xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <History className="h-7 w-7 text-yellow-400" />
        Transactions
      </h1>
      <p className="text-gray-400 mb-8">
        View your transaction history across all networks.
      </p>
      <div className="rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl text-center">
        <p className="text-gray-400">Transaction history — coming soon.</p>
      </div>
    </div>
  );
}
