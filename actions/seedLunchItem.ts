/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { db } from "@/lib/prisma";

export async function seedLunchItems() {
  try {
    const lunchItems = [
      { foodType: "VEG", price: 120 },
      { foodType: "NONVEG", price: 150 },
    ];

    // Insert seed data into the database
    const createdItems = await Promise.all(
      lunchItems.map((item) =>
        db.lunchItem.create({
          data: {
            foodType: item.foodType,
            price: item.price,
          },
        })
      )
    );

    return { success: true, data: createdItems };
  } catch (error: any) {
    console.error("Error seeding data:", error.message || error);
    return {
      success: false,
      error: error.message || "An error occurred while seeding data",
    };
  }
}
