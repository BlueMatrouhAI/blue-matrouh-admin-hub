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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, CheckCheck, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const NotificationsPage = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    title: "",
    subtitle: "",
    description: "",
    imageUrls: "",
  });

  const list = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api<NotificationItem[]>("/notifications/"),
  });

  const send = useMutation({
    mutationFn: () =>
      api("/notifications/", {
        method: "POST",
        body: {
          userId: form.userId,
          title: form.title,
          subtitle: form.subtitle,
          description: form.description,
          imageUrls: form.imageUrls
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      }),
    onSuccess: () => {
      toast.success("Notification sent");
      setOpen(false);
      setForm({
        userId: "",
        title: "",
        subtitle: "",
        description: "",
        imageUrls: "",
      });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  const viewOne = useMutation({
    mutationFn: (id: string) =>
      api(`/notifications/${id}/view`, { method: "PATCH" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const viewAll = useMutation({
    mutationFn: () => api(`/notifications/view-all`, { method: "PATCH" }),
    onSuccess: () => {
      toast.success("Marked all as read");
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Send push/in-app notifications and review your inbox."
        actions={
          <>
            <Button variant="outline" onClick={() => viewAll.mutate()}>
              <CheckCheck className="mr-1 h-4 w-4" /> Mark all read
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-1 h-4 w-4" /> Send
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send notification</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label>Recipient user ID</Label>
                    <Input
                      value={form.userId}
                      onChange={(e) =>
                        setForm({ ...form, userId: e.target.value })
                      }
                      placeholder="user _id"
                    />
                    <p className="text-xs text-muted-foreground">
                      Broadcast / multi-recipient requires a new endpoint.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Title</Label>
                    <Input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Subtitle</Label>
                    <Input
                      value={form.subtitle}
                      onChange={(e) =>
                        setForm({ ...form, subtitle: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Image URLs (comma-separated)</Label>
                    <Input
                      value={form.imageUrls}
                      onChange={(e) =>
                        setForm({ ...form, imageUrls: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => send.mutate()}
                    disabled={!form.userId || !form.title || send.isPending}
                  >
                    Send
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="rounded-xl border bg-card shadow-(--shadow-card)">
        {list.isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading…</p>
        ) : !list.data?.data?.length ? (
          <p className="p-6 text-sm text-muted-foreground">No notifications.</p>
        ) : (
          <ul className="divide-y">
            {list.data.data.map((n) => (
              <li
                key={n._id}
                className={cn(
                  "flex items-start gap-3 p-4 transition-colors",
                  !n.isViewed && "bg-primary/5",
                )}
              >
                <div
                  className={cn(
                    "mt-1 h-2 w-2 shrink-0 rounded-full",
                    n.isViewed ? "bg-muted" : "bg-primary",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="truncate text-sm font-medium">{n.title}</h4>
                    {n.createdAt && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {n.subtitle && (
                    <p className="text-xs text-muted-foreground">
                      {n.subtitle}
                    </p>
                  )}
                  {n.description && (
                    <p className="mt-1 text-sm">{n.description}</p>
                  )}
                </div>
                {!n.isViewed && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => viewOne.mutate(n._id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default NotificationsPage;
