/*
  Warnings:

  - The primary key for the `Child` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Child` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `personId` column on the `Child` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Parent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Parent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `personId` column on the `Parent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Person` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Person` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Child" DROP CONSTRAINT "Child_personId_fkey";

-- DropForeignKey
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_personId_fkey";

-- AlterTable
ALTER TABLE "Child" DROP CONSTRAINT "Child_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "personId",
ADD COLUMN     "personId" INTEGER,
ADD CONSTRAINT "Child_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Parent" DROP CONSTRAINT "Parent_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "personId",
ADD COLUMN     "personId" INTEGER,
ADD CONSTRAINT "Parent_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Person" DROP CONSTRAINT "Person_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Person_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
