/*
  Warnings:

  - You are about to drop the column `monthly_budget` on the `category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."category" DROP COLUMN "monthly_budget";

-- AlterTable
ALTER TABLE "public"."subcategory" ADD COLUMN     "monthly_budget" DECIMAL(12,2);
