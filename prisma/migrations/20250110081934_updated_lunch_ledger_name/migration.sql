/*
  Warnings:

  - You are about to drop the `budgets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_companyId_fkey";

-- DropForeignKey
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "budgets" DROP CONSTRAINT "budgets_lunchItemId_fkey";

-- DropTable
DROP TABLE "budgets";

-- CreateTable
CREATE TABLE "lunchledgers" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "lunchItemId" TEXT NOT NULL,

    CONSTRAINT "lunchledgers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lunchledgers_companyId_idx" ON "lunchledgers"("companyId");

-- CreateIndex
CREATE INDEX "lunchledgers_employeeId_idx" ON "lunchledgers"("employeeId");

-- CreateIndex
CREATE INDEX "lunchledgers_lunchItemId_idx" ON "lunchledgers"("lunchItemId");

-- AddForeignKey
ALTER TABLE "lunchledgers" ADD CONSTRAINT "lunchledgers_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lunchledgers" ADD CONSTRAINT "lunchledgers_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lunchledgers" ADD CONSTRAINT "lunchledgers_lunchItemId_fkey" FOREIGN KEY ("lunchItemId") REFERENCES "lunchItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
