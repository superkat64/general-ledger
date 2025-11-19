export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(data.amount),
        transaction_date: new Date(data.date),
        note: data.note,
        subcategory: data.category,
        user_id: "f57bbb99-fcfc-400c-82c8-4cee9b9023c4", // placeholder for now
      },
    });
    return NextResponse.json(transaction);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error creating transaction" }, { status: 500 });
  }
}
