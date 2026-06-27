import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T extends { _id?: string; id?: string }>({
  columns,
  rows,
  loading,
  empty = "No records found",
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[] | undefined;
  loading?: boolean;
  empty?: string;
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-(--shadow-card)">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn("px-4 py-3 font-medium", c.className)}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  className="px-4 py-10 text-center text-muted-foreground"
                  colSpan={columns.length}
                >
                  Loading…
                </td>
              </tr>
            )}
            {!loading && (!rows || rows.length === 0) && (
              <tr>
                <td
                  className="px-4 py-10 text-center text-muted-foreground"
                  colSpan={columns.length}
                >
                  {empty}
                </td>
              </tr>
            )}
            {!loading &&
              rows?.map((row, i) => (
                <tr
                  key={row._id || row.id || i}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-t transition-colors",
                    onRowClick && "cursor-pointer hover:bg-accent/40",
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn("px-4 py-3 align-middle", c.className)}
                    >
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();
  const map: Record<string, string> = {
    approved: "bg-success/15 text-success",
    active: "bg-success/15 text-success",
    pending: "bg-warning/20 text-warning-foreground",
    rejected: "bg-destructive/15 text-destructive",
    inactive: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        map[s] || "bg-muted text-muted-foreground",
      )}
    >
      {status || "—"}
    </span>
  );
}
