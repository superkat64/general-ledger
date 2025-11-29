// app/transactions/page.tsx
import TransactionTable from "@/components/transaction-table";
import Link from "next/link";
import { listTransactions } from "@/app/transactions/actions";

export default async function TransactionsPage() {
  const transactions = await listTransactions();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Recent Transactions</h1>
        <Link href="/transactions/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Transaction</Link>
      </div>
      <TransactionTable transactions={transactions} />
    </div>
  );
}