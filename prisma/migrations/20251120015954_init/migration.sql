-- CreateEnum
CREATE TYPE "public"."transaction_type" AS ENUM ('expense', 'income', 'transfer');

-- CreateTable
CREATE TABLE "public"."category" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "monthly_budget" DECIMAL(12,2),
    "type" "public"."transaction_type" NOT NULL DEFAULT 'expense',
    "color" TEXT,
    "icon" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."institution" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "color" TEXT,
    "last_four_digits" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subcategory" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "transaction_date" DATE NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "transaction_type" "public"."transaction_type" NOT NULL DEFAULT 'expense',
    "description" TEXT,
    "subcategory_id" UUID,
    "institution_id" UUID,
    "payment_method" TEXT,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_category_user" ON "public"."category"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_category_user_name" ON "public"."category"("user_id", "name");

-- CreateIndex
CREATE INDEX "idx_institution_user" ON "public"."institution"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_institution_user_name_4" ON "public"."institution"("user_id", "name", "last_four_digits");

-- CreateIndex
CREATE INDEX "idx_subcategory_category" ON "public"."subcategory"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_subcategory_cat_name" ON "public"."subcategory"("category_id", "name");

-- CreateIndex
CREATE INDEX "idx_tx_user_date" ON "public"."transaction"("user_id", "transaction_date" DESC);

-- CreateIndex
CREATE INDEX "idx_tx_user_subcat" ON "public"."transaction"("user_id", "subcategory_id");

-- CreateIndex
CREATE INDEX "idx_tx_user_type" ON "public"."transaction"("user_id", "transaction_type");

-- AddForeignKey
ALTER TABLE "public"."subcategory" ADD CONSTRAINT "subcategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."transaction" ADD CONSTRAINT "transaction_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "public"."institution"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."transaction" ADD CONSTRAINT "transaction_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategory"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
