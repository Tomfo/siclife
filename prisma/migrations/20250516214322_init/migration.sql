/*
  Warnings:

  - Changed the type of `idType` on the `Person` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "IdType" AS ENUM ('GhCard', 'Passport');

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "idType",
ADD COLUMN     "idType" "IdType" NOT NULL;
