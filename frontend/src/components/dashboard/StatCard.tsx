import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning";
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-gradient-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
};

const iconBgStyles = {
  default: "bg-muted",
  primary: "bg-primary-foreground/20",
  success: "bg-success-foreground/20",
  warning: "bg-warning-foreground/20",
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = "default" 
}: StatCardProps) {
  const isColoredVariant = variant !== "default";

  return (
    <div
      className={cn(
        "rounded-2xl p-6 shadow-md card-hover animate-fade-in",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn(
            "text-sm font-medium mb-1",
            isColoredVariant ? "opacity-80" : "text-muted-foreground"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-3xl font-bold tracking-tight",
            !isColoredVariant && "text-foreground"
          )}>
            {value}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                trend.isPositive 
                  ? "bg-success/20 text-success" 
                  : "bg-destructive/20 text-destructive"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
            )}
            <p className={cn(
              "text-sm",
              isColoredVariant ? "opacity-70" : "text-muted-foreground"
            )}>
              {subtitle}
            </p>
          </div>
        </div>
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          iconBgStyles[variant]
        )}>
          <Icon className={cn(
            "h-6 w-6",
            isColoredVariant ? "text-current" : "text-primary"
          )} />
        </div>
      </div>
    </div>
  );
}
