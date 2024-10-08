/*
  Warnings:

  - You are about to drop the `Matches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Matches";

-- DropTable
DROP TABLE "Teams";

-- CreateTable
CREATE TABLE "Team" (
    "name" TEXT NOT NULL,
    "regdate" TIMESTAMP(3) NOT NULL,
    "groupno" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Match" (
    "namea" TEXT NOT NULL,
    "nameb" TEXT NOT NULL,
    "goalsa" INTEGER NOT NULL,
    "goalsb" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("namea","nameb")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_namea_fkey" FOREIGN KEY ("namea") REFERENCES "Team"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_nameb_fkey" FOREIGN KEY ("nameb") REFERENCES "Team"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
