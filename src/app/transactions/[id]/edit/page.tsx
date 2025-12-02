// app/transactions/[id]/edit/page.tsx
import TransactionForm from "@/components/transaction-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { notFound } from "next/navigation";
import { getTransactionById } from "@/app/transactions/actions";

export default async function EditTransactionPage({ params }: { params: { id: string } }) {
  const transaction = await getTransactionById(params.id);
  if (!transaction) notFound();
  return (
    <>
      <Link href="/transactions" className="flex flex-row mt-4 ml-4">
        <ChevronLeft />
        Back
      </Link>
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <main className="w-full max-w-md">
          <div>
            <h1 className="text-4xl font-bold text-center mb-8">
              Edit Transaction
            </h1>
            <TransactionForm transaction={transaction} />
          </div>
        </main>
      </div>
    </>
  )
}