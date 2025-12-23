// app/transactions/page.tsx

// import TransactionTable from "@/components/transaction-table";

import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import Link from "next/link";
import { getTransactionsForDisplay } from "./queries";
import type { TransactionForDisplay } from "./queries";

async function getData(): Promise<TransactionForDisplay[]> {
  return await getTransactionsForDisplay();
}

export default async function TransactionsPage() {
  const data = await getData();
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Recent Transactions</h1>
        <Link href="/transactions/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Transaction</Link>
      </div>
      <DataTable columns={columns} data={data} />
      {/* <TransactionTable transactions={transactions} /> */}
    </div>
  );
}