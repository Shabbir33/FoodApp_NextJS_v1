"use client";

import { checkEmployeeCompany } from "@/actions/company";
import { getEmployee } from "@/actions/employee";
import { createLedger } from "@/actions/ledger";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
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
import ItemCard from "./_components/ItemCard";
import { getLunchItems } from "@/actions/lunchItem";

// Test URL - http://localhost:3000/choice?company=framsikt&companyId=57110883-2670-4e31-8582-f3fc267f09a0

interface LedgerType {
  id: string;
  date: Date;
  companyId: string;
  employeeId: string;
  lunchItemId: string;
}

interface ItemType {
  id: string;
  foodType: string;
  price: number;
  isVeg: boolean;
}

const Choice = () => {
  const router = useRouter();
  const [companyEmployee, setCompanyEmployee] = useState<boolean | null>(null);
  const [existingEntry, setExistingEntry] = useState(false);
  const [existingLedger, setExistingLedger] = useState<LedgerType>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [foodItems, setFoodItems] = useState<ItemType[]>();

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

  useEffect(() => {
    const fetchItems = async () => {
      const items = await getLunchItems();

      setFoodItems(items);
    };

    fetchItems();
  }, []);

  console.log(existingEntry);
  console.log(foodItems);

  const handleClick = async (lunchItemId: string) => {
    setIsLoading(true);
    // Update to getting companyId from the Employee table using ClerkUserId
    const companyId = params.get("companyId");

    // Get EmployeeID using Clerk User ID (Action)
    const employee = await getEmployee();

    const ledger = await createLedger(companyId!, employee.id, lunchItemId);

    if (ledger.existingEntry) {
      setExistingEntry(true);
      setExistingLedger(ledger.data);
      setDialogOpen(true);
      setIsLoading(false);
      return;
    }

    // Go to Tickets Page
    router.push(`/ticket/${ledger.data.id}`);
    setIsLoading(false);
  };

  console.log("ExistingLedger: " + existingLedger);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      {companyEmployee == null && <ClipLoader color="white" />}
      {companyEmployee != null &&
        (companyEmployee ? (
          <div>
            <Card className="w-[400px] md:w-[450px]">
              <CardHeader>
                <CardTitle>
                  <h2 className="text-2xl font-semibold text-center">
                    Lunch Options
                  </h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 justify-center">
                  {foodItems == null && (
                    <div className="flex items-center justify-center h-full">
                      <ClipLoader
                        color="white"
                        className="items-center justify-between"
                      />
                    </div>
                  )}
                  {foodItems &&
                    foodItems?.map((item) => (
                      <ItemCard
                        key={item.id}
                        isLoading={isLoading}
                        handleClick={handleClick}
                        itemId={item.id}
                        itemName={item.foodType}
                        itemPrice={item.price}
                        isVeg={item.isVeg}
                      />
                    ))}
                </div>
              </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger />
              <DialogContent className="w-[350px] mx-auto p-6 rounded-lg shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    <p className="text-lg font-bold">
                      Today&apos;s Ticket Already Exists
                    </p>
                  </DialogTitle>
                  <DialogDescription>
                    <span>
                      Issued at: {existingLedger?.date.toLocaleString()}
                    </span>
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

const ChoicePage = () => {
  return (
    <Suspense>
      <Choice />
    </Suspense>
  );
};

export default ChoicePage;
