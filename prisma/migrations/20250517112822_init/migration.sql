/*
  Warnings:

  - Changed the type of `declaration` on the `Person` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "declaration",
ADD COLUMN     "declaration" BOOLEAN NOT NULL;
