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
    <div className="flex justify-center items-center h-screen">
      <Card className="flex flex-col justify-center items-center">
        <CardHeader className="text-center mb-4">
          <CardTitle className="text-2xl font-semibold">Scan QR Code</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-80 w-80">
          <div>
            <Scanner onScan={handleScan} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;
