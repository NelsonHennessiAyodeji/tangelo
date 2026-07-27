// src/app/error.tsx
"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <PageHeader
        title="Something Went Wrong"
        description="We apologize for the inconvenience. An unexpected error occurred."
        icon={AlertTriangle}
      />
      <div className="mt-8 bg-card p-8 rounded-lg shadow-xl inline-block">
        <p className="text-lg text-destructive mb-4">
          Error: {error.message || "An unknown error occurred."}
        </p>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          variant="default"
          size="lg"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
