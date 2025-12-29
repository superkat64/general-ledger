"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import { Decimal } from "@prisma/client/runtime/library";


export async function updateSubcategory(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error('Not authenticated');

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Subcategory id is required");

  const name = formData.get("name")?.toString();
  if (!name) throw new Error("Name is required");

  const monthlyRaw = formData.get("monthly_budget")?.toString();
  const monthly_budget = monthlyRaw ? new Decimal(monthlyRaw) : null;

  // ensure the subcategory exists and belongs to a category owned by this user
  const existing = await prisma.subcategory.findFirst({ where: { id }, include: { category: true } });
  if (!existing) throw new Error("Not found");
  if (existing.category.user_id !== user.id) throw new Error("Not authorized");

  const updated = await prisma.subcategory.update({ where: { id }, data: { name, monthly_budget } });

  revalidatePath(`/categories/${existing.category_id}/subcategories`);
  return updated;
}

export async function deleteSubcategory(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Subcategory id is required");

  const category_id = formData.get("category_id")?.toString();

  const result = await prisma.subcategory.deleteMany({
    where: {
      id,
      category_id: category_id,
      category: { user_id: user.id }
    }
  });

  if (result.count === 0) {
    // Either subcategory doesn't exist, or user doesn't own the category
    return { error: 'Not found or unauthorized' };
  }

  revalidatePath(`/categories/${category_id}/subcategories`);
  return { ok: true };
}