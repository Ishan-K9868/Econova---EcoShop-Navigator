
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import SustainabilityInsights from './components/SustainabilityInsights';
import ProductDetailModal from './components/ProductDetailModal';
import LoadingSpinner from './components/LoadingSpinner';
import Alerts from './components/Alerts';
import CustomerDashboard from './components/CustomerDashboard';
import CartModal from './components/CartModal';
import PurchaseAnimation from './components/PurchaseAnimation';
import CheckoutAnimation from './components/CheckoutAnimation';
import SearchSuggestions from './components/SearchSuggestions';
import ExternalProductAnalyzer from './components/ExternalProductAnalyzer';
import SustainabilityChatbot from './components/SustainabilityChatbot';
import WalletPage from './components/WalletPage';
import SustainabilityQuizModal from './components/SustainabilityQuizModal';
import FeedbackModal from './components/feedback/FeedbackModal';
import SellerRegistrationWizard from './components/seller/SellerRegistrationWizard';
import SellerAdminPage from './components/seller_admin/SellerAdminPage';
import PersonalImpactDashboard from './components/analytics/PersonalImpactDashboard';
import MultiModalHub from './components/multimodal/MultiModalHub';
import MarketplaceView from './components/marketplace/MarketplaceView';
import CreateListingModal from './components/marketplace/CreateListingModal';
import MarketplaceListingDetailModal from './components/marketplace/MarketplaceListingDetailModal';
import MarketplaceChatModal from './components/marketplace/MarketplaceChatModal'; // New Import
import Footer from './components/Footer';
import FAQView from './components/faq/FAQView';
import ReturnPackagingView from './components/returns/ReturnPackagingView';
import ReturnInitiationModal from './components/returns/ReturnInitiationModal';
import Sidebar from './components/Sidebar'; // New Sidebar component


import {
    Product, CartItem, GeneratedProductIdea, AlertMessage, AlertType, UserProfile,
    CartType, Theme, ExternalAnalysisResult, ChatMessage, MarketplaceChatMessage, // Added MarketplaceChatMessage
    CoinTransaction, CoinReward,
    UserStreaks, UserMilestones, Quiz,
    FeedbackContextData, ClientFeedbackSubmission,
    SellerFormData, AppViewType,
    NewProductFormData, SellerProduct,
    UserImpactMetrics, BarcodeAnalysisResult,
    VoiceCommandInterpretation,
    MarketplaceListing, MarketplaceListingStatus, FAQItem,
    ReturnablePackage, ReturnPackageStatus, PackageCondition
} from './types';
import {
    INITIAL_PRODUCTS, DEFAULT_GROUP_BUY_DISCOUNT_PERCENTAGE, ECO_PACKAGING_CO2_SAVING, PREDEFINED_SEARCH_SUGGESTIONS,
    COINS_DAILY_LOGIN, INITIAL_MOCK_REWARDS, COINS_PER_KG_CO2_SAVED, MIN_COINS_PER_ANALYSIS, HIGH_ECOSCORE_THRESHOLD,
    COINS_SUSTAINABLE_PURCHASE_HIGH_ECOSCORE, FIRST_ANALYSIS_BONUS, NOVICE_ANALYZER_THRESHOLD,
    NOVICE_ANALYZER_BONUS, ANALYSIS_STREAK_3_DAY_THRESHOLD, ANALYSIS_STREAK_3_DAY_BONUS,
    ANALYSIS_STREAK_7_DAY_THRESHOLD, ANALYSIS_STREAK_7_DAY_BONUS,
    COINS_PROFILE_COMPLETION, ECO_EXPLORER_THRESHOLD, ECO_EXPLORER_BONUS,
    CARBON_CRUSHER_THRESHOLD_KG, CARBON_CRUSHER_BONUS,
    ACHIEVEMENT_FIRST_ANALYSIS, ACHIEVEMENT_NOVICE_ANALYZER, ACHIEVEMENT_ECO_EXPLORER,
    ACHIEVEMENT_CARBON_CRUSHER, ACHIEVEMENT_PROFILE_COMPLETION,
    ACHIEVEMENT_ANALYSIS_STREAK_3_DAYS, ACHIEVEMENT_ANALYSIS_STREAK_7_DAYS,
    COINS_FIRST_EVER_SUSTAINABLE_PURCHASE, ACHIEVEMENT_FIRST_EVER_SUSTAINABLE_PURCHASE,
    AVAILABLE_QUIZZES, COINS_QUIZ_COMPLETION, FIRST_QUIZ_BONUS, ACHIEVEMENT_FIRST_QUIZ_COMPLETED, COINS_QUIZ_PERFECT_SCORE_BONUS,
    FEEDBACK_CATEGORIES, INITIAL_SELLER_PRODUCTS,
    SELLER_ONBOARDING_ACHIEVEMENTS, MOCK_USER_IMPACT_METRICS,
    INITIAL_MARKETPLACE_LISTINGS, COINS_FOR_LISTING_ITEM, COINS_FOR_MARKETPLACE_PURCHASE_USED_ITEM, ESTIMATED_CO2_SAVING_PER_USED_ITEM_KG,
    FAQ_DATA,
    INITIAL_RETURNABLE_PACKAGES, COINS_PACKAGE_RETURN_BASE, COINS_PACKAGE_GOOD_CONDITION_BONUS, PENALTY_PACKAGE_SLIGHT_DAMAGE, PENALTY_PACKAGE_HEAVY_DAMAGE
} from './constants';
import { generateProductIdeas, isGeminiAvailable as checkGeminiAvailable, getEcoTip as fetchEcoTip, getSimulatedSellerResponse, generateProductImage } from './services/geminiService'; // Added generateProductImage & getSimulatedSellerResponse
import { calculateComprehensiveEcoScore } from './utils/ecoScoreCalculator';

const MAX_ANALYSIS_HISTORY = 10;
const MAX_FEEDBACK_HISTORY = 20;
const MAX_MARKETPLACE_LISTINGS_DISPLAY = 50;

export type NavTarget = AppViewType | 'cart' | 'dashboard' | 'wallet';


const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const productsWithCalculatedScores = INITIAL_PRODUCTS.map(p => {
        const calculatedScore = calculateComprehensiveEcoScore(p);
        return { ...p, ecoScore: calculatedScore };
      });
    return productsWithCalculatedScores;
  });

  const [groupBuyCart, setGroupBuyCart] = useState<CartItem[]>([]);
  const [individualCart, setIndividualCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [geminiAvailable, setGeminiAvailable] = useState<boolean>(true);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const storedProfile = localStorage.getItem('userProfile');
    const defaultUserId = `simUser-${Date.now()}`;
    return storedProfile ? JSON.parse(storedProfile) : { name: "Eco User", ecoInterests: [], userId: defaultUserId };
  });


  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  const [showCartModal, setShowCartModal] = useState<boolean>(false);
  const [sustainablePackaging, setSustainablePackaging] = useState<boolean>(() => {
    const storedPref = localStorage.getItem('sustainablePackaging');
    return storedPref ? JSON.parse(storedPref) : false;
  });
  const [currentCartCo2Saved, setCurrentCartCo2Saved] = useState<number>(0);
  const [animatingProductId, setAnimatingProductId] = useState<string | null>(null);

  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [lifetimeCo2Saved, setLifetimeCo2Saved] = useState<number>(() => {
     const storedVal = localStorage.getItem('lifetimeCo2Saved');
     return storedVal ? JSON.parse(storedVal) : 0;
  });

  const [showSearchSuggestions, setShowSearchSuggestions] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [currentView, setCurrentView] = useState<AppViewType>('home');
  const [analysisHistory, setAnalysisHistory] = useState<(ExternalAnalysisResult | BarcodeAnalysisResult)[]>(() => {
    const storedHistory = localStorage.getItem('analysisHistory');
    return storedHistory ? JSON.parse(storedHistory).map((item:any) => ({...item, analysisDate: new Date(item.analysisDate)})) : [];
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- COIN SYSTEM STATE ---
  const [userCoins, setUserCoins] = useState<number>(() => {
    const storedCoins = localStorage.getItem('userEcoCoins');
    return storedCoins ? JSON.parse(storedCoins) : 100; // Initial coins
  });
  const [coinTransactions, setCoinTransactions] = useState<CoinTransaction[]>(() => {
    const storedTransactions = localStorage.getItem('userCoinTransactions');
    return storedTransactions ? JSON.parse(storedTransactions).map((tx:any) => ({...tx, date: new Date(tx.date)})) : [];
  });
  const [showWalletPage, setShowWalletPage] = useState<boolean>(false);
  const [showQuizModal, setShowQuizModal] = useState<Quiz | null>(null);


  const initialStreaks: UserStreaks = { analysisStreakDays: 0, lastAnalysisDate: null };
  const initialMilestones: UserMilestones = {
    productsAnalyzedCount: 0,
    sustainablePurchasesCount: 0,
    totalCo2EstimatedFromAnalyses: 0,
    quizzesCompletedCount: 0,
    achievementsUnlocked: [],
    marketplaceItemsListed: 0,
    marketplaceItemsSold: 0,
    marketplaceItemsPurchased: 0,
    packagesReturnedSuccessfully: 0,
  };

  const [userStreaks, setUserStreaks] = useState<UserStreaks>(() => {
    const storedStreaks = localStorage.getItem('userEcoStreaks');
    return storedStreaks ? JSON.parse(storedStreaks) : initialStreaks;
  });
  const [userMilestones, setUserMilestones] = useState<UserMilestones>(() => {
    const storedMilestones = localStorage.getItem('userEcoMilestones');
    if (storedMilestones) {
      const parsed = JSON.parse(storedMilestones);
      return {
        ...initialMilestones,
        ...parsed,
        achievementsUnlocked: Array.isArray(parsed.achievementsUnlocked) ? parsed.achievementsUnlocked : [],
      };
    }
    return initialMilestones;
  });
  // --- END COIN SYSTEM STATE ---

  // --- FEEDBACK SYSTEM STATE ---
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackContextData, setFeedbackContextData] = useState<FeedbackContextData | undefined>(undefined);
  const [submittedFeedback, setSubmittedFeedback] = useState<ClientFeedbackSubmission[]>(() => {
    const storedFeedback = localStorage.getItem('userSubmittedFeedback');
    return storedFeedback ? JSON.parse(storedFeedback).map((fb:any) => ({...fb, submissionDate: new Date(fb.submissionDate)})) : [];
  });
  // --- END FEEDBACK SYSTEM STATE ---

  // --- SELLER REGISTRATION STATE ---
  const [showSellerRegistrationWizard, setShowSellerRegistrationWizard] = useState(false);
  const [sellerApplicationData, setSellerApplicationData] = useState<SellerFormData | null>(() => {
    const storedData = localStorage.getItem('sellerApplicationData');
    return storedData ? JSON.parse(storedData) : null;
  });
  // --- END SELLER REGISTRATION STATE ---

  // --- SELLER ADMIN STATE ---
  const [isSellerLoggedIn, setIsSellerLoggedIn] = useState<boolean>(() => {
     return localStorage.getItem('isSellerRegistered') === 'true' && localStorage.getItem('isSellerLoggedIn') === 'true';
  });
  // --- END SELLER ADMIN STATE ---

  // --- PHASE 7 STATE (MOCK DATA) ---
  const [userImpactData, setUserImpactData] = useState<UserImpactMetrics>(MOCK_USER_IMPACT_METRICS);
  // --- END PHASE 7 STATE ---

  // --- MARKETPLACE STATE (Phase 1) ---
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListing[]>(() => {
    const storedListings = localStorage.getItem('marketplaceListings');
    return storedListings ? JSON.parse(storedListings).map((l:any) => ({...l, listedDate: new Date(l.listedDate)})) : INITIAL_MARKETPLACE_LISTINGS;
  });
  const [showCreateListingModal, setShowCreateListingModal] = useState<boolean>(false);
  const [viewingMarketplaceListing, setViewingMarketplaceListing] = useState<MarketplaceListing | null>(null);
  // --- END MARKETPLACE STATE ---
  
  // --- MARKETPLACE CHAT STATE (NEW) ---
  const [showMarketplaceChatModal, setShowMarketplaceChatModal] = useState<boolean>(false);
  const [chattingWithSellerForListing, setChattingWithSellerForListing] = useState<MarketplaceListing | null>(null);
  const [currentMarketplaceChatMessages, setCurrentMarketplaceChatMessages] = useState<MarketplaceChatMessage[]>([]);
  const [isMarketplaceChatLoading, setIsMarketplaceChatLoading] = useState<boolean>(false);
  // --- END MARKETPLACE CHAT STATE ---


  // --- RETURN PACKAGING STATE (Phase 3) ---
  const [returnablePackages, setReturnablePackages] = useState<ReturnablePackage[]>(() => {
    const storedPackages = localStorage.getItem('returnablePackages');
    const initialPackagesWithUser = INITIAL_RETURNABLE_PACKAGES.map(pkg => ({
      ...pkg,
      userId: userProfile.userId // Ensure initial packages are associated with current user
    }));
    return storedPackages ? JSON.parse(storedPackages).map((p:any) => ({...p, returnByDate: p.returnByDate ? new Date(p.returnByDate) : undefined })) : initialPackagesWithUser;
  });
  const [showReturnInitiationModal, setShowReturnInitiationModal] = useState<boolean>(false);
  const [selectedPackageForReturn, setSelectedPackageForReturn] = useState<ReturnablePackage | null>(null);
  // --- END RETURN PACKAGING STATE ---


  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const addAlert = useCallback((message: string, type: AlertType, isCoinAlert: boolean = false) => {
    const id = Date.now().toString();
    const finalMessage = isCoinAlert ? `💰 ${message}` : message;
    setAlerts(prevAlerts => [...prevAlerts, { id, message: finalMessage, type }]);
    setTimeout(() => {
      setAlerts(currentAlerts => currentAlerts.filter(alert => alert.id !== id));
    }, isCoinAlert ? 7000 : 5000);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // --- COIN SYSTEM LOGIC ---
  const addCoins = useCallback((amount: number, reason: string, achievementKey?: string, context?: CoinTransaction['context']) => {
    if (amount <= 0) {
        return;
    }

    setUserCoins(prevCoins => {
        return prevCoins + amount;
    });

    const makeTransaction = (): CoinTransaction => ({
      id: `ct-${Date.now()}`,
      type: 'earned',
      amount,
      reason,
      date: new Date(),
      context
    });

    setCoinTransactions(prevTx => [
        makeTransaction(),
        ...prevTx
      ].slice(0, 50));

    addAlert(`You earned ${amount} EcoCoin(s) for: ${reason}!`, AlertType.SUCCESS, true);

    if (achievementKey) {
        setUserMilestones(prevMilestones => {
            if (!prevMilestones.achievementsUnlocked.includes(achievementKey)) {
                return { ...prevMilestones, achievementsUnlocked: [...prevMilestones.achievementsUnlocked, achievementKey] };
            }
            return prevMilestones;
        });
    }
  }, [addAlert]);


  const spendCoins = useCallback((amount: number, rewardName: string): boolean => {
    if (amount <= 0) return false;
    if (userCoins < amount) {
      addAlert(`Not enough EcoCoins to redeem "${rewardName}". You need ${amount - userCoins} more.`, AlertType.ERROR);
      return false;
    }
    setUserCoins(prevCoins => prevCoins - amount);
    const newTransaction: CoinTransaction = {
      id: `ct-${Date.now()}`,
      type: 'spent',
      amount,
      reason: `Redeemed: ${rewardName}`,
      date: new Date(),
    };
    setCoinTransactions(prevTx => [newTransaction, ...prevTx].slice(0, 50));
    addAlert(`Successfully redeemed "${rewardName}" for ${amount} EcoCoins!`, AlertType.SUCCESS, true);
    return true;
  }, [userCoins, addAlert]);


  // Daily login logic - Simplified
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    // Check if login bonus was already given today by looking at the transactions state
    const dailyLoginAwardedToday = coinTransactions.some(
        tx => tx.reason === "Daily Login Bonus" && 
              new Date(tx.date).toISOString().split('T')[0] === todayStr
    );

    if (!dailyLoginAwardedToday) {
        addCoins(COINS_DAILY_LOGIN, "Daily Login Bonus");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs once on mount: awards bonus if not given for today.


  // Persist data to localStorage
  useEffect(() => { localStorage.setItem('userEcoCoins', JSON.stringify(userCoins)); }, [userCoins]);
  useEffect(() => { localStorage.setItem('userCoinTransactions', JSON.stringify(coinTransactions)); }, [coinTransactions]);
  useEffect(() => { localStorage.setItem('userEcoStreaks', JSON.stringify(userStreaks)); }, [userStreaks]);
  useEffect(() => { localStorage.setItem('userEcoMilestones', JSON.stringify(userMilestones)); }, [userMilestones]);
  useEffect(() => { localStorage.setItem('userProfile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('sustainablePackaging', JSON.stringify(sustainablePackaging)); }, [sustainablePackaging]);
  useEffect(() => { localStorage.setItem('lifetimeCo2Saved', JSON.stringify(lifetimeCo2Saved)); }, [lifetimeCo2Saved]);
  useEffect(() => { localStorage.setItem('analysisHistory', JSON.stringify(analysisHistory)); }, [analysisHistory]);
  useEffect(() => { localStorage.setItem('userSubmittedFeedback', JSON.stringify(submittedFeedback)); }, [submittedFeedback]);
  useEffect(() => { localStorage.setItem('sellerApplicationData', JSON.stringify(sellerApplicationData));}, [sellerApplicationData]);
  useEffect(() => { localStorage.setItem('isSellerLoggedIn', JSON.stringify(isSellerLoggedIn)); }, [isSellerLoggedIn]);
  useEffect(() => { localStorage.setItem('marketplaceListings', JSON.stringify(marketplaceListings)); }, [marketplaceListings]);
  useEffect(() => { localStorage.setItem('returnablePackages', JSON.stringify(returnablePackages)); }, [returnablePackages]);

  // --- END COIN SYSTEM LOGIC ---

  useEffect(() => {
    const isAvailable = checkGeminiAvailable();
    setGeminiAvailable(isAvailable);
    // if (!isAvailable) {
    //   addAlert("Gemini AI features are currently unavailable. API key might be missing or invalid. Some features will be limited.", AlertType.INFO);
    // }
  }, [addAlert]);

  // Generate product images on load
  useEffect(() => {
    const generateInitialImages = async () => {
        if (!geminiAvailable) {
            // Removed the alert here as per user request for fewer AI popups
            // addAlert("Imagen AI for product images is unavailable.", AlertType.INFO);
            return;
        }

        setIsLoadingProducts(true); // Use existing loading state
        // Removed the specific alert: "Generating enhanced product images with AI..."

        const updatedProducts = await Promise.all(
            products.map(async (product) => {
                if (product.imagePrompt) {
                    const generatedImageUrl = await generateProductImage(product.imagePrompt);
                    if (generatedImageUrl) {
                        return { ...product, imageUrl: generatedImageUrl };
                    }
                }
                return product; // Return original product if no prompt or generation fails
            })
        );
        setProducts(updatedProducts);
        setIsLoadingProducts(false);
        // addAlert("Product images updated with AI generations where possible.", AlertType.SUCCESS);
    };

    generateInitialImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [geminiAvailable]); 


  useEffect(() => {
    const co2SavedFromGroupBuys = groupBuyCart.reduce((sum, item) => {
      const originalItemCarbon = item.carbonFootprint * item.quantity;
      return sum + (originalItemCarbon * DEFAULT_GROUP_BUY_DISCOUNT_PERCENTAGE) / 100;
    }, 0);

    const hasItemsInAnyCart = groupBuyCart.length > 0 || individualCart.length > 0;
    const packagingSaving = sustainablePackaging && hasItemsInAnyCart ? ECO_PACKAGING_CO2_SAVING : 0;

    const co2SavedFromEcoProductsInCart = [...groupBuyCart, ...individualCart].reduce((sum, item) => {
      return sum + (item.ecoScore >= 4 ? (0.1 * item.quantity) : 0);
    }, 0);

    setCurrentCartCo2Saved(co2SavedFromGroupBuys + packagingSaving + co2SavedFromEcoProductsInCart);
  }, [groupBuyCart, individualCart, sustainablePackaging]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const removeAlert = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  const handleViewDetails = (product: Product) => { setSelectedProduct(product); };
  const handleCloseModal = () => { setSelectedProduct(null); };

  const handleAddToCart = (productToAdd: Product, cartType: CartType) => {
    const cartSetter = cartType === CartType.GROUP_BUY ? setGroupBuyCart : setIndividualCart;

    cartSetter((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productToAdd.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...productToAdd, quantity: 1, cartType }];
    });
    addAlert(`${productToAdd.name} added to ${cartType === CartType.GROUP_BUY ? 'Group Buy' : 'Individual'} cart!`, AlertType.SUCCESS);
    triggerPurchaseAnimation(productToAdd.id);

    if (productToAdd.ecoScore >= HIGH_ECOSCORE_THRESHOLD) {
      addCoins(
        COINS_SUSTAINABLE_PURCHASE_HIGH_ECOSCORE,
        `Sustainable pick: ${productToAdd.name.substring(0, 20)}...`,
        undefined,
        { productId: productToAdd.id }
      );

      if (!userMilestones.achievementsUnlocked.includes(ACHIEVEMENT_FIRST_EVER_SUSTAINABLE_PURCHASE)) {
        addCoins(
          COINS_FIRST_EVER_SUSTAINABLE_PURCHASE,
          "First Ever Sustainable Purchase Bonus!",
          ACHIEVEMENT_FIRST_EVER_SUSTAINABLE_PURCHASE,
          { productId: productToAdd.id }
        );
      }

      setUserMilestones(prev => ({ ...prev, sustainablePurchasesCount: prev.sustainablePurchasesCount + 1, }));
    }
  };

  const handleRemoveFromCart = (productId: string, cartType: CartType) => {
    const cartSetter = cartType === CartType.GROUP_BUY ? setGroupBuyCart : setIndividualCart;
    cartSetter((prevItems) => prevItems.filter((item) => item.id !== productId));
    addAlert(`Item removed from ${cartType === CartType.GROUP_BUY ? 'Group Buy' : 'Individual'} cart.`, AlertType.INFO);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number, cartType: CartType) => {
    if (quantity < 1) { handleRemoveFromCart(productId, cartType); return; }
    const cartSetter = cartType === CartType.GROUP_BUY ? setGroupBuyCart : setIndividualCart;
    cartSetter((prevItems) =>
      prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const executeSearch = useCallback(async (currentSearchTerm: string) => {
    if (!currentSearchTerm.trim()) {
      // If search term is empty, reset to initial products with generated images
      const initialProductsWithCalculatedScoresAndGeneratedImages = INITIAL_PRODUCTS.map(p => ({
        ...p,
        ecoScore: calculateComprehensiveEcoScore(p)
      }));
       // This part needs to re-trigger image generation or use already generated ones.
       // For now, just set to the ones that *might* have been updated.
      setProducts(prevProducts => {
        return initialProductsWithCalculatedScoresAndGeneratedImages.map(initialProd => {
          const existingGenerated = prevProducts.find(pp => pp.id === initialProd.id && pp.imageUrl.startsWith('data:image'));
          return existingGenerated || initialProd;
        });
      });
      return;
    }
    
    if (!geminiAvailable) {
      // addAlert("AI Product search unavailable. Showing initial products filtered by name.", AlertType.INFO);
      const filtered = INITIAL_PRODUCTS
        .filter(p => p.name.toLowerCase().includes(currentSearchTerm.toLowerCase()) || p.category.toLowerCase().includes(currentSearchTerm.toLowerCase()))
        .map(p => ({ ...p, ecoScore: calculateComprehensiveEcoScore(p) }));
      setProducts(filtered);
      setIsLoadingProducts(false); // Ensure loading state is reset
      return;
    }

    setIsLoadingProducts(true);
    // addAlert(`Searching for eco-friendly products related to "${currentSearchTerm}"...`, AlertType.INFO); // Keep this general search feedback
    try {
      const ideas: GeneratedProductIdea[] = await generateProductIdeas(currentSearchTerm, userProfile.ecoInterests);
      if (ideas.length > 0) {
        const newProductsPromises: Promise<Product>[] = ideas.map(async (idea, index) => {
          let imageUrl = `https://picsum.photos/seed/${encodeURIComponent(idea.name)}/400/300`; // Fallback
          if (geminiAvailable) {
            const generatedImg = await generateProductImage(`A clear product shot of a ${idea.name}, ${idea.description}. Emphasize its eco-friendly materials like ${idea.materials?.join(', ')}. Category: ${idea.category}.`);
            if (generatedImg) imageUrl = generatedImg;
          }

          const tempProduct: Product = {
            id: `gemini-${Date.now()}-${index}`,
            name: idea.name,
            imageUrl: imageUrl,
            imagePrompt: `A clear product shot of a ${idea.name}, ${idea.description}. Emphasize its eco-friendly materials like ${idea.materials?.join(', ')}. Category: ${idea.category}.`,
            description: idea.description,
            ecoScore: 0,
            carbonFootprint: parseFloat((Math.random() * 5 + 0.5).toFixed(1)),
            category: idea.category,
            certifications: Math.random() > 0.5 ? ['GRS Certified Recycled'] : ['Organic Content'],
            price: idea.price,
            materials: idea.materials || [],
            durabilityScore: idea.durabilityScore || 3,
            packagingScore: idea.packagingScore || 3,
            healthImpactScore: idea.healthImpactScore || 3,
          };
          return { ...tempProduct, ecoScore: calculateComprehensiveEcoScore(tempProduct) };
        });
        const newProducts = await Promise.all(newProductsPromises);
        setProducts(newProducts);
        // addAlert(`Found ${newProducts.length} AI-suggested products!`, AlertType.SUCCESS);
      } else {
        setProducts([]);
        addAlert(`No AI-suggested products found for "${currentSearchTerm}". Try different keywords or broaden your eco-preferences.`, AlertType.INFO);
      }
    } catch (error) {
      console.error("Search error:", error);
      setProducts(INITIAL_PRODUCTS.map(p => ({ ...p, ecoScore: calculateComprehensiveEcoScore(p) })));
      addAlert("Error fetching AI product suggestions. Showing initial products.", AlertType.ERROR);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [geminiAvailable, userProfile.ecoInterests, addAlert]);


  const handleSearch = (currentSearchTerm: string) => {
    setShowSearchSuggestions(false);
    executeSearch(currentSearchTerm);
  };

  const handleSearchSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSearchSuggestions(false);
    executeSearch(suggestion);
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const clearAppStates = (options: { preserveView?: boolean } = {}) => {
    setSearchTerm('');
    setSelectedProduct(null);
    setShowDashboard(false);
    setShowCartModal(false);
    setShowSearchSuggestions(false);
    setShowQuizModal(null);
    setIsFeedbackModalOpen(false);
    setShowSellerRegistrationWizard(false);
    setShowCreateListingModal(false);
    setViewingMarketplaceListing(null);
    setShowReturnInitiationModal(false);
    setSelectedPackageForReturn(null);
    setShowMarketplaceChatModal(false); // Clear chat modal
    setChattingWithSellerForListing(null);
    setCurrentMarketplaceChatMessages([]);
    if (!options.preserveView) setIsSidebarOpen(false);
  };

  const handleGoHome = () => {
    setCurrentView('home');
    clearAppStates();
     // Reset products to initial list with potentially updated images
     const initialProductsWithCalculatedScoresAndGeneratedImages = INITIAL_PRODUCTS.map(p => ({
        ...p,
        ecoScore: calculateComprehensiveEcoScore(p)
      }));
    setProducts(prevProducts => {
        return initialProductsWithCalculatedScoresAndGeneratedImages.map(initialProd => {
          const existingGenerated = prevProducts.find(pp => pp.id === initialProd.id && pp.imageUrl.startsWith('data:image'));
          if(existingGenerated) return existingGenerated;

          const currentLoadedProduct = products.find(loadedP => loadedP.id === initialProd.id && loadedP.imageUrl.startsWith('data:image'));
          return currentLoadedProduct || initialProd;
        });
      });
  };

  const handleNavigation = (view: NavTarget) => {
    clearAppStates({ preserveView: view === currentView });
    setIsSidebarOpen(false);

    if (view === 'cart') {
        setShowCartModal(true);
    } else if (view === 'dashboard') {
        setShowDashboard(true);
    } else if (view === 'wallet') {
        setShowWalletPage(true);
    } else {
        setCurrentView(view);
    }
  };


  const handleShowExternalAnalyzer = () => {
    handleNavigation('analyzeExternal'); // Use handleNavigation for consistent state clearing
  };

  const handleShowPersonalImpactDashboard = () => {
    handleNavigation('personalImpactDashboard');
  };

  const handleShowEcoTip = async () => {
    if (geminiAvailable) {
        const tip = await fetchEcoTip();
        // addAlert(`Eco-Tip: ${tip}`, AlertType.INFO); // Popup removed
        console.log("Eco-Tip fetched (no popup):", tip); // For console verification
        // To actually show the tip, MultiModalHub would need a way to display it.
        // For now, the request was to disable popups.
    } else {
        // addAlert("AI Eco-Tips are currently unavailable.", AlertType.INFO); // Popup removed
        console.log("Eco-Tips: AI unavailable (no popup)."); // For console verification
    }
  };


  const handleAnalysisComplete = (result: ExternalAnalysisResult | BarcodeAnalysisResult) => {
    setAnalysisHistory(prevHistory => [result, ...prevHistory.slice(0, MAX_ANALYSIS_HISTORY - 1)]);

    const co2ForCoins = Math.max(0, result.co2FootprintKg);
    const coinsFromCo2 = Math.floor(co2ForCoins * COINS_PER_KG_CO2_SAVED);
    const analysisCoinsAwarded = Math.max(MIN_COINS_PER_ANALYSIS, coinsFromCo2);

    let analysisReason = `Product Analysis (${result.productName.substring(0,20)}...)`;
    if ('simulatedBarcode' in result) {
      analysisReason = `Image Scan: ${result.productName.substring(0,15)}... (BC: ...${result.simulatedBarcode.slice(-4)})`;
    }
    addCoins(analysisCoinsAwarded, analysisReason, undefined, { analyzedCo2Kg: result.co2FootprintKg });


    const todayStr = new Date().toISOString().split('T')[0];

    setUserMilestones(prevMilestones => {
        let updatedMilestones = { ...prevMilestones };
        updatedMilestones.productsAnalyzedCount += 1;
        updatedMilestones.totalCo2EstimatedFromAnalyses = (updatedMilestones.totalCo2EstimatedFromAnalyses || 0) + result.co2FootprintKg;

        if (updatedMilestones.productsAnalyzedCount === 1 && !updatedMilestones.achievementsUnlocked.includes(ACHIEVEMENT_FIRST_ANALYSIS)) {
            addCoins(FIRST_ANALYSIS_BONUS, "First Product Analysis", ACHIEVEMENT_FIRST_ANALYSIS);
        }
        if (updatedMilestones.productsAnalyzedCount === NOVICE_ANALYZER_THRESHOLD && !updatedMilestones.achievementsUnlocked.includes(ACHIEVEMENT_NOVICE_ANALYZER)) {
            addCoins(NOVICE_ANALYZER_BONUS, `Novice Analyzer (${NOVICE_ANALYZER_THRESHOLD} Analyses)`, ACHIEVEMENT_NOVICE_ANALYZER);
        } else if (updatedMilestones.productsAnalyzedCount === NOVICE_ANALYZER_THRESHOLD - 1 && !updatedMilestones.achievementsUnlocked.includes(ACHIEVEMENT_NOVICE_ANALYZER)) {
            addAlert(`Analyze 1 more product for the Novice Analyzer bonus!`, AlertType.INFO);
        }
        if (updatedMilestones.productsAnalyzedCount === ECO_EXPLORER_THRESHOLD && !updatedMilestones.achievementsUnlocked.includes(ACHIEVEMENT_ECO_EXPLORER)) {
            addCoins(ECO_EXPLORER_BONUS, `Eco Explorer (${ECO_EXPLORER_THRESHOLD} Analyses)`, ACHIEVEMENT_ECO_EXPLORER);
        } else if (updatedMilestones.productsAnalyzedCount === ECO_EXPLORER_THRESHOLD - 1 && !updatedMilestones.achievementsUnlocked.includes(ACHIEVEMENT_ECO_EXPLORER)) {
            addAlert(`Analyze 1 more product to become an Eco Explorer!`, AlertType.INFO);
        }
        if (updatedMilestones.totalCo2EstimatedFromAnalyses >= CARBON_CRUSHER_THRESHOLD_KG && !updatedMilestones.achievementsUnlocked.includes(ACHIEVEMENT_CARBON_CRUSHER)) {
            addCoins(CARBON_CRUSHER_BONUS, `Carbon Crusher (${CARBON_CRUSHER_THRESHOLD_KG}kg CO2 from Analyses)`, ACHIEVEMENT_CARBON_CRUSHER);
        } else if (updatedMilestones.totalCo2EstimatedFromAnalyses < CARBON_CRUSHER_THRESHOLD_KG &&
                   updatedMilestones.totalCo2EstimatedFromAnalyses >= CARBON_CRUSHER_THRESHOLD_KG - 5 &&
                   !updatedMilestones.achievementsUnlocked.includes(ACHIEVEMENT_CARBON_CRUSHER)) {
            addAlert(`You're close to the Carbon Crusher bonus! Only ${(CARBON_CRUSHER_THRESHOLD_KG - updatedMilestones.totalCo2EstimatedFromAnalyses).toFixed(1)}kg CO2 more from analyses.`, AlertType.INFO);
        }
        return updatedMilestones;
    });

    setUserStreaks(prevStreaks => {
      let currentStreak = prevStreaks.analysisStreakDays;
      if (prevStreaks.lastAnalysisDate) {
        const lastDate = new Date(prevStreaks.lastAnalysisDate);
        const today = new Date(todayStr);
        const diffTime = new Date(today.toDateString()).getTime() - new Date(lastDate.toDateString()).getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) { currentStreak++; }
        else if (diffDays > 1) { currentStreak = 1; }
      } else { currentStreak = 1; }

      if (currentStreak >= ANALYSIS_STREAK_3_DAY_THRESHOLD && !userMilestones.achievementsUnlocked.includes(ACHIEVEMENT_ANALYSIS_STREAK_3_DAYS)) {
          addCoins(ANALYSIS_STREAK_3_DAY_BONUS, `${ANALYSIS_STREAK_3_DAY_THRESHOLD}-Day Analysis Streak`, ACHIEVEMENT_ANALYSIS_STREAK_3_DAYS);
      } else if (currentStreak === ANALYSIS_STREAK_3_DAY_THRESHOLD - 1 && !userMilestones.achievementsUnlocked.includes(ACHIEVEMENT_ANALYSIS_STREAK_3_DAYS)) {
           addAlert(`Analyze tomorrow for a ${ANALYSIS_STREAK_3_DAY_BONUS} coin streak bonus!`, AlertType.INFO);
      }

      if (currentStreak >= ANALYSIS_STREAK_7_DAY_THRESHOLD && !userMilestones.achievementsUnlocked.includes(ACHIEVEMENT_ANALYSIS_STREAK_7_DAYS)) {
          addCoins(ANALYSIS_STREAK_7_DAY_BONUS, `${ANALYSIS_STREAK_7_DAY_THRESHOLD}-Day Analysis Streak`, ACHIEVEMENT_ANALYSIS_STREAK_7_DAYS);
      } else if (currentStreak === ANALYSIS_STREAK_7_DAY_THRESHOLD -1 && !userMilestones.achievementsUnlocked.includes(ACHIEVEMENT_ANALYSIS_STREAK_7_DAYS)) {
          addAlert(`Analyze tomorrow for a ${ANALYSIS_STREAK_7_DAY_BONUS} coin streak bonus!`, AlertType.INFO);
      }

      return { analysisStreakDays: currentStreak, lastAnalysisDate: todayStr };
    });

    if (userMilestones.productsAnalyzedCount % 3 === 0) {
        handleOpenFeedbackModal({ page: 'ExternalProductAnalyzer', userAction: 'analysis_completed', productId: result.productName });
    }
  };


  const handleToggleDashboard = () => setShowDashboard(prev => !prev);
  const handleToggleCartModal = () => setShowCartModal(prev => !prev);
  const handleToggleWalletPage = () => setShowWalletPage(prev => !prev);
  const handleUpdatePackagingPreference = (preference: boolean) => { setSustainablePackaging(preference); addAlert(`Sustainable packaging preference ${preference ? 'enabled' : 'disabled'}.`, AlertType.INFO); };
  const handleUpdateEcoInterests = (interests: string[]) => {
    const hadPreviousInterests = userProfile.ecoInterests.length > 0;
    setUserProfile(prev => ({ ...prev, ecoInterests: interests }));
    addAlert("Eco-preferences updated! Future searches will consider these.", AlertType.SUCCESS);

    if (!hadPreviousInterests && interests.length > 0 && !userMilestones.achievementsUnlocked.includes(ACHIEVEMENT_PROFILE_COMPLETION)) {
        addCoins(COINS_PROFILE_COMPLETION, "Profile Setup: Eco-Interests Selected", ACHIEVEMENT_PROFILE_COMPLETION);
    }
  };

  const triggerPurchaseAnimation = (productId: string) => { setAnimatingProductId(null); setTimeout(() => setAnimatingProductId(productId + Date.now()), 0); };
  const handleAnimationEnd = () => { setAnimatingProductId(null); };

  const completeCheckout = () => {
    setIsCheckingOut(false);
    const co2SavedThisOrder = currentCartCo2Saved;
    setLifetimeCo2Saved(prev => prev + co2SavedThisOrder);
    setGroupBuyCart([]);
    setIndividualCart([]);
    addAlert(`Checkout successful! You've saved an estimated ${co2SavedThisOrder.toFixed(2)} kg CO₂e. Lifetime savings updated.`, AlertType.SUCCESS);
  };

  const handleProceedToCheckout = () => {
    if (groupBuyCart.length === 0 && individualCart.length === 0) { addAlert("Your cart is empty.", AlertType.INFO); return; }
    setShowCartModal(false); setIsCheckingOut(true);
    setTimeout(() => { completeCheckout(); }, 3000);
  };

  const handleOpenQuiz = (quiz: Quiz) => { setShowQuizModal(quiz); setShowWalletPage(false); };
  const handleQuizCompletion = (quizId: string, score: number, totalQuestions: number, coinsEarnedBase: number) => {
    setUserMilestones(prev => {
        const updatedMilestones = { ...prev };
        updatedMilestones.quizzesCompletedCount = (updatedMilestones.quizzesCompletedCount || 0) + 1;
        if (updatedMilestones.quizzesCompletedCount === 1 && !updatedMilestones.achievementsUnlocked.includes(ACHIEVEMENT_FIRST_QUIZ_COMPLETED)) {
            addCoins(FIRST_QUIZ_BONUS, "First Quiz Completed!", ACHIEVEMENT_FIRST_QUIZ_COMPLETED, { quizId });
        }
        if (score === totalQuestions && showQuizModal?.coinsPerfectScoreBonus) {
            addCoins(showQuizModal.coinsPerfectScoreBonus, `Perfect Score: ${showQuizModal.title}`, undefined, { quizId: showQuizModal.id });
        }
        return updatedMilestones;
    });
    setShowQuizModal(null);
  };

  const handleOpenFeedbackModal = (context?: FeedbackContextData) => { setFeedbackContextData(context); setIsFeedbackModalOpen(true); };
  const handleFeedbackSubmit = (submission: ClientFeedbackSubmission) => {
    setSubmittedFeedback(prevFeedback => [submission, ...prevFeedback.slice(0, MAX_FEEDBACK_HISTORY - 1)]);
    localStorage.setItem('lastFeedbackDate', new Date().toISOString());
    addAlert(`Thank you for your feedback on "${submission.title.substring(0,20)}..."! You earned ${submission.coinsAwarded} EcoCoins.`, AlertType.SUCCESS, true);
    addCoins(submission.coinsAwarded, `Feedback: ${submission.category}`, undefined, { feedbackId: submission.id });
    setIsFeedbackModalOpen(false);
  };

  const handleOpenSellerRegistration = () => { setShowSellerRegistrationWizard(true); setIsSidebarOpen(false); };
  const handleSellerRegistrationComplete = (formData: SellerFormData, totalCoinsAwardedByWizardSteps: number) => {
    console.log("Seller Registration Data Submitted (Simulated):", formData);
    setSellerApplicationData(formData);
    localStorage.setItem('isSellerRegistered', 'true');; 
    const wizardCompletionAchievement = SELLER_ONBOARDING_ACHIEVEMENTS.registration_quick_starter;
    addCoins(wizardCompletionAchievement.coins, wizardCompletionAchievement.name, wizardCompletionAchievement.id);
    addAlert(`Seller registration complete! You earned step rewards + ${wizardCompletionAchievement.coins} for completion!`, AlertType.SUCCESS);
    setShowSellerRegistrationWizard(false);
    setIsSellerLoggedIn(true);
    handleNavigation('sellerAdmin');
  };

  const handleSellerLogin = () => {
    const isRegistered = localStorage.getItem('isSellerRegistered') === 'true';
    if (!isRegistered) {
        addAlert("Please complete the 'Become a Seller' registration first.", AlertType.INFO);
        setShowSellerRegistrationWizard(true);
        return;
    }
    setIsSellerLoggedIn(true);
    addAlert("Seller logged in successfully (simulated).", AlertType.SUCCESS);
  };

  const handleSellerLogout = () => {
    setIsSellerLoggedIn(false);
    addAlert("Seller logged out (simulated).", AlertType.INFO);
    handleGoHome();
  };

  // --- MARKETPLACE HANDLERS (Phase 1) ---
  const handleNavigateToMarketplace = () => {
    handleNavigation('marketplace');
  };

  const handleOpenCreateListingModal = () => {
    if (!geminiAvailable && marketplaceListings.length >= 5) {
        addAlert("Marketplace listing limit reached for demo without AI. Contact support for more.", AlertType.INFO);
        return;
    }
    setShowCreateListingModal(true);
  };
  const handleCloseCreateListingModal = () => setShowCreateListingModal(false);

  const handleAddMarketplaceListing = (newListingData: Omit<MarketplaceListing, 'id' | 'userId' | 'listedDate' | 'status' | 'estimatedCo2Saved'> & { imageFiles?: File[] }) => {
    let imageURLs: string[] = [];
    if (newListingData.imageFiles && newListingData.imageFiles.length > 0) {
        imageURLs = newListingData.images || [URL.createObjectURL(newListingData.imageFiles[0])];
    } else if (newListingData.images && newListingData.images.length > 0) {
        imageURLs = newListingData.images;
    } else {
        imageURLs = ['https://picsum.photos/seed/default_mp_item/300/200'];
    }

    const newListing: MarketplaceListing = {
      ...newListingData,
      id: `mp-item-${Date.now()}`,
      userId: userProfile.userId,
      listedDate: new Date(),
      status: MarketplaceListingStatus.AVAILABLE,
      estimatedCo2Saved: ESTIMATED_CO2_SAVING_PER_USED_ITEM_KG,
      images: imageURLs,
    };
    delete (newListing as any).imageFiles;


    setMarketplaceListings(prev => [newListing, ...prev.slice(0, MAX_MARKETPLACE_LISTINGS_DISPLAY -1)]);
    addCoins(COINS_FOR_LISTING_ITEM, `Listed: ${newListing.title.substring(0,20)}...`, undefined, { marketplaceListingId: newListing.id });
    setUserMilestones(prev => ({...prev, marketplaceItemsListed: (prev.marketplaceItemsListed || 0) + 1}));
    addAlert(`"${newListing.title}" listed on the marketplace!`, AlertType.SUCCESS);
    setShowCreateListingModal(false);
  };

  const handleViewMarketplaceListing = (listing: MarketplaceListing) => setViewingMarketplaceListing(listing);
  const handleCloseMarketplaceListingDetail = () => setViewingMarketplaceListing(null);

  const handleSimulatedPurchaseMarketplaceItem = (listingId: string) => {
    const itemToPurchase = marketplaceListings.find(item => item.id === listingId);
    if (!itemToPurchase || itemToPurchase.status === MarketplaceListingStatus.SOLD) {
        addAlert("This item is no longer available.", AlertType.ERROR);
        return;
    }
     if (itemToPurchase.userId === userProfile.userId) {
      addAlert("You cannot purchase your own item.", AlertType.INFO);
      return;
    }

    setMarketplaceListings(prev => prev.map(item =>
        item.id === listingId ? { ...item, status: MarketplaceListingStatus.SOLD } : item
    ));

    addCoins(COINS_FOR_MARKETPLACE_PURCHASE_USED_ITEM, `Purchased used item: ${itemToPurchase.title.substring(0,15)}...`, undefined, { marketplaceListingId: itemToPurchase.id });
    setUserMilestones(prev => ({...prev, marketplaceItemsPurchased: (prev.marketplaceItemsPurchased || 0) + 1, sustainablePurchasesCount: prev.sustainablePurchasesCount + 1 }));


    addAlert(`Successfully "purchased" ${itemToPurchase.title}! Estimated ${itemToPurchase.estimatedCo2Saved}kg CO2 saved. You earned ${COINS_FOR_MARKETPLACE_PURCHASE_USED_ITEM} EcoCoins.`, AlertType.SUCCESS, true);
    setViewingMarketplaceListing(null);
  };
  // --- END MARKETPLACE HANDLERS ---
  
  // --- MARKETPLACE CHAT HANDLERS (NEW) ---
  const handleOpenMarketplaceChat = (listing: MarketplaceListing) => {
    setChattingWithSellerForListing(listing);
    // Initialize with a greeting from the "seller"
    setCurrentMarketplaceChatMessages([
      {
        id: `seller-greeting-${Date.now()}`,
        listingId: listing.id,
        text: `Hello! I'm the seller of "${listing.title}". How can I help you today?`,
        sender: 'seller',
        timestamp: new Date(),
      }
    ]);
    setShowMarketplaceChatModal(true);
  };

  const handleCloseMarketplaceChat = () => {
    setShowMarketplaceChatModal(false);
    setChattingWithSellerForListing(null);
    setCurrentMarketplaceChatMessages([]);
  };

  const handleSendMarketplaceChatMessage = async (userMessageText: string) => {
    if (!chattingWithSellerForListing || !geminiAvailable) return;

    const userMessage: MarketplaceChatMessage = {
      id: `user-${Date.now()}`,
      listingId: chattingWithSellerForListing.id,
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setCurrentMarketplaceChatMessages(prev => [...prev, userMessage]);
    setIsMarketplaceChatLoading(true);

    try {
      const sellerResponseText = await getSimulatedSellerResponse(
        chattingWithSellerForListing,
        userMessageText,
        [...currentMarketplaceChatMessages, userMessage] // Pass current history including new user message
      );
      const sellerMessage: MarketplaceChatMessage = {
        id: `seller-${Date.now()}`,
        listingId: chattingWithSellerForListing.id,
        text: sellerResponseText,
        sender: 'seller',
        timestamp: new Date(),
      };
      setCurrentMarketplaceChatMessages(prev => [...prev, sellerMessage]);
    } catch (error) {
      addAlert("Error getting response from AI seller. Please try again.", AlertType.ERROR);
      const errorMessage: MarketplaceChatMessage = {
        id: `seller-error-${Date.now()}`,
        listingId: chattingWithSellerForListing.id,
        text: "Sorry, I encountered an error. Could you repeat that?",
        sender: 'seller',
        timestamp: new Date(),
      };
      setCurrentMarketplaceChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsMarketplaceChatLoading(false);
    }
  };
  // --- END MARKETPLACE CHAT HANDLERS ---


  // --- FAQ HANDLER ---
  const handleNavigateToFAQ = () => {
    handleNavigation('faq');
  };
  // --- END FAQ HANDLER ---

  // --- RETURN PACKAGING HANDLERS (Phase 3) ---
  const handleNavigateToReturns = () => {
    handleNavigation('returns');
  };

  const handleOpenReturnModal = (packageData: ReturnablePackage) => {
    setSelectedPackageForReturn(packageData);
    setShowReturnInitiationModal(true);
  };

  const handleCloseReturnModal = () => {
    setSelectedPackageForReturn(null);
    setShowReturnInitiationModal(false);
  };

  const handleInitiateReturn = (packageId: string, userReportedCondition: PackageCondition) => {
    setReturnablePackages(prevPackages =>
      prevPackages.map(pkg =>
        pkg.id === packageId
          ? { ...pkg, status: ReturnPackageStatus.RETURN_INITIATED, reportedConditionByUser: userReportedCondition }
          : pkg
      )
    );
    addAlert(`Return initiated for package of ${selectedPackageForReturn?.productName}. Use QR code for drop-off (simulated).`, AlertType.SUCCESS);
    handleCloseReturnModal();
  };

  const handleSimulateHubProcessing = (packageId: string) => {
    const pkgToProcess = returnablePackages.find(p => p.id === packageId);
    if (!pkgToProcess) return;

    const conditions = [PackageCondition.GOOD, PackageCondition.SLIGHTLY_DAMAGED, PackageCondition.HEAVILY_DAMAGED];
    const assessedCondition = pkgToProcess.reportedConditionByUser || conditions[Math.floor(Math.random() * conditions.length)];

    let netCoins = 0;
    let finalStatus = ReturnPackageStatus.RETURN_COMPLETED;
    let alertMessage = "";

    if (assessedCondition === PackageCondition.HEAVILY_DAMAGED) {
      finalStatus = ReturnPackageStatus.RETURN_REJECTED;
      netCoins -= PENALTY_PACKAGE_HEAVY_DAMAGE;
      alertMessage = `Package for ${pkgToProcess.productName} was heavily damaged. Return rejected. Penalty applied.`;
    } else {
      netCoins += COINS_PACKAGE_RETURN_BASE;
      if (assessedCondition === PackageCondition.GOOD) {
        netCoins += COINS_PACKAGE_GOOD_CONDITION_BONUS;
        alertMessage = `Package for ${pkgToProcess.productName} returned in good condition!`;
      } else {
        netCoins -= PENALTY_PACKAGE_SLIGHT_DAMAGE;
        alertMessage = `Package for ${pkgToProcess.productName} returned slightly damaged.`;
      }
    }

    setReturnablePackages(prevPackages =>
      prevPackages.map(pkg =>
        pkg.id === packageId
          ? { ...pkg, status: finalStatus, assessedConditionByHub: assessedCondition, rewardEcoCoins: netCoins > 0 ? netCoins : 0 }
          : pkg
      )
    );

    if (netCoins > 0) {
      addCoins(netCoins, `Package Return: ${pkgToProcess.productName}`, undefined, { returnPackageId: pkgToProcess.id });
      if (finalStatus === ReturnPackageStatus.RETURN_COMPLETED) {
        setUserMilestones(prev => ({...prev, packagesReturnedSuccessfully: (prev.packagesReturnedSuccessfully || 0) + 1}));
      }
    } else if (netCoins < 0) {
      // Ensure the penalty is actually deducted if that's the desired logic (currently addCoins only adds)
      // For now, just log the negative impact as an alert.
      addAlert(alertMessage + ` ${Math.abs(netCoins)} EcoCoin penalty applied.`, AlertType.INFO, true);
    }

    addAlert(alertMessage, netCoins > 0 ? AlertType.SUCCESS : AlertType.INFO);
  };
  // --- END RETURN PACKAGING HANDLERS ---


  const totalCartItemsCount = groupBuyCart.reduce((sum, item) => sum + item.quantity, 0) + individualCart.reduce((sum, item) => sum + item.quantity, 0);

  const renderHomeView = () => (
    <>
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md mb-8 relative" ref={searchContainerRef}>
        <MultiModalHub
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
          showSearchSuggestions={showSearchSuggestions}
          setShowSearchSuggestions={setShowSearchSuggestions}
          SearchSuggestionsComponent={SearchSuggestions}
          onSuggestionClick={handleSearchSuggestionClick}
          predefinedSearchSuggestions={PREDEFINED_SEARCH_SUGGESTIONS}
          isLoadingProducts={isLoadingProducts}
          isGeminiAvailable={geminiAvailable}
          addAlert={addAlert}
          onExternalAnalysisComplete={handleAnalysisComplete}
          onNavigate={handleNavigation}
          onGetEcoTip={handleShowEcoTip}
        />
        {!geminiAvailable && <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">AI-powered search is currently unavailable.</p>}
        {geminiAvailable && userProfile.ecoInterests.length > 0 && <p className="text-xs text-sky-600 dark:text-sky-400 mt-2">Searching with preferences: {userProfile.ecoInterests.join(', ')}</p>}
      </div>
      <ProductList products={products} onViewDetails={handleViewDetails} onAddToCart={handleAddToCart} isLoading={isLoadingProducts} title={searchTerm ? `Results for "${searchTerm}"` : "Featured Eco-Friendly Products"} triggerPurchaseAnimation={triggerPurchaseAnimation} />
      <SustainabilityInsights />
    </>
  );

  // Main App Return
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-200">
      <Header
        onGoHome={handleGoHome}
        onShowCart={handleToggleCartModal}
        userCoins={userCoins}
        cartItemCount={totalCartItemsCount}
        theme={theme}
        toggleTheme={toggleTheme}
        onToggleSidebar={toggleSidebar}
        onShowDashboard={handleToggleDashboard}
        onShowPersonalImpactDashboard={handleShowPersonalImpactDashboard}
        onShowWalletPage={handleToggleWalletPage} // Pass the correct handler
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        onNavigate={handleNavigation}
        onShowExternalAnalyzer={() => handleNavigation('analyzeExternal')}
        onNavigateToMarketplace={() => handleNavigation('marketplace')}
        onNavigateToReturns={() => handleNavigation('returns')}
        onNavigateToFAQ={() => handleNavigation('faq')}
        onOpenFeedbackModal={() => handleOpenFeedbackModal({ page: 'sidebar' })}
        onOpenSellerRegistration={handleOpenSellerRegistration}
        onNavigateToSellerAdmin={() => handleNavigation('sellerAdmin')}
        isSellerLoggedIn={isSellerLoggedIn}
        sellerApplicationData={sellerApplicationData}
        userProfileName={userProfile.name}
      />
      {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}


      <Alerts alerts={alerts} removeAlert={removeAlert} />
      {animatingProductId && <PurchaseAnimation productId={animatingProductId} onAnimationEnd={handleAnimationEnd} />}
      <CheckoutAnimation isOpen={isCheckingOut} />

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        {currentView === 'home' && renderHomeView()}
        {currentView === 'analyzeExternal' && <ExternalProductAnalyzer addAlert={addAlert} isGeminiAvailable={geminiAvailable} onAnalysisComplete={handleAnalysisComplete} />}
        {currentView === 'sellerAdmin' && <SellerAdminPage isSellerLoggedIn={isSellerLoggedIn} onLogin={handleSellerLogin} onLogout={handleSellerLogout} addAlert={addAlert} calculateEcoScore={calculateComprehensiveEcoScore} />}
        {currentView === 'personalImpactDashboard' && <PersonalImpactDashboard userImpactData={userImpactData} addAlert={addAlert} />}
        {currentView === 'marketplace' && (
            <MarketplaceView
                listings={marketplaceListings}
                onViewListing={handleViewMarketplaceListing}
                onOpenCreateListingModal={handleOpenCreateListingModal}
                isLoading={isLoadingProducts} 
            />
        )}
        {currentView === 'faq' && <FAQView faqData={FAQ_DATA} onGoHome={handleGoHome} />}
        {currentView === 'returns' && (
            <ReturnPackagingView
                packages={returnablePackages.filter(p => p.userId === userProfile.userId)}
                onInitiateReturn={handleOpenReturnModal}
                onSimulateProcessing={handleSimulateHubProcessing}
            />
        )}
      </main>

      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={handleCloseModal} onAddToCart={handleAddToCart} triggerPurchaseAnimation={triggerPurchaseAnimation} userEcoInterests={userProfile.ecoInterests} />}
      {showDashboard && <CustomerDashboard currentCartCo2Saved={currentCartCo2Saved} lifetimeCo2Saved={lifetimeCo2Saved} packagingPreference={sustainablePackaging} onUpdatePackagingPreference={handleUpdatePackagingPreference} onClose={handleToggleDashboard} userProfile={userProfile} onUpdateEcoInterests={handleUpdateEcoInterests} groupBuyItemsCount={groupBuyCart.reduce((acc, item) => acc + item.quantity, 0)} activeGroupBuySimulationsCount={groupBuyCart.length} />}
      <CartModal isOpen={showCartModal} onClose={handleToggleCartModal} groupBuyItems={groupBuyCart} individualItems={individualCart} onRemoveItem={handleRemoveFromCart} onUpdateQuantity={handleUpdateCartQuantity} onProceedToCheckout={handleProceedToCheckout} />
      <SustainabilityChatbot analysisHistory={analysisHistory.filter(item => 'sourceType' in item && (item.sourceType === 'url' || item.sourceType === 'image')) as ExternalAnalysisResult[]} isGeminiAvailable={geminiAvailable} addAlert={addAlert} />
      {showQuizModal && AVAILABLE_QUIZZES.find(q => q.id === showQuizModal.id) && <SustainabilityQuizModal quiz={AVAILABLE_QUIZZES.find(q => q.id === showQuizModal.id)!} isOpen={!!showQuizModal} onClose={() => setShowQuizModal(null)} onQuizComplete={handleQuizCompletion} addCoins={addCoins} />}
      {showWalletPage && <WalletPage isOpen={showWalletPage} onClose={handleToggleWalletPage} userCoins={userCoins} transactions={coinTransactions} rewards={INITIAL_MOCK_REWARDS} onRedeemReward={(reward) => spendCoins(reward.cost, reward.name)} addAlert={addAlert} userMilestones={userMilestones} onTakeQuiz={handleOpenQuiz} />}
      {isFeedbackModalOpen && <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} onSubmit={handleFeedbackSubmit} contextData={feedbackContextData} />}
      {showSellerRegistrationWizard && <SellerRegistrationWizard isOpen={showSellerRegistrationWizard} onClose={() => setShowSellerRegistrationWizard(false)} onComplete={handleSellerRegistrationComplete} addCoins={addCoins} userProfile={userProfile} />}

      {showCreateListingModal && (
        <CreateListingModal
            isOpen={showCreateListingModal}
            onClose={handleCloseCreateListingModal}
            onAddListing={handleAddMarketplaceListing}
            isGeminiAvailable={geminiAvailable}
            addAlert={addAlert}
        />
      )}
      {viewingMarketplaceListing && (
        <MarketplaceListingDetailModal
            listing={viewingMarketplaceListing}
            onClose={handleCloseMarketplaceListingDetail}
            onPurchase={handleSimulatedPurchaseMarketplaceItem}
            currentUserProfile={userProfile}
            onOpenChat={handleOpenMarketplaceChat} // Pass handler
        />
      )}
      {showMarketplaceChatModal && chattingWithSellerForListing && (
        <MarketplaceChatModal
          isOpen={showMarketplaceChatModal}
          onClose={handleCloseMarketplaceChat}
          listing={chattingWithSellerForListing}
          messages={currentMarketplaceChatMessages}
          onSendMessage={handleSendMarketplaceChatMessage}
          isLoading={isMarketplaceChatLoading}
          isGeminiAvailable={geminiAvailable}
        />
      )}
      {showReturnInitiationModal && selectedPackageForReturn && (
        <ReturnInitiationModal
          isOpen={showReturnInitiationModal}
          onClose={handleCloseReturnModal}
          packageData={selectedPackageForReturn}
          onInitiateReturn={handleInitiateReturn}
        />
      )}

      <Footer
        onNavigateToFAQ={() => handleNavigation('faq')}
        onOpenFeedbackModal={() => handleOpenFeedbackModal({ page: 'footer' })}
        onOpenSellerRegistration={handleOpenSellerRegistration}
        onNavigateToSellerAdmin={() => handleNavigation('sellerAdmin')}
      />
    </div>
  );
}
export default App;
