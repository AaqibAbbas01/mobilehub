"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Package, 
  MessageCircle, 
  Search, 
  Grid3X3,
  Battery,
  ArrowRight,
  Loader2,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice, getWhatsAppLink, getConditionColor } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useBusiness } from "@/contexts/BusinessContext";

interface ProductItem {
  id: string;
  brand: string;
  model_name: string;
  variant: string | null;
  color: string | null;
  condition_grade: string;
  battery_health_percent: number | null;
  selling_price: number;
  original_mrp: number | null;
  images: string[] | null;
  status: string;
}

const gradients = [
  "from-violet-600 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-red-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-pink-500 to-rose-500",
  "from-yellow-500 to-amber-500",
];

export default function PhonesPage() {
  const biz = useBusiness();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [settings, setSettings] = useState<{ store_name?: string; whatsapp_number?: string } | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch {
      // ignore
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from("phones")
        .select("*")
        .eq("status", "Available")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const whatsappNum = settings?.whatsapp_number || "919999999999";
  const storeName = settings?.store_name || biz.store_name || "Our Store";
  const categories = biz.primary_categories || [];
  const conditionLabels: Record<string, string> = biz.condition_labels || {};

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.brand === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.selling_price - b.selling_price;
      case "price_high":
        return b.selling_price - a.selling_price;
      default:
        return 0;
    }
  });

  const getGradient = (index: number) => gradients[index % gradients.length];

  return (
    <div className="min-h-screen bg-[#030712]">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-xl">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">{storeName}</span>
            </Link>
            <a href={getWhatsAppLink(whatsappNum, `Hi, I'm looking for ${biz.product_name_plural.toLowerCase()}`)}>
              <Button className="btn-futuristic rounded-xl">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder={`Search ${biz.product_name_plural.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-gray-800 rounded-xl"
              />
            </div>
            {categories.length > 0 && (
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 bg-white/5 border-gray-800 rounded-xl">
                  <SelectValue placeholder={`All ${biz.category_label}s`} />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="all">All {biz.category_label}s</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-white/5 border-gray-800 rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {loading ? "Loading..." : `${sortedProducts.length} ${biz.product_name_plural} Available`}
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchProducts} className="mt-4">Retry</Button>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20">
            <Grid3X3 className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No {biz.product_name_plural.toLowerCase()} found</h3>
            <p className="text-gray-500">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product, index) => {
              const price = product.selling_price;
              const originalPrice = product.original_mrp || null;
              const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;
              const condLabel = conditionLabels[product.condition_grade] || product.condition_grade;

              return (
                <Link key={product.id} href={`/phones/${product.id}`}>
                  <div className="glass-card rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                    {/* Image */}
                    <div className={`relative aspect-square bg-gradient-to-br ${getGradient(index)}`}>
                      {product.images?.[0] ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.model_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-24 h-24 text-white/30" />
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {biz.use_condition_grades && (
                          <Badge className={`${getConditionColor(condLabel)} border-0`}>
                            {condLabel}
                          </Badge>
                        )}
                        {discount > 0 && (
                          <Badge className="bg-green-500/90 text-white border-0">
                            -{discount}% OFF
                          </Badge>
                        )}
                      </div>

                      {/* Battery */}
                      {biz.use_battery_health && product.battery_health_percent && (
                        <div className="absolute bottom-3 right-3 glass rounded-full px-3 py-1 flex items-center gap-1">
                          <Battery className="w-3 h-3 text-green-500" />
                          <span className="text-xs font-medium">{product.battery_health_percent}%</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-xs text-orange-500 font-medium mb-1">{product.brand}</p>
                      <h3 className="font-bold text-lg mb-1 truncate">{product.model_name}</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {product.variant || ""} {product.color ? `• ${product.color}` : ""}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-orange-500">{formatPrice(price)}</span>
                          {originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {formatPrice(originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                          <ArrowRight className="w-4 h-4 text-orange-500 group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* WhatsApp Float */}
      <a
        href={getWhatsAppLink(whatsappNum, `Hi, I want to know about available ${biz.product_name_plural.toLowerCase()}`)}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>
      </a>
    </div>
  );
}
