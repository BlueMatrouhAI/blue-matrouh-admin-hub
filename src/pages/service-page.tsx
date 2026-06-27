import { StatusBadge } from "@/components/admin/data-table";
import PageHeader from "@/components/admin/page-header";
import ApproveButton from "@/components/services/approve-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import httpClient from "@/lib/http-client";
import type { Service } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ArrowLeft, Check, Edit, X } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

interface EditableTextProps {
  children: React.ReactNode;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

const EditableText: React.FC<EditableTextProps> = ({
  children,
  defaultValue = "",
  onValueChange,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [draft, setDraft] = useState(defaultValue);

  useEffect(() => {
    setDraft(defaultValue);
  }, [defaultValue]);

  const handleSave = () => {
    onValueChange?.(draft);
    setIsEdit(false);
  };

  const handleCancel = () => {
    setDraft(defaultValue);
    setIsEdit(false);
  };

  if (isEdit) {
    return (
      <div className="flex items-center gap-2">
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} />

        <Button size="sm" onClick={handleSave}>
          Save
        </Button>

        <Button size="sm" variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2">
      {children}

      <Button
        className="hidden group-hover:flex"
        size="icon-sm"
        variant="ghost"
        onClick={() => setIsEdit(true)}
      >
        <Edit />
      </Button>
    </div>
  );
};

type FeatureValue = string | number | boolean | string[];

interface EditableFeatureProps {
  label: string;
  value: FeatureValue;
  onChange: (value: FeatureValue) => void;
}

function EditableFeature({ label, value, onChange }: EditableFeatureProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [draft, setDraft] = useState<FeatureValue>(value);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleSave = () => {
    onChange(draft);
    setIsEdit(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setNewItem("");
    setIsEdit(false);
  };

  if (!isEdit) {
    return (
      <div className="group flex items-center gap-2">
        <span>
          {label}:{" "}
          {Array.isArray(value)
            ? value.join(", ")
            : typeof value === "boolean"
              ? value
                ? "Yes"
                : "No"
              : value}
        </span>

        <Button
          size="icon-sm"
          variant="ghost"
          className="hidden group-hover:flex"
          onClick={() => setIsEdit(true)}
        >
          <Edit />
        </Button>
      </div>
    );
  }

  if (typeof draft === "number") {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={draft}
          onChange={(e) => setDraft(Number(e.target.value))}
        />

        <Button size="sm" onClick={handleSave}>
          Save
        </Button>

        <Button size="sm" variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    );
  }

  if (typeof draft === "boolean") {
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          checked={draft}
          onCheckedChange={(checked) => setDraft(Boolean(checked))}
        />

        <Button size="sm" onClick={handleSave}>
          Save
        </Button>

        <Button size="sm" variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    );
  }

  if (Array.isArray(draft)) {
    return (
      <div className="space-y-2">
        {draft.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const copy = [...draft];
                copy[index] = e.target.value;
                setDraft(copy);
              }}
            />

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDraft(draft.filter((_, i) => i !== index))}
            >
              Delete
            </Button>
          </div>
        ))}

        <div className="flex gap-2">
          <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} />

          <Button
            onClick={() => {
              if (!newItem.trim()) return;

              setDraft([...draft, newItem]);
              setNewItem("");
            }}
          >
            Add
          </Button>
        </div>

        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>

          <Button size="sm" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input value={draft} onChange={(e) => setDraft(e.target.value)} />

      <Button size="sm" onClick={handleSave}>
        Save
      </Button>

      <Button size="sm" variant="ghost" onClick={handleCancel}>
        Cancel
      </Button>
    </div>
  );
}

const ServicePage = () => {
  const { id } = useParams();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [changes, setChanges] = useState<Partial<Service>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["services", id],
    enabled: !!id,
    queryFn: async ({ signal }) => {
      const res = await httpClient.get<{ data: Service }>(`/services/${id}`, {
        signal,
      });
      return res.data.data;
    },
  });
  const s = data;

  const isChange = useMemo(() => {
    if (!data) return false;

    return Object.entries(changes).some(([key, value]) => {
      const originalValue = data[key as keyof Service];

      return JSON.stringify(value) !== JSON.stringify(originalValue);
    });
  }, [changes, data]);

  const qc = useQueryClient();

  const edit = useMutation<{ message: string }, AxiosError>({
    mutationKey: ["edit", "service"],
    mutationFn: async () => {
      const formData = new FormData();
      Object.entries(changes).forEach(([key, value]) => {
        if (key === "features") {
          formData.append(
            "features",
            JSON.stringify(
              (value as Service["features"])?.map((f) => ({
                featureCategoryId: f.featureCategoryId,
                value: f.value,
              })),
            ),
          );
        } else {
          formData.append(key, String(value));
        }
      });
      const res = await httpClient.patch<{ message: string }>(
        `/services/${id}`,
        formData,
      );
      await qc.invalidateQueries({ queryKey: ["services", id] });
      return res.data;
    },
    onSuccess: ({ message }) => {
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  const reject = useMutation<{ message: string }, AxiosError>({
    mutationKey: ["reject", "service"],
    mutationFn: async () => {
      const res = await httpClient.post<{ message: string }>(
        `/services/reject/${id}`,
        {
          reason,
        },
      );
      await qc.invalidateQueries({ queryKey: ["services", id] });
      return res.data;
    },
    onSuccess: ({ message }) => {
      setRejectOpen(false);
      toast.success(message);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!s) return <p className="text-muted-foreground">Service not found.</p>;

  const seller = typeof s.userId === "object" ? s.userId : null;
  const cat = typeof s.serviceCatId === "object" ? s.serviceCatId : null;
  const area = typeof s.area === "object" ? s.area.areaName : s.area;

  const updateFeature = (
    featureCategoryId: number,
    value: string | number | boolean | string[],
  ) => {
    setChanges((prev) => {
      const source = prev.features ?? s.features ?? [];

      const updated = source.map((feature) =>
        feature.featureCategoryId === featureCategoryId
          ? {
              ...feature,
              value,
            }
          : feature,
      );

      return {
        ...prev,
        features: updated,
      };
    });
  };

  return (
    <>
      {isChange && !s.isDeleted && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
          <Button disabled={edit.isPending} onClick={() => edit.mutate()}>
            Save Changes {edit.isPending && <Spinner data-icon="inline-start" />}
          </Button>
        </div>
      )}
      <Link
        to={"/services"}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to services
      </Link>
      <PageHeader
        title={
          <EditableText
            defaultValue={changes?.title || s.title}
            onValueChange={(e) => {
              if (s.title !== e) {
                setChanges((prev) => ({ ...prev, title: e }));
              } else {
                setChanges((prev) => {
                  const { title, ...rest } = prev;
                  return rest;
                });
              }
            }}
          >
            {changes?.title || s.title}
          </EditableText>
        }
        description={`Submitted by ${seller?.username || seller?.email || "—"}`}
        actions={
          <>
            <StatusBadge status={s.status} />
            {s.status === "Pending" && (
              <>
                <ApproveButton id={s._id} />
                <Button
                  size={"sm"}
                  variant="destructive"
                  onClick={() => setRejectOpen(true)}
                >
                  <X className="mr-1 h-4 w-4" /> Reject
                </Button>
              </>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {s.imageUrls && s.imageUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {s.imageUrls.map((u, i) => (
                <img
                  key={i}
                  src={u}
                  alt=""
                  className="aspect-video w-full rounded-md border object-cover"
                />
              ))}
            </div>
          )}

          <section className="rounded-xl border bg-card p-5 shadow-(--shadow-card)">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </h3>
            <EditableText
              defaultValue={changes?.description || s.description}
              onValueChange={(e) => {
                if (s.description !== e) {
                  setChanges((prev) => ({ ...prev, description: e }));
                } else {
                  setChanges((prev) => {
                    const { description, ...rest } = prev;
                    return rest;
                  });
                }
              }}
            >
              <p className="whitespace-pre-wrap text-sm">
                {changes?.description || s.description || "—"}
              </p>
            </EditableText>
          </section>

          {s.features && s.features.length > 0 && (
            <section className="rounded-xl border bg-card p-5 shadow-(--shadow-card)">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Features
              </h3>
              <ul className="grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                {(changes.features ?? s.features)?.map((feature) => (
                  <li key={feature.featureCategoryId}>
                    <EditableFeature
                      label={feature.featureCategoryTitle}
                      value={feature.value}
                      onChange={(value) =>
                        updateFeature(feature.featureCategoryId, value)
                      }
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {s.offerDescription && (
            <section className="rounded-xl border bg-card p-5 shadow-(--shadow-card)">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Active offer
              </h3>
              <p className="text-sm">{s.offerDescription}</p>
              <p className="text-xs text-muted-foreground">
                {s.discountPercentage}% off · code{" "}
              </p>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-(--shadow-card)">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Details
            </h3>
            <dl className="space-y-2 text-sm">
              <Field label="Category" value={cat?.title || "—"} />
              <Field label="Area" value={String(area || "—")} />
              <Field
                label="Price"
                value={s.price != null ? String(changes.price ?? s.price) : "—"}
                editable
                onValueChange={(value) => {
                  const price = Number(value);

                  if (price !== s.price) {
                    setChanges((prev) => ({
                      ...prev,
                      price,
                    }));
                  } else {
                    setChanges((prev) => {
                      const { price, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
              />
              <Field
                label="Location"
                value={changes.location ?? s.location ?? "—"}
                editable
                onValueChange={(value) => {
                  if (value !== s.location) {
                    setChanges((prev) => ({
                      ...prev,
                      location: value,
                    }));
                  } else {
                    setChanges((prev) => {
                      const { location, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
              />
              <Field
                label="Created"
                value={
                  s.createdAt ? new Date(s.createdAt).toLocaleString() : "—"
                }
              />
            </dl>
          </div>

          {seller && (
            <div className="rounded-xl border bg-card p-5 shadow-(--shadow-card)">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Seller
              </h3>
              <div className="flex items-center gap-3">
                {seller.imageUrl ? (
                  <img
                    src={seller.imageUrl}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {(seller.username || seller.email || "?")
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {seller.username || seller.email}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {seller.phoneNumber || seller.email || "—"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject service</DialogTitle>
          </DialogHeader>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection (visible to the seller)…"
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="ghost"
              disabled={reject.isPending}
              onClick={() => {
                setRejectOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={reject.isPending}
              onClick={() => reject.mutate()}
            >
              Confirm reject
              {reject.isPending && <Spinner data-icon="inline-start" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

function Field({
  label,
  value,
  editable,
  onValueChange,
}: {
  label: string;
  value: string;
  editable?: boolean;
  onValueChange?: (value: string) => void;
}) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>

      <dd className="max-w-[60%] text-right font-medium">
        {editable ? (
          <EditableText defaultValue={value} onValueChange={onValueChange}>
            {value}
          </EditableText>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export default ServicePage;
