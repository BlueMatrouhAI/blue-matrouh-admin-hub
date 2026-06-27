import httpClient from "@/lib/http-client";
import type { Service } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import DataTable from "./data-table";
import { columns } from "./columns";

type PaginatedResponse = {
  data: Service[];
  currentPage: number;
  limit: number;
  totalDocuments: number;
  totalPages: number;
};

const CategoryService = ({
  categoryId,
  areaId,
  query
}: {
  categoryId: string;
  areaId: string;
  query:string
}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const services = useQuery({
    queryKey: ["services", categoryId, pagination.pageIndex],
    queryFn: async ({ signal }) => {
      const res = await httpClient.get<PaginatedResponse>(
        `/services/category/${categoryId}`,
        { signal, params: { page: pagination.pageIndex + 1 } },
      );

      return res.data;
    },
  });

  const rows = useMemo(() => {
    const s = services.data?.data;
    return s
      ? s.filter((s) => {
          if (areaId !== "all") {
            const aid = typeof s.area === "string" ? s.area : s.area?.areaId;
            if (aid !== areaId) return false;
          }
          return true;
        })
      : [];
  }, [categoryId, areaId, services.data]);

  return (
    <DataTable
      columns={columns}
      data={rows}
      isLoading={services.isLoading}
      paginationOpts={{
        pageCount: services.data?.totalPages ?? 0,
        pagination,
        onPaginationChange: setPagination,
      }}
      query={query}
    />
  );
};

export default CategoryService;
