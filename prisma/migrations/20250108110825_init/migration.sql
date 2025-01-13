-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('VEG', 'NONVEG');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "currentBalance" DECIMAL(65,30) NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lunchItems" (
    "id" TEXT NOT NULL,
    "foodType" "FoodType" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "lunchItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgets" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "lunchItemId" TEXT NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "employees_companyId_idx" ON "employees"("companyId");

-- CreateIndex
CREATE INDEX "budgets_companyId_idx" ON "budgets"("companyId");

-- CreateIndex
CREATE INDEX "budgets_employeeId_idx" ON "budgets"("employeeId");

-- CreateIndex
CREATE INDEX "budgets_lunchItemId_idx" ON "budgets"("lunchItemId");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_lunchItemId_fkey" FOREIGN KEY ("lunchItemId") REFERENCES "lunchItems"("id") ON DELETE CASCADE ON UPDATE CASCADE;
