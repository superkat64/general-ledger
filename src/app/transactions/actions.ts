"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function createTransaction(formData: FormData) {
  const user_id = "TODO-user-id";

  const amountRaw = formData.get("amount")?.toString() ?? "0";
  const amount = new Decimal(amountRaw);

  const dateRaw = formData.get("transaction_date")?.toString();
  if (!dateRaw) throw new Error("Transaction date is required");

  const transaction_type = (formData.get("transaction_type")?.toString() ?? "expense") as any;

  const description = formData.get("description")?.toString() || null;

  await prisma.transaction.create({
    data: {
      user_id,
      transaction_date: new Date(dateRaw),
      amount,
      transaction_type,
      description,
    },
  });

  // revalidate the list page
  revalidatePath("/transactions");
}
