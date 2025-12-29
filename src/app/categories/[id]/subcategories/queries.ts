// app/categories/[id]/subcategories/queries.ts

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export type SubcategoryForDisplay = {
  id: string;
  name: string;
  monthly_budget: string | undefined;
  category_id: string;
};

export async function getSubcategoriesByCategoryId(category_id: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  // verify the category exists and belongs to this user
  const category = await prisma.category.findFirst({ where: { id: category_id, user_id: user.id } });
  if (!category) throw new Error("Not authorized");

  const subcategories = await prisma.subcategory.findMany({ where: { category_id: category_id }, orderBy: { name: "asc" } });
  return subcategories.map(s => ({
    id: s.id,
    name: s.name,
    monthly_budget: s.monthly_budget?.toString(),
    category_id: s.category_id
  }));
}