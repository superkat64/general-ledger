//app/categories/[id]/subcategories/components/table.tsx
"use client";

import { useState, useTransition } from "react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner"
import { Check, Edit, Trash2, X } from "lucide-react";
import { updateSubcategory, deleteSubcategory } from "@/app/categories/[id]/subcategories/actions";

type Subcategory = {
  id: string;
  name: string;
  monthly_budget: string | undefined;
  category_id: string
};

interface SubcategoryTableProps {
  subcategories: Subcategory[];
}

export default function SubcategoryTable({ subcategories }: SubcategoryTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingBudget, setEditingBudget] = useState("");
  const [isPending, startTransition] = useTransition();

  const startEdit = (subcategory: Subcategory) => {
    setEditingId(subcategory.id);
    setEditingName(subcategory.name);
    setEditingBudget(subcategory.monthly_budget || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingBudget("");
  };

  const confirmEdit = async () => {
    if (!editingId) return;

    const formData = new FormData();
    formData.append('name', editingName);
    formData.append('monthly_budget', editingBudget);
    formData.append('id', editingId);
    startTransition(async () => {
      try {
        await updateSubcategory(formData);
        cancelEdit();
      } catch (error) {
        console.error('Failed to update subcategory:', error);
      }
    })
  };

  const deleteRow = async (id: string, category_id: string) => {
    if (!confirm("Delete this subcategory?")) return;

    const formData = new FormData();
    formData.append('id', id);
    formData.append('category_id', category_id);
    startTransition(async () => {
      try {
        await deleteSubcategory(formData);
      } catch (error) {
        console.error('Failed to delete subcategory:', error);
      }
    });
  };

  const buttonClasses = "inline-flex items-center justify-center p-1 rounded";

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className='min-w-[150px]'>Monthly Budget</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subcategories.map((subcategory) => (
          <TableRow key={subcategory.id}>
            <TableCell>
              {editingId === subcategory.id ? (
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  autoFocus
                  disabled={isPending}
                />
              ) : (
                subcategory.name
              )}
            </TableCell>
            <TableCell>
              {editingId === subcategory.id ? (
                <Input value={editingBudget} onChange={(e) => setEditingBudget(e.target.value)} disabled={isPending} />
              ) : (
                subcategory.monthly_budget ? '$' + subcategory.monthly_budget : '$0.00'
              )}
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-2">
                {editingId === subcategory.id ? (
                  <>
                    <button
                      onClick={confirmEdit}
                      className={`${buttonClasses} text-green-600 hover:text-green-700`}
                      aria-label="Confirm edit"
                    >
                      {isPending ? <Spinner className="text-gray-600 hover:text-gray-700" /> : <Check className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className={`${buttonClasses} text-red-600 hover:text-red-700`}
                      aria-label="Cancel edit"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(subcategory)}
                      className={`${buttonClasses} text-blue-600 hover:text-blue-700`}
                      aria-label="Edit subcategory"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteRow(subcategory.id, subcategory.category_id)}
                      className={`${buttonClasses} text-red-600 hover:text-red-700`}
                      aria-label="Delete subcategory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}