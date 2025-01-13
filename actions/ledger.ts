"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getLedger(lunchLedgerId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized!");

    const employee = await db.employee.findUnique({
      where: { clerkUserId: userId },
    });

    if (!employee) throw new Error("Employee not found!");

    const ledger = await db.lunchLedger.findUnique({
      where: {
        id: lunchLedgerId,
      },
    });

    return ledger;
  } catch (error) {
    throw new Error(error.message);
  }
}

// export async function getDayLedger(employeeId:string) {

// }

export async function createLedger(
  companyId: string,
  employeeId: string,
  lunchItemId: string
) {
  console.log(companyId, employeeId, lunchItemId);
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized!");

    const employee = await db.employee.findUnique({
      where: { clerkUserId: userId },
    });

    if (!employee) throw new Error("Employee not found!");

    // Get the start of today (midnight)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // The Existing Ledger needs to be between the start of the day till current time
    const existingLedger = await db.lunchLedger.findFirst({
      where: {
        employeeId: employeeId,
        date: {
          gte: startOfDay, // Start of the day
          lte: new Date(), // Current time
        },
      },
    });

    if (existingLedger) {
      return { existingEntry: true, data: existingLedger };
    }

    const newLedger = await db.lunchLedger.create({
      data: {
        companyId: companyId,
        employeeId: employeeId,
        lunchItemId: lunchItemId,
        date: new Date(),
      },
    });

    // Update the Daily Redis Cache Object form Daily Count

    return { existingEntry: false, data: newLedger };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Fetches the count of ledgers created before the given ledger's date and time on the same day.
 * @param {string} ledgerId - The ID of the reference ledger.
 * @returns {number} - The count of ledgers.
 */
export async function getCountOfLedgersBefore(
  ledgerId: string
): Promise<number> {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized!");

    // Fetch the reference ledger
    const referenceLedger = await db.lunchLedger.findUnique({
      where: { id: ledgerId },
    });

    if (!referenceLedger) throw new Error("Ledger not found!");

    // Extract the reference date
    const referenceDate = new Date(referenceLedger.date);

    // Calculate the start and end of the day
    const startOfDay = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      referenceDate.getDate(),
      0, // Start hour
      0, // Start minute
      0 // Start second
    );

    // Count ledgers before the given date and time on the same day
    const count = await db.lunchLedger.count({
      where: {
        date: {
          gte: startOfDay, // Same day
          lte: referenceDate, // Before the reference ledger's date and time
        },
      },
    });

    return count;
  } catch (error) {
    throw new Error(error.message);
  }
}
