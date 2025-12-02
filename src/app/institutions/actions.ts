// app/institutions/actions.ts
"use server"

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

/**
 * Fetches all institutions belonging to the authenticated user, ordered by name ascending.
 *
 * @returns An array of institution records for the authenticated user, ordered by name ascending.
 * @throws Error when no user is authenticated (message: "Not Authenticated").
 */
export async function getInstitutions() {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not Authenticated");

  return prisma.institution.findMany({
    where: { user_id: user.id },
    orderBy: { name: "asc" },
  })
}

/**
 * Fetches an institution belonging to the current authenticated user by its id.
 *
 * @param id - The institution's id
 * @returns The institution record if found, `null` otherwise
 * @throws Error when no user is authenticated
 */
export async function getInstitutionById(id: string) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not Authenticated");

  return prisma.institution.findFirst({ where: { id, user_id: user.id } });
}

/**
 * Creates a new institution for the authenticated user and revalidates the institutions page.
 *
 * @param formData - FormData containing `name` (required), `color` (optional), and `last_four_digits` (optional)
 * @throws Error - "Not Authenticated" if no user is signed in.
 * @throws Error - "Name is required" if `name` is missing from `formData`.
 */
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

/**
 * Update an existing institution belonging to the authenticated user.
 *
 * Expects a FormData object containing the institution fields; updates the record and revalidates the "/institutions" path.
 *
 * @param formData - FormData with required fields `id` and `name`, and optional `color` and `last_four_digits`
 * @throws Error - "Not Authenticated" if there is no authenticated user
 * @throws Error - "Institution id is required" if `id` is missing from `formData`
 * @throws Error - "Name is required" if `name` is missing from `formData`
 */
export async function updateInstitution(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not Authenticated");
  const user_id = user.id;

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Institution id is required");

  const name = formData.get("name")?.toString();
  if (!name) throw new Error("Name is required");

  const color = formData.get("color")?.toString() || null;
  const last_four_digits = formData.get('last_four_digits')?.toString() || null;

  await prisma.institution.update({ where: { id }, data: { user_id, name, color, last_four_digits } });
  revalidatePath("/institutions");
}

/**
 * Delete the institution specified by `id` for the authenticated user and revalidate the "/institutions" path.
 *
 * @param formData - A FormData object that must contain the `id` field of the institution to delete.
 * @returns An object with an `error` string when the institution was not found or the user is unauthorized; otherwise `undefined`.
 * @throws Error when the request is not authenticated or when `id` is missing from `formData`.
 */
export async function deleteInstitution(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Institution id is required");

  const result = await prisma.institution.deleteMany({
    where: { id, user_id: user.id },
  });

  if (result.count === 0) {
    return { error: 'Not found or unauthorized' };
  }
  revalidatePath("/institutions");
}