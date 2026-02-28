"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Phone, 
  MessageCircle, 
  Shield, 
  Award, 
  Zap, 
  ChevronRight, 
  Star,
  Cpu,
  Battery,
  Camera,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Clock,
  Smartphone,
  Menu,
  X,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getWhatsAppLink } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useBusinessConfig } from "@/contexts/BusinessContext";

interface PhoneItem {
  id: string;
  brand: string;
  model_name: string;
  variant: string;
  selling_price: number;
  original_mrp: number;
  condition_grade: string;
  battery_health_percent: number;
  images: string[];
  status: string;
}

const brandGradients: Record<string, string> = {
  "Apple": "from-violet-600 to-purple-600",
  "Samsung": "from-cyan-500 to-blue-600",
  "OnePlus": "from-red-500 to-orange-500",
  "Google": "from-emerald-500 to-teal-500",
  "Xiaomi": "from-orange-500 to-yellow-500",
  "Vivo": "from-blue-500 to-indigo-600",
  "Oppo": "from-green-500 to-emerald-600",
  "Realme": "from-yellow-500 to-orange-500",
  "default": "from-gray-500 to-gray-700",
};

export default function HomePage() {
  const { config: biz } = useBusinessConfig();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [featuredPhones, setFeaturedPhones] = useState<PhoneItem[]>([]);
  const [loadingPhones, setLoadingPhones] = useState(true);
  const [settings, setSettings] = useState<{ store_name?: string; tagline?: string; whatsapp_number?: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load store settings (name, whatsapp)
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => { if (d.success) setSettings(d.settings); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchFeaturedPhones = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("phones")
          .select("*")
          .eq("status", "Available")
          .order("created_at", { ascending: false })
          .limit(4);

        if (error) throw error;
        setFeaturedPhones(data || []);
      } catch (err) {
        console.error("Error fetching phones:", err);
      } finally {
        setLoadingPhones(false);
      }
    };

    fetchFeaturedPhones();
  }, []);

  const storeName  = settings?.store_name  || "My Store";
  const whatsappNum = settings?.whatsapp_number?.replace(/\D/g, "") || "";
  const productPlural = biz.product_name_plural || "Products";
  const heroStats = [
    { label: biz.hero_stat_1_label, value: biz.hero_stat_1_value, icon: Smartphone },
    { label: biz.hero_stat_2_label, value: biz.hero_stat_2_value, icon: Users },
    { label: biz.hero_stat_3_label, value: biz.hero_stat_3_value, icon: Award },
    { label: biz.hero_stat_4_label, value: biz.hero_stat_4_value, icon: Shield },
  ];
  const categoryList = ((biz.primary_categories as string[]) || []).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="orb orb-orange w-[500px] h-[500px] -top-48 -right-48" />
        <div className="orb orb-cyan w-[400px] h-[400px] top-1/2 -left-48" />
        <div className="orb orb-purple w-[600px] h-[600px] -bottom-48 right-1/4" />
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 ? 'glass py-3' : 'py-5'
      }`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-xl">
                <Phone className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">{storeName}</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: "Home",            href: "/" },
              { label: `All ${productPlural}`, href: "/phones" },
              { label: biz.category_label + "s", href: "/brands" },
              { label: "About",           href: "/about" },
              { label: "Contact",         href: "/contact" },
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="relative text-gray-300 hover:text-white font-medium transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {whatsappNum && (
              <a href={getWhatsAppLink(whatsappNum)} target="_blank" rel="noopener noreferrer" className="hidden sm:block">
                <Button className="btn-futuristic bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 rounded-full px-6">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </a>
            )}
            <Link href="/admin" className="hidden md:block">
              <Button variant="outline" className="border-gray-700 bg-transparent hover:bg-white/5 rounded-full text-gray-300 hover:text-white">
                Admin
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden glass mt-2 mx-4 rounded-2xl p-6 space-y-4">
            {[
              { label: "Home",                   href: "/" },
              { label: `All ${productPlural}`,   href: "/phones" },
              { label: biz.category_label + "s", href: "/brands" },
              { label: "About",                  href: "/about" },
              { label: "Contact",                href: "/contact" },
              { label: "Admin Dashboard",        href: "/admin" },
            ].map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="block text-gray-300 hover:text-orange-500 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-orange-500/30">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-300">{settings?.tagline || `Quality ${productPlural} — Guaranteed`}</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block">Premium</span>
                <span className="block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  {productPlural}
                </span>
                <span className="block">at Best Prices</span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-lg">
                Get quality {productPlural.toLowerCase()} at unbeatable prices. Every item is verified, certified, and comes with warranty.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/phones">
                  <Button className="btn-futuristic bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg px-8 py-6 rounded-2xl border-0">
                    Browse {productPlural}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                {whatsappNum && (
                  <a href={getWhatsAppLink(whatsappNum)} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="text-lg px-8 py-6 rounded-2xl border-gray-700 bg-transparent hover:bg-white/5 text-white">
                      <MessageCircle className="w-5 h-5 mr-2 text-green-500" />
                      Quick Inquiry
                    </Button>
                  </a>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-4">
                {[
                  { icon: Shield, label: "6-Month Warranty" },
                  { icon: CheckCircle2, label: "Verified Devices" },
                  { icon: Zap, label: "Same Day Delivery" },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400">
                    <badge.icon className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Phone Display */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-[3rem] blur-3xl opacity-20 scale-110" />
                
                {/* Phone Frame */}
                <div className="relative gradient-border p-8 rounded-[2.5rem]">
                  <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-[2rem] p-6 w-72 h-[500px] flex flex-col items-center justify-center">
                    {/* Screen Content */}
                    <div className="text-center space-y-4">
                      <div className="text-8xl float-animation">📱</div>
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">iPhone 15 Pro</p>
                        <p className="text-orange-500 text-3xl font-bold">₹89,999</p>
                        <p className="text-gray-500 line-through">₹1,59,900</p>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          Save 44%
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full" />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -right-4 top-20 glass-card p-4 rounded-2xl float-animation" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Verified</p>
                      <p className="text-xs text-gray-500">Quality Checked</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -left-4 bottom-32 glass-card p-4 rounded-2xl float-animation" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Battery className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">95% Health</p>
                      <p className="text-xs text-gray-500">Battery Status</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {heroStats.map((stat, i) => (
              <div 
                key={i} 
                className="glass-card rounded-2xl p-6 text-center card-hover-effect"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-orange-500" />
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

      {/* Featured Products */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/30 mb-4">
                <TrendingUp className="w-3 h-3 mr-1" />
                Hot Deals
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold">
                Featured <span className="text-orange-500">{productPlural}</span>
              </h2>
              <p className="text-gray-400 mt-2">Hand-picked deals with maximum savings</p>
            </div>
            <Link href="/phones">
              <Button variant="outline" className="border-gray-700 bg-transparent hover:bg-white/5 rounded-full group">
                View All
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingPhones ? (
              <div className="col-span-full flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              </div>
            ) : featuredPhones.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <Smartphone className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No {productPlural.toLowerCase()} available yet. Check back soon!</p>
              </div>
            ) : (
              featuredPhones.map((phone) => (
                <Link href={`/phones/${phone.id}`} key={phone.id}>
                  <div className="glass-card rounded-3xl overflow-hidden group card-hover-effect h-full">
                    {/* Card Header with Gradient */}
                    <div className={`relative h-48 bg-gradient-to-br ${brandGradients[phone.brand] || brandGradients.default} p-6 flex items-center justify-center`}>
                      <div className="absolute inset-0 bg-black/20" />
                      {phone.images && phone.images[0] ? (
                        <img 
                          src={phone.images[0]} 
                          alt={phone.model_name}
                          className="h-full w-auto object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform duration-500">
                          📱
                        </span>
                      )}
                      <Badge className="absolute top-4 right-4 bg-black/50 text-white border-0">
                        {phone.condition_grade}
                      </Badge>
                    </div>
                    
                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{phone.brand}</p>
                        <h3 className="text-lg font-bold mt-1">{phone.model_name}</h3>
                        <p className="text-sm text-gray-400">{phone.variant}</p>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded-lg bg-white/5">
                          <Battery className="w-4 h-4 mx-auto text-green-500 mb-1" />
                          <p className="text-xs text-gray-400">{phone.battery_health_percent}%</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white/5">
                          <Camera className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                          <p className="text-xs text-gray-400">Camera</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white/5">
                          <Cpu className="w-4 h-4 mx-auto text-purple-500 mb-1" />
                          <p className="text-xs text-gray-400 truncate">{phone.brand}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-end justify-between pt-2">
                        <div>
                          <p className="text-2xl font-bold text-orange-500">{formatPrice(phone.selling_price)}</p>
                          {phone.original_mrp && (
                            <p className="text-sm text-gray-500 line-through">{formatPrice(phone.original_mrp)}</p>
                          )}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Shop by <span className="text-orange-500">{biz.category_label}</span></h2>
            <p className="text-gray-400">All major {biz.category_label.toLowerCase()}s available with warranty</p>
          </div>

          <div className={`grid gap-4 ${categoryList.length <= 3 ? "grid-cols-3" : "grid-cols-3 md:grid-cols-6"}`}>
            {categoryList.map((cat) => (
              <Link href={`/phones?brand=${cat}`} key={cat}>
                <div className="glass-card rounded-2xl p-6 text-center card-hover-effect">
                  <span className="text-4xl block mb-3">
                    {brandGradients[cat] ? "📦" : "📦"}
                  </span>
                  <p className="font-medium text-sm">{cat}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="gradient-border rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/30 mb-6">
                  Why {storeName}?
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  The Smartest Way to Buy <span className="text-orange-500">{productPlural}</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  We&apos;ve built a trusted platform for quality {productPlural.toLowerCase()} with rigorous quality checks, transparent pricing, and a customer-first approach.
                </p>
                
                <div className="space-y-6">
                  {[
                    { icon: Shield, title: "Warranty Included", desc: "Coverage on all purchases" },
                    { icon: CheckCircle2, title: "Quality Checked", desc: "Every item thoroughly inspected" },
                    { icon: Zap, title: "Fast Delivery", desc: "Quick delivery available" },
                    { icon: Award, title: "Best Price Guarantee", desc: "Competitive pricing always" },
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                        <p className="text-gray-400">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="glass-card rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {['😊', '😃', '🤩', '😍'].map((emoji, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-lg">
                          {emoji}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-400">12,500+ happy customers</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="glass rounded-xl p-4">
                      <p className="text-sm text-gray-300">&ldquo;Best place to buy second-hand phones in Delhi! Got my iPhone at half price with warranty.&rdquo;</p>
                      <p className="text-xs text-gray-500 mt-2">— Rahul S., Karol Bagh</p>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <p className="text-sm text-gray-300">&ldquo;Bahut accha experience tha. Phone ekdum naya jaisa mil gaya. 100% recommend!&rdquo;</p>
                      <p className="text-xs text-gray-500 mt-2">— Priya M., Connaught Place</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-400">Gaffar Market, Karol Bagh</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-400">Open Now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600" />
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            
            <div className="relative px-8 py-16 md:py-24 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Get Your {biz.product_name_singular}?
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                {biz.enable_whatsapp_ai
                  ? "Message us on WhatsApp for instant support. Our AI assistant is available 24/7 to help you find the perfect item."
                  : `Browse our collection of quality ${productPlural.toLowerCase()} and find the best deal for you.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {whatsappNum && (
                  <a href={getWhatsAppLink(whatsappNum)} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6 rounded-2xl">
                      <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
                      {biz.whatsapp_cta_label || "Chat on WhatsApp"}
                    </Button>
                  </a>
                )}
                <Link href="/phones">
                  <Button variant="outline" className="border-white/30 bg-transparent hover:bg-white/10 text-white text-lg px-8 py-6 rounded-2xl">
                    Browse {productPlural}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-xl">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">{storeName}</span>
              </Link>
              <p className="text-gray-400 max-w-md mb-6">
                {settings?.tagline || `Quality ${productPlural} — Guaranteed`}
              </p>
              {whatsappNum && (
                <div className="flex gap-4">
                  <a href={getWhatsAppLink(whatsappNum)} target="_blank" rel="noopener noreferrer" 
                    className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-green-500/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                  </a>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: `All ${productPlural}`, href: "/phones" },
                  { label: `${biz.category_label}s`, href: "/brands" },
                  { label: "About Us", href: "/about" },
                  { label: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-orange-500 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <address className="text-gray-400 not-italic space-y-2 text-sm">
                {settings?.address && <p>{settings.address}</p>}
                {settings?.phone && (
                  <p className="pt-2">
                    <a href={`tel:${settings.phone}`} className="hover:text-orange-500">{settings.phone}</a>
                  </p>
                )}
                {settings?.email && (
                  <p>
                    <a href={`mailto:${settings.email}`} className="hover:text-orange-500">{settings.email}</a>
                  </p>
                )}
              </address>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {storeName}. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs">
              Powered by CRM Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
