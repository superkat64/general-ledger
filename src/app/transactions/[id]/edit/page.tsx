// app/transactions/[id]/edit/page.tsx
import TransactionForm from "@/components/transaction-form";
import { getTransactionById } from "@/app/transactions/actions";

export default async function EditTransactionPage({ params }: { params: { id: string } }) {
  const transaction = await getTransactionById(params.id);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="w-full max-w-md">
        {transaction ? (
          <div>
            <h1 className="text-4xl font-bold text-center mb-8">
              Edit Transaction
            </h1>
            <TransactionForm transaction={transaction} />
          </div>
        ) : (
          <div>Transaction not found</div>
        )}
      </main>
    </div>
  )
}