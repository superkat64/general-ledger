// app/institutions/[id]/edit/page.tsx
import InstitutionForm from "@/components/institution-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getInstitutionById } from "@/app/institutions/actions";
import { notFound } from "next/navigation";

export default async function EditInstitutionPage({ params }: { params: { id: string } }) {
  const institution = await getInstitutionById(params.id);
  if (!institution) notFound();
  return (
    <>
      <Link href="/institutions" className="flex flex-row mt-4 ml-4">
        <ChevronLeft />
        Back
      </Link>
      <div className="flex flex-col items-center justify-center sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="w-full max-w-md">
          <div>
            <h1 className="text-4xl font-bold text-center mb-8">Edit Institution: {institution.name}</h1>
            <InstitutionForm institution={institution} />
          </div>
        </div>
      </div>
    </>
  )
}