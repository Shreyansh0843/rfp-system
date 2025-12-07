import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="bg-card rounded-2xl p-6 shadow-md mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@company.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="Company Inc." />
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-card rounded-2xl p-6 shadow-md mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates about RFPs and proposals</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Proposal Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when vendors submit proposals</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Deadline Reminders</p>
              <p className="text-sm text-muted-foreground">Reminders for upcoming RFP deadlines</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* API Settings */}
      <div className="bg-card rounded-2xl p-6 shadow-md mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">API Configuration</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openaiKey">OpenAI API Key</Label>
            <Input id="openaiKey" type="password" placeholder="sk-..." />
            <p className="text-xs text-muted-foreground">Required for AI-powered RFP generation and proposal analysis</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpServer">SMTP Server</Label>
            <Input id="smtpServer" placeholder="smtp.gmail.com" />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-gradient-primary hover:opacity-90">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
