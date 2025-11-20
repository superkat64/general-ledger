import { prisma } from "@/lib/prisma";

export default async function TransactionsPage() {
  const tx = await prisma.transaction.findMany({
    orderBy: { transaction_date: "desc" },
    take: 10,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Recent Transactions</h1>
      <ul>
        {tx.map((t) => (
          <li key={t.id} className="mb-2">
            <div>
              <strong>Date:</strong> {t.transaction_date.toISOString().split("T")[0]}
            </div>
            <div>
              <strong>Amount:</strong> ${t.amount.toFixed(2)}
            </div>
            <div>
              <strong>Type:</strong> {t.transaction_type}
            </div>
            {t.description && (
              <div>
                <strong>Description:</strong> {t.description}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
