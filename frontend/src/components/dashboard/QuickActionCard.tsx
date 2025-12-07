import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  variant?: "default" | "primary";
}

export function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  href,
  variant = "default"
}: QuickActionCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300",
        variant === "primary"
          ? "bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-lg"
          : "bg-card shadow-md hover:shadow-lg hover:-translate-y-1"
      )}
    >
      <div className={cn(
        "flex h-14 w-14 items-center justify-center rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-110",
        variant === "primary" 
          ? "bg-primary-foreground/20" 
          : "bg-primary/10"
      )}>
        <Icon className={cn(
          "h-7 w-7",
          variant === "primary" ? "text-primary-foreground" : "text-primary"
        )} />
      </div>
      <h3 className={cn(
        "font-semibold mb-1",
        variant === "default" && "text-foreground"
      )}>
        {title}
      </h3>
      <p className={cn(
        "text-sm",
        variant === "primary" ? "opacity-80" : "text-muted-foreground"
      )}>
        {description}
      </p>
    </Link>
  );
}
