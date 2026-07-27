"use client";

import { useState, useEffect, useCallback } from "react";
import type { Vendor } from "@/lib/types";
import { useAuth } from "./use-auth";

// In demo mode, we'll use localStorage to persist selected vendors.
const LOCAL_STORAGE_KEY = "selectedVendors";

export function useSelectedVendors() {
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedVendors = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedVendors) {
          setSelectedVendors(JSON.parse(storedVendors));
        }
      } catch (error) {
        console.error(
          "Failed to parse selected vendors from localStorage",
          error
        );
      }
      setIsLoaded(true);
    }
  }, []);

  const updateLocalStorage = (vendors: Vendor[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(vendors));
    }
  };

  const addVendor = useCallback(
    async (vendor: Vendor): Promise<boolean> => {
      if (!user) return false;

      if (selectedVendors.some((v) => v.id === vendor.id)) {
        return false;
      }

      const newVendors = [...selectedVendors, vendor];
      setSelectedVendors(newVendors);
      updateLocalStorage(newVendors);
      return true;
    },
    [selectedVendors, user]
  );

  const removeVendor = useCallback(
    async (vendorId: string) => {
      if (!user) return;

      const newVendors = selectedVendors.filter((v) => v.id !== vendorId);
      setSelectedVendors(newVendors);
      updateLocalStorage(newVendors);
    },
    [selectedVendors, user]
  );

  const isVendorSelected = useCallback(
    (vendorId: string): Vendor | undefined => {
      return selectedVendors.find((v) => v.id === vendorId);
    },
    [selectedVendors]
  );

  return {
    selectedVendors,
    addVendor,
    removeVendor,
    isVendorSelected,
    isLoaded,
  };
}
