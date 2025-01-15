"use client";

import { getDayLedgerCountPerItem } from "@/actions/ledger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

interface ItemCountType {
  lunchItemId: string;
  lunchItemName: string;
  count: number;
}

const FoodItemList = () => {
  const [lunchItemsCountForDay, setLunchItemsCountForDay] =
    useState<ItemCountType[]>();

  useEffect(() => {
    const fetchData = async () => {
      const data: ItemCountType[] = await getDayLedgerCountPerItem(new Date());

      setLunchItemsCountForDay(data);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {lunchItemsCountForDay?.map((item) => (
        <Card
          key={item.lunchItemId}
          className="flex flex-row items-center justify-between shadow-md rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow border border-gray-700"
        >
          <CardHeader className="flex-grow">
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {item.lunchItemName}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <p>Count: {item.count}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FoodItemList;
