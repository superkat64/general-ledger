// components/transaction-table.tsx
"use client";

import { useTransition } from "react";
import { Table, TableHeader, TableHead, TableBody, TableFooter, TableRow, TableCell } from "@/components/ui/table";
import Link from "next/link";
import { Trash2, Edit } from "lucide-react";

import { deleteTransaction } from "@/app/transactions/actions";

import type { Decimal } from "@prisma/client/runtime/library";
import type { TransactionWithRels } from "@/lib/types";

type TransactionTableProps = {
  transactions: TransactionWithRels[];
};

function formatDate(d: Date | string) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toDateString();
}

function formatAmount(amount: number | Decimal | string) {
  if (amount && typeof amount === "object" && "toFixed" in amount) {
    try {
      return (amount as Decimal).toFixed(2);
    } catch {
      return String(amount);
    }
  }
  return Number(amount || 0).toFixed(2);
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const [isPending, startTransition] = useTransition();

  const deleteRow = async (id: string) => {
    if (!confirm("Delete this Transaction?")) return;

    const formData = new FormData();
    formData.append('id', id);
    startTransition(async () => {
      await deleteTransaction(formData);
    });
  };
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Institution</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Subcategory</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t) => (
          <TableRow key={t.id}>
            <TableCell>{formatDate(t.transaction_date)}</TableCell>
            <TableCell>${formatAmount(t.amount)}</TableCell>
            <TableCell className="capitalize">{t.transaction_type}</TableCell>
            <TableCell>{t.institution?.name ?? '-'}</TableCell>
            <TableCell>{t.subcategory?.category?.name ?? "-"}</TableCell>
            <TableCell>{t.subcategory?.name ?? "-"}</TableCell>
            <TableCell>{t.description ?? "-"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Link
                  href={`/transactions/${t.id}/edit`}
                  aria-label={`Edit transaction on ${formatDate(t.transaction_date)}`}
                  title={`Edit transaction on ${formatDate(t.transaction_date)}`}
                  className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700 p-1 rounded"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => deleteRow(t.id)}
                  aria-label={`Delete transaction`}
                  className="inline-flex items-center justify-center text-red-600 hover:text-red-700 p-1 rounded"
                  disabled={isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter />
    </Table>
  );
}