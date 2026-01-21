// app/transactions/actions.tsx
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { stackServerApp } from "@/stack/server";

const buildPrismaUpdateCreateDataObject = (formData: FormData) => {
  const amountRaw = formData.get("amount")?.toString() ?? "0";
  if (!amountRaw || isNaN(Number(amountRaw))) {
    throw new Error("Invalid amount");
  }
  const amount = new Decimal(amountRaw);

  const currency = formData.get("currency")?.toString() ?? "USD";

  const dateRaw = formData.get("transaction_date")?.toString();
  if (!dateRaw) throw new Error("Transaction date is required");
  const transaction_date = new Date(dateRaw);
  if (isNaN(transaction_date.getTime())) {
    throw new Error("Invalid transaction date");
  }

  const transaction_type_raw = formData.get("transaction_type")?.toString() ?? "expense";
  if (!["income", "expense"].includes(transaction_type_raw)) {
    throw new Error("Invalid transaction type");
  }
  const transaction_type = transaction_type_raw as "income" | "expense";

  const description = formData.get("description")?.toString() || null;
  const subcategory_id = formData.get("subcategory_id")?.toString() || null;
  const institution_id = formData.get("institution_id")?.toString() || null;

  return { transaction_date, amount, currency, transaction_type, description, subcategory_id, institution_id };
}

export async function createTransaction(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");
  const user_id = user.id;

  const organizedData = buildPrismaUpdateCreateDataObject(formData);
  await prisma.transaction.create({
    data: { ...organizedData, user_id, },
  });

  // revalidate the list page
  revalidatePath("/transactions");
}

export async function updateTransaction(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Transaction id is required");

  const organizedData = buildPrismaUpdateCreateDataObject(formData);

  // ensure ownership
  const existing = await prisma.transaction.findFirst({ where: { id, user_id: user.id } });
  if (!existing) throw new Error("Not found or not authorized");

  await prisma.transaction.update({ where: { id, user_id: user.id }, data: organizedData });

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

