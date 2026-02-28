// Business Type Templates
// Each template defines terminology, field visibility, categories, and defaults
// for a specific type of product-based business.

export interface BusinessTemplate {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  color: string; // tailwind color class

  // Product terminology
  product_name_singular: string;
  product_name_plural: string;

  // Identifier (replaces IMEI)
  identifier_label: string;
  identifier_2_label: string;
  identifier_required: boolean;
  identifier_unique: boolean;

  // Field labels
  category_label: string;         // replaces "Brand"
  subcategory_label: string;      // replaces "Model"
  variant_label: string;          // replaces "Storage / RAM"
  seller_label: string;           // replaces "Seller"

  // Condition grade labels
  use_condition_grades: boolean;
  condition_labels: Record<string, string>;

  // Feature flags
  use_battery_health: boolean;
  use_functional_tests: boolean;
  enable_imei_check: boolean;

  // Primary categories (brands/types/makes etc.)
  primary_categories: string[];

  // WhatsApp inquiry template
  whatsapp_cta_label: string;
  whatsapp_inquiry_template: string;

  // Order prefix
  order_prefix: string;

  // Hero stats
  hero_stat_1_value: string;
  hero_stat_1_label: string;
  hero_stat_2_value: string;
  hero_stat_2_label: string;
  hero_stat_3_value: string;
  hero_stat_3_label: string;
  hero_stat_4_value: string;
  hero_stat_4_label: string;

  // Sample FAQs
  faqs: { question: string; answer: string }[];

  // GST
  gst_enabled: boolean;
  gst_rate: number;
  gst_label: string;

  // Module flags
  enable_leads_module: boolean;
  enable_marketing_module: boolean;
  enable_seller_tracking: boolean;
  enable_whatsapp_ai: boolean;
}

export const BUSINESS_TEMPLATES: BusinessTemplate[] = [
  // ─────────────────────────────────────────────────
  // 1. Mobile Phones (default / current)
  // ─────────────────────────────────────────────────
  {
    id: "mobile_phones",
    name: "Mobile Phones",
    description: "Second-hand / refurbished smartphones with IMEI tracking, battery health, and condition grades",
    icon: "📱",
    color: "orange",

    product_name_singular: "Phone",
    product_name_plural: "Phones",

    identifier_label: "IMEI",
    identifier_2_label: "IMEI 2",
    identifier_required: true,
    identifier_unique: true,

    category_label: "Brand",
    subcategory_label: "Model",
    variant_label: "Storage / RAM",
    seller_label: "Seller",

    use_condition_grades: true,
    condition_labels: {
      "A+": "Like New",
      "A":  "Excellent",
      "B+": "Very Good",
      "B":  "Good",
      "C":  "Fair",
      "D":  "Acceptable",
    },
    use_battery_health: true,
    use_functional_tests: true,
    enable_imei_check: true,

    primary_categories: ["Apple", "Samsung", "OnePlus", "Xiaomi", "Vivo", "Oppo", "Realme", "Google", "Nothing", "Motorola", "iQOO", "Poco"],

    whatsapp_cta_label: "Inquire on WhatsApp",
    whatsapp_inquiry_template: "Hi! I'm interested in the {{category}} {{subcategory}} ({{variant}}) listed at {{price}}. Is it still available?",

    order_prefix: "MH",

    hero_stat_1_value: "15,000+",
    hero_stat_1_label: "Phones Sold",
    hero_stat_2_value: "12,500+",
    hero_stat_2_label: "Happy Customers",
    hero_stat_3_value: "8+",
    hero_stat_3_label: "Years Experience",
    hero_stat_4_value: "< 2%",
    hero_stat_4_label: "Warranty Claims",

    faqs: [
      { question: "Do the phones come with warranty?", answer: "Yes! All our phones come with 30-90 days seller warranty. We also offer extended warranty options." },
      { question: "Can I exchange my old phone?", answer: "Yes, we accept phone exchanges. Bring your old phone for evaluation and get a discount on your purchase." },
      { question: "What payment methods do you accept?", answer: "We accept Cash, UPI, Card, EMI and Bank Transfer." },
      { question: "Do you provide home delivery?", answer: "Yes, we offer delivery within Delhi NCR. Courier service available across India." },
    ],

    gst_enabled: true,
    gst_rate: 18,
    gst_label: "GST",

    enable_leads_module: true,
    enable_marketing_module: true,
    enable_seller_tracking: true,
    enable_whatsapp_ai: true,
  },

  // ─────────────────────────────────────────────────
  // 2. Laptops & Computers
  // ─────────────────────────────────────────────────
  {
    id: "laptops",
    name: "Laptops & Computers",
    description: "Refurbished laptops and desktops with serial number tracking and hardware grading",
    icon: "💻",
    color: "blue",

    product_name_singular: "Laptop",
    product_name_plural: "Laptops",

    identifier_label: "Serial Number",
    identifier_2_label: "Service Tag",
    identifier_required: true,
    identifier_unique: true,

    category_label: "Brand",
    subcategory_label: "Model",
    variant_label: "Processor / RAM / Storage",
    seller_label: "Supplier",

    use_condition_grades: true,
    condition_labels: {
      "A+": "Like New – No marks, full accessories",
      "A":  "Excellent – Minor signs of use",
      "B+": "Very Good – Light scratches",
      "B":  "Good – Visible wear, fully working",
      "C":  "Fair – Heavy wear, all functions OK",
      "D":  "For Parts – Issues present",
    },
    use_battery_health: true,
    use_functional_tests: true,
    enable_imei_check: false,

    primary_categories: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "Microsoft", "MSI", "Samsung", "LG"],

    whatsapp_cta_label: "Inquire on WhatsApp",
    whatsapp_inquiry_template: "Hi! I'm interested in the {{category}} {{subcategory}} ({{variant}}) listed at {{price}}. Is it available?",

    order_prefix: "LC",

    hero_stat_1_value: "5,000+",
    hero_stat_1_label: "Laptops Sold",
    hero_stat_2_value: "4,000+",
    hero_stat_2_label: "Happy Customers",
    hero_stat_3_value: "5+",
    hero_stat_3_label: "Years Experience",
    hero_stat_4_value: "6 Mo",
    hero_stat_4_label: "Warranty",

    faqs: [
      { question: "Do laptops come with warranty?", answer: "All laptops come with a minimum 3-month seller warranty. Some models carry original manufacturer warranty." },
      { question: "Can I upgrade RAM or storage?", answer: "Most laptops can be upgraded. Ask our team before purchase for compatibility details." },
      { question: "Do you accept corporate bulk orders?", answer: "Yes, we offer bulk discounts for corporates and institutions. Contact us for pricing." },
      { question: "What payment options are available?", answer: "Cash, UPI, Card, EMI and Bank Transfer accepted." },
    ],

    gst_enabled: true,
    gst_rate: 18,
    gst_label: "GST",

    enable_leads_module: true,
    enable_marketing_module: true,
    enable_seller_tracking: true,
    enable_whatsapp_ai: true,
  },

  // ─────────────────────────────────────────────────
  // 3. Clothing & Fashion
  // ─────────────────────────────────────────────────
  {
    id: "clothing",
    name: "Clothing & Fashion",
    description: "Apparel, shoes, and accessories with size, colour and condition tracking",
    icon: "👗",
    color: "pink",

    product_name_singular: "Item",
    product_name_plural: "Items",

    identifier_label: "SKU",
    identifier_2_label: "Barcode",
    identifier_required: false,
    identifier_unique: true,

    category_label: "Category",
    subcategory_label: "Brand",
    variant_label: "Size / Colour",
    seller_label: "Supplier",

    use_condition_grades: true,
    condition_labels: {
      "A+": "Brand New – With Tags",
      "A":  "Like New – Worn Once",
      "B+": "Very Good – Barely Used",
      "B":  "Good – Normal Wear",
      "C":  "Fair – Visible Wear",
      "D":  "Poor – Heavy Wear",
    },
    use_battery_health: false,
    use_functional_tests: false,
    enable_imei_check: false,

    primary_categories: ["Men's Wear", "Women's Wear", "Kids", "Footwear", "Accessories", "Ethnic Wear", "Western Wear", "Sportswear", "Winter Wear"],

    whatsapp_cta_label: "Enquire on WhatsApp",
    whatsapp_inquiry_template: "Hi! I'm interested in {{subcategory}} {{subcategory}} ({{variant}}) listed at {{price}}. Is it still available?",

    order_prefix: "CF",

    hero_stat_1_value: "10,000+",
    hero_stat_1_label: "Items Sold",
    hero_stat_2_value: "8,000+",
    hero_stat_2_label: "Happy Customers",
    hero_stat_3_value: "3+",
    hero_stat_3_label: "Years Experience",
    hero_stat_4_value: "100%",
    hero_stat_4_label: "Authentic Products",

    faqs: [
      { question: "Do you accept returns?", answer: "Yes, we have a 7-day return policy for items in original condition with tags." },
      { question: "How do I know my size?", answer: "We follow standard Indian sizing. A size chart is available on each product page." },
      { question: "Are these original branded items?", answer: "Yes, all items are 100% authentic. We source directly from trusted suppliers." },
      { question: "Do you offer gift wrapping?", answer: "Yes, gift wrapping is available at a nominal charge." },
    ],

    gst_enabled: true,
    gst_rate: 5,
    gst_label: "GST",

    enable_leads_module: true,
    enable_marketing_module: true,
    enable_seller_tracking: true,
    enable_whatsapp_ai: true,
  },

  // ─────────────────────────────────────────────────
  // 4. Jewelry & Accessories
  // ─────────────────────────────────────────────────
  {
    id: "jewelry",
    name: "Jewelry & Accessories",
    description: "Gold, silver, diamond jewellery and accessories with purity and weight tracking",
    icon: "💍",
    color: "yellow",

    product_name_singular: "Piece",
    product_name_plural: "Pieces",

    identifier_label: "Hallmark ID",
    identifier_2_label: "Certificate No.",
    identifier_required: false,
    identifier_unique: false,

    category_label: "Type",
    subcategory_label: "Style",
    variant_label: "Metal / Stone",
    seller_label: "Artisan / Supplier",

    use_condition_grades: true,
    condition_labels: {
      "A+": "Mint – Unworn",
      "A":  "Excellent – Like New",
      "B+": "Very Good – Minor Signs",
      "B":  "Good – Some Wear",
      "C":  "Fair – Needs Polish",
      "D":  "For Repair",
    },
    use_battery_health: false,
    use_functional_tests: false,
    enable_imei_check: false,

    primary_categories: ["Rings", "Necklaces", "Earrings", "Bracelets", "Bangles", "Anklets", "Pendants", "Chains", "Mangalsutra", "Nose Pins"],

    whatsapp_cta_label: "Enquire on WhatsApp",
    whatsapp_inquiry_template: "Hi! I'm interested in the {{subcategory}} {{category}} ({{variant}}) listed at {{price}}. Is it available?",

    order_prefix: "JW",

    hero_stat_1_value: "2,000+",
    hero_stat_1_label: "Pieces Sold",
    hero_stat_2_value: "1,500+",
    hero_stat_2_label: "Happy Customers",
    hero_stat_3_value: "10+",
    hero_stat_3_label: "Years Experience",
    hero_stat_4_value: "BIS",
    hero_stat_4_label: "Hallmarked",

    faqs: [
      { question: "Are all jewellery pieces hallmarked?", answer: "Yes, all gold and silver pieces carry BIS hallmark certifications." },
      { question: "Can I get custom jewellery made?", answer: "Yes, we offer custom jewellery making services. Enquire for pricing and lead time." },
      { question: "Do you buy old gold or silver?", answer: "Yes, we buy old gold and silver at competitive market rates." },
      { question: "What is your return policy?", answer: "We offer 7-day returns for manufacturing defects. Custom pieces are non-returnable." },
    ],

    gst_enabled: true,
    gst_rate: 3,
    gst_label: "GST",

    enable_leads_module: true,
    enable_marketing_module: true,
    enable_seller_tracking: true,
    enable_whatsapp_ai: true,
  },

  // ─────────────────────────────────────────────────
  // 5. Books & Stationery
  // ─────────────────────────────────────────────────
  {
    id: "books",
    name: "Books & Stationery",
    description: "New and second-hand books, textbooks, notebooks and stationery",
    icon: "📚",
    color: "green",

    product_name_singular: "Book",
    product_name_plural: "Books",

    identifier_label: "ISBN",
    identifier_2_label: "Edition",
    identifier_required: false,
    identifier_unique: false,

    category_label: "Genre",
    subcategory_label: "Title",
    variant_label: "Author / Edition",
    seller_label: "Donor / Supplier",

    use_condition_grades: true,
    condition_labels: {
      "A+": "New – Sealed",
      "A":  "Like New – No marks",
      "B+": "Very Good – Light use",
      "B":  "Good – Some highlights",
      "C":  "Fair – Writing inside",
      "D":  "Reader – Damaged cover",
    },
    use_battery_health: false,
    use_functional_tests: false,
    enable_imei_check: false,

    primary_categories: ["Fiction", "Non-Fiction", "Academic", "Science", "History", "Self-Help", "Children", "Comics", "Religion", "Competitive Exams"],

    whatsapp_cta_label: "Enquire on WhatsApp",
    whatsapp_inquiry_template: "Hi! I'm looking for \"{{subcategory}}\" by {{variant}} ({{category}}) listed at {{price}}. Is it available?",

    order_prefix: "BK",

    hero_stat_1_value: "50,000+",
    hero_stat_1_label: "Books Sold",
    hero_stat_2_value: "20,000+",
    hero_stat_2_label: "Happy Readers",
    hero_stat_3_value: "5+",
    hero_stat_3_label: "Years Experience",
    hero_stat_4_value: "70%",
    hero_stat_4_label: "Savings vs New",

    faqs: [
      { question: "Are second-hand books in good condition?", answer: "All books are graded A+ to D. Grade and any defects are clearly mentioned on each listing." },
      { question: "Do you buy old books?", answer: "Yes! Bring your old books and get store credit or cash." },
      { question: "Can I place a request for a specific book?", answer: "Yes, fill the request form and we'll notify you when it's available." },
      { question: "Do you deliver?", answer: "Yes, we ship books pan-India via courier." },
    ],

    gst_enabled: false,
    gst_rate: 0,
    gst_label: "GST",

    enable_leads_module: false,
    enable_marketing_module: true,
    enable_seller_tracking: true,
    enable_whatsapp_ai: false,
  },

  // ─────────────────────────────────────────────────
  // 6. Electronics & Gadgets
  // ─────────────────────────────────────────────────
  {
    id: "electronics",
    name: "Electronics & Gadgets",
    description: "TVs, cameras, gaming consoles, audio gear and other electronics",
    icon: "🎮",
    color: "purple",

    product_name_singular: "Product",
    product_name_plural: "Products",

    identifier_label: "Serial Number",
    identifier_2_label: "Model Number",
    identifier_required: false,
    identifier_unique: true,

    category_label: "Category",
    subcategory_label: "Brand",
    variant_label: "Model / Spec",
    seller_label: "Seller",

    use_condition_grades: true,
    condition_labels: {
      "A+": "Brand New – Sealed Box",
      "A":  "Like New – Open Box",
      "B+": "Excellent – Barely Used",
      "B":  "Good – Some Use",
      "C":  "Fair – Visible Wear",
      "D":  "For Parts",
    },
    use_battery_health: false,
    use_functional_tests: true,
    enable_imei_check: false,

    primary_categories: ["TVs", "Cameras", "Gaming", "Audio", "Smart Home", "Wearables", "Printers", "Networking", "Storage", "Projectors"],

    whatsapp_cta_label: "Enquire on WhatsApp",
    whatsapp_inquiry_template: "Hi! I'm interested in the {{subcategory}} {{subcategory}} ({{variant}}) listed at {{price}}. Is it still available?",

    order_prefix: "EL",

    hero_stat_1_value: "8,000+",
    hero_stat_1_label: "Products Sold",
    hero_stat_2_value: "6,000+",
    hero_stat_2_label: "Happy Customers",
    hero_stat_3_value: "4+",
    hero_stat_3_label: "Years Experience",
    hero_stat_4_value: "1 Year",
    hero_stat_4_label: "Max Warranty",

    faqs: [
      { question: "Do electronics come with warranty?", answer: "All electronics are tested and come with at least 3 months seller warranty." },
      { question: "Can I return if the product doesn't work?", answer: "Yes, we have a 7-day return policy for defective products." },
      { question: "Do you offer repair services?", answer: "Yes, we have an in-house repair service for most categories." },
      { question: "What payment methods do you accept?", answer: "Cash, UPI, Card, EMI and Bank Transfer." },
    ],

    gst_enabled: true,
    gst_rate: 18,
    gst_label: "GST",

    enable_leads_module: true,
    enable_marketing_module: true,
    enable_seller_tracking: true,
    enable_whatsapp_ai: true,
  },

  // ─────────────────────────────────────────────────
  // 7. Cars & Vehicles
  // ─────────────────────────────────────────────────
  {
    id: "cars",
    name: "Cars & Vehicles",
    description: "Used cars, bikes, scooters and commercial vehicles with VIN/chassis tracking",
    icon: "🚗",
    color: "red",

    product_name_singular: "Vehicle",
    product_name_plural: "Vehicles",

    identifier_label: "VIN / Chassis No.",
    identifier_2_label: "Engine No.",
    identifier_required: true,
    identifier_unique: true,

    category_label: "Make",
    subcategory_label: "Model",
    variant_label: "Year / Fuel / Transmission",
    seller_label: "Owner",

    use_condition_grades: true,
    condition_labels: {
      "A+": "Showroom – No Issues",
      "A":  "Excellent – Minor Wear",
      "B+": "Very Good – Light Use",
      "B":  "Good – Normal Wear",
      "C":  "Fair – Needs Attention",
      "D":  "Project Car – Major Work",
    },
    use_battery_health: false,
    use_functional_tests: true,
    enable_imei_check: false,

    primary_categories: ["Maruti Suzuki", "Hyundai", "Tata", "Honda", "Toyota", "Ford", "Mahindra", "Kia", "MG", "Volkswagen"],

    whatsapp_cta_label: "Enquire on WhatsApp",
    whatsapp_inquiry_template: "Hi! I'm interested in the {{variant}} {{category}} {{subcategory}} listed at {{price}}. Is it available for test drive?",

    order_prefix: "VH",

    hero_stat_1_value: "500+",
    hero_stat_1_label: "Vehicles Sold",
    hero_stat_2_value: "450+",
    hero_stat_2_label: "Happy Customers",
    hero_stat_3_value: "6+",
    hero_stat_3_label: "Years Experience",
    hero_stat_4_value: "RC",
    hero_stat_4_label: "Transfer Assistance",

    faqs: [
      { question: "Can I get the vehicle inspected before purchase?", answer: "Yes, we do a full 100-point inspection on every vehicle. Report available on request." },
      { question: "Do you assist with RC transfer?", answer: "Yes, we handle all RC transfer paperwork at a nominal fee." },
      { question: "Is finance available?", answer: "Yes, we have tie-ups with multiple banks and NBFCs for easy auto loans." },
      { question: "Can I sell my old vehicle?", answer: "Yes, we buy used vehicles at competitive prices." },
    ],

    gst_enabled: false,
    gst_rate: 0,
    gst_label: "GST",

    enable_leads_module: true,
    enable_marketing_module: true,
    enable_seller_tracking: true,
    enable_whatsapp_ai: true,
  },

  // ─────────────────────────────────────────────────
  // 8. Furniture & Home
  // ─────────────────────────────────────────────────
  {
    id: "furniture",
    name: "Furniture & Home",
    description: "Used and new furniture, home decor, appliances and fixtures",
    icon: "🛋️",
    color: "brown",

    product_name_singular: "Item",
    product_name_plural: "Items",

    identifier_label: "SKU",
    identifier_2_label: "Tag ID",
    identifier_required: false,
    identifier_unique: true,

    category_label: "Category",
    subcategory_label: "Type",
    variant_label: "Material / Dimensions",
    seller_label: "Owner / Supplier",

    use_condition_grades: true,
    condition_labels: {
      "A+": "Brand New",
      "A":  "Like New – No Damage",
      "B+": "Very Good – Minimal Wear",
      "B":  "Good – Minor Scratches",
      "C":  "Fair – Visible Wear",
      "D":  "Needs Repair",
    },
    use_battery_health: false,
    use_functional_tests: false,
    enable_imei_check: false,

    primary_categories: ["Beds & Mattresses", "Sofas", "Dining Sets", "Wardrobes", "Tables", "Chairs", "Storage", "Appliances", "Décor", "Outdoor"],

    whatsapp_cta_label: "Enquire on WhatsApp",
    whatsapp_inquiry_template: "Hi! I'm interested in the {{subcategory}} {{category}} ({{variant}}) listed at {{price}}. Is it available?",

    order_prefix: "FH",

    hero_stat_1_value: "3,000+",
    hero_stat_1_label: "Items Sold",
    hero_stat_2_value: "2,500+",
    hero_stat_2_label: "Happy Customers",
    hero_stat_3_value: "5+",
    hero_stat_3_label: "Years Experience",
    hero_stat_4_value: "Free",
    hero_stat_4_label: "Delivery Available",

    faqs: [
      { question: "Do you offer delivery and installation?", answer: "Yes, we offer delivery and basic assembly/installation service within the city." },
      { question: "Can I buy individual pieces from a set?", answer: "Generally yes, though some sets are sold together. Check the listing details." },
      { question: "Can I sell my old furniture?", answer: "Yes, we buy used furniture in good condition. Contact us for a valuation." },
      { question: "What is the return policy?", answer: "Returns accepted within 48 hours of delivery if the item doesn't match the description." },
    ],

    gst_enabled: true,
    gst_rate: 12,
    gst_label: "GST",

    enable_leads_module: false,
    enable_marketing_module: true,
    enable_seller_tracking: true,
    enable_whatsapp_ai: false,
  },

  // ─────────────────────────────────────────────────
  // 9. Custom / Generic
  // ─────────────────────────────────────────────────
  {
    id: "custom",
    name: "Custom Business",
    description: "Start from scratch and configure everything to fit your unique business",
    icon: "⚙️",
    color: "gray",

    product_name_singular: "Product",
    product_name_plural: "Products",

    identifier_label: "ID / Code",
    identifier_2_label: "Secondary ID",
    identifier_required: false,
    identifier_unique: false,

    category_label: "Category",
    subcategory_label: "Name",
    variant_label: "Variant",
    seller_label: "Seller",

    use_condition_grades: true,
    condition_labels: {
      "A+": "Grade A+",
      "A":  "Grade A",
      "B+": "Grade B+",
      "B":  "Grade B",
      "C":  "Grade C",
      "D":  "Grade D",
    },
    use_battery_health: false,
    use_functional_tests: false,
    enable_imei_check: false,

    primary_categories: ["Category 1", "Category 2", "Category 3"],

    whatsapp_cta_label: "Enquire on WhatsApp",
    whatsapp_inquiry_template: "Hi! I'm interested in {{subcategory}} ({{variant}}) listed at {{price}}. Is it available?",

    order_prefix: "OR",

    hero_stat_1_value: "1,000+",
    hero_stat_1_label: "Products Sold",
    hero_stat_2_value: "500+",
    hero_stat_2_label: "Happy Customers",
    hero_stat_3_value: "2+",
    hero_stat_3_label: "Years Experience",
    hero_stat_4_value: "100%",
    hero_stat_4_label: "Satisfaction",

    faqs: [
      { question: "What is your return policy?", answer: "We have a hassle-free return policy. Contact us within 7 days of purchase." },
      { question: "What payment methods do you accept?", answer: "We accept all major payment methods including Cash, UPI, and Card." },
    ],

    gst_enabled: true,
    gst_rate: 18,
    gst_label: "GST",

    enable_leads_module: true,
    enable_marketing_module: true,
    enable_seller_tracking: true,
    enable_whatsapp_ai: true,
  },
];

// Get a template by ID
export function getTemplate(id: string): BusinessTemplate | undefined {
  return BUSINESS_TEMPLATES.find((t) => t.id === id);
}

// Get template by business type
export function getTemplateByType(type: string): BusinessTemplate {
  return BUSINESS_TEMPLATES.find((t) => t.id === type) ?? BUSINESS_TEMPLATES[0];
}
