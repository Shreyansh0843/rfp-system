import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { RecentRFPCard } from "@/components/dashboard/RecentRFPCard";
import { Button } from "@/components/ui/button";

const stats = [
  { 
    title: "Total RFPs", 
    value: 24, 
    subtitle: "All time",
    icon: FileText,
    trend: { value: 12, isPositive: true }
  },
  { 
    title: "Active RFPs", 
    value: 8, 
    subtitle: "In progress",
    icon: Clock,
    variant: "primary" as const
  },
  { 
    title: "Completed", 
    value: 16, 
    subtitle: "This quarter",
    icon: CheckCircle2,
    trend: { value: 8, isPositive: true }
  },
  { 
    title: "Active Vendors", 
    value: 42, 
    subtitle: "In network",
    icon: Users,
  },
];

const quickActions = [
  { 
    title: "Create New RFP", 
    description: "Start a new procurement request", 
    icon: Plus,
    href: "/rfps/create",
    variant: "primary" as const
  },
  { 
    title: "Manage Vendors", 
    description: "View and add vendors", 
    icon: Users,
    href: "/vendors"
  },
  { 
    title: "View All RFPs", 
    description: "Browse existing RFPs", 
    icon: FileText,
    href: "/rfps"
  },
];

const recentRFPs = [
  { 
    title: "IT Equipment Procurement", 
    budget: "$50,000", 
    deadline: "Dec 15, 2024",
    status: "active" as const,
    proposalCount: 5
  },
  { 
    title: "Office Furniture Supply", 
    budget: "$25,000", 
    deadline: "Dec 20, 2024",
    status: "sent" as const,
    proposalCount: 3
  },
  { 
    title: "Marketing Services Contract", 
    budget: "$100,000", 
    deadline: "Jan 5, 2025",
    status: "draft" as const,
    proposalCount: 0
  },
];

export default function Dashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-primary">AI-Powered</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your procurement activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            variant={stat.variant}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>

      {/* Recent RFPs */}
      <div className="bg-card rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Recent RFPs</h2>
            <p className="text-sm text-muted-foreground">Your latest procurement requests</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/rfps" className="flex items-center gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentRFPs.map((rfp) => (
            <RecentRFPCard key={rfp.title} {...rfp} />
          ))}
        </div>

        {recentRFPs.length === 0 && (
          <div className="text-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">No RFPs yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first RFP to get started
            </p>
            <Button asChild>
              <Link to="/rfps/create">Create Your First RFP</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
