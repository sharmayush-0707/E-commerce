export const initialProducts = [
  {
    _id: "prod-1",
    name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    tagline: "Industry-leading noise canceling with two processors and 8 microphones",
    description: "Experience silence and crystal-clear audio with the Sony WH-1000XM5. Featuring industry-leading noise cancellation, exceptional sound quality with the Integrated Processor V1, up to 30 hours of battery life with quick charging, and ultra-comfortable lightweight design.",
    price: 349.99,
    originalPrice: 399.99,
    discountPercentage: 12,
    category: "Electronics",
    subCategory: "Audio",
    brand: "Sony",
    stock: 25,
    rating: 4.8,
    numReviews: 128,
    isFeatured: true,
    isTrending: true,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["wireless", "noise-canceling", "bluetooth", "audio", "travel", "over-ear", "sony"],
    specs: {
      "Battery Life": "30 Hours",
      "Bluetooth": "5.2",
      "Weight": "250g",
      "Microphones": "8 Beamforming",
      "Charging": "USB-C Fast Charging"
    },
    aiKeywords: ["music", "focus", "work from home", "commute", "high bass", "audiophile"]
  },
  {
    _id: "prod-2",
    name: "Apple MacBook Pro 16\" M3 Pro (18GB, 512GB SSD)",
    tagline: "Mind-blowing performance and extreme battery life for creators",
    description: "The 16-inch MacBook Pro with M3 Pro chip blazes through demanding projects. Liquid Retina XDR display with Extreme Dynamic Range, up to 22 hours of battery life, six-speaker sound system with Spatial Audio, and pro connectivity with MagSafe 3 and Thunderbolt 4.",
    price: 2399.00,
    originalPrice: 2499.00,
    discountPercentage: 4,
    category: "Electronics",
    subCategory: "Computers",
    brand: "Apple",
    stock: 14,
    rating: 4.9,
    numReviews: 94,
    isFeatured: true,
    isTrending: true,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["laptop", "apple", "macbook", "m3", "programming", "video-editing", "creator"],
    specs: {
      "Chip": "Apple M3 Pro 12-core",
      "Memory": "18GB Unified RAM",
      "Storage": "512GB NVMe SSD",
      "Display": "16.2\" Liquid Retina XDR (3456x2234)",
      "Battery": "Up to 22 hours"
    },
    aiKeywords: ["coding", "design", "video rendering", "engineering", "premium", "apple"]
  },
  {
    _id: "prod-3",
    name: "Apple Watch Ultra 2 GPS + Cellular Titanium 49mm",
    tagline: "The most rugged and capable Apple Watch ever designed",
    description: "Crafted with lightweight aerospace-grade titanium, a precision dual-frequency GPS system, up to 36 hours of battery life, customizable Action button, and 3000 nits brightest display for all outdoor adventures.",
    price: 799.00,
    originalPrice: 849.00,
    discountPercentage: 6,
    category: "Wearables",
    subCategory: "Smartwatches",
    brand: "Apple",
    stock: 18,
    rating: 4.9,
    numReviews: 76,
    isFeatured: true,
    isTrending: false,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["smartwatch", "apple", "fitness", "gps", "waterproof", "titanium", "running"],
    specs: {
      "Case": "49mm Aerospace Titanium",
      "Water Resistance": "100m / Dive certified to 40m",
      "Battery": "36-72 Hours",
      "Display": "Always-On Retina 3000 nits"
    },
    aiKeywords: ["fitness tracking", "health", "diving", "running", "hiking", "luxury sports"]
  },
  {
    _id: "prod-4",
    name: "Logitech MX Master 3S Wireless Performance Mouse",
    tagline: "Quiet Clicks and 8K DPI track-on-glass sensor",
    description: "An icon remastered. Feel every moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8,000 DPI track-on-glass sensor with MagSpeed electromagnetic scrolling.",
    price: 99.99,
    originalPrice: 119.99,
    discountPercentage: 17,
    category: "Electronics",
    subCategory: "Accessories",
    brand: "Logitech",
    stock: 45,
    rating: 4.7,
    numReviews: 215,
    isFeatured: false,
    isTrending: true,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["mouse", "ergonomic", "productivity", "office", "bluetooth", "wireless"],
    specs: {
      "Sensor": "Darkfield 8000 DPI",
      "Connectivity": "Bluetooth & Logi Bolt",
      "Battery": "Up to 70 days",
      "Buttons": "7 customizable"
    },
    aiKeywords: ["ergonomics", "office desk", "developer setup", "quiet click", "designer tool"]
  },
  {
    _id: "prod-5",
    name: "Keychron Q1 Pro Wireless Custom Mechanical Keyboard",
    tagline: "75% full aluminum QMK/VIA wireless mechanical keyboard",
    description: "Full metal CNC machined body, double-gasket design, hot-swappable switches, PBT keycaps, and seamless Bluetooth 5.1 connection for Mac and Windows. Engineered for refined typing feel and acoustics.",
    price: 199.99,
    originalPrice: 229.00,
    discountPercentage: 13,
    category: "Electronics",
    subCategory: "Accessories",
    brand: "Keychron",
    stock: 20,
    rating: 4.8,
    numReviews: 89,
    isFeatured: true,
    isTrending: true,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["mechanical keyboard", "custom", "keychron", "hot-swap", "rgb", "typing"],
    specs: {
      "Layout": "75% 82-Key",
      "Switches": "K Pro Red (Pre-lubed)",
      "Body": "Full CNC Aluminum",
      "Backlight": "South-facing RGB"
    },
    aiKeywords: ["mechanical typing", "desk aesthetic", "minimalist", "gamer", "programmer"]
  },
  {
    _id: "prod-6",
    name: "Sony Alpha 7 IV Full-frame Mirrorless Camera",
    tagline: "Beyond basic - 33MP Exmor R CMOS sensor and 4K 60p video",
    description: "Groundbreaking image quality and next-generation speed. Features real-time Eye AF for humans, animals, and birds, 10-bit 4:2:2 4K video recording, active optical image stabilization, and dual card slots.",
    price: 2298.00,
    originalPrice: 2498.00,
    discountPercentage: 8,
    category: "Photography",
    subCategory: "Cameras",
    brand: "Sony",
    stock: 8,
    rating: 4.9,
    numReviews: 64,
    isFeatured: true,
    isTrending: false,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["camera", "sony", "full-frame", "4k", "mirrorless", "photography", "cinematography"],
    specs: {
      "Sensor": "33MP Full-Frame BSI Exmor R",
      "Video": "4K 60p 10-Bit 4:2:2",
      "Autofocus": "759 Phase-Detection Points",
      "Stabilization": "5.5-Stop In-Body Image Stabilization"
    },
    aiKeywords: ["cinematography", "portrait photography", "youtube content", "studio camera"]
  },
  {
    _id: "prod-7",
    name: "Nike Air Max 270 React Premium Sneakers",
    tagline: "Bold style with Nike's highest volume heel Air unit yet",
    description: "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. Inspired by Air Max icons, it showcases Nike's greatest innovation with its large window and fresh array of colors.",
    price: 159.99,
    originalPrice: 179.99,
    discountPercentage: 11,
    category: "Footwear",
    subCategory: "Sneakers",
    brand: "Nike",
    stock: 35,
    rating: 4.6,
    numReviews: 184,
    isFeatured: false,
    isTrending: true,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["shoes", "sneakers", "nike", "running", "streetwear", "athletic", "fashion"],
    specs: {
      "Upper Material": "Knit & Synthetic Mesh",
      "Cushioning": "Max Air 270 unit & Nike React foam",
      "Sole": "Solid rubber outsole",
      "Fit": "True to size"
    },
    aiKeywords: ["comfort wear", "casual streetwear", "gym shoe", "daily walking sneaker"]
  },
  {
    _id: "prod-8",
    name: "Minimalist Italian Vegetable Tanned Leather Backpack",
    tagline: "Handcrafted full-grain leather backpack built to last decades",
    description: "Made with genuine Tuscan vegetable tanned leather that patinas beautifully over time. Padded 16-inch laptop compartment, waterproof YKK brass zippers, ergonomic shoulder straps, and anti-theft back pocket.",
    price: 249.00,
    originalPrice: 295.00,
    discountPercentage: 15,
    category: "Fashion",
    subCategory: "Bags",
    brand: "Vachetta Artisan",
    stock: 12,
    rating: 4.8,
    numReviews: 53,
    isFeatured: true,
    isTrending: false,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["leather", "backpack", "luxury", "travel", "work", "minimalist", "handcrafted"],
    specs: {
      "Material": "100% Full-grain Tuscan Leather",
      "Capacity": "22 Liters",
      "Laptop Slot": "Up to 16-inch MacBook",
      "Hardware": "Solid Brushed Brass"
    },
    aiKeywords: ["executive style", "commuter bag", "heritage leather", "travel accessory"]
  },
  {
    _id: "prod-9",
    name: "Bose SoundLink Revolve+ II Bluetooth 360° Speaker",
    tagline: "Deep, loud and immersive sound with true 360-degree coverage",
    description: "Engineered to deliver true 360° sound for consistent, uniform coverage. Place it in the center of the room to give everyone the same experience. Or set it near a wall and sound will radiate and reflect around the room, immersing you.",
    price: 279.00,
    originalPrice: 329.00,
    discountPercentage: 15,
    category: "Electronics",
    subCategory: "Audio",
    brand: "Bose",
    stock: 22,
    rating: 4.7,
    numReviews: 110,
    isFeatured: false,
    isTrending: true,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["speaker", "bluetooth", "bose", "water-resistant", "portable", "360-sound"],
    specs: {
      "Battery Life": "Up to 17 Hours",
      "Water Resistance": "IP55 splash proof",
      "Voice Prompts": "Built-in microphone for speakerphone",
      "Handle": "Flexible fabric handle"
    },
    aiKeywords: ["patio speaker", "bbq party", "acoustic warmth", "portable audio", "travel"]
  },
  {
    _id: "prod-10",
    name: "Fellow Ode Gen 2 Brew Grinder & Stagg EKG Kettle Set",
    tagline: "Award-winning coffee precision gear for barista quality pour-overs",
    description: "The ultimate specialty coffee bundle. Featuring the Fellow Ode Gen 2 with 64mm commercial-grade flat burrs and anti-static technology, paired with the variable temperature electric Stagg EKG precision gooseneck kettle.",
    price: 495.00,
    originalPrice: 540.00,
    discountPercentage: 8,
    category: "Home & Kitchen",
    subCategory: "Coffee",
    brand: "Fellow",
    stock: 9,
    rating: 4.9,
    numReviews: 72,
    isFeatured: true,
    isTrending: false,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["coffee", "grinder", "kettle", "kitchen", "pour-over", "barista", "aesthetic"],
    specs: {
      "Burrs": "64mm Stainless Steel Flat Burrs",
      "Temperature Control": "Degree precision (135°F to 212°F)",
      "PID Controller": "Keeps temperature stable for 60 mins"
    },
    aiKeywords: ["specialty coffee", "morning ritual", "espresso", "barista gear", "kitchen luxury"]
  },
  {
    _id: "prod-11",
    name: "Ray-Ban Meta Smart Glasses (Wayfarer Polarized)",
    tagline: "Capture photos, stream, listen to music, and speak to Meta AI",
    description: "Classic Wayfarer look fused with modern smart technology. Ultra-wide 12 MP camera captures stunning POV photos and 1080p video. Discreet open-ear speakers with deep bass, plus hands-free Meta AI voice assistant.",
    price: 329.00,
    originalPrice: 349.00,
    discountPercentage: 6,
    category: "Wearables",
    subCategory: "Eyewear",
    brand: "Ray-Ban",
    stock: 16,
    rating: 4.6,
    numReviews: 88,
    isFeatured: false,
    isTrending: true,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["glasses", "smart", "camera", "rayban", "ai", "polarized", "audio"],
    specs: {
      "Camera": "12MP Ultra-wide, 1080p 60fps video",
      "Audio": "Custom open-ear 5-speaker array",
      "Battery": "4 hours per charge + 32 hours case",
      "Lenses": "Polarized UV400 Protection"
    },
    aiKeywords: ["smart wearables", "vlogging", "hands-free recording", "sunglasses", "gadget"]
  },
  {
    _id: "prod-12",
    name: "BenQ ScreenBar Halo Wireless LED Monitor Light",
    tagline: "Precision eye-care desk lamp with wireless dial controller",
    description: "Patented asymmetrical optical design prevents screen reflection while brightly illuminating your desk workspace. Includes ambient back light to reduce eye strain in dark rooms and a wireless rotary controller.",
    price: 179.00,
    originalPrice: 199.00,
    discountPercentage: 10,
    category: "Electronics",
    subCategory: "Lighting",
    brand: "BenQ",
    stock: 30,
    rating: 4.8,
    numReviews: 142,
    isFeatured: false,
    isTrending: true,
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80"
    ],
    tags: ["desk lamp", "screenbar", "benq", "lighting", "workspace", "ergonomics"],
    specs: {
      "Color Temp": "2700K - 6500K tunable",
      "Illuminance": "800 Lux at 45cm",
      "Controller": "2.4GHz Wireless Smart Dial",
      "Power": "USB-A (5V, 1.5A)"
    },
    aiKeywords: ["desk aesthetic", "office lighting", "coding station", "eye care"]
  }
];

export const initialReviews = [
  {
    _id: "rev-1",
    productId: "prod-1",
    userName: "Alex Mercer",
    rating: 5,
    comment: "The noise cancellation is unmatched. Flew internationally and heard virtually zero plane engine drone. Extremely comfortable for 8+ hours.",
    createdAt: "2026-10-14T09:30:00Z"
  },
  {
    _id: "rev-2",
    productId: "prod-1",
    userName: "Sarah Jenkins",
    rating: 5,
    comment: "Audio quality and spatial sound are crisp. Microphone clarity on Zoom calls is a night-and-day improvement from the XM4.",
    createdAt: "2026-11-02T14:15:00Z"
  },
  {
    _id: "rev-3",
    productId: "prod-2",
    userName: "David Kim",
    rating: 5,
    comment: "The M3 Pro handles 4K video exports without breaking a sweat, fans barely spin up. The Liquid Retina screen is breathtaking.",
    createdAt: "2026-10-20T11:00:00Z"
  },
  {
    _id: "rev-4",
    productId: "prod-4",
    userName: "Elena Rostova",
    rating: 5,
    comment: "The quiet click is so satisfying and doesn't annoy anyone around me. Scrolling through 5000 lines of code is effortless.",
    createdAt: "2026-11-08T16:45:00Z"
  }
];

export const initialUsers = [
  {
    _id: "usr-admin-1",
    name: "Admin Manager",
    email: "admin@eshop.com",
    role: "admin",
    // hashed password for "admin123"
    passwordHash: "$2a$10$w09ZJ3o58oH6fL4993qWleJdF73lZ4q3qfW3Xq2ZJ3o58oH6fL499",
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    _id: "usr-demo-1",
    name: "Jane Doe",
    email: "demo@user.com",
    role: "user",
    // hashed password for "user123"
    passwordHash: "$2a$10$w09ZJ3o58oH6fL4993qWleJdF73lZ4q3qfW3Xq2ZJ3o58oH6fL499",
    createdAt: "2026-02-15T00:00:00Z"
  }
];

export const initialOrders = [
  {
    _id: "ord-1001",
    user: "usr-demo-1",
    customerName: "Jane Doe",
    customerEmail: "demo@user.com",
    orderItems: [
      {
        product: "prod-1",
        name: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        price: 349.99,
        quantity: 1
      },
      {
        product: "prod-4",
        name: "Logitech MX Master 3S Wireless Performance Mouse",
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
        price: 99.99,
        quantity: 1
      }
    ],
    shippingAddress: {
      address: "742 Evergreen Terrace",
      city: "Springfield",
      postalCode: "97477",
      country: "USA"
    },
    paymentMethod: "Stripe",
    paymentResult: {
      id: "pi_mock_123456789",
      status: "succeeded",
      update_time: "2026-11-10T12:00:00Z",
      email_address: "demo@user.com"
    },
    itemsPrice: 449.98,
    taxPrice: 36.00,
    shippingPrice: 0.00,
    totalPrice: 485.98,
    isPaid: true,
    paidAt: "2026-11-10T12:00:00Z",
    status: "Delivered",
    deliveredAt: "2026-11-12T15:30:00Z",
    createdAt: "2026-11-10T11:58:00Z"
  },
  {
    _id: "ord-1002",
    user: "usr-demo-1",
    customerName: "Jane Doe",
    customerEmail: "demo@user.com",
    orderItems: [
      {
        product: "prod-5",
        name: "Keychron Q1 Pro Wireless Custom Mechanical Keyboard",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
        price: 199.99,
        quantity: 1
      }
    ],
    shippingAddress: {
      address: "742 Evergreen Terrace",
      city: "Springfield",
      postalCode: "97477",
      country: "USA"
    },
    paymentMethod: "Stripe",
    paymentResult: {
      id: "pi_mock_987654321",
      status: "succeeded",
      update_time: "2026-11-16T18:20:00Z",
      email_address: "demo@user.com"
    },
    itemsPrice: 199.99,
    taxPrice: 16.00,
    shippingPrice: 10.00,
    totalPrice: 225.99,
    isPaid: true,
    paidAt: "2026-11-16T18:20:00Z",
    status: "Processing",
    createdAt: "2026-11-16T18:15:00Z"
  }
];
