/*
  Warnings:

  - You are about to drop the column `email` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `employees` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkUserId]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkUserId` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "clerkUserId" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "employees_clerkUserId_key" ON "employees"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "employees_phoneNumber_key" ON "employees"("phoneNumber");
