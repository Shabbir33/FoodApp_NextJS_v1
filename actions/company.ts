"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const allowedNumbers = [
  "+919773215046",
  "+918435343424",
  "+917990787532",
  "+919980081000",
]; //"+917990787532"

const serializeTransaction = (obj) => {
  const serialized = { ...obj };

  if (obj.currentBalance) {
    serialized.currentBalance = obj.currentBalance.toNumber();
  }

  return serialized;
};

export async function checkEmployeeCompany(
  companyId: string,
  companyName: string
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized!");

    const employee = await db.employee.findUnique({
      where: { clerkUserId: userId },
    });
    if (!employee) throw new Error("Employee not found!");
    console.log("Compare: ", companyId === companyId.trim());
    console.log("Company ID: ", companyId);

    let companyEntry = await db.company.findUnique({
      where: {
        id: companyId.trim(),
      },
    });

    console.log("Company Entry: ", companyEntry);

    if (!companyEntry) {
      console.log("New Company Created.");
      companyEntry = await db.company.create({
        data: {
          name: companyName,
        },
      });
    }

    if (!allowedNumbers.includes(employee.phoneNumber)) {
      return { isCompanyEmployee: false, data: null };
    }

    // If CompanyID of employee is null or if the employee has changed his company
    if (employee?.companyId == null || companyEntry.id != employee.companyId) {
      const updatedEmployee = await db.employee.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          companyId: companyEntry.id, // Correct placement
        },
      });
      return updatedEmployee;
    }

    return { isCompanyEmployee: true, data: serializeTransaction(employee) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getCompanyForLedger(lunchLedgerId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized!");

    const employee = await db.employee.findUnique({
      where: { clerkUserId: userId },
    });
    if (!employee) throw new Error("Employee not found!");

    const lunchLedger = await db.lunchLedger.findUnique({
      where: {
        id: lunchLedgerId,
      },
    });

    // UPDATE - Compare LunchLedger companyId with employee companyId for validation

    const companyId = lunchLedger.companyId;

    const company = await db.company.findUnique({
      where: {
        id: companyId,
      },
    });

    return company;
  } catch (error) {
    throw new Error(error.message);
  }
}
