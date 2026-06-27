import PageHeader from "@/components/admin/page-header";
import StateCard from "@/components/state-card";
import { api } from "@/lib/api";
import { mockHandle } from "@/lib/mock-data";
import { useQuery } from "@tanstack/react-query";
import {
  BadgePercent,
  Bell,
  Briefcase,
  Megaphone,
  Store,
  UserCheck,
  UsersIcon,
  UserX,
} from "lucide-react";
import { Link } from "react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
} from "recharts";

type Stats = {
  users: {
    total: number;
    buyers: number;
    sellers: number;
    pendingSellers: number;
    suspended: number;
    active: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  services: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  offers: { total: number; pending: number; approved: number };
  ads: { active: number };
  notifications: { total: number; unread: number };
  categories: number;
  areas: number;
};

type TrendPoint = { date: string; users: number; sellers: number };

const PIE_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--destructive))",
];

const OverviewPage = () => {
  const stats = useQuery({ queryKey: ["stats"], queryFn: () => api<Stats>("/stats") });
  const trend = useQuery({ queryKey: ["users", "trend"], queryFn: () => api<TrendPoint[]>("/users/trend") });
  const pending = useQuery({
    queryKey: ["services", "pending"],
    queryFn: () => api<any[]>("/services/pending"),
  });

  const s = stats.data?.data;
  const trendData = trend.data?.data || [];
  const pendingList = pending.data?.data || [];

  const userBreakdown = s
    ? [
        { name: "Buyers", value: s.users.buyers },
        { name: "Sellers", value: s.users.sellers },
        { name: "Pending sellers", value: s.users.pendingSellers },
        { name: "Suspended", value: s.users.suspended },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <>
      <PageHeader
        title="Overview"
        description="Operational pulse — users, services, offers, and ads at a glance."
      />
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        User analytics
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StateCard
          label="Total users"
          value={s ? s.users.total : "…"}
          hint={s ? `${s.users.newThisMonth} new this month` : undefined}
          icon={UsersIcon}
          to="/users"
          tone="primary"
        />
        <StateCard
          label="Sellers"
          value={s ? s.users.sellers : "…"}
          hint={
            s ? `${s.users.pendingSellers} awaiting verification` : undefined
          }
          icon={Store}
          to="/users"
          tone="success"
        />
        <StateCard
          label="Active users"
          value={s ? s.users.active : "…"}
          hint={s ? `${s.users.newThisWeek} new this week` : undefined}
          icon={UserCheck}
          tone="primary"
        />
        <StateCard
          label="Suspended"
          value={s ? s.users.suspended : "…"}
          icon={UserX}
          tone="danger"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-(--shadow-card) lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Signups — last 30 days</h3>
            <span className="text-xs text-muted-foreground">
              Users vs sellers
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ left: -20, right: 8, top: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="gSellers" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--success))"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--success))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="date"
                  fontSize={11}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  fill="url(#gUsers)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="sellers"
                  stroke="hsl(var(--success))"
                  fill="url(#gSellers)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-(--shadow-card)">
          <h3 className="mb-3 text-sm font-semibold">User breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {userBreakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Operations
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StateCard
          label="Pending services"
          value={s ? s.services.pending : "…"}
          hint="Awaiting review"
          icon={Briefcase}
          to="/services"
          tone="warning"
        />
        <StateCard
          label="Pending offers"
          value={s ? s.offers.pending : "…"}
          icon={BadgePercent}
          to="/offers"
          tone="warning"
        />
        <StateCard
          label="Active ads"
          value={s ? s.ads.active : "…"}
          icon={Megaphone}
          to="/ads"
          tone="primary"
        />
        <StateCard
          label="Unread notifications"
          value={s ? s.notifications.unread : "…"}
          icon={Bell}
          to="/notifications"
          tone="success"
        />
      </div>
      <div className="mt-6 rounded-xl border bg-card p-5 shadow-(--shadow-card)">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Recent pending services
          </h2>
          <Link
            to={"/services"}
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {pending.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : pendingList.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing pending. You're caught up.
          </p>
        ) : (
          <ul className="divide-y">
            {pendingList.slice(0, 6).map((svc: any) => (
              <li
                key={svc._id}
                className="flex items-center justify-between gap-3 py-2.5"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {svc.title || "Untitled"}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {svc.userId?.email || svc.userId?.username || "—"} ·{" "}
                    {svc.serviceCatId?.title || "—"}
                  </div>
                </div>
                <Link
                  to={`/services/${svc._id}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Review
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default OverviewPage;
