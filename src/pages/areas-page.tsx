import { DataTable, type Column } from "@/components/admin/data-table";
import PageHeader, { EndpointMissing } from "@/components/admin/page-header";
import { api } from "@/lib/api";
import type { Area } from "@/types";
import { useQuery } from "@tanstack/react-query";

const AreasPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["areas"],
    queryFn: () => api<Area[]>("/areas/"),
  });

  const columns: Column<Area>[] = [
    {
      key: "name",
      header: "Name",
      cell: (r) => <span className="font-medium">{r.name}</span>,
    },
    {
      key: "del",
      header: "Deleted",
      cell: (r) => (r.isDeleted ? "Yes" : "No"),
    },
    {
      key: "id",
      header: "ID",
      cell: (r) => (
        <code className="text-xs text-muted-foreground">{r._id}</code>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Areas"
        description="Service coverage areas (read-only)."
      />
      <div className="mb-4">
        <EndpointMissing name="POST/PATCH/DELETE /api/admin/areas" />
      </div>
      <DataTable
        columns={columns}
        rows={data?.data}
        loading={isLoading}
        empty="No areas"
      />
    </>
  );
};

export default AreasPage;
