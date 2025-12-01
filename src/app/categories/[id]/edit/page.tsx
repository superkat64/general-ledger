// app/categories/[id]/edit/page.tsx
import CategoryForm from "@/components/category-form";
import { getCategoryById } from '@/app/categories/actions';
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id);

  if (!category) {
    notFound();
  }

  return (
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
  );
}