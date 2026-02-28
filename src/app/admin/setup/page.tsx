"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Store,
  Palette,
  Users,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Phone,
  MapPin,
  Mail,
  Globe,
  MessageSquare,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { BUSINESS_TEMPLATES, BusinessTemplate } from "@/lib/business-templates";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface StoreInfo {
  store_name: string;
  tagline: string;
  description: string;
  logo_url: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  whatsapp_number: string;
}

interface AdminAccount {
  full_name: string;
  username: string;
  password: string;
  confirm_password: string;
}

// Built-in theme presets (quick colours for the wizard)
const THEME_PRESETS = [
  { id: "neon-orange",  name: "Neon Orange",    primary: "#f97316", accent: "#06b6d4" },
  { id: "ocean-blue",   name: "Ocean Blue",      primary: "#3b82f6", accent: "#8b5cf6" },
  { id: "forest-green", name: "Forest Green",    primary: "#22c55e", accent: "#06b6d4" },
  { id: "royal-purple", name: "Royal Purple",    primary: "#a855f7", accent: "#ec4899" },
  { id: "crimson-red",  name: "Crimson Red",     primary: "#ef4444", accent: "#f97316" },
  { id: "minimal-dark", name: "Minimal Dark",    primary: "#6b7280", accent: "#9ca3af" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Step indicator
// ─────────────────────────────────────────────────────────────────────────────
function Steps({ current, isNewProfile }: { current: number; isNewProfile: boolean }) {
  const steps = [
    { label: "Business Type",     icon: Store },
    { label: "Store Details",     icon: MapPin },
    { label: "Customize Fields",  icon: SlidersHorizontal },
    { label: "Appearance",        icon: Palette },
    ...(isNewProfile ? [] : [{ label: "Admin Account", icon: Users }]),
  ];
  return (
    <div className="flex items-center gap-2 mb-10 flex-wrap justify-center">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.label} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              active  ? "bg-orange-500 text-white" :
              done    ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                        "bg-white/5 text-gray-500"
            }`}>
              {done ? <CheckCircle className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
              {s.label}
            </div>
            {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-600" />}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Wizard
// ─────────────────────────────────────────────────────────────────────────────
function SetupWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // ?new=1 means create an additional profile (skip admin account step)
  const isNewProfile = searchParams.get("new") === "1";

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step 0 state
  const [selectedTemplate, setSelectedTemplate] = useState<BusinessTemplate>(BUSINESS_TEMPLATES[0]);

  // Step 1 state
  const [storeInfo, setStoreInfo] = useState<StoreInfo>({
    store_name: "",
    tagline: "",
    description: "",
    logo_url: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    whatsapp_number: "",
  });

  // Step 2 state — terminology customisation (pre-filled from template)
  const [terminology, setTerminology] = useState<Partial<BusinessTemplate>>({});

  // Step 3 state
  const [selectedTheme, setSelectedTheme] = useState(THEME_PRESETS[0]);

  // Step 4 state (only for first-time setup)
  const [adminAccount, setAdminAccount] = useState<AdminAccount>({
    full_name: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  const totalSteps = isNewProfile ? 4 : 5; // 0-indexed: steps 0..3 or 0..4

  // Redirect if already set up (unless creating a new profile)
  useEffect(() => {
    if (isNewProfile) return;
    const check = async () => {
      const res = await fetch("/api/business-config");
      const json = await res.json();
      if (json.success && json.config?.setup_completed) {
        router.push("/admin");
      }
    };
    check();
  }, [router, isNewProfile]);

  // Pre-fill terminology whenever template changes
  useEffect(() => {
    setTerminology({
      product_name_singular: selectedTemplate.product_name_singular,
      product_name_plural: selectedTemplate.product_name_plural,
      category_label: selectedTemplate.category_label,
      subcategory_label: selectedTemplate.subcategory_label,
      variant_label: selectedTemplate.variant_label,
      seller_label: selectedTemplate.seller_label,
      identifier_label: selectedTemplate.identifier_label,
      order_prefix: selectedTemplate.order_prefix,
      primary_categories: selectedTemplate.primary_categories,
      use_condition_grades: selectedTemplate.use_condition_grades,
      use_battery_health: selectedTemplate.use_battery_health,
      enable_imei_check: selectedTemplate.enable_imei_check,
      enable_leads_module: selectedTemplate.enable_leads_module,
      enable_marketing_module: selectedTemplate.enable_marketing_module,
      enable_whatsapp_ai: selectedTemplate.enable_whatsapp_ai,
      gst_enabled: selectedTemplate.gst_enabled,
      gst_rate: selectedTemplate.gst_rate,
    });
    setStoreInfo((prev) => ({
      ...prev,
      tagline: prev.tagline || `Premium ${selectedTemplate.product_name_plural} — Quality Guaranteed`,
    }));
  }, [selectedTemplate]);

  // ─────────────────────────────────────────────────────────────────────────
  // Navigation helpers
  // ─────────────────────────────────────────────────────────────────────────
  const canProceed = (): boolean => {
    if (step === 0) return true;
    if (step === 1) return storeInfo.store_name.trim().length > 0;
    if (step === 2) return true; // terminology — all optional
    if (step === 3) return true; // appearance
    if (step === 4) {            // admin account (first-time only)
      return (
        adminAccount.full_name.trim().length > 0 &&
        adminAccount.username.trim().length > 0 &&
        adminAccount.password.length >= 6 &&
        adminAccount.password === adminAccount.confirm_password
      );
    }
    return false;
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Final submit
  // ─────────────────────────────────────────────────────────────────────────
  const handleFinish = async () => {
    if (!canProceed()) return;
    setSaving(true);

    try {
      // Merge template with overridden terminology
      const configPayload = {
        ...selectedTemplate,
        ...terminology,
        display_name: storeInfo.store_name || selectedTemplate.name,
        setup_completed: true,
        setup_completed_at: new Date().toISOString(),
      };

      // For new profile: POST to /api/profiles; first-time: POST to /api/business-config
      const configUrl = isNewProfile ? "/api/profiles" : "/api/business-config";
      const configRes = await fetch(configUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configPayload),
      });
      const configJson = await configRes.json();
      if (!configRes.ok) throw new Error(configJson.error || "Failed to save business config");

      const newProfileId: string | undefined = isNewProfile
        ? configJson.profile?.id
        : configJson.config?.id;

      // Save store settings
      const settingsRes = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...storeInfo,
          theme_config: {
            mode: "dark",
            admin: { primaryColor: selectedTheme.primary, accentColor: selectedTheme.accent, sidebarStyle: "glass" },
            website: {
              primaryColor: selectedTheme.primary,
              secondaryColor: selectedTheme.accent,
              backgroundColor: "#030712",
              heroStyle: "gradient",
              cardStyle: "glass",
              enableNeonEffects: true,
              enableAnimatedOrbs: true,
              enableGlassmorphism: true,
              borderRadius: "lg",
              fontFamily: "geist",
            },
            preset: selectedTheme.id,
          },
          welcome_message: `Welcome to ${storeInfo.store_name}! How can we help you today?`,
          agent_name: `${storeInfo.store_name} Assistant`,
          ai_auto_reply: selectedTemplate.enable_whatsapp_ai,
        }),
      });
      if (!settingsRes.ok) throw new Error("Failed to save settings");

      // Create admin user only on first-time setup
      if (!isNewProfile && adminAccount.username && adminAccount.password) {
        const adminRes = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: adminAccount.full_name,
            username: adminAccount.username,
            password: adminAccount.password,
            role: "super_admin",
            is_active: true,
          }),
        });
        if (!adminRes.ok) {
          const err = await adminRes.json();
          console.warn("Admin user creation warning:", err);
        }
      }

      // Switch to the newly created profile
      if (newProfileId) {
        await fetch("/api/profiles/switch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile_id: newProfileId }),
        });
      }

      toast.success(isNewProfile ? "New profile created! 🎉" : "Setup complete! Welcome to your CRM 🎉");
      setTimeout(() => router.push("/admin"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-start px-4 py-12">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          First-time Setup
        </div>
        <h1 className="text-4xl font-bold mb-2">Set Up Your CRM</h1>
        <p className="text-gray-400 text-lg">Answer a few questions and your CRM will be ready in minutes.</p>
      </div>

      {/* Step Indicator */}
      <div className="relative z-10 w-full max-w-3xl">
        <Steps current={step} isNewProfile={isNewProfile} />

        {/* ─── Step 0: Business Type ─── */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">What kind of business do you run?</h2>
            <p className="text-gray-400 mb-6">Choose the template that best fits your business. You can customise everything later.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BUSINESS_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-200 ${
                    selectedTemplate.id === t.id
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-gray-800 bg-white/3 hover:border-gray-600 hover:bg-white/5"
                  }`}
                >
                  <div className="text-3xl mb-3">{t.icon}</div>
                  <div className="font-semibold text-sm mb-1">{t.name}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{t.description}</div>
                  {selectedTemplate.id === t.id && (
                    <div className="mt-3">
                      <Badge className="bg-orange-500 text-white border-0 text-xs">Selected</Badge>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Template preview */}
            <div className="mt-6 p-5 rounded-2xl border border-gray-800 bg-white/3">
              <p className="text-sm text-gray-400 mb-3 font-medium">Preview: how terminology will appear in your CRM</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                {[
                  ["Products called", selectedTemplate.product_name_plural],
                  [selectedTemplate.category_label, selectedTemplate.primary_categories.slice(0, 3).join(", ") + "…"],
                  ["ID / Tracking", selectedTemplate.identifier_label],
                  ["Order prefix", selectedTemplate.order_prefix + "YYMM####"],
                ].map(([label, val]) => (
                  <div key={label} className="bg-white/5 rounded-xl p-3">
                    <div className="text-gray-500 text-xs mb-1">{label}</div>
                    <div className="font-semibold text-white">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 1: Store Details ─── */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Tell us about your store</h2>
            <p className="text-gray-400 mb-6">This information will appear on your public website and invoices.</p>
            <div className="grid gap-5">
              {/* Logo */}
              <div>
                <Label>Store Logo URL</Label>
                <div className="mt-2 flex gap-3 items-center">
                  {storeInfo.logo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={storeInfo.logo_url} alt="logo" className="w-12 h-12 rounded-xl object-cover border border-gray-800" />
                  )}
                  <Input
                    value={storeInfo.logo_url}
                    onChange={(e) => setStoreInfo((p) => ({ ...p, logo_url: e.target.value }))}
                    placeholder="Paste a logo image URL or upload via Settings later"
                    className="bg-white/5 border-gray-800 rounded-xl"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">You can upload a logo from Settings → Store Info after setup.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Store Name *</Label>
                  <div className="relative mt-1">
                    <Store className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <Input
                      value={storeInfo.store_name}
                      onChange={(e) => setStoreInfo((p) => ({ ...p, store_name: e.target.value }))}
                      placeholder="e.g. QuickMobiles Delhi"
                      className="pl-9 bg-white/5 border-gray-800 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <Label>Tagline</Label>
                  <Input
                    value={storeInfo.tagline}
                    onChange={(e) => setStoreInfo((p) => ({ ...p, tagline: e.target.value }))}
                    placeholder="e.g. Quality Phones at Best Prices"
                    className="mt-1 bg-white/5 border-gray-800 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label>Short Description</Label>
                <Textarea
                  value={storeInfo.description}
                  onChange={(e) => setStoreInfo((p) => ({ ...p, description: e.target.value }))}
                  placeholder="A brief description of your business for the website..."
                  rows={3}
                  className="mt-1 bg-white/5 border-gray-800 rounded-xl resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <Input
                      value={storeInfo.phone}
                      onChange={(e) => setStoreInfo((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="pl-9 bg-white/5 border-gray-800 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <Label>WhatsApp Number</Label>
                  <div className="relative mt-1">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <Input
                      value={storeInfo.whatsapp_number}
                      onChange={(e) => setStoreInfo((p) => ({ ...p, whatsapp_number: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="pl-9 bg-white/5 border-gray-800 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <Input
                      value={storeInfo.email}
                      onChange={(e) => setStoreInfo((p) => ({ ...p, email: e.target.value }))}
                      placeholder="hello@yourstore.com"
                      className="pl-9 bg-white/5 border-gray-800 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <Label>Website</Label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <Input
                      value={storeInfo.website}
                      onChange={(e) => setStoreInfo((p) => ({ ...p, website: e.target.value }))}
                      placeholder="https://yourstore.com"
                      className="pl-9 bg-white/5 border-gray-800 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Store Address</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <Textarea
                    value={storeInfo.address}
                    onChange={(e) => setStoreInfo((p) => ({ ...p, address: e.target.value }))}
                    placeholder="Shop 12, Main Market, City - 110001"
                    rows={2}
                    className="pl-9 bg-white/5 border-gray-800 rounded-xl resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 2: Customize Fields ─── */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Customize your fields &amp; features</h2>
            <p className="text-gray-400 mb-6">
              These defaults come from the <strong className="text-white">{selectedTemplate.name}</strong> template. Adjust them to match your exact workflow.
            </p>

            {/* Terminology */}
            <div className="mb-6 p-5 rounded-2xl border border-gray-800 bg-white/3">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Terminology</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {([
                  ["product_name_singular", "Product (singular)", "e.g. Phone, Car, Book"],
                  ["product_name_plural",   "Product (plural)",   "e.g. Phones, Cars, Books"],
                  ["category_label",        "Category label",     "e.g. Brand, Make, Genre"],
                  ["subcategory_label",     "Sub-category label", "e.g. Model, Series"],
                  ["variant_label",         "Variant label",      "e.g. Color, Size, Edition"],
                  ["seller_label",          "Seller label",       "e.g. Seller, Supplier, Dealer"],
                  ["identifier_label",      "ID / tracking field","e.g. IMEI, VIN, ISBN"],
                  ["order_prefix",          "Order prefix",       "e.g. INV, ORD, SALE"],
                ] as [keyof BusinessTemplate, string, string][]).map(([key, label, placeholder]) => (
                  <div key={key}>
                    <Label className="text-xs text-gray-400">{label}</Label>
                    <Input
                      value={String(terminology[key] ?? "")}
                      onChange={(e) => setTerminology((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="mt-1 bg-white/5 border-gray-700 rounded-xl text-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Label className="text-xs text-gray-400">Primary categories (comma-separated)</Label>
                <Textarea
                  value={(terminology.primary_categories ?? []).join(", ")}
                  onChange={(e) =>
                    setTerminology((p) => ({
                      ...p,
                      primary_categories: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    }))
                  }
                  placeholder="Apple, Samsung, Xiaomi, OnePlus"
                  rows={2}
                  className="mt-1 bg-white/5 border-gray-700 rounded-xl text-sm resize-none"
                />
              </div>
            </div>

            {/* Feature toggles */}
            <div className="p-5 rounded-2xl border border-gray-800 bg-white/3">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">Features &amp; modules</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {([
                  ["use_condition_grades",      "Condition grades (A+, A, B…)"],
                  ["use_battery_health",         "Battery health tracking"],
                  ["enable_imei_check",          "IMEI / serial verification"],
                  ["enable_leads_module",        "Leads &amp; enquiry module"],
                  ["enable_marketing_module",    "Marketing &amp; campaigns"],
                  ["enable_whatsapp_ai",         "WhatsApp AI auto-reply"],
                  ["gst_enabled",                "GST billing"],
                ] as [keyof BusinessTemplate, string][]).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between gap-3">
                    <Label
                      className="text-sm text-gray-300 cursor-pointer"
                      htmlFor={`toggle-${key}`}
                      dangerouslySetInnerHTML={{ __html: label }}
                    />
                    <Switch
                      id={`toggle-${key}`}
                      checked={Boolean(terminology[key] ?? false)}
                      onCheckedChange={(val) => setTerminology((p) => ({ ...p, [key]: val }))}
                    />
                  </div>
                ))}
              </div>

              {/* GST rate — only show when GST enabled */}
              {terminology.gst_enabled && (
                <div className="mt-4">
                  <Label className="text-xs text-gray-400">GST rate (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={String(terminology.gst_rate ?? 18)}
                    onChange={(e) => setTerminology((p) => ({ ...p, gst_rate: Number(e.target.value) }))}
                    className="mt-1 w-32 bg-white/5 border-gray-700 rounded-xl text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Step 3: Appearance ─── */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Choose your look</h2>
            <p className="text-gray-400 mb-6">Pick a colour preset. You can customise every detail later in Settings → Appearance.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedTheme(preset)}
                  className={`relative p-5 rounded-2xl border transition-all duration-200 text-left ${
                    selectedTheme.id === preset.id
                      ? "border-white/40 bg-white/10"
                      : "border-gray-800 bg-white/3 hover:border-gray-600"
                  }`}
                >
                  <div className="flex gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full" style={{ background: preset.primary }} />
                    <div className="w-7 h-7 rounded-full" style={{ background: preset.accent }} />
                  </div>
                  <div className="text-sm font-medium">{preset.name}</div>
                  {selectedTheme.id === preset.id && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Live preview strip */}
            <div className="mt-6 p-5 rounded-2xl border border-gray-800 overflow-hidden">
              <p className="text-sm text-gray-400 mb-4">Preview</p>
              <div
                className="rounded-xl p-5"
                style={{ background: `linear-gradient(135deg, ${selectedTheme.primary}22, ${selectedTheme.accent}22)`, border: `1px solid ${selectedTheme.primary}44` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold" style={{ background: selectedTheme.primary }}>
                    {selectedTemplate.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{storeInfo.store_name || "Your Store Name"}</div>
                    <div className="text-xs" style={{ color: selectedTheme.primary }}>{storeInfo.tagline || "Your tagline here"}</div>
                  </div>
                </div>
                <div
                  className="text-xs text-white px-3 py-1.5 rounded-lg inline-block"
                  style={{ background: selectedTheme.primary }}
                >
                  Browse {selectedTemplate.product_name_plural}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Step 4: Admin Account ─── */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Create your admin account</h2>
            <p className="text-gray-400 mb-6">This will be the super-admin account. You can add more team members later.</p>
            <div className="grid gap-5">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={adminAccount.full_name}
                  onChange={(e) => setAdminAccount((p) => ({ ...p, full_name: e.target.value }))}
                  placeholder="Rajesh Kumar"
                  className="mt-1 bg-white/5 border-gray-800 rounded-xl"
                />
              </div>
              <div>
                <Label>Username *</Label>
                <Input
                  value={adminAccount.username}
                  onChange={(e) => setAdminAccount((p) => ({ ...p, username: e.target.value.toLowerCase().replace(/\s/g, "") }))}
                  placeholder="admin"
                  className="mt-1 bg-white/5 border-gray-800 rounded-xl"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Password * (min 6 characters)</Label>
                  <Input
                    type="password"
                    value={adminAccount.password}
                    onChange={(e) => setAdminAccount((p) => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••"
                    className="mt-1 bg-white/5 border-gray-800 rounded-xl"
                  />
                </div>
                <div>
                  <Label>Confirm Password *</Label>
                  <Input
                    type="password"
                    value={adminAccount.confirm_password}
                    onChange={(e) => setAdminAccount((p) => ({ ...p, confirm_password: e.target.value }))}
                    placeholder="••••••••"
                    className={`mt-1 bg-white/5 border-gray-800 rounded-xl ${
                      adminAccount.confirm_password && adminAccount.password !== adminAccount.confirm_password
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {adminAccount.confirm_password && adminAccount.password !== adminAccount.confirm_password && (
                    <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div className="mt-8 p-5 rounded-2xl border border-gray-800 bg-white/3">
              <p className="text-sm font-medium mb-3 text-gray-300">Setup Summary</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Business Type", `${selectedTemplate.icon} ${selectedTemplate.name}`],
                  ["Store Name", storeInfo.store_name || "—"],
                  ["Products", selectedTemplate.product_name_plural],
                  ["Theme", selectedTheme.name],
                  ["Order Prefix", selectedTemplate.order_prefix],
                  ["GST", selectedTemplate.gst_enabled ? `${selectedTemplate.gst_rate}%` : "Disabled"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-gray-500">{k}: </span>
                      <span className="text-white">{v}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Navigation ─── */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < totalSteps - 1 ? (
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="bg-green-500 hover:bg-green-600 text-white px-8"
              onClick={handleFinish}
              disabled={!canProceed() || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up…
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Finish Setup
                </>
              )}
            </Button>
          )}
        </div>

        {/* Skip link for existing installs */}
        <div className="text-center mt-4">
          <button
            onClick={() => router.push("/admin")}
            className="text-xs text-gray-600 hover:text-gray-400 underline"
          >
            Skip — I already have an account
          </button>
        </div>
      </div>
    </div>
  );
}
// Suspense boundary required because SetupWizard calls useSearchParams
export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    }>
      <SetupWizard />
    </Suspense>
  );
}