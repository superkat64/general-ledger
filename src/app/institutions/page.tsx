// app/institutions/page.tsx
import InstitutionTable from "@/components/institution-table";
import Link from "next/link";
import { getInstitutions } from "@/app/institutions/actions";

export default async function InstitutionsPage() {
  const institutions = await getInstitutions();
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Institutions</h1>
        <Link href="/institutions/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Institution</Link>
      </div>
      <InstitutionTable institutions={institutions} />
    </div>
  )
}