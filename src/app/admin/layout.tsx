"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package,
  Users, 
  ShoppingCart, 
  MessageSquare, 
  Settings,
  Phone,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Zap,
  Loader2,
  UserPlus,
  Store,
  ChevronDown,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useBusinessConfig } from "@/contexts/BusinessContext";

interface Profile {
  id: string;
  display_name: string;
  business_type: string;
  product_name_plural: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [profileDropOpen, setProfileDropOpen] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const { config: bizConfig, refreshConfig } = useBusinessConfig();

  // Dynamic nav built from bizConfig
  const navigation = useMemo(() => {
    const base = [
      { name: "Dashboard",                          href: "/admin",                 icon: LayoutDashboard },
      { name: `${bizConfig.product_name_plural}`,   href: "/admin/inventory",       icon: Package },
      { name: "Customers",                          href: "/admin/customers",       icon: Users },
    ];
    if (bizConfig.enable_leads_module)    base.push({ name: "Leads",     href: "/admin/leads",         icon: UserPlus });
    if (bizConfig.enable_marketing_module) base.push({ name: "Marketing", href: "/admin/marketing",     icon: Zap });
    base.push({ name: "Orders",    href: "/admin/orders",       icon: ShoppingCart });
    if (bizConfig.enable_whatsapp_ai) base.push({ name: "WhatsApp",  href: "/admin/conversations", icon: Phone });
    base.push({ name: "Inquiries", href: "/admin/inquiries",    icon: MessageSquare });
    base.push({ name: "Settings",  href: "/admin/settings",     icon: Settings });
    return base;
  }, [bizConfig]);

  // Load profiles list for the switcher
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/profiles")
      .then(r => r.json())
      .then(json => { if (json.success) setProfiles(json.profiles); })
      .catch(() => {});
  }, [status]);

  // Read active profile from cookie hint stored in BusinessContext
  useEffect(() => {
    if (bizConfig.id) setActiveProfileId(bizConfig.id);
  }, [bizConfig.id]);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login" && !pathname.startsWith("/admin/setup")) {
      router.push("/admin/login");
    }
  }, [status, pathname, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  const switchProfile = async (profileId: string) => {
    setProfileDropOpen(false);
    const res = await fetch("/api/profiles/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: profileId }),
    });
    if (res.ok) {
      setActiveProfileId(profileId);
      await refreshConfig();
      router.refresh();
    }
  };

  const adminUser = session?.user
    ? { username: session.user.username || session.user.name || "Admin", full_name: session.user.name, role: session.user.role }
    : null;

  // Show login page without layout
  if (pathname === "/admin/login" || pathname.startsWith("/admin/setup")) {
    return <>{children}</>;
  }

  // Show loading state while session loads
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  // Unauthenticated — middleware handles redirect but guard here too
  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 bottom-0 w-72 glass border-r border-gray-800 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo + Profile Switcher */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-orange-500 blur-lg opacity-50" />
                  {bizConfig.id && (bizConfig as { logo_url?: string }).logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={(bizConfig as { logo_url?: string }).logo_url}
                      alt="logo"
                      className="relative w-10 h-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="relative bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-xl">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-lg font-bold truncate block">{(bizConfig as { store_name?: string }).store_name || "My Store"}</span>
                  <span className="block text-[10px] text-orange-500 uppercase tracking-wider">Admin Panel</span>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Switcher */}
            {profiles.length > 1 && (
              <div className="mt-3 relative">
                <button
                  onClick={() => setProfileDropOpen(o => !o)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/5 border border-gray-800 hover:border-orange-500/40 transition-all text-sm"
                >
                  <span className="truncate text-gray-300">
                    {profiles.find(p => p.id === activeProfileId)?.display_name ||
                     profiles.find(p => p.id === activeProfileId)?.product_name_plural ||
                     "Select Profile"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                </button>

                {profileDropOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
                    {profiles.map(p => (
                      <button
                        key={p.id}
                        onClick={() => switchProfile(p.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                          p.id === activeProfileId
                            ? "bg-orange-500/20 text-orange-400"
                            : "hover:bg-white/5 text-gray-300"
                        }`}
                      >
                        <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{p.display_name || p.product_name_plural}</span>
                      </button>
                    ))}
                    <div className="border-t border-gray-800">
                      <Link
                        href="/admin/setup?new=1"
                        onClick={() => setProfileDropOpen(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        New Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/admin" && pathname.startsWith(item.href));
              
              return (
                <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}>
                  <div className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-500/20 to-red-500/10 text-orange-500 border border-orange-500/20' 
                      : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}>
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : ''}`} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.badge && (
                      <Badge className="bg-orange-500 text-white border-0 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-800">
            {/* User Info */}
            {adminUser && (
              <div className="glass-card rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-semibold">
                    {(adminUser.full_name || adminUser.username).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{adminUser.full_name || adminUser.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{adminUser.role?.replace("_", " ") || "Admin"}</p>
                  </div>
                </div>
              </div>
            )}
            
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
                <LogOut className="w-4 h-4 mr-3" />
                Back to Website
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-2"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 glass border-b border-gray-800">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input 
                  placeholder={`Search ${bizConfig.product_name_plural.toLowerCase()}, orders…`}
                  className="w-80 pl-10 bg-white/5 border-gray-800 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-white/10 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-sm font-bold">
                  {(adminUser?.full_name || adminUser?.username || "A").charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{adminUser?.full_name || adminUser?.username || "Admin"}</p>
                  <p className="text-xs text-gray-500 capitalize">{adminUser?.role?.replace("_", " ") || "Administrator"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
