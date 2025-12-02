// app/institutions/new/page.tsx
import InstitutionForm from "@/components/institution-form";

/**
 * Renders the page for creating a new institution.
 *
 * @returns The JSX element containing a centered "New Institution" header and the InstitutionForm within a responsive container.
 */
export default function NewInstitutionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">New Institution</h1>
        <InstitutionForm />
      </div>
    </div>
  )
}