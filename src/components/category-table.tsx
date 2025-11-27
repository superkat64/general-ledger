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

import type { category } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { deleteCategoryAction } from "@/app/categories/actions";
import Link from "next/link";
import { Trash2, Edit } from "lucide-react";

type Sub = { id: string; name: string };
type CategoryWithSubs = category & { subcategory?: Sub[] };

type CategoryTableProps = {
  categories: CategoryWithSubs[];
};

function formatAmount(amount: number | Decimal | string | null | undefined) {
  if (!amount) return "-";
  if (amount && typeof amount === "object" && "toFixed" in amount) {
    try {
      return (amount as Decimal).toFixed(2);
    } catch {
      return String(amount);
    }
  }
  return Number(amount).toFixed(2);
}

export default function CategoryTable({ categories }: CategoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className={cn("text-right")}>Monthly</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Icon</TableHead>
          <TableHead>Subcategories</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.name}</TableCell>
            <TableCell>{c.type}</TableCell>
            <TableCell className={cn("text-right")}>${formatAmount(c.monthly_budget)}</TableCell>
            <TableCell>
              {c.color ? (
                <div className="w-5 h-5 rounded" style={{ backgroundColor: c.color }} />
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>{c.icon ?? "-"}</TableCell>
            <TableCell>
              {c.subcategory && c.subcategory.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {c.subcategory.map((s) => (
                    <span key={s.id} className="text-sm px-2 py-1 bg-gray-100 rounded">
                      {s.name}
                    </span>
                  ))}
                </div>
              ) : (
                "-"
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
                <form action={deleteCategoryAction} method="post">
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    aria-label={`Delete category ${c.name}`}
                    title={`Delete category ${c.name}`}
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
