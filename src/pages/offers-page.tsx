import { DataTable, StatusBadge, type Column } from "@/components/admin/data-table";
import PageHeader, { EndpointMissing } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Offer } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const OffersPage = () => {
  const [tab, setTab] = useState<"active" | "pending">("active");
  const qc = useQueryClient();

  const offers = useQuery({
    queryKey: ["offers"],
    queryFn: () => api<Offer[]>("/offers/"),
    enabled: tab === "active",
  });

  const approve = useMutation({
    mutationFn: (id: string) =>
      api(`/offers/approve/${id}`, { method: "POST" }),
    onSuccess: () => {
      toast.success("Approved");
      qc.invalidateQueries({ queryKey: ["offers"] });
    },
  });
  const reject = useMutation({
    mutationFn: (id: string) => api(`/offers/reject/${id}`, { method: "POST" }),
    onSuccess: () => {
      toast.success("Rejected");
      qc.invalidateQueries({ queryKey: ["offers"] });
    },
  });
  const del = useMutation({
    mutationFn: (id: string) => api(`/offers/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["offers"] });
    },
  });

  const columns: Column<Offer>[] = [
    {
      key: "service",
      header: "Service",
      cell: (r) =>
        typeof r.serviceId === "object" && r.serviceId
          ? r.serviceId.title
          : String(r.serviceId || "—"),
    },
    {
      key: "desc",
      header: "Description",
      cell: (r) => r.offerDescription || "—",
    },
    {
      key: "discount",
      header: "Discount",
      cell: (r) =>
        r.discountPercentage != null ? `${r.discountPercentage}%` : "—",
    },
    { key: "code", header: "Promo", cell: (r) => r.promoCode || "—" },
    {
      key: "window",
      header: "Window",
      cell: (r) =>
        r.startTime && r.endTime
          ? `${new Date(r.startTime).toLocaleDateString()} → ${new Date(r.endTime).toLocaleDateString()}`
          : "—",
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (r) => (
        <div className="flex justify-end gap-1">
          {r.status !== "approved" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => approve.mutate(r._id)}
            >
              Approve
            </Button>
          )}
          {r.status !== "rejected" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => reject.mutate(r._id)}
            >
              Reject
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => del.mutate(r._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Offers"
        description="Approve, reject, or remove seller-submitted offers."
      />

      <div className="mb-4 inline-flex rounded-md border bg-card p-1">
        <button
          onClick={() => setTab("active")}
          className={`rounded px-3 py-1.5 text-sm font-medium transition ${tab === "active" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Active
        </button>
        <button
          onClick={() => setTab("pending")}
          className={`rounded px-3 py-1.5 text-sm font-medium transition ${tab === "pending" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          Pending
        </button>
      </div>

      {tab === "pending" ? (
        <EndpointMissing name="GET /api/admin/offers/pending" />
      ) : (
        <DataTable
          columns={columns}
          rows={offers.data?.data}
          loading={offers.isLoading}
          empty="No active offers"
        />
      )}
    </>
  );
};

export default OffersPage;
