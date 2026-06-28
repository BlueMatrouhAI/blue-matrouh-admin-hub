import AddService from "@/components/services/add-service";
import PageHeader from "@/components/admin/page-header";
import CategoryService from "@/components/services/category-service";
import PendingService from "@/components/services/pending-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAreas } from "@/hooks/useAreas";
import { useCategories } from "@/hooks/useCategories";
import { useEffect, useState } from "react";

const ServicesPage = () => {
  const [q, setQ] = useState("");
  const categories = useCategories();
  const areas = useAreas();
  const [tab, setTab] = useState<"pending" | "all">("pending");
  const [categoryId, setCategoryId] = useState<string>();
  const [areaId, setAreaId] = useState<string>("all");

  useEffect(() => {
    if (categories.data) {
      setCategoryId(categories.data[0]._id);
    }
  }, [categories.data]);

  if (categories.isLoading || areas.isLoading) {
    return null;
  }

  return (
    <>
      <PageHeader
        title="Services"
        description="Moderate seller-submitted services. Approve or reject with a reason."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-md border bg-card p-1">
          <button
            onClick={() => setTab("pending")}
            className={`rounded px-3 py-1.5 text-sm font-medium transition ${tab === "pending" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setTab("all")}
            className={`rounded px-3 py-1.5 text-sm font-medium transition ${tab === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            All
          </button>
        </div>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title…"
          className="max-w-xs"
        />
        <Select value={categoryId!} onValueChange={setCategoryId}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.data?.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={areaId} onValueChange={setAreaId}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All areas</SelectItem>
            {areas.data?.map((a) => (
              <SelectItem key={a._id} value={a._id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">Refresh</Button>
        <AddService />
      </div>

      {tab === "pending" ? (
        <PendingService areaId={areaId} categoryId={categoryId!} query={q} />
      ) : (
        <CategoryService areaId={areaId} categoryId={categoryId!} query={q} />
      )}
    </>
  );
};

export default ServicesPage;
