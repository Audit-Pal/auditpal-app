"use client";

import { useSession } from "next-auth/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  User,
  Bell,
  Monitor,
  CheckCircle2,
  Mail,
  ShieldAlert,
  Moon,
  Sun,
  LayoutDashboard
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SettingsForm() {
  const { data: session } = useSession();
  const { publicKey, connected, disconnect } = useWallet();

  // Local state for UI toggles
  const [notifications, setNotifications] = useState({
    email: true,
    security: true,
    marketing: false
  });

  const { theme, setTheme } = useTheme();
  const [density, setDensity] = useState("comfortable");

  const handleDisconnect = async () => {
    if (connected) {
      await disconnect();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">

      <Tabs defaultValue="account" className="space-y-8">
        <TabsList className="bg-muted border border-border p-1">
          <TabsTrigger value="account" className="data-[state=active]:bg-kast-teal data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" /> Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-kast-teal data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-kast-teal data-[state=active]:text-white">
            <Monitor className="w-4 h-4 mr-2" /> Appearance
          </TabsTrigger>
        </TabsList>

        {/* ACCOUNT & IDENTITY */}
        <TabsContent value="account" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {/* Identity Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-kast-teal" />
              <h3 className="text-lg font-medium text-foreground">Identity</h3>
            </div>

            <div className="p-6 rounded-xl bg-muted/30 border border-border space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Display Name</Label>
                  <Input
                    defaultValue={session?.user?.name || "Global User"}
                    className="bg-background border-input text-foreground focus:border-kast-teal"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Email Address</Label>
                  <Input
                    defaultValue={session?.user?.email || "user@auditpal.io"}
                    className="bg-background border-input text-foreground focus:border-kast-teal"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-foreground text-background hover:bg-foreground/90">Save Changes</Button>
              </div>
            </div>
          </div>

          {/* Connected Wallets */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-kast-teal" />
              <h3 className="text-lg font-medium text-foreground">Connected Wallets</h3>
            </div>

            <div className="p-6 rounded-xl bg-muted/30 border border-border">
              {connected && publicKey ? (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-mono text-sm bg-muted px-2 py-1 rounded border border-border">{publicKey.toString()}</span>
                      <div className="flex items-center text-emerald-600 text-xs font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground pl-1">Solana Devnet</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    className="h-9 border-red-500/20 text-red-500 hover:text-red-600 hover:bg-red-500/10 hover:border-red-500/40"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <Wallet className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No wallet connected</p>
                  <Button className="bg-kast-teal text-white hover:bg-kast-teal/90">Connect Wallet</Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="p-6 rounded-xl bg-muted/30 border border-border space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-kast-teal" /> Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive reports and updates via email.</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, email: c }))}
                className="data-[state=checked]:bg-kast-teal"
              />
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" /> Security Alerts
                </Label>
                <p className="text-sm text-muted-foreground">Immediate alerts for critical vulnerabilities found.</p>
              </div>
              <Switch
                checked={notifications.security}
                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, security: c }))}
                className="data-[state=checked]:bg-rose-500"
              />
            </div>
          </div>
        </TabsContent>

        {/* APPEARANCE */}
        <TabsContent value="appearance" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

          {/* Theme Preference */}
          <div className="space-y-3">
            <Label className="text-foreground text-base">Theme Mode</Label>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setTheme("dark")}
                className={cn(
                  "cursor-pointer border-2 rounded-xl p-4 transition-all",
                  theme === "dark"
                    ? "border-kast-teal bg-muted/50"
                    : "border-transparent bg-muted/20 hover:bg-muted/40 hover:border-border"
                )}
              >
                <div className="bg-card border border-border rounded-lg h-24 mb-3 flex items-center justify-center">
                  <Moon className={cn("w-6 h-6", theme === "dark" ? "text-kast-teal" : "text-muted-foreground")} />
                </div>
                <div className="font-medium text-foreground text-sm">Dark Mode</div>
                <div className="text-xs text-muted-foreground">Default for coding focus.</div>
              </div>

              <div
                onClick={() => setTheme("light")}
                className={cn(
                  "cursor-pointer border-2 rounded-xl p-4 transition-all",
                  theme === "light"
                    ? "border-kast-teal bg-muted/50"
                    : "border-transparent bg-muted/20 hover:bg-muted/40 hover:border-border"
                )}
              >
                <div className="bg-white border border-border rounded-lg h-24 mb-3 flex items-center justify-center">
                  <Sun className={cn("w-6 h-6", theme === "light" ? "text-orange-500" : "text-muted-foreground")} />
                </div>
                <div className="font-medium text-foreground text-sm">Light Mode</div>
                <div className="text-xs text-muted-foreground">Clean and bright.</div>
              </div>
            </div>
          </div>

          {/* Density */}
          <div className="space-y-3 pt-4">
            <Label className="text-foreground text-base">Workspace Density</Label>
            <div className="p-6 rounded-xl bg-muted/30 border border-border space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="bg-background border border-border rounded-lg p-3 space-y-2">
                    <div className="h-2 w-2/3 bg-muted rounded"></div>
                    <div className="h-2 w-1/2 bg-muted rounded"></div>
                  </div>
                  <div className="text-center mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDensity("comfortable")}
                      className={cn("text-xs", density === "comfortable" ? "text-kast-teal" : "text-muted-foreground")}
                    >
                      Comfortable
                    </Button>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-background border border-border rounded-lg p-3 space-y-1">
                    <div className="h-1.5 w-2/3 bg-muted rounded"></div>
                    <div className="h-1.5 w-1/2 bg-muted rounded"></div>
                    <div className="h-1.5 w-3/4 bg-muted rounded"></div>
                  </div>
                  <div className="text-center mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDensity("compact")}
                      className={cn("text-xs", density === "compact" ? "text-kast-teal" : "text-muted-foreground")}
                    >
                      Compact
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
