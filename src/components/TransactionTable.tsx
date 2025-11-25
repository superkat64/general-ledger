import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCaption,
  TableFooter,
  TableRow,
  TableCell
} from "@/components/ui/Table";

import clsx from "clsx";

import type { transaction } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type TransactionTableProps = {
  transactions: transaction[];
};

function formatDate(d: Date | string) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toISOString().split("T")[0];
}

function formatAmount(amount: number | Decimal | string) {
  if (amount && typeof amount === "object" && "toFixed" in amount) {
    try {
      return (amount as Decimal).toFixed(2);
    } catch {
      return String(amount);
    }
  }
  return Number(amount || 0).toFixed(2);
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className={clsx("text-right")}>Amount</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t) => (
          <TableRow key={t.id}>
            <TableCell>{formatDate(t.transaction_date)}</TableCell>
            <TableCell>{t.description ?? "-"}</TableCell>
            <TableCell className={clsx("text-right")}>${formatAmount(t.amount)}</TableCell>
            <TableCell>{t.transaction_type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter />
    </Table>
  );
}