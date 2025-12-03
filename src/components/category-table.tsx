// components/category-table.tsx
"use client";

import { useTransition } from "react";
import { Table, TableHeader, TableHead, TableBody, TableFooter, TableRow, TableCell } from "@/components/ui/table";
import Link from "next/link";
import { Trash2, Edit } from "lucide-react";

import { deleteCategory } from "@/app/categories/actions";
import { Decimal } from "@prisma/client/runtime/library";
import { cn } from "@/lib/utils";

import type { category } from "@prisma/client";

type Sub = { id: string; name: string };
type CategoryWithSubs = category & { subcategory?: Sub[] };

type CategoryTableProps = {
  categories: CategoryWithSubs[];
};

function formatAmount(amount: number | Decimal | string | null | undefined) {
  if (amount === null || amount === undefined) return "-";
  if (typeof amount === "object" && "toFixed" in amount) {
    try {
      return (amount as Decimal).toFixed(2);
    } catch {
      return String(amount);
    }
  }
  return Number(amount).toFixed(2);
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  const [isPending, startTransition] = useTransition();

  const deleteRow = async (id: string) => {
    if (!confirm("Delete this category?")) return;

    const formData = new FormData();
    formData.append('id', id);
    startTransition(async () => {
      await deleteCategory(formData);
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className='min-w-[150px]'>Monthly Budget</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Icon</TableHead>
          <TableHead>Subcategories</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className={cn("text-center py-6 text-sm text-muted-foreground")}>
              No categories yet
            </TableCell>
          </TableRow>
        )}
        {categories.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.name}</TableCell>
            <TableCell className="capitalize">{c.type}</TableCell>
            <TableCell>{c.monthly_budget ? '$' + formatAmount(c.monthly_budget) : '-'}</TableCell>
            <TableCell>
              {c.color ? (
                <div className="flex flex-row gap-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: c.color }} title={c.color} /> {c.color}
                </div>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>{c.icon ?? "-"}</TableCell>
            <TableCell>
              {c.subcategory && c.subcategory.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {c.subcategory.map((s) => (
                    <span key={s.id} className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      {s.name}
                    </span>
                  ))}
                </div>
              ) : (
                "None"
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Link
                  href={`/categories/${c.id}/edit`}
                  aria-label={`Edit category ${c.name}`}
                  title={`Edit category ${c.name}`}
                  className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700 p-1 rounded"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => deleteRow(c.id)}
                  aria-label={`Delete category ${c.name}`}
                  title={`Delete category ${c.name}`}
                  className="inline-flex items-center justify-center text-red-600 hover:text-red-700 p-1 rounded"
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
