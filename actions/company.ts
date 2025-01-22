/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// const allowedNumbers = [
//   "+919773215046",
//   "+918435343424",
//   "+917990787532",
//   "+919980081000",
//   "+919742377773",
//   "+919346458948",
//   "+917903058042",
//   "+919910185992",
//   "+919360207800",
//   "+919742149503",
//   "+918884571130",
//   "+919481705132",
//   "+919663023474",
//   "+919507816479",
// ];

const allowedEmails = [
  "shabbirpoonawala03@gmail.com",
  "rajesh@framsikt.no",
  "avinash@framsikt.no",
  "paulraj@framsikt.no",
  "vinod@framsikt.no",
  "arikumar@framsikt.no",
  "kamaraju@framsikt.no",
  "kesavan@framsikt.no",
  "nikhil@framsikt.no",
  "ramachandra@framsikt.no",
  "shinoj@framsikt.no",
  "subulakshmi@framsikt.no",
  "venkat@framsikt.no",
  "apoorva@framsikt.no",
  "hemanth@framsikt.no",
  "haritha@framsikt.no",
  "maria@framsikt.no",
  "radhika@framsikt.no",
  "praveen@framsikt.no",
  "gayathri@framsikt.no",
  "charanya@framsikt.no",
  "aniket@framsikt.no",
  "ritik@framsikt.no",
  "varinder.sharma@framsikt.no",
  "loknath.mishra@framsikt.no",
  "navanip.priya@framsikt.no",
  "manjit.sithuraj@framsikt.no",
  "megha.nayak@framsikt.no",
  "rahul.kumar@framsikt.no",
  "darshan.suresha@framsikt.no",
  "sreeram.kommarolu@framsikt.no",
  "vijit.jha@framsikt.no",
  "aswia.simeen@framsikt.no",
  "parashuram.yerranagu@framsikt.no",
  "nithi.dhanasekaran@framsikt.no",
  "yashas.narayanaswamy@framsikt.no",
  "zainmuhammed.jambagi@framsikt.no",
  "subhan.vali@framsikt.no",
  "anurag.kumar@framsikt.no",
  "mehul.poddar@framsikt.no",
  "naga.krishna@framsikt.no",
  "sales@foodmos.com",
  "adyautsahi@gmail.com",
  "saivishnukamisetty@gmail.com",
  "anitdias3@gmail.com",
];

const serializeTransaction = (obj: any) => {
  const serialized = { ...obj };

  if (obj.currentBalance) {
    serialized.currentBalance = obj.currentBalance.toNumber();
  }

  return serialized;
};

export async function getCompanies() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized!");

    // Update - Check if a Vendor

    const companies = db.company.findMany();

    return companies;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

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

    if (!allowedEmails.includes(employee.email)) {
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
      return {
        isCompanyEmployee: true,
        data: serializeTransaction(updatedEmployee),
      };
    }

    return { isCompanyEmployee: true, data: serializeTransaction(employee) };
  } catch (error: any) {
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

    console.log(lunchLedgerId);

    // UPDATE - Compare LunchLedger companyId with employee companyId for validation

    const companyId = lunchLedger?.companyId;

    console.log(companyId);

    const company = await db.company.findUnique({
      where: {
        id: companyId,
      },
    });

    return company;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
