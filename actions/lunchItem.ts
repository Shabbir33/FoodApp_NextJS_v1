/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getLunchItem(lunchItemId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized!");

    const employee = await db.employee.findUnique({
      where: { clerkUserId: userId },
    });

    if (!employee) throw new Error("Employee not found!");

    const lunchItem = await db.lunchItem.findUnique({
      where: {
        id: lunchItemId,
      },
    });

    return { ...lunchItem, price: lunchItem?.price.toNumber() };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getLunchItems() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized!");

    // Update - Check Either a Employee or a Vendor

    const lunchItems = await db.lunchItem.findMany();

    return lunchItems?.map((item) => ({
      ...item,
      price: item.price.toNumber(),
    }));
  } catch (error: any) {
    throw new Error(error.message);
  }
}
