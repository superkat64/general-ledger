// components/transactions/columns.tsx

"use client"

import type { transaction_type } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime/library';

import { ColumnDef } from '@tanstack/react-table';
import Link from "next/link";
import { Trash2, Edit } from "lucide-react";

function formatDate(d: Date | string) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toDateString();
}

export type Transaction = {
  id: string
  date: Date
  amount: Decimal
  type: transaction_type
  institution: string | undefined
  category: string | undefined
  subcategory: string | undefined
  description: string | null

}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "transaction_date",
    header: "Date"
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "transaction_type",
    header: "Type"
  },
  {
    accessorKey: "institution",
    header: "Institution"
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "subcategory",
    header: "Subcategory"
  },
  {
    accessorKey: "description",
    header: "Description"
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const t = row.original
      return (
        <div className="flex items-center gap-2">
          <Link
            href={`/transactions/${t.id}/edit`}
            aria-label={`Edit transaction on ${formatDate(t.date)}`}
            title={`Edit transaction on ${formatDate(t.date)}`}
            className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700 p-1 rounded"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            // onClick={() => deleteRow(t.id)}
            aria-label={`Delete transaction`}
            className="inline-flex items-center justify-center text-red-600 hover:text-red-700 p-1 rounded"
          // disabled={isPending}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  },
]
