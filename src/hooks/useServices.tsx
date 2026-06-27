import httpClient from "@/lib/http-client";
import type { Service } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useCategories } from "./useCategories";

export const useServices = () => {
  const [tab, setTab] = useState<"pending" | "all">("pending");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [areaId, setAreaId] = useState<string>("all");

  const categories = useCategories();

  useEffect(() => {
    if (categories.data?.length && !categoryId) {
      setCategoryId(categories.data[0]._id);
    }
  }, [categories.data, categoryId]);

  const pendingServices = useQuery({
    queryKey: ["services", tab],
    enabled: tab === "pending",
    queryFn: async ({ signal }) => {
      const res = await httpClient.get<{ data: Service[] }>(
        "/services/pending",
        { signal },
      );

      return res.data;
    },
  });

  const servicesByCat = useQuery({
    queryKey: ["services", categoryId],
    enabled: tab === "all",
    queryFn: async ({ signal }) => {
      const res = await httpClient.get<{ data: Service[] }>(
        `/services/category/${categoryId}`,
        { signal },
      );

      return res.data;
    },
  });

  const isLoading =
    tab === "pending" ? pendingServices.isLoading : servicesByCat.isLoading;

  const rows = useMemo(() => {
    const data = tab === "pending" ? pendingServices.data : servicesByCat.data;

    return data?.data.filter((s) => {
      if (tab === "pending") {
        const cid =
          typeof s.serviceCatId === "string"
            ? s.serviceCatId
            : s.serviceCatId?._id;
        if (cid !== categoryId) return false;
      }
      if (areaId !== "all") {
        const aid = typeof s.area === "string" ? s.area : s.area?.areaId;
        if (aid !== areaId) return false;
      }
      return true;
    });
  }, [tab, areaId, categoryId, pendingServices.data, servicesByCat.data]);

  const refetch = () => {
    if (tab === "all") {
      servicesByCat.refetch();
    } else {
      pendingServices.refetch();
    }
  };

  return {
    tab,
    setTab,
    rows,
    refetch,
    isLoading,
    categoryId,
    setCategoryId,
    areaId,
    setAreaId,
  };
};
