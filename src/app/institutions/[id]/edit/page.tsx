// app/institutions/[id]/edit/page.tsx
import InstitutionForm from "@/components/institution-form";
import { getInstitutionById } from "@/app/institutions/actions";
import { notFound } from "next/navigation";

export default async function EditInstitutionPage({ params }: { params: { id: string } }) {
  const institution = await getInstitutionById(params.id);
  if (!institution) notFound();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div>
          <h1 className="text-4xl font-bold text-center mb-8">Edit Institution: {institution.name}</h1>
          <InstitutionForm institution={institution} />
        </div>
      </div>
    </div>
  )
}