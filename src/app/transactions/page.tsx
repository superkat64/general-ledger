// app/transactions/page.tsx

// import TransactionTable from "@/components/transaction-table";

import { columns, Transaction } from '@/components/transactions/columns';
import { DataTable } from '@/components/transactions/data-table';
import Link from "next/link";
import { getTransactions } from "@/app/transactions/actions";

async function getData(): Promise<Transaction[]> {
  return (await getTransactions()).map(t => (
    {
      id: t.id,
      date: t.transaction_date,
      amount: t.amount,
      type: t.transaction_type,
      institution: t.institution?.name,
      category: t.subcategory?.category?.name,
      subcategory: t.subcategory?.name,
      description: t.description
    }
  ));
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