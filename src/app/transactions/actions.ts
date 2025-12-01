// app/transactions/actions.tsx
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { stackServerApp } from "@/stack/server";

const transactionWithRelations = {
  subcategory: {
    select: {
      id: true,
      name: true,
      category_id: true,
      category: { select: { id: true, name: true } },
    },
  },
  institution: { select: { id: true, name: true, last_four_digits: true } },
};

export async function listTransactions() {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  return prisma.transaction.findMany({
    where: { user_id: user.id },
    orderBy: { transaction_date: "desc" },
    include: transactionWithRelations
  });
}

export async function getTransactionById(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  return prisma.transaction.findFirst({
    where: { id, user_id: user.id },
    include: transactionWithRelations
  });
}

export async function createTransaction(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");
  const user_id = user.id;

  const amountRaw = formData.get("amount")?.toString() ?? "0";
  const amount = new Decimal(amountRaw);

  const dateRaw = formData.get("transaction_date")?.toString();
  if (!dateRaw) throw new Error("Transaction date is required");

  const transaction_type = (formData.get("transaction_type")?.toString() ?? "expense") as any;

  const description = formData.get("description")?.toString() || null;

  const subcategory_id = formData.get("subcategory_id")?.toString() || null;

  await prisma.transaction.create({
    data: { user_id, transaction_date: new Date(dateRaw), amount, transaction_type, description, subcategory_id },
  });

  // revalidate the list page
  revalidatePath("/transactions");
}

export async function updateTransaction(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Transaction id is required");

  const amountRaw = formData.get("amount")?.toString() ?? "0";
  const amount = new Decimal(amountRaw);

  const dateRaw = formData.get("transaction_date")?.toString();
  if (!dateRaw) throw new Error("Transaction date is required");

  const transaction_type = (formData.get("transaction_type")?.toString() ?? "expense") as any;
  const description = formData.get("description")?.toString() || null;
  const subcategory_id = formData.get("subcategory_id")?.toString() || null;

  // ensure ownership
  const existing = await prisma.transaction.findFirst({ where: { id, user_id: user.id } });
  if (!existing) throw new Error("Not found or not authorized");

  await prisma.transaction.update({ where: { id }, data: { transaction_date: new Date(dateRaw), amount, transaction_type, description, subcategory_id } });

  revalidatePath("/transactions");
}

export async function deleteTransaction(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id")?.toString()
  if (!id) throw new Error("Transaction id is required");

  const result = await prisma.transaction.deleteMany({
    where: { id, user_id: user.id },
  });

  if (result.count === 0) {
    return { error: 'Not found or unauthorized' };
  }

  revalidatePath("/transactions");
}

