
# EcoShop Navigator - Sustainable Luxury

EcoShop Navigator is a cutting-edge web application designed to empower users to make more sustainable shopping choices. It offers a rich platform to explore eco-friendly products, analyze their environmental impact, participate in a circular economy marketplace, and engage with sustainability through gamified features and AI-driven insights.

## ✨ Core Features

EcoShop Navigator boasts a wide array of features aimed at promoting sustainable consumption:

### 🛍️ Product Discovery & AI Suggestions
*   **Advanced Search:** Find products using text-based queries.
*   **AI-Powered Product Ideas:** The Gemini API generates novel eco-friendly product suggestions based on keywords and personalized user eco-interests.
*   **Comprehensive Product Details:** View in-depth information for each product, including:
    *   **Calculated EcoScore:** A holistic 1-5 star rating.
    *   Carbon Footprint (kg CO₂e).
    *   Materials used (e.g., Organic Cotton, Recycled PET).
    *   Durability, Packaging, and Health Impact scores (1-5).
    *   Relevant certifications (e.g., GOTS, Fair Trade).
*   **AI-Generated Descriptions:** Product descriptions are dynamically enhanced by AI for a more engaging and informative experience.

### 🔬 Sustainability Analysis Tools
*   **EcoScore:** A comprehensive rating (1-5 stars, 5 is best) automatically calculated based on a product's carbon footprint, material sustainability, durability, packaging eco-friendliness, and health impact.
*   **External Product Analyzer:**
    *   **Analyze by URL (Simulated):** Input a product URL, and the AI provides a fictional sustainability analysis for a common product type that might be sold at such a URL.
    *   **Analyze by Image:** Upload a product image, and the Gemini API analyzes it to identify a plausible product name, estimate its CO₂ footprint, and assign a sustainability score.
*   **Barcode Scan Simulation (Image Upload):** Upload an image of a product to simulate scanning its barcode. The AI identifies the product, estimates its sustainability metrics, and generates a mock barcode.
*   **Analysis History:** Keep track of all products analyzed via URL, image, or barcode scan.

### 💰 EcoCoins & Gamification
*   **Earn EcoCoins:** Users are rewarded with EcoCoins for various sustainable actions:
    *   Daily logins.
    *   Analyzing products (CO₂ saved estimation).
    *   Purchasing products with high EcoScores.
    *   Completing their user profile (setting eco-interests).
    *   Achieving analysis streaks (e.g., 3-day, 7-day).
    *   Completing sustainability quizzes (base coins + perfect score bonus).
    *   Submitting app feedback (bonus for including screenshots).
    *   Listing items on the marketplace.
    *   Purchasing used items from the marketplace.
    *   Successfully returning packaging through the Return Packaging System.
    *   Completing seller registration steps and achieving seller-specific milestones.
*   **EcoCoins Wallet:** A dedicated page to view current EcoCoin balance, detailed transaction history, and available rewards.
*   **Redeem Rewards:** Spend EcoCoins on various rewards like discounts on purchases or digital goods.
*   **Achievements & Milestones:** Unlock badges and bonuses for reaching sustainability milestones (e.g., "First Analysis," "Carbon Crusher").
*   **Sustainability Quizzes:** Interactive quizzes on topics like carbon footprints and recycling to test knowledge and earn EcoCoins.

### 🛒 Smart Shopping & Cart
*   **Dual Cart System:**
    *   **Individual Cart:** For standard purchases.
    *   **Group Buy Cart:** Simulate collective purchasing to estimate potential CO₂ savings from consolidated shipping.
*   **Sustainable Packaging Option:** Users can opt-in for sustainable packaging in their dashboard, applying a simulated CO₂ saving to their orders.
*   **Simulated Checkout:** Experience a checkout process that highlights the environmental impact of the purchase.

### ♻️ Circular Economy Marketplace
*   **List, Buy, Sell, Trade:** Users can list their pre-loved items for sale or trade, promoting product lifecycle extension.
*   **Multiple Currencies:** Price items in EcoCoins, simulated USD, or offer them for "Trade."
*   **Item Conditions:** Clearly defined conditions from "New with Tags" to "Fair Condition."
*   **AI-Simulated Seller Chat:** Buyers can engage in a text-based chat with an AI that simulates the seller, allowing for inquiries and (gentle) negotiations.
*   **Marketplace Rewards:** Earn EcoCoins for listing items and for purchasing used items.

### 📦 Return Packaging System
*   **"My Returns" Section:** View and manage packages eligible for return from simulated past orders.
*   **Initiate Returns:** Users can start a return process, reporting the condition of the packaging (Good, Slightly Damaged, Heavily Damaged).
*   **Simulated QR Code System:** A mock QR code is provided for dropping off the package.
*   **EcoCoin Rewards:** Earn EcoCoins for successfully returning packaging in good or slightly damaged condition. Penalties may apply for heavily damaged returns.

### 👤 User Engagement & Personalization
*   **"My Dashboard":** Manage user preferences, including sustainable packaging options and eco-interests.
*   **Eco-Interests:** Select preferred sustainability attributes (e.g., "Organic Materials," "Recycled Content") to personalize AI-driven product search suggestions.
*   **"My Impact Dashboard" (Mock-up):** A visual overview of the user's positive environmental contributions, including:
    *   Total CO₂ saved, products analyzed, EcoCoins earned, sustainability streaks.
    *   Comparisons against community averages (mock data).
    *   Environmental equivalents (e.g., trees saved, water saved).
    *   Mock goal-setting functionality.
*   **Feedback System:** Users can submit feedback on various categories (bug reports, feature requests, etc.) and earn EcoCoins.

### 🤝 Seller Features (Simulated)
*   **Seller Registration Wizard:** A multi-step guided process for users to register as sellers, with EcoCoin rewards for completing each step and overall registration.
*   **Seller Admin Dashboard:** (Simulated) Logged-in sellers can:
    *   View their listed products.
    *   Add new products to the platform (EcoScore is automatically calculated).
    *   Remove their listings.

### 🎤 Multi-Modal Input & Navigation
*   **Text Search:** Classic keyword-based product search.
*   **Image Scan (for Barcode Simulation):** Upload a product image; the AI analyzes it and simulates a barcode scan result, including sustainability info.
*   **Voice Command (Simulated via Text Input):** Type commands as if speaking them. The AI interprets the intent (e.g., search, analyze product, navigate, get eco-tip) and extracts parameters.
*   **Intuitive Sidebar:** Easy navigation to all major sections of the application.

### 🤖 Eco Assistant Chatbot
*   An AI-powered chatbot ("Eco Assistant") to help users:
    *   Navigate the app and understand its features.
    *   Get general sustainability advice and tips.
*   The chatbot considers the user's recent product analysis history for more relevant, contextual advice.

### 🎨 User Interface & Experience
*   **Responsive Design:** Adapts to various screen sizes for a seamless experience on desktop and mobile devices.
*   **Theme Toggle:** Switch between Light and Dark themes.
*   **Alerts & Notifications:** Provides users with timely feedback on actions, rewards, and system messages.
*   **Animated Interactions:** Includes subtle animations for actions like adding to cart and checkout for a more engaging experience.

### ℹ️ Informational Resources
*   **FAQ Section:** A comprehensive list of frequently asked questions about the app's features, EcoCoins, sustainability metrics, and more.
*   **Eco-Tip Corner:** Displays AI-powered daily sustainability tips to encourage eco-friendly habits.

## 🛠️ Tech Stack

*   **Frontend:** React, TypeScript, Tailwind CSS
*   **AI Integration:** Google Gemini API (via `@google/genai` SDK)
*   **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`, `useRef`)
*   **Styling:** Tailwind CSS (configured in `index.html`), custom CSS for scrollbars and animations.
*   **Data Persistence:** Browser `localStorage` is used to simulate user sessions, preferences, cart contents, EcoCoins, and history.
*   **Module System:** ES6 Modules with an `importmap` defined in `index.html`.

## ⚙️ Gemini API Integration

The application leverages the Google Gemini API for several AI-powered features.

### API Key Setup
The Google Gemini API key **must** be provided as an environment variable named `API_KEY`.
```
API_KEY=YOUR_GEMINI_API_KEY
```
This application assumes `process.env.API_KEY` is accessible in the execution context where `geminiService.ts` initializes the API client. **The application will not prompt for an API key, nor does it provide UI for managing it.** Ensure this environment variable is correctly configured in your deployment or development setup.

If the API key is not set or is invalid, AI-related features will be disabled or provide fallback responses, and a warning will be logged to the console.

### Models Used
*   **General Text Tasks:** `gemini-2.5-flash-preview-04-17` (for product idea generation, descriptions, eco-tips, chatbot responses, voice command interpretation, seller suggestions, marketplace chat simulation).
*   **Image Analysis Tasks:** `gemini-2.5-flash-preview-04-17` (for analyzing uploaded product images for sustainability insights and barcode simulation).
*   *(Note: `imagen-3.0-generate-002` is specified in coding guidelines for image generation, but this app currently focuses on image analysis/understanding rather than generation.)*

### Core AI Service (`services/geminiService.ts`)
This module encapsulates all interactions with the Gemini API:
*   `getEcoTip()`: Fetches a concise sustainability tip.
*   `generateProductDescription()`: Creates eco-focused product descriptions.
*   `generateProductIdeas()`: Suggests new product ideas based on keywords and user interests.
*   `analyzeProductUrl()`: Provides a *simulated* sustainability analysis for a product based on a given URL.
*   `analyzeProductImage()`: Analyzes an uploaded image to identify a product and estimate its sustainability metrics.
*   `analyzeProductImageForBarcodeSimulation()`: Analyzes an image, identifies a product, estimates metrics, and generates a *simulated* barcode.
*   `interpretVoiceCommand()`: Interprets a user's (typed) voice command to determine intent and parameters.
*   `getChatbotResponse()`: Powers the "Eco Assistant" by providing contextual responses based on user input, app knowledge, and analysis history.
*   `getSellerSuggestions()`: Provides AI-generated descriptions and keywords for sellers listing products.
*   `getSimulatedSellerResponse()`: Generates responses for the AI seller in the marketplace chat.
*   `isGeminiAvailable()`: Checks if the API key is configured.

## 🚀 Getting Started

This project uses a simple setup with `index.html` directly importing ES modules.

### Prerequisites
*   A modern web browser that supports ES Modules and `importmap`.
*   (Optional, for development/modification) Node.js and npm/yarn if you plan to introduce build tools or manage packages traditionally.

### Setup & Running
1.  **Clone the repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Set up the API Key:**
    As mentioned, the `API_KEY` for Google Gemini must be available as `process.env.API_KEY`. Since this is a client-side application without a visible build step in the provided files, you'll need to ensure your environment or a manual pre-processing step makes this key available to `geminiService.ts`.
    *   **One simple way for local testing (not for production):** You could temporarily replace `process.env.API_KEY` in `geminiService.ts` with your actual key string for testing. **Remember to remove it before committing.**
    *   **Recommended for development:** Use a tool like Vite or Parcel which can handle `.env` files and inject environment variables during development.
3.  **Open the Application:**
    Simply open the `index.html` file in your web browser.

    *Example using a live server (if you have one installed, e.g., via VS Code extension or `npm install -g live-server`):*
    ```bash
    live-server .
    ```
    Or, directly open `index.html` using the `file:///` protocol, though some browser features might be restricted.

## 📁 File Structure

The project is organized as follows:

```
/
├── components/                 # React components
│   ├── analytics/              # Components for Personal Impact Dashboard
│   ├── feedback/               # Feedback modal and related UI
│   ├── marketplace/            # Marketplace views, modals, cards
│   ├── multimodal/             # Barcode scanner, voice search, hub
│   ├── returns/                # Return packaging system components
│   ├── seller/                 # Seller registration wizard steps
│   ├── seller_admin/           # Seller admin page components
│   ├── Alerts.tsx              # Global alert display
│   ├── CartModal.tsx           # Shopping cart modal
│   ├── CheckoutAnimation.tsx   # Checkout loading animation
│   ├── CustomerDashboard.tsx   # User preferences dashboard modal
│   ├── FAQView.tsx             # FAQ display component
│   ├── Footer.tsx              # Application footer
│   ├── GroupBuySimulator.tsx   # (Legacy, UI moved to CartModal)
│   ├── Header.tsx              # Application header
│   ├── LoadingSpinner.tsx      # Reusable loading spinner
│   ├── ProductCard.tsx         # Individual product card display
│   ├── ProductDetailModal.tsx  # Modal for detailed product view
│   ├── ProductList.tsx         # Component to display a list of products
│   ├── PurchaseAnimation.tsx   # Animation on adding item to cart
│   ├── SearchSuggestions.tsx   # UI for search suggestions
│   ├── ShippingOptionsPopover.tsx # Popover for shipping info
│   ├── Sidebar.tsx             # Main navigation sidebar
│   ├── SustainabilityAnalysisCard.tsx # Card for displaying analysis results
│   ├── SustainabilityChatbot.tsx # Eco Assistant chatbot UI
│   ├── SustainabilityInsights.tsx# Eco-Tip Corner display
│   └── SustainabilityQuizModal.tsx # Quiz interface
│   └── WalletPage.tsx          # EcoCoins wallet, rewards, transactions
├── services/
│   └── geminiService.ts        # All interactions with the Google Gemini API
├── utils/
│   └── ecoScoreCalculator.ts   # Logic for calculating product EcoScores
├── App.tsx                     # Main application component, state management
├── constants.ts                # Application-wide constants (products, rewards, etc.)
├── index.html                  # Main HTML entry point
├── index.tsx                   # React root rendering and setup
├── metadata.json               # Application metadata
├── types.ts                    # TypeScript type definitions
└── README.md                   # This file
```

## 🌍 Functionality Overview (User Perspective)

1.  **Explore Products:** Users land on the home page with featured products and a multi-modal search hub. They can search via text (with suggestions), simulated voice commands, or by "scanning" a product image (uploading an image for AI analysis).
2.  **View Product Details:** Clicking on a product opens a modal with detailed information, including its EcoScore, carbon footprint, materials, and an AI-generated description.
3.  **Analyze External Products:** Users can navigate to the "Analyze Product" section to get AI-driven sustainability insights for products not listed on the site by providing a URL or uploading an image.
4.  **Shop Sustainably:**
    *   Add products to either an "Individual Cart" or a "Group Buy Cart."
    *   Group buys simulate CO₂ savings.
    *   Opt for "Sustainable Packaging" in the User Dashboard for further CO₂ reduction.
5.  **Engage with the Marketplace:**
    *   Browse items listed by other users (simulated).
    *   List their own used items for sale or trade.
    *   "Purchase" items, earning EcoCoins and contributing to CO₂ savings.
    *   Chat with an AI simulating the seller for listed items.
6.  **Manage Returns:**
    *   View eligible packaging for return in "My Returns."
    *   Initiate a return, report package condition, and use a simulated QR code.
    *   Earn EcoCoins for successful returns.
7.  **Earn & Spend EcoCoins:**
    *   Accumulate EcoCoins through various activities (see Core Features).
    *   Visit the "EcoCoins Wallet" to check balance, view transaction history, take quizzes, and redeem rewards.
8.  **Track Impact:** The (mocked-up) "My Impact Dashboard" shows personalized sustainability statistics and comparisons.
9.  **Use the Eco Assistant:** A floating chatbot provides help with app navigation and offers general sustainability advice.
10. **Customize Experience:** Toggle light/dark themes, set eco-preferences in the User Dashboard.
11. **Become a Seller (Simulated):** Go through a registration wizard to become a seller and manage product listings in a dedicated Seller Admin area.

## 🌿 EcoScore Calculation

The `EcoScore` for each product is a rating from 1 to 5 (higher is better) and is dynamically calculated in `utils/ecoScoreCalculator.ts`. It considers:
*   **Carbon Footprint:** Normalized score where lower CO₂ footprint yields a higher score.
*   **Materials:** Points awarded for use of sustainable keywords (e.g., "organic," "recycled").
*   **Durability Score:** Based on product data (1-5).
*   **Packaging Score:** Based on product data (1-5, for eco-friendliness).
*   **Health Impact Score:** Based on product data (1-5, for low chemical use, non-toxicity).

These factors are weighted/averaged to produce the final EcoScore.

## 💡 Future Enhancements (Potential)

The extensive type definitions and constants suggest potential for:
*   More detailed user profiles and social interactions.
*   Advanced analytics and goal tracking in the Personal Impact Dashboard.
*   Integration with actual e-commerce backends.
*   Real-time collaborative group buys.
*   More sophisticated AI-driven personalization and recommendations.
*   Expansion of the rewards and achievements system.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the existing style and that any new features are well-documented.

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details (if one exists, otherwise assume MIT or specify).
(Note: A `LICENSE` file was not provided, MIT is a common default for open source projects).
      