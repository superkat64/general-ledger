// components/institution-table.tsx
"use client";

import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { deleteInstitution } from "@/app/institutions/actions";

import type { institution } from "@prisma/client";
interface InstitutionTableProps {
  institutions: institution[];
}

export default function InstitutionTable({ institutions }: InstitutionTableProps) {
  const deleteRow = async (id: string) => {
    if (!confirm("Delete this Institution?")) return;

    const formData = new FormData();
    formData.append('id', id);
    try {
      await deleteInstitution(formData);
    } catch (error) {
      alert("Failed to delete institution. Please try again.");
      console.error(error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Name</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Last Four Digits</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {institutions.map((institution) => (
          <TableRow key={institution.id}>
            <TableCell>{institution.name}</TableCell>
            <TableCell>
              {institution.color ? (
                <div className="flex flex-row gap-2">
                  <div className="w-5 h-5 rounded" style={{ backgroundColor: institution.color }} title={institution.color} />
                  {institution.color}
                </div>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>{institution.last_four_digits ?? "-"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Link
                  href={`/institutions/${institution.id}/edit`}
                  aria-label={`Edit institution ${institution.name}`}
                  title={`Edit institution ${institution.name}`}
                  className="inline-flex items-center justify-center text-blue-600 hover:text-blue-700 p-1 rounded"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => deleteRow(institution.id)}
                  aria-label={`Delete institution ${institution.name}`}
                  title={`Delete institution ${institution.name}`}
                  className="inline-flex items-center justify-center text-red-600 hover:text-red-700 p-1 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}