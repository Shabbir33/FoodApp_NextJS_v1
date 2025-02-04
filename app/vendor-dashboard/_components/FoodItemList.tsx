"use client";

import { getDayLedgerCountPerItem } from "@/actions/ledger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

interface ItemCountType {
  lunchItemId: string;
  lunchItemName: string;
  count: number;
}

const FoodItemList = ({ date }: { date: Date }) => {
  const [lunchItemsCountForDay, setLunchItemsCountForDay] =
    useState<ItemCountType[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log(date);
      const data: ItemCountType[] = await getDayLedgerCountPerItem(date);

      setLunchItemsCountForDay(data);
      setLoading(false);
    };

    fetchData();
  }, [date]);

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
            <p>
              Count:{" "}
              {!loading ? item.count : <ClipLoader size={15} color="white" />}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FoodItemList;
