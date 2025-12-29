import SubcategoryTable from '@/app/categories/[id]/subcategories/components/table';
import { getSubcategoriesByCategoryId } from '@/app/categories/[id]/subcategories/queries';
import { getCategoryById } from '@/app/categories/actions';

export default async function SubcategoriesPage({ params }: { params: { id: string } }) {
  const subcats = await getSubcategoriesByCategoryId(params.id);
  const cat = await getCategoryById(params.id);

  if (!cat) {
    return <div className="p-8">Category not found</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{cat?.icon} {cat.name} - Subcategories</h1>
      <SubcategoryTable subcategories={subcats} />
    </div>
  );
}