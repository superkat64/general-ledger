// app/transactions/new/page.tsx
import TransactionForm from "@/app/transactions/components/form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewTransactionPage() {
  return (
    <>
      <Link href="/transactions" className="flex flex-row mt-4 ml-4">
        <ChevronLeft />
        Back
      </Link>
      <div className="flex flex-col items-center justify-center sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8">New Transaction</h1>
          <TransactionForm />
        </div>
      </div>
    </>
  );
}
