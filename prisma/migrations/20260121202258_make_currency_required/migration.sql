/*
  Warnings:

  - Made the column `currency` on table `transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- Backfill NULL currency values with USD (sensible default)
-- TODO: Review transactions with currency = 'USD' and update to correct currency if needed
UPDATE "public"."transaction" 
SET "currency" = 'USD' 
WHERE "currency" IS NULL;

-- AlterTable
ALTER TABLE "public"."transaction" ALTER COLUMN "currency" SET NOT NULL;
