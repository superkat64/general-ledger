import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import Link from "next/link";

import type { transaction } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { deleteTransactionAction } from "@/app/transactions/actions";
import { Trash2, Edit } from "lucide-react";

type TransactionWithRels = transaction & {
  subcategory?: { id: string; name: string; category?: { id: string; name: string } } | null;
  institution?: { id: string; name?: string; last_four_digits?: string | null } | null;
};

type TransactionTableProps = {
  transactions: TransactionWithRels[];
};

function formatDate(d: Date | string) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toISOString().split("T")[0];
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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead className={cn("text-right")}>Amount</TableHead>
          <TableHead>Type</TableHead>
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
            <TableCell className={cn("text-right")}>${formatAmount(t.amount)}</TableCell>
            <TableCell>{t.transaction_type}</TableCell>
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
                <form action={deleteTransactionAction} method="post">
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    aria-label={`Delete transaction on ${formatDate(t.transaction_date)}`}
                    title={`Delete transaction on ${formatDate(t.transaction_date)}`}
                    className="inline-flex items-center justify-center text-red-600 hover:text-red-700 p-1 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter />
    </Table>
  );
}