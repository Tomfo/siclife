-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('Father', 'Mother', 'Inlaw');

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "idType" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "Sex" NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "spouseFullname" TEXT NOT NULL,
    "spousebirthday" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "residence" TEXT NOT NULL,
    "underlying" TEXT NOT NULL,
    "declaration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "personId" TEXT,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "relationship" "RelationType" NOT NULL,
    "personId" TEXT,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_nationalId_key" ON "Person"("nationalId");

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
