/*
  Warnings:

  - Added the required column `condition` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `underlying` on the `Person` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "condition" TEXT NOT NULL,
DROP COLUMN "underlying",
ADD COLUMN     "underlying" BOOLEAN NOT NULL;
