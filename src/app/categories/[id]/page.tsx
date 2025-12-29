// app/categories/[id]/page.tsx

import SubcategoryTable from "@/app/categories/[id]/subcategories/components/table";
import { columns } from "@/app/transactions/components/columns";
import { DataTable } from "@/app/transactions/components/data-table";

import { getCategoryWithSubcategoriesAndTransactions } from "@/app/categories/queries";

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategoryWithSubcategoriesAndTransactions(params.id);
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center">
        <h1 className="text-2xl font-bold mb-4">{category?.icon} {category?.name}</h1>
      </div>
      <div className="mb-6 flex">
        <div className="flex">
          <p className="font-xs font-bold mr-2 uppercase text-sm/6">Type:</p>
          <p className="capitalize">{category?.type}</p>
        </div>
        <div className="ml-8 flex">
          <p className="font-xs font-bold mr-2 uppercase text-sm/6">Color:</p>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded mr-2" style={{ backgroundColor: category?.color || 'transparent' }} title={category?.color || ""} />
            <span>{category?.color}</span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
        <SubcategoryTable subcategories={category?.subcategories || []} />
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <DataTable columns={columns} data={category?.transactions || []} />
      </div>
    </div>
  );
}