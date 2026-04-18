/*
  Warnings:

  - You are about to drop the column `money` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `fromTransactionId` on the `TransferDetail` table. All the data in the column will be lost.
  - You are about to drop the column `toTransactionId` on the `TransferDetail` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TransferDetail" DROP CONSTRAINT "TransferDetail_fromTransactionId_fkey";

-- DropForeignKey
ALTER TABLE "TransferDetail" DROP CONSTRAINT "TransferDetail_toTransactionId_fkey";

-- DropIndex
DROP INDEX "TransferDetail_fromTransactionId_key";

-- DropIndex
DROP INDEX "TransferDetail_toTransactionId_key";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "money",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transferDetailId" INTEGER;

-- AlterTable
ALTER TABLE "TransferDetail" DROP COLUMN "fromTransactionId",
DROP COLUMN "toTransactionId";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_transferDetailId_fkey" FOREIGN KEY ("transferDetailId") REFERENCES "TransferDetail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
