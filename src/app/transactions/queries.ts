// app/transactions/queries.ts

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export type TransactionForDisplay = {
  id: string;
  date: string;
  amount: number;
  type: string;
  institution: string | null;
  category: string | null;
  subcategory: string | null;
  description: string | null;
};

export async function getTransactionById(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  return prisma.transaction.findFirst({
    where: { id, user_id: user.id },
    include: {
      institution: true,
      subcategory: {
        include: {
          category: true,
        },
      },
    }
  });
}

export async function getTransactionsForDisplay() {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  const transactions = await prisma.transaction.findMany({
    where: { user_id: user.id },
    include: {
      institution: true,
      subcategory: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { transaction_date: 'desc' },
  });

  return transactions.map(t => ({
    id: t.id,
    date: t.transaction_date.toISOString(),
    amount: Number(t.amount),
    type: t.transaction_type,
    institution: t.institution?.name ?? null,
    category: t.subcategory?.category?.name ?? null,
    subcategory: t.subcategory?.name ?? null,
    description: t.description,
  }));
}