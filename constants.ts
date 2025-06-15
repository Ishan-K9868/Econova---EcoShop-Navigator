
import { Product, EcoInterest, CoinReward, Quiz, FeedbackCategoryName, FeedbackCategoryDetails, SellerRegistrationStepConfig, SellerAchievement, UserImpactMetrics, UserGoal, AISuggestedGoal, MarketplaceListing, MarketplaceCondition, MarketplaceListingStatus, FAQItem, ReturnablePackage, ReturnPackageStatus, PackageCondition } from './types';

export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-04-17"; // General text tasks
export const IMAGEN_MODEL_NAME = "imagen-3.0-generate-002"; // Image generation tasks

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Organic Cotton T-Shirt',
    imageUrl: '/Organic Cotton T-Shirt.jpeg',
    imagePrompt: 'A high-quality, soft white organic cotton t-shirt, neatly folded. Clean, minimalist studio shot, bright lighting.',
    description: 'Comfortable and stylish t-shirt made from 100% organic cotton, grown without harmful pesticides.',
    ecoScore: 5, // Will be recalculated
    carbonFootprint: 2.7,
    category: 'Apparel',
    certifications: ['GOTS Certified Organic', 'Fair Trade'],
    price: 29.99,
    materials: ['Organic Cotton'],
    durabilityScore: 4,
    packagingScore: 3, // Minimal, recycled packaging
    healthImpactScore: 5, // No harmful dyes
  },
  {
    id: '2',
    name: 'Reusable Bamboo Coffee Cup',
    imageUrl: '/Reusable Bamboo Coffee Cup.jpeg',
    imagePrompt: 'A stylish reusable coffee cup made from light-colored bamboo fiber, with a dark grey silicone lid. Shown on a rustic wooden cafe table, soft natural light.',
    description: 'Eco-friendly coffee cup made from sustainable bamboo fiber. Perfect for your daily brew.',
    ecoScore: 4,
    carbonFootprint: 0.8,
    category: 'Kitchenware',
    certifications: ['BPA Free'],
    price: 15.50,
    materials: ['Bamboo Fiber', 'Silicone Lid'],
    durabilityScore: 3,
    packagingScore: 4, // Recycled card box
    healthImpactScore: 4, // Food-safe materials
  },
  {
    id: '3',
    name: 'Recycled Material Backpack',
    imageUrl: '/Recycled Material Backpack.jpeg',
    imagePrompt: 'A modern, durable backpack in a neutral grey or blue color, made from recycled materials. Suitable for everyday urban use, clean background.',
    description: 'Durable backpack made from recycled plastic bottles. Stylish and sustainable.',
    ecoScore: 4,
    carbonFootprint: 3.5,
    category: 'Accessories',
    certifications: ['GRS Certified Recycled'],
    price: 59.00,
    materials: ['Recycled PET bottles', 'Recycled Nylon'],
    durabilityScore: 5,
    packagingScore: 3, // Polybag (recycled if possible)
    healthImpactScore: 4, // Generally safe materials
  },
  {
    id: '4',
    name: 'Solar Powered Phone Charger',
    imageUrl: '/Solar Powered Phone Charger.jpeg',
    imagePrompt: 'A compact, portable solar-powered phone charger with visible solar panels, possibly shown outdoors or charging a phone. Tech-forward, sleek aesthetic.',
    description: 'Charge your devices on the go with this portable solar-powered charger. Clean energy in your pocket.',
    ecoScore: 5, // Will be recalculated
    carbonFootprint: 1.2, // Manufacturing footprint, operational is zero
    category: 'Electronics',
    certifications: ['CE', 'RoHS'],
    price: 45.00,
    materials: ['ABS Plastic', 'Monocrystalline Silicon Solar Panel'],
    durabilityScore: 5, // Increased for testing
    packagingScore: 4, // Increased for testing
    healthImpactScore: 4, // Increased for testing
  },
  {
    id: '5',
    name: 'Biodegradable Phone Case',
    imageUrl: '/Biodegradable Phone Case.jpeg',
    imagePrompt: 'An eco-friendly, biodegradable phone case in a natural, earthy tone (e.g., beige, light green, speckled). Maybe a subtle leaf imprint or texture. Shown protecting a smartphone.',
    description: 'Protect your phone and the planet with this compostable phone case made from plant-based materials.',
    ecoScore: 4,
    carbonFootprint: 0.5,
    category: 'Accessories',
    certifications: ['Compostable EN13432'],
    price: 22.90,
    materials: ['PLA (Corn Starch)', 'PBAT'],
    durabilityScore: 2, // Biodegradable often means less durable
    packagingScore: 5, // Compostable packaging
    healthImpactScore: 5, // Plant-based, non-toxic
  },
  {
    id: '6',
    name: 'Stainless Steel Water Bottle',
    imageUrl: '/Stainless Steel Water Bottle.jpeg',
    imagePrompt: 'A sleek, matte black stainless steel water bottle with a minimalist logo. Studio shot against a clean, light grey background.',
    description: 'Durable and reusable stainless steel water bottle to keep you hydrated and reduce plastic waste.',
    ecoScore: 4.5,
    carbonFootprint: 1.0,
    category: 'Lifestyle',
    certifications: ['Food Grade Stainless Steel'],
    price: 25.00,
    materials: ['Stainless Steel', 'BPA-Free Plastic Lid'],
    durabilityScore: 5,
    packagingScore: 4, // Recycled cardboard tube
    healthImpactScore: 5,
  },
  {
    id: '7',
    name: 'Organic Bamboo Cutting Board',
    imageUrl: '/Organic Bamboo Cutting Board.jpeg',
    imagePrompt: 'A rectangular organic bamboo cutting board showing its natural grain, placed on a kitchen counter with some fresh vegetables nearby.',
    description: 'Sustainable and durable cutting board made from organic bamboo, naturally anti-bacterial.',
    ecoScore: 4.7,
    carbonFootprint: 0.6,
    category: 'Kitchenware',
    certifications: ['FSC Certified Bamboo', 'Organic'],
    price: 19.99,
    materials: ['Organic Bamboo'],
    durabilityScore: 4,
    packagingScore: 4, // Minimal paper wrap
    healthImpactScore: 5,
  },
  {
    id: '8',
    name: 'Natural Rubber Yoga Mat',
    imageUrl: '/Natural Rubber Yoga Mat.jpeg',
    imagePrompt: 'A rolled-up natural rubber yoga mat in a calming earth tone color, displayed in a bright, airy yoga studio setting.',
    description: 'Eco-friendly yoga mat made from sustainably sourced natural rubber, providing excellent grip and cushioning.',
    ecoScore: 4.6,
    carbonFootprint: 1.5,
    category: 'Fitness',
    certifications: ['Sustainably Sourced Rubber'],
    price: 69.00,
    materials: ['Natural Rubber', 'Cotton Carry Strap'],
    durabilityScore: 4,
    packagingScore: 3, // Recycled paper band
    healthImpactScore: 5,
  },
  {
    id: '9',
    name: 'Reusable Mesh Produce Bags (Set of 4)',
    imageUrl: '/Reusable Mesh Produce Bags (Set of 4).jpeg',
    imagePrompt: 'A set of five different sized reusable mesh produce bags, filled with colorful fruits and vegetables, on a farmers market stall.',
    description: 'Say goodbye to single-use plastic produce bags with this set of 5 washable and reusable mesh bags.',
    ecoScore: 4.8,
    carbonFootprint: 0.2, // Very low for the product itself
    category: 'Groceries',
    certifications: [],
    price: 12.99,
    materials: ['Recycled PET Mesh'],
    durabilityScore: 3, // Mesh can snag over time
    packagingScore: 5, // Minimal, often just a paper sleeve
    healthImpactScore: 5, // No direct contact with food preparation
  }
];

export const DEFAULT_GROUP_BUY_DISCOUNT_PERCENTAGE = 15; // 15% CO2 reduction for group buy simulation
export const ECO_PACKAGING_CO2_SAVING = 0.2; // kg CO2e saved by choosing eco-friendly packaging (simulated)

export const AVAILABLE_ECO_INTERESTS: EcoInterest[] = [
  { id: 'organic', name: 'Organic Materials', description: 'Products made with certified organic materials.' },
  { id: 'recycled', name: 'Recycled Content', description: 'Products incorporating recycled materials.' },
  { id: 'low_carbon', name: 'Low Carbon Footprint', description: 'Products with a demonstrably lower carbon footprint.' },
  { id: 'plastic_free', name: 'Plastic-Free', description: 'Products and packaging that avoid plastics.' },
  { id: 'vegan', name: 'Vegan', description: 'Products free from animal-derived ingredients.' },
  { id: 'fair_trade', name: 'Fair Trade', description: 'Products supporting ethical labor practices.' },
  { id: 'water_saving', name: 'Water Saving', description: 'Products manufactured using water-efficient processes or that help save water.' },
  { id: 'energy_efficient', name: 'Energy Efficient', description: 'Products that consume less energy during use or manufacturing.' },
  { id: 'locally_sourced', name: 'Locally Sourced', description: 'Products made with materials sourced locally to reduce transport emissions.' },
  { id: 'minimal_packaging', name: 'Minimal Packaging', description: 'Products with reduced or no packaging.' },
];

export const PREDEFINED_SEARCH_SUGGESTIONS = [
  "organic cotton",
  "bamboo toothbrush",
  "recycled backpack",
  "solar charger",
  "eco friendly gifts",
  "sustainable kitchenware",
  "plastic free shampoo",
  "vegan leather wallet"
];

export const COINS_DAILY_LOGIN = 5;
export const COINS_PER_KG_CO2_SAVED = 10; // For product analysis feature
export const MIN_COINS_PER_ANALYSIS = 2; // Minimum coins even if CO2 saved is very low
export const COINS_SUSTAINABLE_PURCHASE_HIGH_ECOSCORE = 15;
export const HIGH_ECOSCORE_THRESHOLD = 3.7; // Products with EcoScore >= this get purchase bonus (Adjusted from 4.0)
export const FIRST_ANALYSIS_BONUS = 20;
export const NOVICE_ANALYZER_THRESHOLD = 5; // Number of analyses to become Novice
export const NOVICE_ANALYZER_BONUS = 30;
export const ANALYSIS_STREAK_3_DAY_THRESHOLD = 3;
export const ANALYSIS_STREAK_3_DAY_BONUS = 25;
export const ANALYSIS_STREAK_7_DAY_THRESHOLD = 7;
export const ANALYSIS_STREAK_7_DAY_BONUS = 75;
export const COINS_PROFILE_COMPLETION = 20; // For setting eco-interests
export const ECO_EXPLORER_THRESHOLD = 15; // Number of analyses for Eco Explorer
export const ECO_EXPLORER_BONUS = 50;
export const CARBON_CRUSHER_THRESHOLD_KG = 25; // kg of CO2 estimated from analyses
export const CARBON_CRUSHER_BONUS = 100;
export const COINS_FIRST_EVER_SUSTAINABLE_PURCHASE = 50;
export const COINS_QUIZ_COMPLETION = 10; // Base coins for any quiz
export const COINS_QUIZ_PERFECT_SCORE_BONUS = 15; // Additional bonus for perfect score
export const FIRST_QUIZ_BONUS = 25; // Bonus for completing the very first quiz
export const COINS_SCREENSHOT_BONUS = 5; // For feedback with screenshot

// Achievement Keys
export const ACHIEVEMENT_FIRST_ANALYSIS = 'first_analysis_bonus';
export const ACHIEVEMENT_NOVICE_ANALYZER = 'novice_analyzer';
export const ACHIEVEMENT_ECO_EXPLORER = 'eco_explorer_bonus';
export const ACHIEVEMENT_CARBON_CRUSHER = 'carbon_crusher_bonus';
export const ACHIEVEMENT_PROFILE_COMPLETION = 'profile_completion_bonus';
export const ACHIEVEMENT_ANALYSIS_STREAK_3_DAYS = 'analysis_streak_3_days';
export const ACHIEVEMENT_ANALYSIS_STREAK_7_DAYS = 'analysis_streak_7_days';
export const ACHIEVEMENT_FIRST_EVER_SUSTAINABLE_PURCHASE = 'first_ever_sustainable_purchase_bonus';
export const ACHIEVEMENT_FIRST_QUIZ_COMPLETED = 'first_quiz_completed_bonus';
// export const ACHIEVEMENT_SUSTAINABLE_PURCHASE_PREFIX = 'sustainable_purchase_'; // e.g. sustainable_purchase_{PRODUCT_ID}

export const INITIAL_MOCK_REWARDS: CoinReward[] = [
  { id: 'discount_5', name: '5% Off Coupon', description: 'Get 5% off your next individual cart purchase.', cost: 50, category: 'Discount' },
  { id: 'ebook_eco', name: 'Eco Living Guide Ebook', description: 'A digital guide to sustainable living.', cost: 100, category: 'Digital Good' },
  { id: 'plant_tree', name: 'Plant a Tree (Simulated)', description: 'We will (simulate) planting a tree on your behalf.', cost: 150, category: 'Eco Action' },
  { id: 'discount_10', name: '10% Off Coupon', description: 'A bigger 10% discount for true eco-shoppers!', cost: 250, category: 'Discount' }
];

export const AVAILABLE_QUIZZES: Quiz[] = [
  {
    id: 'quiz_carbon_basics',
    title: 'Carbon Footprint Basics',
    category: 'Carbon Footprint',
    coinsOnCompletion: COINS_QUIZ_COMPLETION,
    coinsPerfectScoreBonus: COINS_QUIZ_PERFECT_SCORE_BONUS,
    questions: [
      { id: 'q1', questionText: 'What is a "carbon footprint"?', options: [{id:'o1', text:'The mark your shoes leave on soft earth.'}, {id:'o2', text:'The total amount of greenhouse gases generated by our actions.'}, {id:'o3', text:'A type of eco-friendly shoe.'}], correctOptionId: 'o2', explanation: 'A carbon footprint is the total greenhouse gas emissions caused by an individual, event, organization, service, place or product.'},
      { id: 'q2', questionText: 'Which of these is NOT a major greenhouse gas?', options: [{id:'o1', text:'Carbon Dioxide (CO2)'}, {id:'o2', text:'Methane (CH4)'}, {id:'o3', text:'Oxygen (O2)'}], correctOptionId: 'o3', explanation: 'Oxygen is essential for life but is not a greenhouse gas. CO2 and Methane are potent greenhouse gases.'},
      { id: 'q3', questionText: 'What is one common way individuals can reduce their carbon footprint?', options: [{id:'o1', text:'Driving a larger car.'}, {id:'o2', text:'Eating more red meat.'}, {id:'o3', text:'Using public transport or cycling.'}], correctOptionId: 'o3', explanation: 'Using public transport, cycling, or walking reduces reliance on personal vehicles, which are a major source of CO2 emissions.'},
    ]
  },
  {
    id: 'quiz_recycling_facts',
    title: 'Recycling Facts',
    category: 'Recycling',
    coinsOnCompletion: COINS_QUIZ_COMPLETION,
    coinsPerfectScoreBonus: COINS_QUIZ_PERFECT_SCORE_BONUS,
    questions: [
      { id: 'q1_rec', questionText: 'What does the "chasing arrows" symbol on a plastic item always mean?', options: [{id:'o1',text:'It means the item is definitely recyclable everywhere.'}, {id:'o2',text:'It indicates the type of plastic resin used.'}, {id:'o3',text:'It means the item is made from recycled materials.'}], correctOptionId: 'o2', explanation: 'The symbol with a number inside identifies the plastic resin type. Recyclability depends on local facilities.'},
      { id: 'q2_rec', questionText: 'Should you rinse food containers before recycling?', options: [{id:'o1',text:'No, it wastes water.'}, {id:'o2',text:'Yes, to remove food residue that can contaminate other recyclables.'}, {id:'o3',text:'Only if they are very dirty.'}], correctOptionId: 'o2', explanation: 'Food residue can contaminate bales of recyclables, making them unusable. Clean and dry is best!'},
    ]
  }
];

export const FEEDBACK_CATEGORIES: Record<FeedbackCategoryName, FeedbackCategoryDetails> = {
  bug_report: { label: 'Bug Report', coins: 20, priority: 'high' },
  feature_request: { label: 'Feature Request', coins: 15, priority: 'medium' },
  sustainability_accuracy: { label: 'Sustainability Data Accuracy', coins: 25, priority: 'high' },
  user_experience: { label: 'User Experience Issue', coins: 10, priority: 'medium' },
  product_suggestion: { label: 'New Product Suggestion', coins: 5, priority: 'low' },
  product_quality_issue: { label: 'Product Quality Issue (Received)', coins: 15, priority: 'medium'},
  delivery_issue: { label: 'Delivery Problem', coins: 10, priority: 'medium'},
  website_navigation: { label: 'Website Navigation Difficulty', coins: 8, priority: 'low'},
  pricing_feedback: { label: 'Pricing Feedback', coins: 5, priority: 'low'},
  account_issue: {label: 'Account/Login Issue', coins: 12, priority: 'medium'},
  payment_issue: {label: 'Payment Problem', coins: 15, priority: 'high'},
  order_issue: {label: 'Order Processing Issue', coins: 12, priority: 'medium'},
  general_feedback: { label: 'General Feedback', coins: 5, priority: 'low' },
  other: { label: 'Other', coins: 3, priority: 'low' },
};

export const SELLER_REGISTRATION_STEPS: SellerRegistrationStepConfig[] = [
  { id: 'business_info', title: 'Business Information', description: 'Tell us about your business.', coinReward: 10 },
  { id: 'sustainability_profile', title: 'Sustainability Profile', description: 'Highlight your eco-friendly practices.', coinReward: 15 },
  { id: 'verification_documents', title: 'Verification Documents', description: 'Upload necessary documents (simulated).', coinReward: 20 },
  { id: 'payment_setup', title: 'Payment Setup', description: 'Configure how you want to get paid (simulated).', coinReward: 10 },
  { id: 'store_customization', title: 'Store Customization', description: 'Personalize your seller storefront (simulated).', coinReward: 5 },
];

export const SELLER_ONBOARDING_ACHIEVEMENTS: Record<string, SellerAchievement> = {
  registration_quick_starter: { id: 'seller_reg_quick_starter', name: 'Registration Quick Starter', description: 'Completed all seller registration steps.', coins: 50 },
  eco_profile_pro: { id: 'seller_eco_profile_pro', name: 'Eco Profile Pro', description: 'Provided a detailed sustainability profile.', coins: 25 },
  sustainability_champion_docs: { id: 'seller_sustain_champion_docs', name: 'Sustainability Champion (Docs)', description: 'Uploaded 2+ sustainability certificates.', coins: 30 },
  // More can be added, e.g., first_product_listed, first_sale_made (simulated)
};

export const INITIAL_SELLER_PRODUCTS: Product[] = [ 
  {
    id: 'seller-item-1',
    name: 'Handmade Recycled Paper Journal',
    imageUrl: 'https://picsum.photos/seed/seller_journal/400/300',
    imagePrompt: 'A unique, artisanal journal with a textured cover made from recycled paper. Earthy tones, possibly with visible fibers or pressed flowers.',
    description: 'Unique journal made from 100% recycled paper by local artisans.',
    ecoScore: 4.5,
    carbonFootprint: 0.3,
    category: 'Stationery',
    certifications: ['Handmade', 'Recycled Content'],
    price: 18.00,
    materials: ['Recycled Paper', 'Natural Dyes'],
    durabilityScore: 3,
    packagingScore: 4,
    healthImpactScore: 5,
  },
  {
    id: 'seller-item-2',
    name: 'Organic Beeswax Food Wraps Set',
    imageUrl: 'https://picsum.photos/seed/beeswax_wraps/400/300',
    imagePrompt: 'A set of three colorful organic cotton food wraps coated in beeswax, neatly folded or wrapping pieces of fruit/bread. Bright, kitchen setting.',
    description: 'Reusable and biodegradable alternative to plastic wrap. Set of 3 sizes.',
    ecoScore: 4.8,
    carbonFootprint: 0.2,
    category: 'Kitchenware',
    certifications: ['GOTS Certified Organic Cotton', 'Natural Beeswax'],
    price: 22.50,
    materials: ['Organic Cotton', 'Beeswax', 'Jojoba Oil', 'Tree Resin'],
    durabilityScore: 3, 
    packagingScore: 5, 
    healthImpactScore: 5, 
  }
];

// --- Phase 7 Constants ---
export const MOCK_USER_IMPACT_METRICS: UserImpactMetrics = {
  personal_stats: {
    total_co2_saved: 125.7,
    total_products_analyzed: 38,
    coins_earned: 1250,
    sustainability_streak: 7,
    eco_score_improvement: 15,
  },
  comparative_stats: {
    vs_avg_user_co2_saved_percent: 22, 
    community_ranking: 152,
    global_percentile: 88, 
  },
  environmental_impact: { 
    trees_equivalent: 0, 
    water_saved_liters: 1500, 
    waste_reduced_kg: 12.5,  
    carbon_offset_value_usd: 0, 
  },
  time_series_data: {
    daily_co2_savings: [
      { date: '2024-07-01', value: 1.2 }, { date: '2024-07-02', value: 0.8 },
      { date: '2024-07-03', value: 2.1 }, { date: '2024-07-04', value: 0.5 },
      { date: '2024-07-05', value: 1.5 }, { date: '2024-07-06', value: 2.5 },
      { date: '2024-07-07', value: 1.0 },
    ],
  },
};

export const CO2_PER_TREE_EQUIVALENT_KG = 21; 
export const USD_PER_KG_CO2_OFFSET = 0.015; 

export const MOCK_UserGoal: UserGoal[] = [
    {
        id: 'user_goal_1',
        title: 'Reduce Personal Carbon Footprint by 5kg monthly',
        description: 'Actively choose lower-carbon products and practices.',
        targetValue: 5,
        currentValue: 1.2,
        unit: 'kg CO2',
        isAchieved: false,
        category: 'co2_reduction',
        deadline: '2024-08-31'
    }
];
export const MOCK_AISuggestedGoal: AISuggestedGoal[] = [
    {
        id: 'ai_goal_1',
        title: 'Analyze 5 Products This Week',
        description: 'Deepen your understanding of product sustainability by analyzing 5 different items.',
        targetValue: 5,
        unit: 'products',
        category: 'product_analysis',
        reasoning: "Frequent analysis helps build eco-awareness.",
        potentialCoinReward: 25
    },
    {
        id: 'ai_goal_2',
        title: 'Complete a Quiz on Carbon Footprints',
        description: 'Expand your knowledge on carbon footprints and their impact.',
        targetValue: 1, 
        unit: 'quiz',
        category: 'learning',
        reasoning: "Understanding carbon footprints is key to making informed choices.",
        potentialCoinReward: 30
    }
];
// --- End Phase 7 Constants ---

// --- Phase 1: Circular Economy Marketplace Constants ---
export const MARKETPLACE_ITEM_CATEGORIES: string[] = [
  "Apparel", "Electronics", "Books", "Home Goods", "Furniture", "Toys & Games", "Sports & Outdoors", "Collectibles", "Other"
];

export const COINS_FOR_LISTING_ITEM = 5; 
export const COINS_FOR_SUCCESSFUL_MARKETPLACE_SALE = 25; 
export const COINS_FOR_MARKETPLACE_PURCHASE_USED_ITEM = 10; 
export const ESTIMATED_CO2_SAVING_PER_USED_ITEM_KG = 1.5; 

export const INITIAL_MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: 'mp-1',
    userId: 'simUser123',
    title: 'Lightly Used "EcoAdventures" Board Game',
    description: 'Played a few times, great condition. All pieces included. Fun for the whole family!',
    category: 'Toys & Games',
    condition: MarketplaceCondition.LIKE_NEW,
    price: 150, 
    currency: 'EcoCoins',
    images: ['https://picsum.photos/seed/boardgame1/400/300', 'https://picsum.photos/seed/boardgame2/400/300'],
    status: MarketplaceListingStatus.AVAILABLE,
    listedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
    estimatedCo2Saved: 1.2,
    location: "Greenville, USA"
  },
  {
    id: 'mp-2',
    userId: 'simUser456',
    title: 'Vintage Denim Jacket - Size M',
    description: 'Classic denim jacket, worn but still has lots of life. Some fading which adds character.',
    category: 'Apparel',
    condition: MarketplaceCondition.GOOD,
    price: 25, 
    currency: 'USD_SIMULATED',
    images: ['https://picsum.photos/seed/denimjacket/400/300'],
    status: MarketplaceListingStatus.AVAILABLE,
    listedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 
    estimatedCo2Saved: 2.5, 
    location: "Eco City, CA"
  },
  {
    id: 'mp-3',
    userId: 'simUser789',
    title: 'Set of 4 Ceramic Mugs - Willing to Trade',
    description: 'Cute ceramic mugs, no chips or cracks. Looking to trade for interesting books or small plants.',
    category: 'Home Goods',
    condition: MarketplaceCondition.GOOD,
    price: 'Trade',
    currency: 'Trade',
    images: ['https://picsum.photos/seed/mugs/400/300'],
    status: MarketplaceListingStatus.AVAILABLE,
    listedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 
    estimatedCo2Saved: 0.8,
    location: "Riverside, TX"
  },
];
// --- End Phase 1 Marketplace Constants ---

// --- Phase 3: Return Packaging System Constants ---
export const COINS_PACKAGE_RETURN_BASE = 10;
export const COINS_PACKAGE_GOOD_CONDITION_BONUS = 5;
export const PENALTY_PACKAGE_SLIGHT_DAMAGE = 5;
export const PENALTY_PACKAGE_HEAVY_DAMAGE = 15;

export const INITIAL_RETURNABLE_PACKAGES: ReturnablePackage[] = [
  {
    id: 'ret-pkg-1',
    orderId: 'order-123',
    productName: 'Organic Cotton T-Shirt',
    imageUrl: INITIAL_PRODUCTS.find(p => p.id === '1')?.imageUrl,
    qrCodeData: 'RETURN-TSHIRT-XYZ789',
    status: ReturnPackageStatus.DELIVERED_TO_USER,
    returnByDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: 'simUser-default',
  },
  {
    id: 'ret-pkg-2',
    orderId: 'order-456',
    productName: 'Recycled Material Backpack',
    imageUrl: INITIAL_PRODUCTS.find(p => p.id === '3')?.imageUrl,
    qrCodeData: 'RETURN-BACKPACK-ABC123',
    status: ReturnPackageStatus.DELIVERED_TO_USER,
    returnByDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    userId: 'simUser-default',
  },
  {
    id: 'ret-pkg-3',
    orderId: 'order-789',
    productName: 'Solar Powered Phone Charger',
    imageUrl: INITIAL_PRODUCTS.find(p => p.id === '4')?.imageUrl,
    qrCodeData: 'RETURN-CHARGER-SOL456',
    status: ReturnPackageStatus.RETURN_INITIATED,
    reportedConditionByUser: PackageCondition.GOOD,
    returnByDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    userId: 'simUser-default',
  }
];
// --- End Phase 3 Constants ---

// --- FAQ Data ---
export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq1',
    question: 'How do I earn EcoCoins?',
    answer: 'You can earn EcoCoins in various ways: daily logins, analyzing products using the "Analyze Product" feature, purchasing products with a high EcoScore (>= 3.7), completing your profile by setting eco-interests, achieving analysis streaks, completing sustainability quizzes, successfully listing or purchasing items on the marketplace, and returning packaging through our Return Packaging System.',
    category: 'EcoCoins',
  },
  {
    id: 'faq2',
    question: 'What is the difference in EcoCoin earning for regular products vs. marketplace items?',
    answer: `For regular products from our catalog, you earn ${COINS_SUSTAINABLE_PURCHASE_HIGH_ECOSCORE} EcoCoins if the product's EcoScore is ${HIGH_ECOSCORE_THRESHOLD} or higher. For marketplace items, the buyer earns ${COINS_FOR_MARKETPLACE_PURCHASE_USED_ITEM} EcoCoins for purchasing any available used item, promoting reuse. Listing an item on the marketplace also earns you ${COINS_FOR_LISTING_ITEM} EcoCoins.`,
    category: 'EcoCoins',
  },
  {
    id: 'faq3',
    question: 'How is the EcoScore calculated?',
    answer: 'The EcoScore is a comprehensive rating from 1 to 5 (5 being best). It considers the product\'s carbon footprint (lower is better), durability, eco-friendliness of its packaging, health impact (low chemical use), and the sustainability of its materials (e.g., organic, recycled).',
    category: 'Products & Sustainability',
  },
  {
    id: 'faq4',
    question: 'How does the Circular Economy Marketplace work?',
    answer: 'Our marketplace allows users to list, sell, buy, or trade used items. This extends product lifecycles and promotes a circular economy. Listing an item or purchasing a used item rewards you with EcoCoins. You can set prices in EcoCoins, simulated USD, or offer items for trade.',
    category: 'Marketplace',
  },
  {
    id: 'faq5',
    question: 'What\'s the difference between "Analyze by URL" and "Analyze by Image"?',
    answer: '"Analyze by Image" sends the uploaded image to our AI for visual analysis to identify the product and estimate its sustainability. "Analyze by URL" is currently a simulation; the AI imagines a common product that might be sold at such a URL and provides a fictional analysis, as direct web page scraping is not performed client-side.',
    category: 'Product Analysis',
  },
  {
    id: 'faq_eco_assistant',
    question: 'What can I ask the Eco Assistant chatbot?',
    answer: `The Eco Assistant is here to help you with two main things:
1.  **App Navigation & Features:** Ask it questions like 'Where can I find my EcoCoins wallet?', 'How do I list an item on the marketplace?', or 'What is an EcoScore?'. It has information about the EcoShop Navigator's sections and functionalities.
2.  **Sustainability Advice:** You can also ask general eco-specific questions, such as 'How can I reduce my plastic use?' or 'What are some tips for sustainable fashion?'. It will provide helpful information and tips.

The assistant also considers your recent product analysis history for more relevant general advice.`,
    category: 'App Features',
  },
  {
    id: 'faq6',
    question: 'What is a Group Buy?',
    answer: 'The Group Buy feature (simulated) allows multiple users to collectively purchase items. This can lead to benefits like reduced shipping emissions (simulated as CO2 savings) and potential discounts. Add items to your Group Buy cart to see the simulated impact!',
    category: 'Shopping Features',
  },
  {
    id: 'faq7',
    question: 'How does the "Sustainable Packaging" option in the Dashboard work?',
    answer: `Opting for "Sustainable Packaging" in your dashboard applies a small simulated CO2 saving (${ECO_PACKAGING_CO2_SAVING} kg CO2e) to your orders, reflecting the reduced impact of eco-friendly packaging materials.`,
    category: 'Shopping Features',
  },
  {
    id: 'faq8',
    question: 'What is the "My Impact Dashboard" for?',
    answer: 'The "My Impact Dashboard" (currently a mock-up) will provide a personalized overview of your sustainable actions, including total CO2 saved, products analyzed, EcoCoins earned, sustainability streaks, and comparisons against community averages. It aims to visualize your positive environmental contributions.',
    category: 'User Engagement',
  },
   {
    id: 'faq9',
    question: 'How do I become a seller?',
    answer: 'Click on the "Become a Seller" link in the footer to go through our (simulated) seller registration wizard. Completing steps will also earn you EcoCoins!',
    category: 'Seller Features',
  },
  {
    id: 'faq10',
    question: 'What are Eco-Interests in my Dashboard?',
    answer: 'Setting your Eco-Interests (e.g., "Organic Materials", "Recycled Content") helps personalize your experience. Currently, these preferences can influence AI-powered product search suggestions to better match what you care about.',
    category: 'User Profile',
  },
  {
    id: 'faq11',
    question: 'How does the AI-powered search work?',
    answer: 'When you search for products and if the Gemini AI is available, it can generate new product ideas based on your keywords and selected Eco-Interests. If AI is not available, the search will filter through our existing product catalog.',
    category: 'App Features',
  },
  {
    id: 'faq12',
    question: 'How does the Return Packaging System work?',
    answer: 'For eligible orders, you can return the product packaging after use. Go to "My Returns" (link in the header), select the package, report its condition, and use the provided (simulated) QR code at a drop-off point. This helps reduce waste and promotes a circular economy.',
    category: 'Returns & Packaging',
  },
  {
    id: 'faq13',
    question: 'How do I earn EcoCoins for returning packaging?',
    answer: `You earn a base of ${COINS_PACKAGE_RETURN_BASE} EcoCoins for successfully returning packaging. If the packaging is in "Good" condition, you'll receive an additional ${COINS_PACKAGE_GOOD_CONDITION_BONUS} EcoCoins bonus. If it's "Slightly Damaged", there's a ${PENALTY_PACKAGE_SLIGHT_DAMAGE} EcoCoin penalty from the base. "Heavily Damaged" packaging may result in a larger penalty and no base reward.`,
    category: 'Returns & Packaging',
  },
  {
    id: 'faq14',
    question: 'What are the different package conditions I can report?',
    answer: 'You can report the packaging as "Good" (like new, fully reusable), "Slightly Damaged" (minor wear, still functional), or "Heavily Damaged" (significant damage, may not be reusable). Please be honest as this impacts the return process and your potential EcoCoin reward.',
    category: 'Returns & Packaging',
  }
];
// --- End FAQ Data ---
