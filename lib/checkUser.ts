/* eslint-disable @typescript-eslint/no-explicit-any */

import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }
    const loggedInUser = await db.employee.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const newUser = await db.employee.create({
      data: {
        clerkUserId: user.id,
        email: user.emailAddresses[0].emailAddress,
        currentBalance: 0,
      },
    });

    return newUser;
  } catch (error: any) {
    console.log(error.message);
  }
};
