/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const serializeTransaction = (obj: any) => {
  const serialized = { ...obj };

  if (obj.currentBalance) {
    serialized.currentBalance = obj.currentBalance.toNumber();
  }

  return serialized;
};

export async function getEmployee() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized!");

    const employee = await db.employee.findUnique({
      where: { clerkUserId: userId },
    });
    if (!employee) throw new Error("Employee not found!");

    console.log(employee);

    return serializeTransaction(employee);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
