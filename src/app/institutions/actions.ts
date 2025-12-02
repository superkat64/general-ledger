// app/institutions/actions.ts
"use server"

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export async function getInstitutions() {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not Authenticated");

  return prisma.institution.findMany({
    where: { user_id: user.id },
    orderBy: { name: "asc" },
  })
}

export async function getInstitutionById(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not Authenticated");

  return prisma.institution.findFirst({ where: { id, user_id: user.id } });
}

export async function createInstitution(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not Authenticated");
  const user_id = user.id;

  const name = formData.get("name")?.toString();
  if (!name) throw new Error("Name is required");

  const color = formData.get("color")?.toString() || null;
  const last_four_digits = formData.get('last_four_digits')?.toString() || null;

  await prisma.institution.create({ data: { user_id, name, color, last_four_digits } });
  revalidatePath("/institutions");
}

export async function updateInstitution(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not Authenticated");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Institution id is required");

  const name = formData.get("name")?.toString();
  if (!name) throw new Error("Name is required");

  const color = formData.get("color")?.toString() || null;
  const last_four_digits = formData.get('last_four_digits')?.toString() || null;

  await prisma.institution.update({ where: { id, user_id: user.id }, data: { name, color, last_four_digits } });
  revalidatePath("/institutions");
}

export async function deleteInstitution(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Institution id is required");

  const result = await prisma.institution.deleteMany({
    where: { id, user_id: user.id },
  });

  if (result.count === 0) {
    throw new Error('Not found or unauthorized');
  }
  revalidatePath("/institutions");
}