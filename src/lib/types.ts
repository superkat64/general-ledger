import type { Prisma } from "@prisma/client";

export type TransactionWithRels = Prisma.transactionGetPayload<{
  include: {
    subcategory: {
      select: {
        id: true;
        name: true;
        category_id: true;
        category: { select: { id: true; name: true } };
      };
    };
    institution: { select: { id: true; name: true; last_four_digits: true } };
  };
}>;

export type CategoryWithSubs = Prisma.categoryGetPayload<{ include: { subcategory: true } }>;
