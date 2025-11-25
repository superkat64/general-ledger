import TransactionTable from "@/components/TransactionTable";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TransactionsPage() {
  const tx = await prisma.transaction.findMany({
    orderBy: { transaction_date: "desc" },
    take: 10,
  });

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Recent Transactions</h1>
        <Link href="/transactions/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Transaction</Link>
      </div>
      <TransactionTable transactions={tx} />
    </div>
  );
}
