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


export async function getTransactions() {
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