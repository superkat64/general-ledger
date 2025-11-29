"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export async function listCategoryScopedSubcategories(categoryId: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  return prisma.subcategory.findMany({
    where: { category_id: categoryId }, include: { category: true },
    orderBy: { name: "asc" }
  });
}

export async function updateSubcategoryName(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Not authenticated');
  const user_id = user.id;

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Subcategory id is required");

  const name = formData.get("name")?.toString();
  if (!name) throw new Error("Name is required");

  await prisma.subcategory.update({ where: { id }, data: { name: name } });

  revalidatePath("/subcategories");
}

export async function deleteSubcategory(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Subcategory id is required");

  await prisma.subcategory.deleteMany({ where: { id } });

  revalidatePath("/subcategories");
}