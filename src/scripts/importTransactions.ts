import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();
const USER_ID = '8844ce56-bb8a-492a-828f-7177ac803eca';

interface CSVRow {
  date: string;
  amount: string;
  category: string;
  subcategoryDesc: string;
  institution: string;
}

async function parseCSV(filePath: string): Promise<CSVRow[]> {
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const records = parse(fileContent, {
    skip_empty_lines: true,
    relax_column_count: true,
  });

  const rows: CSVRow[] = [];

  for (const record of records) {
    // CSV format: ,,,DATE, AMOUNT,CATEGORY,,SUBCATEGORY: DESCRIPTION,,INSTITUTION
    // Indices:     0 1 2  3     4      5         6 7                    8 9
    const date = record[3]?.trim();
    const amount = record[4]?.trim();
    const category = record[5]?.trim();
    const subcategoryDesc = record[7]?.trim();
    const institution = record[9]?.trim();

    if (date && amount && category) {
      rows.push({
        date,
        amount,
        category,
        subcategoryDesc,
        institution,
      });
    }
  }

  return rows;
}

function parseDate(dateStr: string): Date {
  // Format: MM/DD/YY
  const [month, day, year] = dateStr.split('/');
  const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
  return new Date(fullYear, parseInt(month) - 1, parseInt(day));
}

function parseAmount(amountStr: string): number {
  // Remove $ and parse
  return parseFloat(amountStr.replace('$', '').replace(',', ''));
}

function parseSubcategoryAndDescription(subcategoryDesc: string): { subcategory: string; description: string | null } {
  if (!subcategoryDesc) {
    return { subcategory: 'Uncategorized', description: null };
  }

  // Check if there's a colon - if yes, split into subcategory and description
  if (subcategoryDesc.includes(':')) {
    const [subcategory, description] = subcategoryDesc.split(':').map(s => s.trim());
    return { subcategory, description };
  }

  // No colon means it's just a subcategory
  return { subcategory: subcategoryDesc.trim(), description: null };
}

async function importTransactions(filePath: string) {
  console.log(`Starting import from ${filePath}...`);

  const rows = await parseCSV(filePath);
  console.log(`Found ${rows.length} transactions to import`);

  let successCount = 0;
  let errorCount = 0;

  for (const [index, row] of rows.entries()) {
    try {
      await prisma.$transaction(async (tx) => {
        const amount = parseAmount(row.amount);
        const isIncome = row.category.toLowerCase() === 'income' && amount < 0;

        let subcategoryId = null;
        let description = null;

        if (isIncome) {
          // For income transactions, the subcategoryDesc field is just the description
          description = row.subcategoryDesc || null;
        } else {
          // For expense transactions, handle categories and subcategories
          // 1. Upsert Category
          let categoryRecord = null;
          categoryRecord = await tx.category.findFirst({ where: { user_id: USER_ID, name: row.category } });
          if (!categoryRecord) {
            categoryRecord = await tx.category.create({ data: { user_id: USER_ID, name: row.category, type: 'expense' } });
          };

          // 2. Parse subcategory and description
          const { subcategory: subcategoryName, description: parsedDescription } = parseSubcategoryAndDescription(row.subcategoryDesc);

          // 3. Upsert Subcategory
          let subcategoryRecord = null;
          subcategoryRecord = await tx.subcategory.findFirst({ where: { category_id: categoryRecord.id, name: subcategoryName } });
          if (!subcategoryRecord) {
            subcategoryRecord = await tx.subcategory.create({ data: { category_id: categoryRecord.id, name: subcategoryName } });
          }

          subcategoryId = subcategoryRecord.id;
          description = parsedDescription;
        }

        // 4. Upsert Institution (if provided)
        let institutionRecord = null;
        if (row.institution) {
          institutionRecord = await tx.institution.findFirst({ where: { user_id: USER_ID, name: row.institution } });
          if (!institutionRecord) {
            institutionRecord = await tx.institution.create({ data: { user_id: USER_ID, name: row.institution } });
          }
        }

        // 5. Create Transaction
        await tx.transaction.create({
          data: {
            user_id: USER_ID,
            transaction_date: parseDate(row.date),
            amount: Math.abs(amount), // Store as positive value
            transaction_type: isIncome ? 'income' : 'expense',
            description: description,
            subcategory_id: subcategoryId,
            institution_id: institutionRecord?.id,
          },
        });
      });

      successCount++;
      if ((index + 1) % 10 === 0) {
        console.log(`Processed ${index + 1}/${rows.length} transactions...`);
      }
    } catch (error) {
      errorCount++;
      console.error(`Error processing row ${index + 1}:`, row);
      console.error(error);
    }
  }

  console.log(`\nImport complete!`);
  console.log(`✅ Successfully imported: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

// Main execution
const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: npx tsx scripts/importTransactions.ts <path-to-csv>');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

importTransactions(filePath)
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });