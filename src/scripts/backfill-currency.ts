// scripts/backfill-currency.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.transaction.updateMany({
    where: { currency: null },
    data: { currency: 'USD' }
  })

  console.log(`Updated ${result.count} transactions`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())