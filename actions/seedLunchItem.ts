/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { db } from "@/lib/prisma";

enum FoodType {
  VEG = "VEG",
  NONVEG = "NONVEG",
}

export async function seedLunchItems() {
  try {
    const lunchItems = [
      { foodType: FoodType.VEG, price: 120 },
      { foodType: FoodType.NONVEG, price: 150 },
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
