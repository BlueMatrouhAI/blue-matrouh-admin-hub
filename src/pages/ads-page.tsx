import { DataTable, type Column } from "@/components/admin/data-table";
import PageHeader from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import type { Ad, Service } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const AdsPage = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [startTime, setStart] = useState("");
  const [endTime, setEnd] = useState("");
  const [q, setQ] = useState("");

  const ads = useQuery({
    queryKey: ["ads"],
    queryFn: () => api<Ad[]>("/adds/"),
  });
  const services = useQuery({
    queryKey: ["services", "all"],
    queryFn: () => api<Service[]>("/services/"),
    enabled: open,
  });

  const filteredServices = useMemo(() => {
    const list = services.data?.data || [];
    return q
      ? list.filter((s) =>
          (s.title || "").toLowerCase().includes(q.toLowerCase()),
        )
      : list;
  }, [services.data, q]);

  const create = useMutation({
    mutationFn: () =>
      api("/adds/", {
        method: "POST",
        body: { serviceId, startTime, endTime },
      }),
    onSuccess: () => {
      toast.success("Ad created");
      qc.invalidateQueries({ queryKey: ["ads"] });
      setOpen(false);
      setServiceId("");
      setStart("");
      setEnd("");
    },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  const columns: Column<Ad>[] = [
    {
      key: "service",
      header: "Service",
      cell: (r) =>
        typeof r.serviceId === "object" && r.serviceId
          ? r.serviceId.title
          : String(r.serviceId || "—"),
    },
    {
      key: "seller",
      header: "Seller",
      cell: (r) => {
        const s = typeof r.serviceId === "object" ? r.serviceId : null;
        const u = s && typeof s.userId === "object" ? s.userId : null;
        return u ? u.username || u.email || "—" : "—";
      },
    },
    {
      key: "start",
      header: "Start",
      cell: (r) => (r.startTime ? new Date(r.startTime).toLocaleString() : "—"),
    },
    {
      key: "end",
      header: "End",
      cell: (r) => (r.endTime ? new Date(r.endTime).toLocaleString() : "—"),
    },
  ];

  return (
    <>
      <PageHeader
        title="Ads"
        description="Promoted services currently surfaced to users."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" /> New ad
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create ad</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Service</Label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search services…"
                      className="pl-8"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto rounded-md border bg-background">
                    {services.isLoading ? (
                      <p className="p-3 text-sm text-muted-foreground">
                        Loading…
                      </p>
                    ) : filteredServices.length === 0 ? (
                      <p className="p-3 text-sm text-muted-foreground">
                        No services
                      </p>
                    ) : (
                      filteredServices.slice(0, 50).map((s) => (
                        <button
                          key={s._id}
                          type="button"
                          onClick={() => setServiceId(s._id)}
                          className={`block w-full px-3 py-2 text-left text-sm hover:bg-accent ${serviceId === s._id ? "bg-accent" : ""}`}
                        >
                          {s.title}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {s._id}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Start</Label>
                    <Input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStart(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>End</label>
                    <Input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEnd(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => create.mutate()}
                  disabled={
                    !serviceId || !startTime || !endTime || create.isPending
                  }
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <DataTable
        columns={columns}
        rows={ads.data?.data}
        loading={ads.isLoading}
        empty="No active ads"
      />
    </>
  );
};

export default AdsPage;
