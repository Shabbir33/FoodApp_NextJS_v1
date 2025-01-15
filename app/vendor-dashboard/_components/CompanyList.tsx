import { getCompanies } from "@/actions/company";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDayLedgerCountPerItemCompany } from "@/actions/ledger";
import CompanyModalButton from "./CompanyModalButton";

const CompanyList = async () => {
  const companies = await getCompanies();

  const companyItemData = await getDayLedgerCountPerItemCompany(new Date());

  const companyData = companies.map((company) => {
    const itemData = companyItemData.filter(
      (item) => item.companyId === company.id
    );

    return {
      ...company,
      items: itemData.map((item) => ({
        itemId: item?.lunchItemId,
        itemName: item?.lunchItemName,
        itemCount: item?.count,
      })),
    };
  });

  return (
    <div className="p-4">
      {companyData.map((company) => (
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
            <CompanyModalButton company={company} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompanyList;
