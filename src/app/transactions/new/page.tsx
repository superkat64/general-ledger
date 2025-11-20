import TransactionForm from "@/components/TransactionForm";

export default function NewTransactionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">New Transaction</h1>
        <TransactionForm />
      </main>
    </div>
  );
}
