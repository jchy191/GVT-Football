/*
  Warnings:

  - You are about to drop the column `body` on the `Log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "body",
ADD COLUMN     "formMatches" TEXT,
ADD COLUMN     "formTeams" TEXT;
