import type { Vendor } from "@/lib/types";
import VendorCard from "./VendorCard";

interface VendorListProps {
  vendors: Vendor[];
}

export default function VendorList({ vendors }: VendorListProps) {
  if (vendors.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No vendors found matching your criteria.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
}
