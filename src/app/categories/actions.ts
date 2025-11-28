// app/categories/actions.tsx
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { stackServerApp } from "@/stack/server";

export async function createCategory(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");
  const user_id = user.id;

  const name = formData.get("name")?.toString();
  if (!name) throw new Error("Name is required");

  const monthlyRaw = formData.get("monthly_budget")?.toString();
  const monthly_budget = monthlyRaw ? new Decimal(monthlyRaw) : null;

  const type = (formData.get("type")?.toString() ?? "expense") as any;
  const color = formData.get("color")?.toString() || null;
  const icon = formData.get("icon")?.toString() || null;
  const subcategoryValues = formData.getAll("subcategory").map((s) => s?.toString().trim()).filter(Boolean);

  const createData: any = { user_id, name, monthly_budget, type, color, icon };
  if (subcategoryValues.length > 0) {
    createData.subcategory = { create: subcategoryValues.map((s) => ({ name: s })) };
  }

  await prisma.category.create({
    data: createData,
  });

  revalidatePath("/categories");
}

export async function listCategories() {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  return prisma.category.findMany({
    where: { user_id: user.id },
    orderBy: { name: "asc" },
    include: { subcategory: { select: { id: true, name: true } } },
  });
}

export async function getCategoryById(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  return prisma.category.findFirst({
    where: { id, user_id: user.id },
    include: { subcategory: true },
  });
}

export async function updateCategory(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");
  const user_id = user.id;

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Category id is required");

  const name = formData.get("name")?.toString();
  if (!name) throw new Error("Name is required");

  const monthlyRaw = formData.get("monthly_budget")?.toString();
  const monthly_budget = monthlyRaw ? new Decimal(monthlyRaw) : null;

  const type = (formData.get("type")?.toString() ?? "expense") as any;
  const color = formData.get("color")?.toString() || null;
  const icon = formData.get("icon")?.toString() || null;

  const subcategoryValues = formData.getAll("subcategory").map((s) => s?.toString().trim()).filter(Boolean);

  // Ensure the category exists and belongs to the user before using nested writes
  const existing = await prisma.category.findFirst({ where: { id, user_id } });
  if (!existing) throw new Error("Category not found or not authorized");

  const updateData: any = { name, monthly_budget, type, color, icon };
  if (subcategoryValues.length > 0) {
    updateData.subcategory = { create: subcategoryValues.map((s) => ({ name: s })) };
  }

  await prisma.category.update({ where: { id }, data: updateData });

  revalidatePath("/categories");
}

export async function deleteCategory(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");
  const user_id = user.id;

  await prisma.category.deleteMany({ where: { id, user_id } });

  revalidatePath("/categories");
}

// Server action wrapper to be used as a form `action` (accepts FormData)
export async function deleteCategoryAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Category id is required");

  await deleteCategory(id);
}
