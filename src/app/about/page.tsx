"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  MessageCircle, 
  Users, 
  Award, 
  Shield, 
  Zap,
  Heart,
  Target,
  CheckCircle2,
  Star,
  MapPin,
  Calendar,
  TrendingUp,
  Sparkles,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getWhatsAppLink } from "@/lib/utils";
import { useBusiness } from "@/contexts/BusinessContext";

interface Settings {
  store_name?: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp_number?: string;
  logo_url?: string;
}

const values = [
  {
    icon: Shield,
    title: "Quality First",
    description: "Every item goes through our rigorous quality check before listing.",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: Heart,
    title: "Customer Obsessed",
    description: "Your satisfaction is our priority. We go above and beyond to ensure you're happy.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    description: "Quick responses and dependable service, every time.",
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    icon: Target,
    title: "Best Prices",
    description: "We guarantee the best prices or we'll match any competitor's price.",
    gradient: "from-blue-500 to-cyan-600",
  },
];

export default function AboutPage() {
  const biz = useBusiness();
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const storeName = settings?.store_name || biz.display_name || biz.name || "Our Store";
  const tagline = settings?.tagline || `Premium ${biz.product_name_plural} — Quality Guaranteed`;
  const address = settings?.address || "";
  const phone = settings?.phone || "";
  const email = settings?.email || "";
  const whatsappNum = settings?.whatsapp_number || "919999999999";

  // Hero stats from business config
  const heroStats = [
    { value: biz.hero_stat_1_value || "1,000+", label: biz.hero_stat_1_label || `${biz.product_name_plural} Sold` },
    { value: biz.hero_stat_2_value || "500+", label: biz.hero_stat_2_label || "Happy Customers" },
    { value: biz.hero_stat_3_value || "5+", label: biz.hero_stat_3_label || "Years Experience" },
    { value: biz.hero_stat_4_value || "< 2%", label: biz.hero_stat_4_label || "Return Rate" },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="orb orb-cyan w-[500px] h-[500px] -top-48 -right-48" />
        <div className="orb orb-orange w-[400px] h-[400px] bottom-20 -left-48" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={storeName} className="h-8 w-auto" />
            ) : (
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-xl">
                <Store className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="text-xl font-bold">{storeName}</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <Link href="/phones" className="text-gray-400 hover:text-white transition-colors">{biz.product_name_plural}</Link>
            <Link href="/about" className="text-orange-500 font-medium">About</Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
          </nav>

          <a href={getWhatsAppLink(whatsappNum)} target="_blank" rel="noopener noreferrer">
            <Button className="btn-futuristic bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 rounded-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/30 mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              About Us
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {storeName}
              <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Our Story
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {heroStats.map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 text-center card-hover-effect">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  {[TrendingUp, Users, Calendar, Award][i] && (() => {
                    const icons = [TrendingUp, Users, Calendar, Award];
                    const Icon = icons[i];
                    return <Icon className="w-7 h-7 text-orange-500" />;
                  })()}
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/30 mb-4">
                Our Story
              </Badge>
              <h2 className="text-4xl font-bold mb-6">
                Started with a Simple <span className="text-orange-500">Vision</span>
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  We started {storeName} with a simple mission: make quality {biz.product_name_plural.toLowerCase()} accessible to everyone at fair prices.
                </p>
                <p>
                  Built on three pillars: <span className="text-white">Quality</span>,{" "}
                  <span className="text-white">Transparency</span>, and{" "}
                  <span className="text-white">Trust</span>.
                </p>
                {address && (
                  <p>
                    Located at <span className="text-white">{address}</span> — visit us anytime!
                  </p>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="gradient-border rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-2xl p-6 text-center">
                    <div className="text-5xl mb-3">🏪</div>
                    <p className="font-semibold">Our Store</p>
                    <p className="text-xs text-gray-500">{address || storeName}</p>
                  </div>
                  <div className="glass rounded-2xl p-6 text-center">
                    <div className="text-5xl mb-3">🤝</div>
                    <p className="font-semibold">Customer First</p>
                    <p className="text-xs text-gray-500">Always &amp; Forever</p>
                  </div>
                  <div className="glass rounded-2xl p-6 text-center">
                    <div className="text-5xl mb-3">✅</div>
                    <p className="font-semibold">Quality Assured</p>
                    <p className="text-xs text-gray-500">Every item checked</p>
                  </div>
                  <div className="glass rounded-2xl p-6 text-center">
                    <div className="text-5xl mb-3">🛡️</div>
                    <p className="font-semibold">Warranty Included</p>
                    <p className="text-xs text-gray-500">Peace of Mind</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30 mb-4">
              What We Stand For
            </Badge>
            <h2 className="text-4xl font-bold">Our <span className="text-orange-500">Values</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 card-hover-effect">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            
            <div className="relative px-8 py-16 text-center">
              <h2 className="text-4xl font-bold mb-4">Ready to Experience the Difference?</h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                {biz.whatsapp_cta_label || `Chat with us on WhatsApp or visit our store.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={getWhatsAppLink(whatsappNum)} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6 rounded-2xl">
                    <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                    Chat Now
                  </Button>
                </a>
                <Link href="/contact">
                  <Button variant="outline" className="border-white/30 bg-transparent hover:bg-white/10 text-white text-lg px-8 py-6 rounded-2xl">
                    <MapPin className="w-5 h-5 mr-2" />
                    Visit Store
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
