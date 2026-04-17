-- AlterEnum
ALTER TYPE "RecurringType" ADD VALUE 'TRANSFER';

-- DropForeignKey
ALTER TABLE "RecurringRule" DROP CONSTRAINT "RecurringRule_categoryId_fkey";

-- AlterTable
ALTER TABLE "RecurringRule" ADD COLUMN     "fromAccountId" INTEGER,
ADD COLUMN     "toAccountId" INTEGER,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RecurringRule" ADD CONSTRAINT "RecurringRule_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringRule" ADD CONSTRAINT "RecurringRule_fromAccountId_fkey" FOREIGN KEY ("fromAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringRule" ADD CONSTRAINT "RecurringRule_toAccountId_fkey" FOREIGN KEY ("toAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
