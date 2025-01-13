"use client";

import { checkEmployeeCompany } from "@/actions/company";
import { getEmployee } from "@/actions/employee";
import { createLedger } from "@/actions/ledger";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ClipLoader } from "react-spinners";

// Test URL - http://localhost:3000/choice?company=framsikt&companyId=57110883-2670-4e31-8582-f3fc267f09a0

enum FoodType {
  VEG = "b100339f-54d2-4562-a3b8-ec6a6b81b9f9",
  NONVEG = "a0e29436-77be-492c-b653-5f57eff3191c",
}

// interface LedgerData {
//   existingEntry: boolean;
//   data: any;
// }

const ChoicePage = () => {
  const router = useRouter();
  const [companyEmployee, setCompanyEmployee] = useState(null);
  const [existingEntry, setExistingEntry] = useState(false);
  const [existingLedger, setExistingLedger] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const params = useSearchParams();
  console.log(params.get("company"));
  useEffect(() => {
    const check = async () => {
      const data = await checkEmployeeCompany(
        params.get("companyId")!,
        params.get("company")!
      );

      setCompanyEmployee(data.isCompanyEmployee);
    };

    check();
  }, [params]);

  console.log(existingEntry);

  // useEffect(() => {
  //   const checkExistingLedger = async () => {
  //     const companyId = params.get("companyId");

  //     const employee = await getEmployee();

  //     const ledger = await getDayLedger(employee.id);

  //     if (ledger.existingEntry) {
  //       setExistingEntry(true);
  //       setExistingLedger(ledger.data);
  //       setDialogOpen(true);
  //       return;
  //     }
  //   };
  // }, []);

  const handleClick = async (lunchItemId: FoodType) => {
    // Update to getting companyId from the Employee table using ClerkUserId
    const companyId = params.get("companyId");

    // Get EmployeeID using Clerk User ID (Action)
    const employee = await getEmployee();

    const ledger = await createLedger(companyId!, employee.id, lunchItemId);

    if (ledger.existingEntry) {
      setExistingEntry(true);
      setExistingLedger(ledger.data);
      setDialogOpen(true);
      return;
    }

    // Go to Tickets Page
    router.push(`/ticket/${ledger.data.id}`);
  };

  console.log("ExistingLedger: " + existingLedger);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      {companyEmployee == null && <ClipLoader color="white" />}
      {companyEmployee != null &&
        (companyEmployee ? (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  <h2 className="text-2xl font-semibold mb-6">
                    Choose Your Lunch
                  </h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => handleClick(FoodType.VEG)}
                    className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                  >
                    Veg
                  </button>
                  <button
                    onClick={() => handleClick(FoodType.NONVEG)}
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                  >
                    Non-Veg
                  </button>
                </div>
              </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger />
              <DialogContent className="max-w-md mx-auto p-6 rounded-lg shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    <p className="text-lg font-bold">
                      Today&apos;s Ticket Already Exists
                    </p>
                  </DialogTitle>
                  <DialogDescription>
                    <p>Issued at: {existingLedger?.date.toLocaleString()}</p>
                    <button
                      onClick={() =>
                        router.push(`/ticket/${existingLedger?.id}`)
                      }
                      className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
                    >
                      Continue
                    </button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {/* {existingEntry && (
          <div>
            <button onClick={() => router.push(`/ticket/${existingLedger?.id}`)}>
              Continue
            </button>
          </div>
        )} */}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <Badge
                  variant="destructive"
                  className="text-2xl font-semibold mb-6"
                >
                  Unauthorized
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                Not a{" "}
                {(params.get("company") ?? "Default Value")
                  .charAt(0)
                  .toUpperCase() +
                  (params.get("company") ?? "Default Value").slice(1)}{" "}
                employee
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default ChoicePage;
