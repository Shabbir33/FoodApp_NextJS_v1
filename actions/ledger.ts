/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Function to convert the date to IST
const getISTDate = (date: Date) => {
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000); // Convert to UTC
  const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // Add IST offset (UTC+5:30)
  return istDate;
};

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
  } catch (error: any) {
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
  } catch (error: any) {
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

    const employee = await db.employee.findUnique({
      where: { clerkUserId: userId },
    });

    if (!employee) throw new Error("Employee not found!");

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
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateLedgerItem(
  lunchLedgerId: string,
  lunchItemId: string
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized!");

    const employee = await db.employee.findUnique({
      where: { clerkUserId: userId },
    });

    if (!employee) throw new Error("Employee not found!");

    // Fetch the reference ledger
    const referenceLedger = await db.lunchLedger.update({
      where: { id: lunchLedgerId },
      data: {
        lunchItemId: lunchItemId,
      },
    });

    if (!referenceLedger) throw new Error("Ledger not found!");
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getDayLedgerCountPerItem(date: Date) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized!");

    // Update - Check if a Vendor

    // Query for the count of lunch items grouped by lunchItemId for the given date
    const itemCounts = await db.lunchLedger.groupBy({
      by: ["lunchItemId"],
      _count: { lunchItemId: true },
      where: {
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)), // Start of the day
          lt: new Date(date.setHours(23, 59, 59, 999)), // End of the day
        },
      },
    });

    // Include additional data like lunch item names
    const itemDetails = await Promise.all(
      itemCounts.map(async (item) => {
        const lunchItem = await db.lunchItem.findUnique({
          where: { id: item.lunchItemId },
        });
        return {
          lunchItemId: item.lunchItemId,
          lunchItemName: lunchItem?.foodType || "Unknown Item",
          count: item._count.lunchItemId,
        };
      })
    );

    return itemDetails;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getDayLedgerCountPerItemCompany(date: Date) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized!");

    // Update date to IST from UTC
    date = getISTDate(date);

    // Update - Check if a Vendor or a Company Admin

    // Query for the count of lunch items grouped by companyId and lunchItemId for the given date
    const itemCountsPerCompany = await db.lunchLedger.groupBy({
      by: ["companyId", "lunchItemId"],
      _count: { lunchItemId: true },
      where: {
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)), // Start of the day
          lt: new Date(date.setHours(23, 59, 59, 999)), // End of the day
        },
      },
    });

    // Include company and lunch item details
    const itemDetailsPerCompany = await Promise.all(
      itemCountsPerCompany.map(async (entry) => {
        const company = await db.company.findUnique({
          where: { id: entry.companyId },
        });
        const lunchItem = await db.lunchItem.findUnique({
          where: { id: entry.lunchItemId },
        });

        return {
          date: date,
          companyId: entry.companyId,
          companyName: company?.name || "Unknown Company",
          lunchItemId: entry.lunchItemId,
          lunchItemName: lunchItem?.foodType || "Unknown Item",
          count: entry._count.lunchItemId,
        };
      })
    );

    return itemDetailsPerCompany;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
