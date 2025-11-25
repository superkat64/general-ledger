"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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
      <Label htmlFor="date">Date</Label>
      <Input type="date" name="transaction_date" required />
      <Label htmlFor="amount">Amount</Label>
      <Input type="number" name="amount" step="0.01" required />
      <Label htmlFor="transaction_type">Type</Label>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="expense">Expense</SelectItem>
          <SelectItem value="income">Income</SelectItem>
        </SelectContent>
      </Select>
      <Label htmlFor="description">Description (Options)</Label>
      <Input type="text" name="description" />
      <button type="submit" disabled={isPending} className="bg-blue-600 text-white py-2 rounded">
        {isPending ? "Submitting..." : "Add Transaction"}
      </button>
    </form>
  );
}
