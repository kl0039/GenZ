import { Product, Recipe, CookingVideo, CulturalArticle, Category } from "@/types";

// Product Categories
export const categories: Category[] = [
  {
    id: "cat1",
    name: "Fresh Ingredients",
    icon: "fa-carrot",
    count: 24,
    level: 0
  },
  {
    id: "cat2",
    name: "Dry Goods",
    icon: "fa-wheat-awn",
    count: 38,
    level: 0
  },
  {
    id: "cat3",
    name: "Sauces & Condiments",
    icon: "fa-bottle-droplet",
    count: 45,
    level: 0
  },
  {
    id: "cat4",
    name: "Frozen",
    icon: "fa-snowflake",
    count: 19,
    level: 0
  },
  {
    id: "cat5",
    name: "Snacks",
    icon: "fa-cookie",
    count: 56,
    level: 0
  },
  {
    id: "cat6",
    name: "Beverages",
    icon: "fa-mug-hot",
    count: 27,
    level: 0
  },
  {
    id: "cat7",
    name: "Kitchenware",
    icon: "fa-kitchen-set",
    count: 31,
    level: 0
  }
];

// Mock Products
export const products: Product[] = [
  {
    id: "p1",
    name: "Premium Soy Sauce",
    description: "Authentic naturally brewed soy sauce from a traditional recipe.",
    price: 6.29,
    originalPrice: 8.99,
    discount: 30,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/9fab137e64-92b45c1ce4e98f11ba51.png",
    category_id: "cat3",
    category: "Sauces",
    tags: ["japanese", "condiment", "bestseller"],
    stock_quantity: 45,
    stock: 45,
    rating: 4.8,
    reviewCount: 128,
    promotion: "sale",
    featured: true,
    categories: []
  },
  {
    id: "p2",
    name: "Instant Ramen Pack",
    description: "Bundle of 5 premium instant ramen varieties from Japan.",
    price: 12.99,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/25b0f3a5c1-711efbc16085618fe12c.png",
    category_id: "cat2",
    category: "Noodles",
    tags: ["japanese", "instant", "bundle"],
    stock_quantity: 30,
    stock: 30,
    rating: 4.5,
    reviewCount: 95,
    promotion: "bundle",
    popular: true,
    categories: []
  },
  {
    id: "p3",
    name: "Premium Jasmine Rice 10kg",
    description: "High-quality aromatic jasmine rice from Thailand.",
    price: 18.99,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/9fab137e64-92b45c1ce4e98f11ba51.png",
    category_id: "cat2",
    category: "Rice",
    tags: ["thai", "staple", "bestseller"],
    stock_quantity: 20,
    stock: 20,
    rating: 4.9,
    reviewCount: 207,
    promotion: "freeDelivery",
    categories: []
  },
  {
    id: "p4",
    name: "Korean Red Pepper Paste (Gochujang)",
    description: "Authentic Korean fermented hot pepper paste.",
    price: 8.49,
    originalPrice: 9.99,
    discount: 15,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/9fab137e64-92b45c1ce4e98f11ba51.png",
    category_id: "cat3",
    category: "Sauces",
    tags: ["korean", "spicy", "bestseller"],
    stock_quantity: 38,
    stock: 38,
    rating: 4.7,
    reviewCount: 145,
    promotion: "sale",
    categories: []
  },
  {
    id: "p5",
    name: "Assorted Mochi Box",
    description: "Box of 12 assorted Japanese mochi desserts.",
    price: 14.99,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/25b0f3a5c1-711efbc16085618fe12c.png",
    category_id: "cat5",
    category: "Desserts",
    tags: ["japanese", "sweet", "gift"],
    stock_quantity: 15,
    stock: 15,
    rating: 4.6,
    reviewCount: 89,
    new: true,
    categories: []
  },
  {
    id: "p6",
    name: "Premium Green Tea",
    description: "High-quality Japanese green tea leaves.",
    price: 9.99,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/9fab137e64-92b45c1ce4e98f11ba51.png",
    category_id: "cat6",
    category: "Beverages",
    tags: ["japanese", "tea", "healthy"],
    stock_quantity: 42,
    stock: 42,
    rating: 4.8,
    reviewCount: 112,
    categories: []
  },
  {
    id: "p7",
    name: "Frozen Dumplings (30pcs)",
    description: "Authentic Chinese dumplings, ready to cook.",
    price: 15.99,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/25b0f3a5c1-711efbc16085618fe12c.png",
    category_id: "cat8",
    category: "Alcohol Drinks",
    tags: ["alcohol", "dimsum", "bestseller"],
    stock_quantity: 25,
    stock: 25,
    rating: 4.7,
    reviewCount: 134,
    popular: true,
    categories: []
  },
  {
    id: "p8",
    name: "Curry Paste Set",
    description: "Set of 3 Thai curry pastes: red, green, and yellow.",
    price: 12.49,
    originalPrice: 14.99,
    discount: 16,
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/9fab137e64-92b45c1ce4e98f11ba51.png",
    category_id: "cat3",
    category: "Sauces",
    tags: ["thai", "spicy", "curry"],
    stock_quantity: 32,
    stock: 32,
    rating: 4.9,
    reviewCount: 97,
    promotion: "sale",
    categories: []
  }
];

// Mock Recipes
export const recipes: Recipe[] = [
  {
    id: "r1",
    title: "Easy Homemade Pad Thai",
    description: "Authentic Pad Thai made simple with our pre-made sauce.",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/25b0f3a5c1-711efbc16085618fe12c.png",
    cookingTime: 25,
    cook_time: 25,
    prep_time: 10,
    servings: 4,
    difficulty: "easy",
    ingredients: [
      "2 cups Jasmine Rice", 
      "3 tbsp Soy Sauce",
      "2 Eggs",
      "200g Bean Sprouts"
    ],
    steps: [
      "Soak rice noodles in hot water for 10 minutes.",
      "Heat oil in a wok over medium-high heat.",
      "Add eggs and scramble until nearly set.",
      "Add soaked noodles and sauce, stir-fry until noodles are tender."
    ],
    cuisine_type: "Thai"
  },
  {
    id: "r2",
    title: "Homemade Dim Sum",
    description: "Learn to make restaurant-quality dim sum at home.",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/25b0f3a5c1-711efbc16085618fe12c.png",
    cookingTime: 60,
    cook_time: 45,
    prep_time: 15,
    servings: 6,
    difficulty: "hard",
    ingredients: [
      "1 pack Frozen Dumplings",
      "Soy Sauce for dipping",
      "3 finely chopped Spring Onions"
    ],
    steps: [
      "Prepare the steamer by bringing water to a boil.",
      "Arrange frozen dumplings on parchment paper in the steamer basket.",
      "Steam for 8-10 minutes until fully cooked.",
      "Serve with dipping sauce and garnish with spring onions."
    ],
    cuisine_type: "Chinese"
  }
];

// Mock Cooking Videos
export const cookingVideos: CookingVideo[] = [
  {
    id: "v1",
    title: "Master the Art of Dim Sum",
    description: "Learn authentic techniques from Chef Wong",
    thumbnail: "https://storage.googleapis.com/uxpilot-auth.appspot.com/25b0f3a5c1-711efbc16085618fe12c.png",
    video_url: "https://www.youtube.com/watch?v=example",
    duration: 1825,
    chef: "Chef Wong",
    views: 12540,
    relatedProducts: ["p7"]
  },
  {
    id: "v2",
    title: "Perfect Sushi Rice Every Time",
    description: "Master the basics of Japanese rice preparation",
    thumbnail: "https://storage.googleapis.com/uxpilot-auth.appspot.com/25b0f3a5c1-711efbc16085618fe12c.png",
    video_url: "https://www.youtube.com/watch?v=example",
    duration: 845,
    chef: "Chef Tanaka",
    views: 8750,
    relatedProducts: ["p3", "p1"]
  }
];

// Mock Cultural Articles
export const culturalArticles: CulturalArticle[] = [
  {
    id: "a1",
    title: "The History and Significance of Lunar New Year",
    summary: "Discover the rich traditions and symbolism behind Lunar New Year celebrations across Asia.",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/25b0f3a5c1-711efbc16085618fe12c.png",
    content: "The Lunar New Year, also known as Spring Festival in China, is a celebration...",
    author: "Dr. Mei Zhang",
    publishDate: "2024-01-15",
    region: "East Asia",
    tags: ["festival", "tradition", "culture"]
  },
  {
    id: "a2",
    title: "Understanding Umami: The Fifth Taste",
    summary: "Explore the science and history behind umami, the savory fifth taste foundational to Asian cuisine.",
    image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/25b0f3a5c1-711efbc16085618fe12c.png",
    content: "Umami, often described as a savory or meaty taste, was identified by Japanese chemist...",
    author: "Dr. James Lee",
    publishDate: "2023-11-22",
    region: "Japan",
    tags: ["food science", "flavor", "culinary history"]
  }
];
