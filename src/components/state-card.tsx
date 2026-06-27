import { cn } from "@/lib/utils";
import { ArrowRight, type Briefcase } from "lucide-react";
import React from "react";
import { Link } from "react-router";

interface StateCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: typeof Briefcase;
  to?: string;
  tone?: "primary" | "warning" | "success" | "muted" | "danger";
}

const StateCard: React.FC<StateCardProps> = ({
  icon: Icon,
  label,
  value,
  hint,
  to,
  tone = "primary",
}) => {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/20 text-warning-foreground",
    success: "bg-success/15 text-success",
    muted: "bg-muted text-muted-foreground",
    danger: "bg-destructive/15 text-destructive",
  }[tone];

  const body = (
    <div className="group flex items-center gap-4 rounded-xl border bg-card p-5 shadow-(--shadow-card) transition-all hover:-translate-y-0.5 hover:shadow-(--shadow-elegant)">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg",
          toneClass,
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="mt-0.5 text-2xl font-semibold tracking-tight">
          {value}
        </div>
        {hint && (
          <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>
        )}
      </div>
      {to && (
        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      )}
    </div>
  );
  return to ? (
    <Link to={to} className="block">
      {body}
    </Link>
  ) : (
    body
  );
};

export default StateCard;
