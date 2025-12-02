// app/categories/actions.tsx
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { stackServerApp } from "@/stack/server";

export async function getCategoriesWithSubcategories() {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  return prisma.category.findMany({
    where: { user_id: user.id },
    orderBy: { name: "asc" },
    include: { subcategory: true },
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

export async function updateCategory(formData: FormData) {
  // Check user authentication
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");
  const user_id = user.id;

  // Check required attributes
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Category id is required");
  const name = formData.get("name")?.toString();
  if (!name) throw new Error("Name is required");

  // Format Category attributes
  const monthlyRaw = formData.get("monthly_budget")?.toString();
  const monthly_budget = monthlyRaw ? new Decimal(monthlyRaw) : null;
  const type = (formData.get("type")?.toString() ?? "expense") as any;
  const color = formData.get("color")?.toString() || null;
  const icon = formData.get("icon")?.toString() || null;
  const subcategoryValues = formData.getAll("subcategory").map((s) => s?.toString().trim()).filter(Boolean);

  // Verify Category exists & belongs to current user
  const existing = await prisma.category.findFirst({ where: { id, user_id } });
  if (!existing) throw new Error("Category not found or not authorized");

  // Build prisma object - this action only supports adding new subcategories to categories.
  const updateData: any = { name, monthly_budget, type, color, icon };
  const newNames = Array.from(new Set(subcategoryValues));
  const ops: any[] = [];
  ops.push(prisma.category.update({ where: { id }, data: updateData }));
  if (newNames.length > 0) {
    ops.push(
      prisma.subcategory.createMany({
        data: newNames.map((name) => ({ category_id: id, name })),
        skipDuplicates: true,
      })
    );
  }

  if (ops.length > 0) {
    await prisma.$transaction(ops);
  }

  revalidatePath("/categories");
}

export async function deleteCategory(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Category id is required");

  const result = await prisma.category.deleteMany({
    where: { id, user_id: user.id },
  });

  if (result.count === 0) {
    return { error: 'Not found or unauthorized' };
  }

  revalidatePath("/categories");
}
