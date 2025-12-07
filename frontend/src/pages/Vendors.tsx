import { useState } from "react";
import { 
  Plus, 
  Search, 
  Users, 
  Mail, 
  Phone, 
  Building2,
  MoreVertical,
  Edit,
  Trash2,
  Star
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  rating: number;
  rfpCount: number;
}

const mockVendors: Vendor[] = [
  { id: "1", name: "TechCorp Solutions", email: "contact@techcorp.com", phone: "+1 555-0101", category: "IT Equipment", rating: 4.8, rfpCount: 12 },
  { id: "2", name: "Office Plus Inc", email: "sales@officeplus.com", phone: "+1 555-0102", category: "Office Supplies", rating: 4.5, rfpCount: 8 },
  { id: "3", name: "Creative Marketing Co", email: "hello@creativemc.com", phone: "+1 555-0103", category: "Marketing", rating: 4.9, rfpCount: 5 },
  { id: "4", name: "BuildRight Construction", email: "info@buildright.com", phone: "+1 555-0104", category: "Construction", rating: 4.2, rfpCount: 3 },
];

export default function Vendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vendors] = useState<Vendor[]>(mockVendors);

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Vendors</h1>
          <p className="text-muted-foreground">
            Manage your vendor network and contacts
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90 shadow-glow">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" placeholder="Enter company name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="contact@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 555-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g., IT Equipment, Marketing" />
              </div>
              <Button className="w-full bg-gradient-primary hover:opacity-90">
                Add Vendor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search vendors by name, email, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 bg-card border-border"
        />
      </div>

      {/* Vendors Grid */}
      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-card rounded-2xl p-6 shadow-md card-hover border border-border"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="font-semibold text-foreground mb-1">{vendor.name}</h3>
              <Badge variant="secondary" className="mb-4">{vendor.category}</Badge>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{vendor.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <span className="text-sm font-medium">{vendor.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {vendor.rfpCount} RFPs
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-2xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-2">No vendors found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery ? "Try a different search term" : "Add your first vendor to get started"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              Add Your First Vendor
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
