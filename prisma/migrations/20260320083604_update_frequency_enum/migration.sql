/*
  Warnings:

  - You are about to drop the column `interval` on the `RecurringRule` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Frequency" ADD VALUE 'BIWEEKLY';
ALTER TYPE "Frequency" ADD VALUE 'BIMONTHLY';
ALTER TYPE "Frequency" ADD VALUE 'QUARTERLY';
ALTER TYPE "Frequency" ADD VALUE 'SEMIANNUAL';

-- AlterTable
ALTER TABLE "RecurringRule" DROP COLUMN "interval";
