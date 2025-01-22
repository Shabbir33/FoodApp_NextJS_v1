/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `employees` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `foodType` on the `lunchItems` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "employees_phoneNumber_key";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "phoneNumber",
ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "lunchItems" DROP COLUMN "foodType",
ADD COLUMN     "foodType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "FoodType";

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");
