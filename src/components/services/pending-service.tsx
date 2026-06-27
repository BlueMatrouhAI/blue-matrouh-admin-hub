import httpClient from "@/lib/http-client";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import DataTable from "./data-table";
import { columns } from "./columns";
import type { Service } from "@/types";

const PendingService = ({
  categoryId,
  areaId,
  query
}: {
  categoryId: string;
  areaId: string;
  query:string
}) => {
  const services = useQuery({
    queryKey: ["services", "pending"],
    queryFn: async ({ signal }) => {
      const res = await httpClient.get<{ data: Service[] }>(
        "/services/pending",
        { signal },
      );

      return res.data;
    },
  });

  const rows = useMemo(() => {
    const s = services.data?.data;
    return s
      ? s.filter((s) => {
          const cid =
            typeof s.serviceCatId === "string"
              ? s.serviceCatId
              : s.serviceCatId?._id;
          if (cid !== categoryId) return false;
          if (areaId !== "all") {
            const aid = typeof s.area === "string" ? s.area : s.area?.areaId;
            if (aid !== areaId) return false;
          }
          return true;
        })
      : [];
  }, [categoryId, areaId, services.data]);

  return (
    <DataTable columns={columns} data={rows} isLoading={services.isLoading} query={query} />
  );
};

export default PendingService;
