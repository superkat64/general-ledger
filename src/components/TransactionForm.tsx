"use client";
import { createTransaction } from "@/app/transactions/actions";
import { useTransition } from "react";

export default function TransactionForm() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      createTransaction(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input type="date" name="transaction_date" required />
      <input type="number" name="amount" step="0.01" required />
      <select name="transaction_type" defaultValue="expense" required>
        <option value="">Select category</option>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
      <input type="text" name="description" placeholder="Description (optional)" />
      <button type="submit" disabled={isPending} className="bg-blue-600 text-white py-2 rounded">
        {isPending ? "Submitting..." : "Add Transaction"}
      </button>
    </form>
  );
}
