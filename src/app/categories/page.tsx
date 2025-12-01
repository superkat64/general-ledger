// app/categories/page.tsx
import CategoryTable from "@/components/category-table";
import Link from "next/link";
import { listCategories } from "@/app/categories/actions";

export default async function CategoriesPage() {
  const cats = await listCategories();

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Categories</h1>
        <Link href="/categories/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Category</Link>
      </div>
      <CategoryTable categories={cats} />
    </div>
  );
}
