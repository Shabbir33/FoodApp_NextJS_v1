"use client";

import { checkEmployeeCompany, getCompanyForLedger } from "@/actions/company";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCountOfLedgersBefore, getLedger } from "@/actions/ledger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipLoader } from "react-spinners";
import { getLunchItem } from "@/actions/lunchItem";

const TicketPage = () => {
  const params = useParams();
  const [ledgerData, setLedgerData] = useState(null);
  const [isCompanyEmployee, setIsCompanyEmployee] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [lunchItemType, setLunchItemType] = useState("");
  const [ledgerCount, setLedgerCount] = useState(0);

  const { id: lunchLedgerId } = params;

  useEffect(() => {
    if (typeof lunchLedgerId !== "string") {
      return; // Ensure lunchLedgerId is a valid string before making API calls
    }

    const fetchDetails = async () => {
      try {
        const company = await getCompanyForLedger(lunchLedgerId);
        setCompanyName(company.name);

        const data = await checkEmployeeCompany(company.id, company.name);
        setIsCompanyEmployee(data.isCompanyEmployee);
        if (!data.isCompanyEmployee) {
          return;
        }

        const ledger = await getLedger(lunchLedgerId);
        setLedgerData(ledger);

        const lunchItem = await getLunchItem(ledger.lunchItemId);
        setLunchItemType(lunchItem.foodType);

        const count = await getCountOfLedgersBefore(lunchLedgerId);
        setLedgerCount(count);
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    fetchDetails();
  }, [lunchLedgerId]);
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      {isCompanyEmployee == null && <ClipLoader color="white" />}
      {isCompanyEmployee != null &&
        (isCompanyEmployee ? (
          <div className="bg-black shadow-lg rounded-lg p-8 w-96 text-center">
            <Card>
              <CardHeader>
                <CardTitle>
                  <h2 className="text-2xl font-semibold mb-4">Lunch Details</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-row justify-center gap-2">
                  <p className="text-lg font-medium text-gray-400">Company: </p>
                  <p className="text-lg font-medium text-white">
                    {companyName.charAt(0).toUpperCase() + companyName.slice(1)}
                  </p>
                </div>
                <div className="mb-4 flex flex-row justify-center gap-2">
                  <p className="text-lg font-medium text-gray-400">ID:</p>
                  <p className="text-lg font-medium text-white">
                    {ledgerCount == 0 ? "Loading..." : ledgerCount}
                  </p>
                </div>
                <div>
                  <Badge
                    className={`${
                      lunchItemType === "NONVEG"
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : lunchItemType === "VEG"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : ""
                    }`}
                  >
                    {lunchItemType == "" ? "Loading..." : lunchItemType}
                  </Badge>
                </div>
              </CardContent>
            </Card>
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
                {(companyName ?? "Default Value").charAt(0).toUpperCase() +
                  (companyName ?? "Default Value").slice(1)}{" "}
                employee
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default TicketPage;
