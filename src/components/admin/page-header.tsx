import { cn } from "@/lib/utils";
import React from "react";

interface PageHeaderProps {
  title: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  actions,
  className,
  description,
}) => {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
};

export function EndpointMissing({ name }: { name: string }) {
  return (
    <div className="rounded-md border border-dashed border-warning/50 bg-warning/10 p-4 text-sm text-warning-foreground/90">
      <span className="font-medium">Requires endpoint:</span> {name}
    </div>
  );
}

export default PageHeader;
