import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ItemCardPropTypes {
  itemId: string;
  itemName: string;
  itemPrice: number;
  handleClick: (lunchItemId: string) => Promise<void>;
  isLoading: boolean;
  isVeg: boolean;
}

const ItemCard = ({
  itemId,
  itemName,
  itemPrice,
  handleClick,
  isLoading,
  isVeg,
}: ItemCardPropTypes) => {
  return (
    <Card className="w-[350px] md:w-[400px] bg-gray-800 shadow-md hover:shadow-lg transition-shadow rounded-lg border border-gray-700 overflow-hidden">
      {/* Header Section */}
      <CardHeader className="p-4">
        <CardTitle className="flex justify-between items-center">
          <p className="text-gray-300 text-base">
            <span className="font-medium text-gray-400">Item:</span>{" "}
            {itemName.charAt(0).toUpperCase() + itemName.slice(1)}
          </p>
          <p className="text-gray-300 text-base">
            <span className="font-medium text-gray-400">Price:</span> ₹
            {itemPrice}
          </p>
        </CardTitle>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="flex justify-between items-center px-4 pb-4">
        <div className="flex flex-row gap-2 justify-between items-center">
          {/* Status Badge */}
          <span className="text-sm text-gray-100 bg-green-600 px-3 py-1 rounded-full">
            Popular
          </span>
          {/* Veg/Non-Veg Icon */}
          <div
            className={`w-5 h-5 flex items-center justify-center border-[2.5px] bg-white ${
              isVeg ? "border-green-500" : "border-red-500"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full ${
                isVeg ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>
        </div>

        {/* Buy Button */}
        <Button
          onClick={() => handleClick(itemId)}
          className={`px-6 py-2 text-sm font-semibold rounded-lg transition ${
            isLoading
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Buy"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
