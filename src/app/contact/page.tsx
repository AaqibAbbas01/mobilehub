"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  MessageCircle, 
  MapPin, 
  Clock, 
  Mail,
  Phone as PhoneIcon,
  Send,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Navigation,
  Instagram,
  Facebook,
  Youtube,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  business_hours?: string;
}

const businessHours = [
  { day: "Monday - Saturday", time: "10:00 AM - 9:00 PM" },
  { day: "Sunday", time: "11:00 AM - 7:00 PM" },
  { day: "Public Holidays", time: "Closed" },
];

export default function ContactPage() {
  const biz = useBusiness();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
  }, []);

  const storeName = settings?.store_name || biz.display_name || biz.name || "Our Store";
  const address = settings?.address || "";
  const phone = settings?.phone || "";
  const email = settings?.email || "";
  const whatsappNum = settings?.whatsapp_number || "919999999999";

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      value: whatsappNum ? `+${whatsappNum}` : "Contact us",
      description: "Fastest response • Available 24/7",
      action: getWhatsAppLink(whatsappNum),
      gradient: "from-green-500 to-emerald-600",
      recommended: true,
    },
    ...(phone ? [{
      icon: PhoneIcon,
      title: "Phone",
      value: phone,
      description: "Call us directly • 10 AM - 9 PM",
      action: `tel:${phone}`,
      gradient: "from-blue-500 to-cyan-600",
      recommended: false,
    }] : []),
    ...(email ? [{
      icon: Mail,
      title: "Email",
      value: email,
      description: "For business inquiries",
      action: `mailto:${email}`,
      gradient: "from-purple-500 to-pink-600",
      recommended: false,
    }] : []),
    ...(address ? [{
      icon: MapPin,
      title: "Visit Us",
      value: address.split(",")[0] || address,
      description: address.split(",").slice(1).join(",").trim() || "",
      action: `https://maps.google.com/?q=${encodeURIComponent(address)}`,
      gradient: "from-orange-500 to-red-600",
      recommended: false,
    }] : []),
  ];

  // Use FAQs from business config, fallback to generic ones
  const faqs = (biz.faqs && biz.faqs.length > 0) ? biz.faqs : [
    {
      question: `Do you provide warranty on ${biz.product_name_plural.toLowerCase()}?`,
      answer: "Yes! We provide warranty on all our products. Please contact us for details on our warranty terms.",
    },
    {
      question: `Can I check the ${biz.product_name_singular.toLowerCase()} before buying?`,
      answer: "Absolutely! We encourage you to visit our store and inspect before purchasing. You can also request a video call for a live demo.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including UPI, bank transfer, credit/debit cards, and cash.",
    },
    {
      question: `Do you buy old ${biz.product_name_plural.toLowerCase()}?`,
      answer: "Yes! We offer competitive prices. Contact us on WhatsApp with details for an instant quote.",
    },
    {
      question: "What is your return policy?",
      answer: "We offer a return policy. Please contact us for full details on terms and conditions.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hi! I'm ${formData.name}.%0A%0A${formData.message}%0A%0AContact: ${formData.phone}%0AEmail: ${formData.email}`;
    window.open(getWhatsAppLink(whatsappNum, message), "_blank");
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="orb orb-purple w-[500px] h-[500px] -top-48 -left-48" />
        <div className="orb orb-cyan w-[400px] h-[400px] bottom-20 -right-48" />
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
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-orange-500 font-medium">Contact</Link>
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
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/30 mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            We&apos;re Here to Help
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Get in <span className="text-orange-500">Touch</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have a question? Want to buy something? Or just want to say hi?
            We&apos;d love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="relative py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, i) => (
              <a
                key={i}
                href={method.action}
                target={method.action.startsWith("http") || method.action.startsWith("https") ? "_blank" : undefined}
                rel={method.action.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <div className="glass-card rounded-2xl p-6 card-hover-effect h-full relative">
                  {method.recommended && (
                    <Badge className="absolute -top-2 -right-2 bg-green-500 text-white border-0 text-xs">
                      Recommended
                    </Badge>
                  )}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.gradient} flex items-center justify-center mb-4`}>
                    <method.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{method.title}</h3>
                  <p className="text-orange-500 font-medium">{method.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{method.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="relative py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-card rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Your Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="bg-white/5 border-gray-800 rounded-xl h-12"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Phone Number</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="bg-white/5 border-gray-800 rounded-xl h-12"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="bg-white/5 border-gray-800 rounded-xl h-12"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Your Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={`I'm interested in...`}
                    className="bg-white/5 border-gray-800 rounded-xl min-h-[150px] resize-none"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full btn-futuristic bg-gradient-to-r from-orange-500 to-red-600 text-white py-6 rounded-xl border-0 text-lg"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send via WhatsApp
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Your message will be sent to our WhatsApp for faster response
                </p>
              </form>
            </div>

            {/* Store Info */}
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl font-bold mb-6">Visit Our Store</h2>
                
                <div className="space-y-4 mb-6">
                  {address && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-semibold">{storeName}</p>
                        <p className="text-gray-400 text-sm whitespace-pre-line">{address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Business Hours</p>
                      <div className="text-sm text-gray-400 space-y-1 mt-1">
                        {businessHours.map((item, i) => (
                          <div key={i} className="flex justify-between gap-4">
                            <span>{item.day}</span>
                            <span className={item.time === "Closed" ? "text-red-400" : "text-green-400"}>
                              {item.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {address && (
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-white/5 hover:bg-white/10 border-0 py-6 rounded-xl">
                      <Navigation className="w-5 h-5 mr-2 text-blue-500" />
                      Get Directions
                    </Button>
                  </a>
                )}
              </div>

              {/* Social Links */}
              <div className="glass-card rounded-2xl p-6">
                <p className="font-semibold mb-4">Follow Us</p>
                <div className="flex gap-4">
                  {[
                    { icon: Instagram, label: "Instagram", color: "hover:bg-pink-500/20 hover:text-pink-500" },
                    { icon: Facebook, label: "Facebook", color: "hover:bg-blue-500/20 hover:text-blue-500" },
                    { icon: Youtube, label: "YouTube", color: "hover:bg-red-500/20 hover:text-red-500" },
                  ].map((social, i) => (
                    <button
                      key={i}
                      className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 transition-all ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/30 mb-4">
              Got Questions?
            </Badge>
            <h2 className="text-4xl font-bold">
              Frequently Asked <span className="text-orange-500">Questions</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between"
                >
                  <span className="font-semibold pr-4">{faq.question}</span>
                  {expandedFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === i && (
                  <div className="px-6 pb-6 text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
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
