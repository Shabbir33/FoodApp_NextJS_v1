import { ArrowRight } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Item {
  itemId: string;
  itemName: string;
  itemCount: number;
}

interface Company {
  id: string;
  name: string;
  items: Item[] | undefined;
}

interface CompanyModalButtonProps {
  company: Company;
}

const CompanyModalButton = ({ company }: CompanyModalButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger className="p-3 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors">
        <ArrowRight className="h-5 w-5" />
      </DialogTrigger>
      <DialogContent className="w-[370px]">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">
            {company.name.charAt(0).toUpperCase() +
              company.name.slice(1).toLowerCase()}
          </DialogTitle>
          {/* <DialogDescription> */}
          {company?.items?.map((item: Item) => (
            <div key={item.itemId}>
              <Card
                key={item.itemId}
                className="flex flex-row items-center justify-between shadow-md rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow border border-gray-700 mt-4"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {item.itemName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <span>Count: {item.itemCount}</span>
                </CardContent>
              </Card>
            </div>
          ))}
          {/* </DialogDescription> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyModalButton;
