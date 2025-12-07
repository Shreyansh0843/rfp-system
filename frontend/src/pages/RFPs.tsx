import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  FileText, 
  Clock, 
  DollarSign,
  MoreVertical,
  Eye,
  Send,
  Trash2,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface RFP {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  status: "draft" | "sent" | "active" | "completed";
  proposalCount: number;
  vendorCount: number;
  createdAt: string;
}

const mockRFPs: RFP[] = [
  { 
    id: "1", 
    title: "IT Equipment Procurement", 
    description: "20 laptops with 16GB RAM and Intel i7, 15 monitors 27-inch with 4K resolution",
    budget: "$50,000", 
    deadline: "Dec 15, 2024",
    status: "active",
    proposalCount: 5,
    vendorCount: 8,
    createdAt: "Nov 28, 2024"
  },
  { 
    id: "2", 
    title: "Office Furniture Supply", 
    description: "Ergonomic desks and chairs for 50 employees, including standing desks",
    budget: "$25,000", 
    deadline: "Dec 20, 2024",
    status: "sent",
    proposalCount: 3,
    vendorCount: 5,
    createdAt: "Nov 25, 2024"
  },
  { 
    id: "3", 
    title: "Marketing Services Contract", 
    description: "Annual digital marketing campaign including SEO, PPC, and social media",
    budget: "$100,000", 
    deadline: "Jan 5, 2025",
    status: "draft",
    proposalCount: 0,
    vendorCount: 0,
    createdAt: "Dec 1, 2024"
  },
  { 
    id: "4", 
    title: "Cloud Infrastructure Upgrade", 
    description: "Migration to cloud services, including storage, compute, and networking",
    budget: "$75,000", 
    deadline: "Nov 30, 2024",
    status: "completed",
    proposalCount: 6,
    vendorCount: 6,
    createdAt: "Oct 15, 2024"
  },
];

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

export default function RFPs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [rfps] = useState<RFP[]>(mockRFPs);

  const filteredRFPs = rfps.filter((rfp) => {
    const matchesSearch = rfp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rfp.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || rfp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">RFPs</h1>
          <p className="text-muted-foreground">
            Manage your requests for proposals
          </p>
        </div>
        <Button asChild className="bg-gradient-primary hover:opacity-90 shadow-glow">
          <Link to="/rfps/create">
            <Plus className="h-4 w-4 mr-2" />
            Create RFP
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search RFPs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-card border-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-12 bg-card">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* RFPs List */}
      {filteredRFPs.length > 0 ? (
        <div className="space-y-4">
          {filteredRFPs.map((rfp) => (
            <div
              key={rfp.id}
              className="bg-card rounded-2xl p-6 shadow-md card-hover border border-border"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{rfp.title}</h3>
                    <Badge className={cn("font-medium", statusStyles[rfp.status])}>
                      {statusLabels[rfp.status]}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {rfp.description}
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-medium text-foreground">{rfp.budget}</span>
                    </span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Due {rfp.deadline}
                    </span>
                    <span className="text-muted-foreground">
                      {rfp.proposalCount} proposals from {rfp.vendorCount} vendors
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/rfps/${rfp.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  {rfp.status === "draft" && (
                    <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-2xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-2">No RFPs found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? "Try a different search term" : "Create your first RFP to get started"}
          </p>
          {!searchQuery && (
            <Button asChild>
              <Link to="/rfps/create">Create Your First RFP</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
