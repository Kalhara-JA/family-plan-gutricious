/*
  Warnings:

  - Added the required column `planId` to the `Family` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Family" ADD COLUMN     "planId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "memberLimit" INTEGER NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_key" ON "Plan"("name");

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
