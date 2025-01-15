import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CompanyList from "./_components/CompanyList";
import FoodItemList from "./_components/FoodItemList";

const VendorDashboardPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <Card className="w-[400px] md:w-[450px] bg-card shadow-lg rounded-lg">
        <CardHeader className="px-6 py-4 border-b dark:border-gray-700 items-center">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Vendor Daily Dashboard
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            View Daily Data of Companies and Food Items easily.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Company List
            </h2>
            <CompanyList />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Food Item List
            </h2>
            <FoodItemList />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDashboardPage;
