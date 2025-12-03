// app/categories/new/page.tsx
import CategoryForm from "@/components/category-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewCategoryPage() {
  return (
    <>
      <Link href="/categories" className="flex flex-row mt-4 ml-4">
        <ChevronLeft />
        Back
      </Link>
      <div className="flex flex-col items-center justify-center sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8">New Category</h1>
          <CategoryForm />
        </div>
      </div>
    </>
  );
}
