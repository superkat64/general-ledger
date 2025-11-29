// app/categories/[id]/edit/page.tsx
import CategoryForm from "@/components/category-form";
import { getCategoryById } from '@/app/categories/actions';

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="w-full max-w-md">
        {category ? (
          <div>
            <h1 className="text-4xl font-bold text-center mb-8">
              Edit Category: {category.name}
            </h1>
            <CategoryForm category={category} />
          </div>
        ) : (
          <div>Category not found</div>
        )}
      </main>
    </div>
  );
}