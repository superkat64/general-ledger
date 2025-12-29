// app/transactions/components/columns.tsx

"use client"
import type { TransactionForDisplay } from '../queries';

import { ColumnDef } from '@tanstack/react-table';
import Link from "next/link";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { Button } from '@/components/ui/button';

function formatDate(d: Date | string) {
  const date = d instanceof Date ? d : new Date(d);
  const userLocaleDate = new Intl.DateTimeFormat('en-US').format(date)
  return userLocaleDate;
}

export const columns: ColumnDef<TransactionForDisplay>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => formatDate(row.original.date)
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="float-right w-fill"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.original.amount}</div>
    }
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return <div className="capitalize">{row.original.type}</div>

    }
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
    header: "Actions",
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
