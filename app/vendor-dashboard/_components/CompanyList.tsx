"use client";

import { getCompanies } from "@/actions/company";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDayLedgerCountPerItemCompany } from "@/actions/ledger";
import CompanyModalButton from "./CompanyModalButton";

interface Company {
  id: string;
  name: string;
}

interface CompanyItem {
  companyId: string;
  companyName: string;
  lunchItemId: string;
  lunchItemName: string;
  count: number;
}

interface CompanyData {
  id: string;
  name: string;
  items:
    | {
        itemId: string;
        itemName: string;
        itemCount: number;
      }[]
    | undefined;
}

const CompanyList = ({ date }: { date: Date }) => {
  const [companies, setCompanies] = useState<Company[]>();
  const [companyItems, setCompanyItems] = useState<CompanyItem[]>();
  const [companyData, setCompanyData] = useState<CompanyData[]>();
  const [loading, setLoading] = useState(true);

  // Function to convert the date to IST
  const getISTDate = (date: Date) => {
    console.log(date);
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000); // Convert to UTC
    const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000); // Add IST offset (UTC+5:30)
    console.log(istDate);
    return istDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const companies = await getCompanies();
      setCompanies(companies);

      const companyItemData = await getDayLedgerCountPerItemCompany(
        getISTDate(date)
      );
      setCompanyItems(companyItemData);
      setLoading(false);
    };

    fetchData();
  }, [date]);

  useEffect(() => {
    const companyData = companies?.map((company) => {
      const itemData = companyItems?.filter(
        (item) => item.companyId === company.id
      );

      return {
        ...company,
        items: itemData?.map((item) => ({
          itemId: item?.lunchItemId,
          itemName: item?.lunchItemName,
          itemCount: item?.count,
        })),
      };
    });

    if (companyData) setCompanyData(companyData);
  }, [companies, companyItems]);

  return (
    <div className="p-4">
      {getISTDate(date).toLocaleString()}
      {companyData?.map((company) => (
        <Card
          key={company.id}
          className="flex flex-row items-center justify-between shadow-md rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow border border-gray-700"
        >
          <CardHeader className="flex-grow">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {company.name.charAt(0).toUpperCase() +
                company.name.slice(1).toLowerCase()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            {!loading && <CompanyModalButton company={company} />}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompanyList;
