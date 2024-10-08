-- DropIndex
DROP INDEX "Match_order_key";

-- AlterTable
ALTER TABLE "Match" ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("namea", "nameb");
