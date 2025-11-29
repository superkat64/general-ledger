"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export async function listCategoryScopedSubcategories(categoryId: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  // verify the category exists and belongs to this user
  const category = await prisma.category.findFirst({ where: { id: categoryId, user_id: user.id } });
  if (!category) throw new Error("Not authorized");

  return prisma.subcategory.findMany({ where: { category_id: categoryId }, orderBy: { name: "asc" } });
}

export async function updateSubcategoryName(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Not authenticated');

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Subcategory id is required");

  const name = formData.get("name")?.toString();
  if (!name) throw new Error("Name is required");

  // ensure the subcategory exists and belongs to a category owned by this user
  const existing = await prisma.subcategory.findFirst({ where: { id }, include: { category: true } });
  if (!existing) throw new Error("Not found");
  if (existing.category.user_id !== user.id) throw new Error("Not authorized");

  const updated = await prisma.subcategory.update({ where: { id }, data: { name } });

  revalidatePath(`/categories/${existing.category_id}/subcategories`);
  return updated;
}

export async function deleteSubcategory(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Subcategory id is required");

  const existing = await prisma.subcategory.findFirst({ where: { id }, include: { category: true } });
  if (!existing) throw new Error("Not found");
  if (existing.category.user_id !== user.id) throw new Error("Not authorized");

  await prisma.subcategory.delete({ where: { id } });

  revalidatePath(`/categories/${existing.category_id}/subcategories`);
  return { ok: true };
}