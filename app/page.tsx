import { lazy, Suspense } from "react";
import { ClipLoader } from "react-spinners";

const QRScanner = lazy(() => import("@/components/QRScanner"));

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <Suspense fallback={<ClipLoader color="white" />}>
        <div className="w-80 h-80 mx-auto flex items-center justify-center">
          <QRScanner />
        </div>
      </Suspense>
    </div>
  );
}
