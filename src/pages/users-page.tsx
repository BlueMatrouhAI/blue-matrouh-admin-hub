import {
  DataTable,
  StatusBadge,
  type Column,
} from "@/components/admin/data-table";
import PageHeader, { EndpointMissing } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import type { UserRef } from "@/types";
import { useState } from "react";

const SAMPLE: UserRef[] = [];

const UsersPage = () => {
  const [q, setQ] = useState("");

  const columns: Column<UserRef>[] = [
    {
      key: "user",
      header: "User",
      cell: (r) => (
        <div className="flex items-center gap-2">
          {r.imageUrl ? (
            <img
              src={r.imageUrl}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {(r.username || r.email || "?").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-sm font-medium">{r.username || "—"}</div>
            <div className="text-xs text-muted-foreground">{r.email}</div>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone", cell: (r) => r.phoneNumber || "—" },
    {
      key: "role",
      header: "Role",
      cell: (r) => <StatusBadge status={r.role} />,
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: "seller",
      header: "Seller",
      cell: (r) => (r.isSeller ? "Yes" : "No"),
    },
    {
      key: "deleted",
      header: "Deleted",
      cell: (r) => (r.isDeleted ? "Yes" : "No"),
    },
  ];

  return (
    <>
      <PageHeader
        title="Users"
        description="Browse, filter, and manage marketplace users and sellers."
      />
      <div className="mb-4 space-y-3">
        <EndpointMissing name="GET /api/admin/users (filters: role, status, isSeller, isDeleted, search)" />
        <EndpointMissing name="GET /api/admin/users/:id  ·  PATCH /api/admin/users/:id  ·  /verify-approve · /verify-reject" />
      </div>

      <div className="mb-3 max-w-xs">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search users…"
          disabled
        />
      </div>

      <DataTable
        columns={columns}
        rows={SAMPLE}
        empty="User admin endpoints are not yet available — UI ready when backend ships."
      />
    </>
  );
};

export default UsersPage;
