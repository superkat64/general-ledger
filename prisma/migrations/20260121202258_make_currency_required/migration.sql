/*
  Warnings:

  - Made the column `currency` on table `transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."transaction" ALTER COLUMN "currency" SET NOT NULL;
