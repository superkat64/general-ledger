// app/categories/queries.ts

import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

import type { TransactionForDisplay } from "@/app/transactions/queries";
import type { SubcategoryForDisplay } from "./[id]/subcategories/queries";

export async function getCategoryWithSubcategoriesAndTransactions(category_id: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not Authenticated");

  const category = await prisma.category.findFirst(
    {
      where: {
        id: category_id,
        user_id: user.id
      },
      include: {
        subcategory: {
          include: {
            transaction: {
              include: {
                institution: true
              }
            }
          }
        }
      }
    }
  )
  const subcategories: Array<SubcategoryForDisplay> = [];
  const transactions: Array<TransactionForDisplay> = [];

  category?.subcategory.forEach(s => {
    subcategories.push({
      id: s.id,
      name: s.name,
      monthly_budget: s.monthly_budget?.toString(),
      category_id: s.category_id
    });
    s.transaction.forEach(t => {
      transactions.push({
        id: t.id,
        amount: t.amount.toString(),
        type: t.transaction_type,
        date: t.transaction_date.toISOString(),
        description: t.description,
        category: category.name,
        subcategory: s.name,
        institution: t.institution?.name ?? null,
      });
    });
  });

  return {
    id: category?.id,
    name: category?.name,
    type: category?.type,
    color: category?.color,
    icon: category?.icon,
    subcategories: subcategories,
    transactions: transactions,
  }
};
