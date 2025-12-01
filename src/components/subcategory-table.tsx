//components/subcategory-table.tsx
"use client";

import { useState, useTransition } from "react";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner"
import { Check, Edit, Trash2, X } from "lucide-react";
import { updateSubcategoryName, deleteSubcategory } from "@/app/categories/[id]/subcategories/actions";

type Subcategory = {
  id: string;
  name: string;
  category_id: string
};

interface SubcategoryTableProps {
  subcategories: Subcategory[];
}

export default function SubcategoryTable({ subcategories }: SubcategoryTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isPending, startTransition] = useTransition();

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const confirmEdit = async () => {
    if (!editingId) return;

    const formData = new FormData();
    formData.append('name', editingValue);
    formData.append('id', editingId);
    startTransition(async () => {
      try {
        await updateSubcategoryName(formData);
        cancelEdit();
      } catch (error) {
        console.error('Failed to update subcategory:', error);
      }
    })
  };

  const deleteRow = async (id: string) => {
    if (!confirm("Delete this subcategory?")) return;

    const formData = new FormData();
    formData.append('id', id);
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
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subcategories.map((subcategory) => (
          <TableRow key={subcategory.id}>
            <TableCell>
              {editingId === subcategory.id ? (
                <Input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  autoFocus
                  disabled={isPending}
                />
              ) : (
                subcategory.name
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
                      className={`${buttonClasses} text-gray-600 hover:text-gray-700`}
                      aria-label="Cancel edit"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(subcategory.id, subcategory.name)}
                      className={`${buttonClasses} text-blue-600 hover:text-blue-700`}
                      aria-label="Edit subcategory"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteRow(subcategory.id)}
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