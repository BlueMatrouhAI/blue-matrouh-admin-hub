import type { Service } from "@/types";
import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "../admin/data-table";
import { Link } from "react-router";
import DeleteButton from "./delete-button";
import ApproveButton from "./approve-button";

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const r = row.original;
      return <Link to={`/services/${r._id}`}>{r.title}</Link>;
    },
  },
  {
    accessorKey: "serviceCatId",
    header: "Category",
    cell: ({ row }) => {
      const cat = row.getValue("serviceCatId") as Service["serviceCatId"];
      return typeof cat === "string" ? cat : cat?.title;
    },
  },
  {
    accessorKey: "userId",
    header: "Seller",
    cell: ({ row }) => {
      const user = row.getValue("userId") as Service["userId"];
      return typeof user === "object"
        ? user.username || user.email || "—"
        : "—";
    },
  },
  {
    accessorKey: "area",
    header: "Area",
    cell: ({ row }) => {
      const area = row.getValue("area") as Service["area"];
      return (typeof area === "string" ? area : area?.areaName) || "-";
    },
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const r = row.original;
      return r.avgRating != null
        ? `${r.avgRating.toFixed(1)} (${r.reviewCount ?? 0})`
        : "—";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) =>
      row.getValue("createdAt")
        ? new Date(row.getValue("createdAt")).toLocaleDateString()
        : "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col gap-y-2">
          {r.status === "Pending" && <ApproveButton id={r._id} />}
          {!r.isDeleted ? <DeleteButton id={r._id} /> : `-`}
        </div>
      );
    },
  },
];
