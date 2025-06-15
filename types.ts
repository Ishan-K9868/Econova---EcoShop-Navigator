
export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  imagePrompt?: string; // Optional: For AI image generation
  description: string;
  ecoScore: number; // Original simple ecoScore, will be re-calculated
  carbonFootprint: number; // in kg CO2e
  category: string;
  certifications: string[];
  price: number;
  // New detailed sustainability attributes
  materials: string[]; // e.g., ["Organic Cotton", "Recycled Polyester"]
  durabilityScore: number; // 1-5 (stars)
  packagingScore: number; // 1-5 (stars, for eco-friendliness of packaging)
  healthImpactScore: number; // 1-5 (stars, for low chemical use, non-toxic etc.)
}

export interface GroupBuyItem extends Product {
  quantity: number;
}

// More generic cart item
export interface CartItem extends Product {
  quantity: number;
  cartType: CartType; // To distinguish between group and individual
}

export enum CartType {
  GROUP_BUY = "group_buy",
  INDIVIDUAL = "individual",
}

export interface GeneratedProductIdea {
  name: string;
  category:string;
  description: string;
  price: number;
  materials?: string[];
  durabilityScore?: number;
  packagingScore?: number;
  healthImpactScore?: number;
}

export enum AlertType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
}

export interface AlertMessage {
  id: string;
  type: AlertType;
  message: string;
}

export interface EcoInterest {
  id: string;
  name: string;
  description: string;
}

export interface UserProfile {
  name: string;
  ecoInterests: string[]; // Array of EcoInterest IDs
  userId: string; // Added simulated user ID
}

export type Theme = 'light' | 'dark';

export interface ExternalAnalysisResult {
  id: string; // For history tracking
  productName: string;
  co2FootprintKg: number;
  sustainabilityScore: number; // 0-100
  sourceType: 'url' | 'image';
  sourceValue: string; // URL string or image file name
  analysisDate: Date; // Changed to Date object
  // Optional, for future enhancement based on the plan
  ecoAlternatives?: { name: string; reason: string; }[];
  impactBreakdown?: Record<string, string | number>;
}

// --- Multi-Modal Input Types ---
export interface BarcodeAnalysisResult { // Renamed and enhanced
  id: string;
  productName: string;
  co2FootprintKg: number;
  sustainabilityScore: number; // 0-100
  simulatedBarcode: string;
  sourceType: 'image_barcode_scan'; // Specific source type
  sourceValue: string; // image file name
  analysisDate: Date;
  imageUrl?: string; // Data URL of the uploaded image for preview/history
  message?: string; // Optional message from analysis
}

export type VoiceCommandAction = 'search_products' | 'analyze_product_by_name' | 'get_eco_tip' | 'navigate_to_section' | 'unknown_intent';

export interface VoiceCommandInterpretation { // For structured voice command results from Gemini
  originalTranscript: string;
  action: VoiceCommandAction;
  parameters: {
    query?: string; // For search_products
    productName?: string; // For analyze_product_by_name
    sectionName?: 'home' | 'cart' | 'dashboard' | 'wallet' | 'marketplace'; // For navigate_to_section
  };
  aiConfidence?: number; // Optional
  message?: string; // Any message from the interpretation process
}
// --- End Multi-Modal Input Types ---


export interface ChatMessage { // General app chat messages (e.g. for main chatbot)
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface MarketplaceChatMessage { // Specific for marketplace seller chat
  id: string;
  listingId: string; // Link message to a specific marketplace listing
  text: string;
  sender: 'user' | 'seller'; // 'seller' will be AI simulated
  timestamp: Date;
}


export interface CoinTransaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  reason: string;
  date: Date;
  context?: { // Optional context for the transaction
    productId?: string;
    achievementId?: string;
    analyzedCo2Kg?: number;
    quizId?: string;
    feedbackId?: string;
    sellerStepId?: string; // For seller registration step rewards
    marketplaceListingId?: string; // For marketplace transactions
    returnPackageId?: string; // For return packaging system
  };
}

export interface CoinReward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'Discount' | 'Digital Good' | 'Eco Action';
}

export interface UserStreaks {
  analysisStreakDays: number;
  lastAnalysisDate: string | null; // Store as ISO string (YYYY-MM-DD)
}

export interface UserMilestones {
  productsAnalyzedCount: number;
  sustainablePurchasesCount: number; // Total count of sustainable purchase actions
  totalCo2EstimatedFromAnalyses: number;
  quizzesCompletedCount: number; // Number of quizzes completed
  achievementsUnlocked: string[]; // e.g., ['first_analysis_bonus', 'novice_analyzer', 'first_quiz_completed', 'first_ever_sustainable_purchase']
  marketplaceItemsListed: number;
  marketplaceItemsSold: number; // This milestone refers to items sold BY THE CURRENT USER.
  marketplaceItemsPurchased: number; // New: Items purchased BY THE CURRENT USER from the marketplace.
  packagesReturnedSuccessfully: number; // For Return Packaging System
}

// --- Quiz System Types ---
export interface QuizQuestion {
  id: string;
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  category: string; // e.g., "Carbon Footprint", "Recycling"
  questions: QuizQuestion[];
  coinsOnCompletion: number;
  coinsPerfectScoreBonus?: number; // Optional bonus for getting all answers right
}
// --- End Quiz System Types ---

// --- Feedback System Types ---
export interface FeedbackContextData {
  productId?: string;
  page?: string; // e.g., current route or view name
  userAction?: string; // e.g., 'completed_analysis', 'viewed_product_X'
}

export type FeedbackCategoryName =
  | 'bug_report'
  | 'feature_request'
  | 'sustainability_accuracy'
  | 'user_experience'
  | 'product_suggestion'
  | 'general_feedback'
  | 'product_quality_issue'
  | 'delivery_issue'
  | 'website_navigation'
  | 'pricing_feedback'
  | 'account_issue'
  | 'payment_issue'
  | 'order_issue'
  | 'other';

export interface FeedbackCategoryDetails {
  label: string;
  coins: number;
  priority: 'low' | 'medium' | 'high';
}

export type FeedbackSeverity = 1 | 2 | 3 | 4 | 5; // 1 = minor, 5 = critical

export interface ClientFeedbackSubmission {
  id: string; // client-generated
  userId?: string; // Optional on client, could be added if user accounts existed
  category: FeedbackCategoryName;
  title: string;
  description: string;
  severity: FeedbackSeverity;
  context?: FeedbackContextData;
  screenshot?: File; // File object for potential upload
  screenshotPreview?: string; // For displaying on client before "upload"
  coinsAwarded: number;
  submissionDate: Date;
}
// --- End Feedback System Types ---

// --- Seller Registration Types ---
export interface BusinessInfoData {
  businessName: string;
  legalName?: string;
  businessType: 'individual' | 'small_business' | 'corporation' | 'nonprofit' | '';
  registrationNumber?: string;
  taxId: string;
  foundedDate?: string; // Store as YYYY-MM-DD string
}

export interface SustainabilityProfileData {
  sustainabilityPractices: string;
  certifications: string; // Comma-separated string
  ecoCommitmentStatement?: string;
}

export interface DocumentUploadData {
  businessLicense?: File | null;
  businessLicensePreview?: string | null;
  taxCertificate?: File | null;
  taxCertificatePreview?: string | null;
  sustainabilityCertificates?: File[] | null; // Array of files
  sustainabilityCertificatesPreviews?: string[] | null; // Array of preview strings
}

export interface PaymentSetupData {
  bankAccountName?: string;
  bankAccountNumber?: string; // UI only
  routingNumber?: string; // UI only
  paymentMethod: 'bank_transfer' | 'paypal' | 'stripe' | '';
  taxExempt: boolean;
  taxRate?: number; // Percentage
}

export interface StoreCustomizationData {
  storeName: string;
  storeDescription: string;
  storeLogo?: File | null;
  storeLogoPreview?: string | null; // Data URL for preview
}

// Union type for data in any single step
export type SellerRegistrationStepData =
  | BusinessInfoData
  | SustainabilityProfileData
  | DocumentUploadData
  | PaymentSetupData
  | StoreCustomizationData;

// Object to hold all form data, keyed by step ID
export interface SellerFormData {
  business_info?: BusinessInfoData;
  sustainability_profile?: SustainabilityProfileData;
  verification_documents?: DocumentUploadData;
  payment_setup?: PaymentSetupData;
  store_customization?: StoreCustomizationData;
}

export interface SellerRegistrationStepConfig {
  id: keyof SellerFormData; // e.g., 'business_info', 'sustainability_profile'
  title: string;
  description: string;
  coinReward?: number;
}

export interface SellerAchievement {
  id: string;
  name: string;
  description: string;
  coins: number;
  badge_url?: string; // Optional path to an SVG or image
}
// --- End Seller Registration Types ---

// --- Seller Admin Page Types ---
export type AppViewType = 'home' | 'analyzeExternal' | 'sellerAdmin' | 'personalImpactDashboard' | 'marketplace' | 'faq' | 'returns';

export interface SellerProduct extends Product { // For products listed by seller
    sellerId: string; // Could be a simulated ID
    status?: 'active' | 'pending_review' | 'draft'; // Example status
}

export interface NewProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  materials: string; // Comma-separated initially
  carbonFootprint: number;
  durabilityScore: number;
  packagingScore: number;
  healthImpactScore: number;
  imageUrl?: string; // Optional, can be text input for simplicity
  imageFile?: File | null; // For actual file upload
}
// --- End Seller Admin Page Types ---

// --- Phase 7: User Impact Dashboard Types ---
export interface PersonalStats {
  total_co2_saved: number;
  total_products_analyzed: number;
  coins_earned: number;
  sustainability_streak: number; // e.g., days of consecutive analysis/purchases
  eco_score_improvement: number; // Percentage point improvement in avg EcoScore of purchases, or similar
}

export interface ComparativeStats {
  vs_avg_user_co2_saved_percent: number; // e.g., 25 means 25% more than average user
  community_ranking?: number; // Optional: e.g., 152 (meaning 152nd place)
  global_percentile?: number; // Optional: e.g., 88 (meaning in top 12%)
}

export interface EnvironmentalImpactNumbers { // Renamed from EnvironmentalImpact for clarity
  trees_equivalent: number; // Calculated or direct from metrics
  water_saved_liters: number;
  waste_reduced_kg: number;
  carbon_offset_value_usd: number; // Calculated or direct
}

export interface TimeSeriesDataPoint {
  date: string; // e.g., 'YYYY-MM-DD'
  value: number;
}

export interface UserImpactMetrics {
  personal_stats: PersonalStats;
  comparative_stats: ComparativeStats;
  environmental_impact: EnvironmentalImpactNumbers;
  time_series_data: {
    daily_co2_savings: TimeSeriesDataPoint[];
    // weekly_eco_score_avg?: TimeSeriesDataPoint[]; // Example for future
  };
}

export interface UserGoal {
    id: string;
    title: string;
    description: string;
    targetValue: number;
    currentValue: number;
    unit: string; // e.g., 'kg CO2', 'products', 'days'
    isAchieved: boolean;
    category: 'co2_reduction' | 'product_analysis' | 'streak' | 'learning' | 'other';
    deadline?: string; // Optional: 'YYYY-MM-DD'
}

export interface AISuggestedGoal extends Omit<UserGoal, 'currentValue' | 'isAchieved' | 'id'> {
    id: string; // Needs an ID for mapping
    reasoning: string; // AI's rationale for suggesting this goal
    potentialCoinReward?: number;
}
// --- End Phase 7 Types ---

// Ensure BarcodeScanResult is defined if used by BarcodeScannerMockup explicitly, or adapt.
// For the new plan:
// BarcodeScanResult is effectively replaced by BarcodeAnalysisResult for MultiModalHub's onScanResult.
// VoiceCommandResult is replaced by VoiceCommandInterpretation for MultiModalHub's onVoiceCommand.
// These are not direct replacements in old files if they are not used by MultiModalHub.
// However, the prompt specifically asks to "hook up simulations/mockups", implying BarcodeScannerMockup
// and VoiceSearchMockup are the targets. So their output types will change.

// Compatibility placeholder if old BarcodeScanResult is still needed elsewhere (it shouldn't be for this change)
export interface BarcodeScanResult {
  barcode: string;
  productName?: string; // Optional, as barcode might not always map to a known product
  message?: string;
}
// Compatibility placeholder for VoiceCommandResult (it shouldn't be for this change)
export interface VoiceCommandResult {
  transcript: string;
  action?: string; // e.g., "search", "analyze"
  parameters?: Record<string, any>;
  message?: string;
}

// --- Phase 1: Circular Economy Marketplace Types ---
export enum MarketplaceCondition {
  NEW_WITH_TAGS = "New with Tags",
  LIKE_NEW = "Like New",
  GOOD = "Good Condition",
  FAIR = "Fair Condition",
}

export enum MarketplaceListingStatus {
  AVAILABLE = "Available",
  SOLD = "Sold",
  RESERVED = "Reserved", // Optional
}

export interface MarketplaceListing {
  id: string;
  userId: string; // Simulated ID of the user listing the item
  title: string;
  description: string;
  category: string; // Could use MARKETPLACE_ITEM_CATEGORIES
  condition: MarketplaceCondition;
  price: number | 'Trade'; // Price in EcoCoins or "Trade"
  currency: 'EcoCoins' | 'USD_SIMULATED' | 'Trade'; // Indicate currency type
  images: string[]; // Array of image URLs (local blob URLs for preview, or hosted URLs)
  imageFiles?: File[]; // For upload
  status: MarketplaceListingStatus;
  listedDate: Date;
  estimatedCo2Saved?: number; // CO2 saved by buying this used item vs. new (simulated/calculated)
  location?: string; // Optional: general location like "City, State"
}
// --- End Phase 1 Marketplace Types ---

// --- FAQ Types ---
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string; // Optional category for filtering/grouping
}
// --- End FAQ Types ---

// --- Return Packaging System Types (Phase 3) ---
export enum ReturnPackageStatus {
  DELIVERED_TO_USER = "Ready for Return", // Package delivered, user can initiate return
  RETURN_INITIATED = "Return Initiated", // User initiated return, QR code generated
  PROCESSING_RETURN = "Return Processing", // Package received by hub, under assessment
  RETURN_COMPLETED = "Return Completed", // Successfully returned and processed
  RETURN_REJECTED = "Return Rejected", // Package too damaged or invalid
}

export enum PackageCondition {
  GOOD = "Good",
  SLIGHTLY_DAMAGED = "Slightly Damaged",
  HEAVILY_DAMAGED = "Heavily Damaged",
}

export interface ReturnablePackage {
  id: string; // Unique ID for this returnable package instance
  orderId: string; // Associated original order ID (simulated)
  productName: string; // Name of the product whose packaging is being returned
  imageUrl?: string; // Image of the product/packaging
  qrCodeData: string; // Data for QR code (e.g., unique return ID)
  status: ReturnPackageStatus;
  returnByDate?: Date; // Optional deadline for return
  reportedConditionByUser?: PackageCondition;
  assessedConditionByHub?: PackageCondition; // Condition assessed by the processing hub
  rewardEcoCoins?: number; // EcoCoins awarded for this specific return
  userId: string; // To associate with the user
}
// --- End Return Packaging System Types ---
