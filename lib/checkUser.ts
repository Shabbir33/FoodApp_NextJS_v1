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
        phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || "N/A", // Use the first available phone number or fallback
        currentBalance: 0,
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};
