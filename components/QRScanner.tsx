"use client";

import React from "react";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QRScanner = () => {
  const router = useRouter();

  const handleScan = (result: IDetectedBarcode[]) => {
    if (result) {
      console.log(result);
      // Redirect to /choice path
      router.push(`/choice?${result[0].rawValue}`);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-md bg-gray-950 shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="text-center p-6 border-b border-gray-700">
          <CardTitle className="text-2xl font-semibold text-white">
            Scan QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center w-72 h-72 bg-gray-700 shadow-inner border-4 border-black">
            <Scanner onScan={handleScan} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;
