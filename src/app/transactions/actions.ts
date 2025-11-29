"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { stackServerApp } from "@/stack/server";

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

  await prisma.transaction.create({
    data: { user_id, transaction_date: new Date(dateRaw), amount, transaction_type, description },
  });

  // revalidate the list page
  revalidatePath("/transactions");
}

export async function deleteTransaction(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");
  const user_id = user.id;

  await prisma.transaction.deleteMany({ where: { id, user_id } });

  revalidatePath("/transactions");
}

// FormData-compatible server action wrapper
export async function deleteTransactionAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Transaction id is required");

  await deleteTransaction(id);
}

export async function listTransactions() {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  return prisma.transaction.findMany({
    where: { user_id: user.id },
    orderBy: { transaction_date: "desc" },
    include: {
      subcategory: {
        select: {
          id: true,
          name: true,
          category_id: true,
          category: { select: { id: true, name: true } },
        },
      },
      institution: { select: { id: true, name: true, last_four_digits: true } },
    },
  });
}

export async function getTransactionById(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  return prisma.transaction.findFirst({
    where: { id, user_id: user.id },
    include: {
      subcategory: {
        select: {
          id: true,
          name: true,
          category_id: true,
          category: { select: { id: true, name: true } },
        },
      },
      institution: { select: { id: true, name: true, last_four_digits: true } },
    },
  });
}

