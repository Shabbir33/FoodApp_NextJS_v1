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
  date: Date;
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const companies = await getCompanies();
      setCompanies(companies);

      const companyItemData = await getDayLedgerCountPerItemCompany(date);
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
      {/* {date.toLocaleString()}

      <p>
        {companyItems && companyItems[0]
          ? new Date(companyItems[0].date).toLocaleString()
          : "No data available"}
      </p> */}
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
