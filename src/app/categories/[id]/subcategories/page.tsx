import SubcategoryTable from '@/components/subcategory-table';
import { listCategoryScopedSubcategories } from '@/app/categories/[id]/subcategories/actions';

export default async function SubcategoriesPage({ params }: { params: { id: string } }) {
  const subcats = await listCategoryScopedSubcategories(params.id);
  const cat = subcats[0].category;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{cat?.icon} {cat.name} - Subcategories</h1>
      <SubcategoryTable subcategories={subcats} categoryId={params.id} />
    </div>
  );
}