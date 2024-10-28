-- CreateTable
CREATE TABLE "Family" (
    "id" SERIAL NOT NULL,
    "manager" TEXT NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "familyId" INTEGER NOT NULL,
    "isManager" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Family_manager_key" ON "Family"("manager");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_email_key" ON "FamilyMember"("email");

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
