import { FileText, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RecentRFPCardProps {
  title: string;
  budget: string;
  deadline: string;
  status: "draft" | "sent" | "active" | "completed";
  proposalCount: number;
}

const statusStyles = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-info/20 text-info",
  active: "bg-warning/20 text-warning",
  completed: "bg-success/20 text-success",
};

const statusLabels = {
  draft: "Draft",
  sent: "Sent",
  active: "Active",
  completed: "Completed",
};

export function RecentRFPCard({ 
  title, 
  budget, 
  deadline, 
  status, 
  proposalCount 
}: RecentRFPCardProps) {
  return (
    <div className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
            {title}
          </h4>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              {budget}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {deadline}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {proposalCount} proposal{proposalCount !== 1 ? "s" : ""}
        </span>
        <Badge className={cn("font-medium", statusStyles[status])}>
          {statusLabels[status]}
        </Badge>
      </div>
    </div>
  );
}
