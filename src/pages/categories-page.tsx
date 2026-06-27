import PageHeader, { EndpointMissing } from "@/components/admin/page-header";
import { api } from "@/lib/api";
import type { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";

const CategoriesPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api<Category[]>("/categories/"),
  });

  return (
    <>
      <PageHeader
        title="Categories"
        description="Service categories and their feature categories (read-only)."
      />

      <div className="mb-4">
        <EndpointMissing name="POST/PATCH/DELETE /api/admin/categories" />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.data?.map((c) => (
            <div
              key={c._id}
              className="rounded-xl border bg-card p-5 shadow-(--shadow-card)"
            >
              <div className="flex items-start gap-3">
                {c.imageUrl ? (
                  <img
                    src={c.imageUrl}
                    alt=""
                    className="h-12 w-12 rounded-md border object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-md bg-muted" />
                )}
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">{c.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    order {c.order ?? 0} ·{" "}
                    {c.priceRequired ? "price required" : "no price"}
                  </p>
                </div>
              </div>
              {c.featureCategories && c.featureCategories.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {c.featureCategories.map((f) => (
                    <span
                      key={f._id}
                      className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground"
                    >
                      {f.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default CategoriesPage;
