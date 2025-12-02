// app/categories/[id]/edit/page.tsx
import CategoryForm from "@/components/category-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { notFound } from "next/navigation";
import { getCategoryById } from '@/app/categories/actions';


export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id);
  if (!category) notFound();
  return (
    <>
      <Link href="/categories" className="flex flex-row mt-4 ml-4">
        <ChevronLeft />
        Back
      </Link>
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <main className="w-full max-w-md">
          <div>
            <h1 className="text-4xl font-bold text-center mb-8">
              Edit Category: {category.name}
            </h1>
            <CategoryForm category={category} />
          </div>
        </main>
      </div>
    </>
  );
}