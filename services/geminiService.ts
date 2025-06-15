
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME, IMAGEN_MODEL_NAME } from '../constants';
import { GeneratedProductIdea, ExternalAnalysisResult, BarcodeAnalysisResult, VoiceCommandInterpretation, VoiceCommandAction, MarketplaceListing, MarketplaceChatMessage } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn(
    "API_KEY for Gemini is not set. AI features will be disabled. " +
    "Please set the API_KEY environment variable."
  );
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const getEcoTip = async (): Promise<string> => {
  if (!ai) return "AI Service is unavailable. API key might be missing.";
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: "Provide a concise and actionable sustainable shopping tip. Max 50 words.",
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching eco tip:", error);
    return "Could not fetch an eco tip at this time. Embrace reusable bags!";
  }
};

export const generateProductDescription = async (productName: string, category: string, userEcoInterests?: string[]): Promise<string> => {
  if (!ai) return `Details for ${productName} (${category}) are currently unavailable. This product promotes sustainability in the ${category} sector.`;
  try {
    let prompt = `Generate a compelling, eco-focused product description for "${productName}" in the category "${category}". Max 70 words. Highlight its key sustainable features and benefits.`;
    if (userEcoInterests && userEcoInterests.length > 0) {
      prompt += ` Emphasize aspects related to: ${userEcoInterests.join(', ')}.`;
    }
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating product description:", error);
    return `Learn more about ${productName} and its eco-benefits through responsible sourcing and materials. Prioritize products that align with your sustainability goals.`;
  }
};

export const generateProductIdeas = async (keywords: string, userEcoInterests?: string[]): Promise<GeneratedProductIdea[]> => {
  if (!ai) {
    console.warn("AI Service unavailable for product ideas.");
    return [];
  }
  let jsonStr = ""; 
  let originalResponseText = ""; 

  try {
    let interestsPrompt = "";
    if (userEcoInterests && userEcoInterests.length > 0) {
      interestsPrompt = `Prioritize ideas aligning with these eco-interests: ${userEcoInterests.join(', ')}.`;
    }

    const prompt = `
      Suggest 3 diverse, eco-friendly product ideas related to: "${keywords}". ${interestsPrompt}
      For each idea, provide ALL of the following fields:
      - "name" (string)
      - "category" (string)
      - "description" (string, eco-focused, max 30 words)
      - "price" (number, plausible price, e.g., 29.99)
      - "materials" (array of strings, e.g., ["Organic Cotton", "Recycled PET"])
      - "durabilityScore" (number, 1-5, 5 is most durable)
      - "packagingScore" (number, 1-5, 5 is most eco-friendly packaging)
      - "healthImpactScore" (number, 1-5, 5 is best for health/low-tox)
      
      Return the output STRICTLY as a VALID JSON array of objects. 
      Do NOT include any text, comments, or explanations outside of the JSON array itself.
      Each object in the array must represent a product idea and contain ALL the specified fields.
      All keys and string values must be enclosed in double quotes (e.g., "name": "Product Name").
      Ensure that string values are properly escaped if they contain special characters (e.g., newlines as \\n, double quotes as \\").
      Do NOT use trailing commas in objects or arrays.
      The entire response should be a single JSON array like: [ {"name": "Product 1", ...}, {"name": "Product 2", ...}, {"name": "Product 3", ...} ]
      Example of a valid entry: {"name": "Hemp Yoga Mat", "category": "Fitness", "description": "Biodegradable, non-slip mat.", "price": 65.00, "materials": ["Natural Hemp", "Natural Rubber"], "durabilityScore": 4, "packagingScore": 5, "healthImpactScore": 5}
    `;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    originalResponseText = response.text;
    jsonStr = originalResponseText.trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr);
    if (Array.isArray(parsedData) && parsedData.every(item => 
        item.name && 
        item.category && 
        item.description && 
        typeof item.price === 'number' &&
        Array.isArray(item.materials) &&
        typeof item.durabilityScore === 'number' &&
        typeof item.packagingScore === 'number' &&
        typeof item.healthImpactScore === 'number'
        )) {
      return parsedData.map(item => ({
        ...item,
        durabilityScore: Math.min(5, Math.max(1, item.durabilityScore || 3)),
        packagingScore: Math.min(5, Math.max(1, item.packagingScore || 3)),
        healthImpactScore: Math.min(5, Math.max(1, item.healthImpactScore || 3)),
      })) as GeneratedProductIdea[];
    }
    console.error("Generated product ideas response is not in the expected format after parsing:", parsedData, "Original JSON string:", jsonStr);
    return [];

  } catch (error) {
    console.error("Error generating product ideas. Original API response text:", originalResponseText, "Processed JSON string for parsing:", jsonStr, "Error:", error);
    return [];
  }
};

export const analyzeProductUrl = async (productUrl: string): Promise<ExternalAnalysisResult | null> => {
  if (!ai) {
    console.warn("AI Service unavailable for URL analysis.");
    return null;
  }
  let jsonStr = "";
  let originalResponseText = "";

  try {
    const prompt = `
      You are a sustainability analysis AI. A user has provided a URL: "${productUrl}".
      While you cannot access this URL, imagine a common consumer product (e.g., apparel, electronics, kitchenware) that might be sold at such a URL.
      Provide a fictional but plausible 'productName' (string, e.g., "Organic Cotton Tee" or "Stainless Steel Water Bottle"), 
      its estimated 'co2FootprintKg' (number, e.g., a value between 0.1 and 10.0), 
      and a 'sustainabilityScore' (number, from 0 to 100, where 100 is best).
      Respond ONLY with a valid JSON object in the format: 
      {"productName": "string", "co2FootprintKg": number, "sustainabilityScore": number}
      Do NOT include any text, comments, or explanations outside of the JSON object itself.
      Ensure all keys and string values are enclosed in double quotes.
      Example: {"productName": "Bamboo Cutting Board", "co2FootprintKg": 1.2, "sustainabilityScore": 85}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    originalResponseText = response.text;
    jsonStr = originalResponseText.trim();

    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr);

    if (parsedData && 
        typeof parsedData.productName === 'string' &&
        typeof parsedData.co2FootprintKg === 'number' &&
        typeof parsedData.sustainabilityScore === 'number') {
      return {
        id: `analysis-${Date.now()}`,
        productName: parsedData.productName,
        co2FootprintKg: parsedData.co2FootprintKg,
        sustainabilityScore: Math.min(100, Math.max(0, parsedData.sustainabilityScore)),
        sourceType: 'url',
        sourceValue: productUrl,
        analysisDate: new Date(),
      };
    }
    console.error("Parsed URL analysis data is not in the expected format:", parsedData, "Original JSON string:", jsonStr);
    return null;

  } catch (error) {
    console.error("Error analyzing product URL. Original API response text:", originalResponseText, "Processed JSON string for parsing:", jsonStr, "Error:", error);
    return null;
  }
};

export const analyzeProductImage = async (base64ImageData: string, mimeType: string, fileName: string): Promise<ExternalAnalysisResult | null> => {
  if (!ai) {
    console.warn("AI Service unavailable for image analysis.");
    return null;
  }
  let jsonStr = "";
  let originalResponseText = "";

  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageData,
      },
    };
    const textPart = {
      text: `
        Analyze the product shown in this image. 
        Identify a plausible 'productName' (string) for it.
        Estimate its 'co2FootprintKg' (number, between 0.1 and 10.0).
        Assign a 'sustainabilityScore' (number, from 0 to 100, 100 is best).
        This is for a fictional sustainability assessment.
        Respond ONLY with a valid JSON object: {"productName": "string", "co2FootprintKg": number, "sustainabilityScore": number}
        Do NOT include any text, comments, or explanations outside the JSON.
        Example: {"productName": "Red Canvas Sneakers", "co2FootprintKg": 3.5, "sustainabilityScore": 65}
      `
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME, // Ensure this model supports image input
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
      },
    });

    originalResponseText = response.text;
    jsonStr = originalResponseText.trim();

    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr);

    if (parsedData &&
        typeof parsedData.productName === 'string' &&
        typeof parsedData.co2FootprintKg === 'number' &&
        typeof parsedData.sustainabilityScore === 'number') {
      return {
        id: `analysis-${Date.now()}`,
        productName: parsedData.productName,
        co2FootprintKg: parsedData.co2FootprintKg,
        sustainabilityScore: Math.min(100, Math.max(0, parsedData.sustainabilityScore)),
        sourceType: 'image',
        sourceValue: fileName,
        analysisDate: new Date(),
      };
    }
    console.error("Parsed image analysis data is not in the expected format:", parsedData, "Original JSON string:", jsonStr);
    return null;

  } catch (error) {
    console.error("Error analyzing product image. Original API response text:", originalResponseText, "Processed JSON string for parsing:", jsonStr, "Error:", error);
    return null;
  }
};

export const analyzeProductImageForBarcodeSimulation = async (base64ImageData: string, mimeType: string, fileName: string, dataUrl?: string): Promise<BarcodeAnalysisResult | null> => {
  if (!ai) {
    console.warn("AI Service unavailable for barcode image analysis.");
    return null;
  }
  let jsonStr = "";
  let originalResponseText = "";

  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageData,
      },
    };
    const textPart = {
      text: `
        Analyze the product shown in this image.
        1. Identify a plausible 'productName' (string, e.g., "Organic Cotton T-Shirt").
        2. Estimate its 'co2FootprintKg' (number, e.g., a value between 0.1 and 10.0).
        3. Assign a 'sustainabilityScore' (number, from 0 to 100, where 100 is best).
        4. Generate a 'simulatedBarcode' (string, a fictional EAN-13 style 13-digit numeric string, e.g., "4006381333931").
        This is for a fictional sustainability assessment and barcode simulation.
        Respond ONLY with a valid JSON object in the format:
        {"productName": "string", "co2FootprintKg": number, "sustainabilityScore": number, "simulatedBarcode": "string"}
        Do NOT include any text, comments, or explanations outside of the JSON object itself.
        Ensure all keys and string values are enclosed in double quotes.
        Example: {"productName": "Fair Trade Coffee Beans", "co2FootprintKg": 0.8, "sustainabilityScore": 90, "simulatedBarcode": "9780201379624"}
      `
    };
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME, 
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
      },
    });
    
    originalResponseText = response.text;
    jsonStr = originalResponseText.trim();

    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr);

    if (parsedData &&
        typeof parsedData.productName === 'string' &&
        typeof parsedData.co2FootprintKg === 'number' &&
        typeof parsedData.sustainabilityScore === 'number' &&
        typeof parsedData.simulatedBarcode === 'string' &&
        /^\d{13}$/.test(parsedData.simulatedBarcode) // Basic check for 13 digits
    ) {
      return {
        id: `barcode-analysis-${Date.now()}`,
        productName: parsedData.productName,
        co2FootprintKg: parsedData.co2FootprintKg,
        sustainabilityScore: Math.min(100, Math.max(0, parsedData.sustainabilityScore)),
        simulatedBarcode: parsedData.simulatedBarcode,
        sourceType: 'image_barcode_scan',
        sourceValue: fileName,
        analysisDate: new Date(),
        imageUrl: dataUrl // Store the data URL of the image itself for display in history
      };
    }
    console.error("Parsed barcode image analysis data is not in the expected format:", parsedData, "Original JSON string:", jsonStr);
    return null;

  } catch (error) {
    console.error("Error analyzing barcode image. Original API response text:", originalResponseText, "Processed JSON string for parsing:", jsonStr, "Error:", error);
    return null;
  }
};


export const interpretVoiceCommand = async (transcript: string): Promise<VoiceCommandInterpretation | null> => {
  if (!ai) {
    console.warn("AI Service unavailable for voice command interpretation.");
    return null;
  }
  let jsonStr = "";
  let originalResponseText = "";

  try {
    const prompt = `
      You are an AI assistant for the EcoShop Navigator app.
      Interpret the user's voice command: "${transcript}"
      Determine the user's intent ('action') and extract relevant 'parameters'.
      Possible actions are: 'search_products', 'analyze_product_by_name', 'get_eco_tip', 'navigate_to_section', 'unknown_intent'.
      For 'search_products', parameters should include 'query' (string).
      For 'analyze_product_by_name', parameters should include 'productName' (string).
      For 'navigate_to_section', parameters should include 'sectionName' (string, must be one of: 'home', 'cart', 'dashboard', 'wallet', 'marketplace', 'returns', 'faq', 'analyze', 'seller_admin', 'my_impact').
      If the intent is unclear, use 'unknown_intent'.
      Provide a brief 'message' (string, max 20 words) summarizing your interpretation or asking for clarification.
      
      Respond ONLY with a valid JSON object in the format:
      {"originalTranscript": "string", "action": "string", "parameters": {"query": "string", ...}, "message": "string"}
      Do NOT include any text, comments, or explanations outside of the JSON object itself.
      Ensure all keys and string values are enclosed in double quotes.
      If a parameter is not applicable, it can be omitted from the parameters object.

      Examples:
      User: "search for bamboo toothbrushes" -> {"originalTranscript": "search for bamboo toothbrushes", "action": "search_products", "parameters": {"query": "bamboo toothbrushes"}, "message": "Searching for bamboo toothbrushes."}
      User: "what's the carbon footprint of a cotton t-shirt" -> {"originalTranscript": "what's the carbon footprint of a cotton t-shirt", "action": "analyze_product_by_name", "parameters": {"productName": "cotton t-shirt"}, "message": "Interpreted as analyze product: cotton t-shirt."}
      User: "give me a sustainability tip" -> {"originalTranscript": "give me a sustainability tip", "action": "get_eco_tip", "parameters": {}, "message": "Fetching an eco tip."}
      User: "go to my cart" -> {"originalTranscript": "go to my cart", "action": "navigate_to_section", "parameters": {"sectionName": "cart"}, "message": "Navigating to cart."}
      User: "how's the weather?" -> {"originalTranscript": "how's the weather?", "action": "unknown_intent", "parameters": {}, "message": "Sorry, I can't help with weather."}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    originalResponseText = response.text;
    jsonStr = originalResponseText.trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr);

    if (parsedData &&
        typeof parsedData.originalTranscript === 'string' &&
        typeof parsedData.action === 'string' &&
        typeof parsedData.parameters === 'object' &&
        typeof parsedData.message === 'string'
    ) {
        // Validate sectionName if action is navigate_to_section
        if (parsedData.action === 'navigate_to_section') {
            const validSections = ['home', 'cart', 'dashboard', 'wallet', 'marketplace', 'returns', 'faq', 'analyze', 'seller_admin', 'my_impact'];
            if (!parsedData.parameters.sectionName || !validSections.includes(parsedData.parameters.sectionName.toLowerCase())) {
                console.warn(`AI returned invalid section for navigation: ${parsedData.parameters.sectionName}. Defaulting to unknown_intent.`);
                parsedData.action = 'unknown_intent';
                parsedData.message = `I understood you want to navigate, but '${parsedData.parameters.sectionName}' is not a recognized section.`;
                parsedData.parameters.sectionName = undefined; 
            } else {
                 parsedData.parameters.sectionName = parsedData.parameters.sectionName.toLowerCase(); // Normalize
            }
        }

      return parsedData as VoiceCommandInterpretation;
    }
    console.error("Parsed voice command interpretation data is not in the expected format:", parsedData, "Original JSON string:", jsonStr);
    return null;

  } catch (error) {
    console.error("Error interpreting voice command. Original API response text:", originalResponseText, "Processed JSON string for parsing:", jsonStr, "Error:", error);
    return null;
  }
};

export const getChatbotResponse = async (
  userInput: string,
  analysisHistory: ExternalAnalysisResult[] // Assuming ExternalAnalysisResult contains what's needed
): Promise<string> => {
  if (!ai) return "I'm sorry, but my AI capabilities are limited right now. Please try again later.";
  try {
    let historyContext = "";
    if (analysisHistory.length > 0) {
      const recentAnalyses = analysisHistory
        .slice(0, 3) // Take last 3
        .map(
          (item) =>
            `- Product: ${item.productName}, CO2: ${item.co2FootprintKg}kg, Score: ${item.sustainabilityScore}/100 (from ${item.sourceType})`
        )
        .join("\n");
      historyContext = `\n\nFor context, here is some of the user's recent product analysis activity:\n${recentAnalyses}`;
    }

    const prompt = `
      You are "Eco Assistant", a friendly and knowledgeable AI guide for the "EcoShop Navigator" web application.
      Your primary role is to assist users with understanding sustainable shopping practices and navigating the app effectively.
      User's message: "${userInput}"
      ${historyContext}
      
      --- APP INFORMATION FOR YOUR KNOWLEDGE (EcoShop Navigator) ---
      **1. Main Sections & Navigation:**
      - **Views:** Users can navigate to Home, Marketplace, Analyze Product (for external items), My Returns, FAQ.
      - **Header Controls:** Quick access to "My Impact Dashboard", "My Dashboard" (user profile/settings), "EcoCoins Wallet", "Cart", and a main "Menu" (sidebar).
      - **Sidebar Menu:** Provides links to most sections, including "Seller Admin" (if registered).
      - **Footer Links:** FAQ, Provide Feedback, Become a Seller / Seller Admin.

      **2. Core Features:**
      - **Product Discovery & Information:**
        - **Home Page Search (MultiModalHub):**
          - **Text Search:** Standard keyword search.
          - **AI-Suggested Products:** Based on keywords and user's selected "Eco-Interests", AI can generate new product ideas.
          - **Image Scan (Barcode Scanner Mockup):** Upload a product image to simulate barcode scanning. AI identifies the product, estimates sustainability, and generates a mock barcode. Result added to analysis history.
          - **Voice Command (Voice Search Mockup):** Users can speak commands (simulated by typing). AI interprets intent (search, analyze, navigate, get tip).
        - **Product Cards & Detail Modal:** Display comprehensive info including EcoScore, CO2 footprint, materials, durability, packaging, health impact scores, certifications, and AI-generated descriptions. Product images can be AI-generated.
      - **Sustainability Analysis:**
        - **EcoScore:** A 1-5 star rating (5 is best), holistically calculated from carbon footprint (lower is better), material sustainability (organic, recycled keywords grant bonus), product durability, packaging eco-friendliness, and health impact (low chemical use).
        - **"Analyze Product" Section (ExternalProductAnalyzer):** Input a URL or upload an image of an external product. AI provides a simulated analysis (product name, CO2, sustainability score). Results are added to "Analysis History".
      - **EcoCoins System:**
        - **Earning Mechanisms:** Daily login; analyzing products (CO2 saved & min bonus); high EcoScore product purchases; completing user profile (setting Eco-Interests); analysis streaks (3-day, 7-day); completing sustainability quizzes (base + perfect score bonus); first quiz completion; submitting feedback (base + screenshot bonus); seller registration steps & achievements; listing items on marketplace; purchasing used items from marketplace; successfully returning packaging (base + good condition bonus).
        - **Spending EcoCoins:** Redeem for rewards (e.g., discounts, digital goods, simulated eco-actions) via the "EcoCoins Wallet" page.
        - **Wallet Page:** View current balance, detailed transaction history, available rewards, and access sustainability quizzes.
      - **Circular Economy Marketplace:**
        - **Functionality:** Users can list, sell, buy, or trade used items. Categories include apparel, electronics, books, etc. Conditions range from "New with Tags" to "Fair".
        - **Currency:** EcoCoins, simulated USD, or "Trade".
        - **Simulated Seller Chat:** Buyers can engage in a text chat with an AI simulating the seller for any marketplace listing to ask questions or (gently) negotiate.
      - **Return Packaging System:**
        - **"My Returns" Page:** View packages eligible for return from past orders (associated with user ID).
        - **Process:** User initiates a return, reports the package's condition (Good, Slightly Damaged, Heavily Damaged), and uses a simulated QR code for drop-off. Successful returns (Good/Slightly Damaged) earn EcoCoins; heavily damaged items may incur a penalty or no reward.
      - **User Engagement & Personalization:**
        - **"My Dashboard" (CustomerDashboard):** Manage preferences like "Sustainable Packaging" (applies a small CO2 saving to orders) and select "Eco-Interests" (which personalize AI-driven product search suggestions).
        - **"My Impact Dashboard" (PersonalImpactDashboard - Mock-up):** Visualizes user's positive environmental contributions: total CO2 saved, products analyzed, EcoCoins earned, sustainability streaks, eco-score improvements, comparisons with community averages, and environmental equivalents (e.g., trees saved). Includes mock goal setting.
        - **Sustainability Quizzes:** Interactive quizzes on topics like carbon footprint & recycling, available via Wallet.
        - **Feedback System:** Users can submit app feedback (bug reports, feature requests, etc.) and earn EcoCoins.
        - **Achievements:** Unlock various achievements for milestones like first analysis, analysis streaks, total CO2 saved from analyses, first quiz, first sustainable purchase, seller onboarding steps.
      - **Seller Features:**
        - **Registration:** Multi-step "Become a Seller" wizard with EcoCoin rewards for completing steps and overall registration.
        - **Seller Admin Page:** (Simulated) Logged-in sellers can view their listed products, add new products (EcoScore calculated automatically), and remove listings.

      **3. Technical Aspects (Simplified for You):**
      - EcoShop Navigator is a modern web application, likely built with React.
      - You, Eco Assistant, are powered by a Generative AI model (like Gemini) to provide intelligent responses and power features like product idea generation, description writing, and image generation.
      - For demonstration purposes, user data (cart, coins, preferences, history, listings) is stored locally in the user's browser.

      **Your Task:**
      Based on the user's message, their analysis history, and the detailed app information above:
      1. Provide a helpful, conversational, and concise response (ideally under 100 words).
      2. If the user asks "Where can I find X?", "How do I do Y?", or about app features, use the APP INFORMATION to guide them accurately.
      3. If the user's query is about a general sustainability topic, provide direct advice.
      4. If the query relates to their analysis history, use that context in your response.
      5. Be friendly, encouraging, and promote sustainable actions and the use of relevant app features.
      6. Do NOT invent features or functionalities not listed in the APP INFORMATION. If unsure or if the app doesn't support something, politely state that or suggest they check the FAQ or explore relevant sections.
      --- END OF APP INFORMATION ---
    `;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    return "I'm having a little trouble connecting right now. Please try asking again in a moment.";
  }
};


export const getSellerSuggestions = async (productName: string, productCategory: string, currentDescription?: string): Promise<{description: string, keywords: string[]}> => {
  if (!ai) return { description: currentDescription || "Focus on unique sustainable aspects.", keywords: ["eco-friendly", productCategory.toLowerCase()] };

  let jsonStr = "";
  let originalResponseText = "";

  try {
    const prompt = `
      You are an AI assistant for sellers on EcoShop, an eco-conscious marketplace.
      Product Name: "${productName}"
      Product Category: "${productCategory}"
      ${currentDescription ? `Current Description (if any): "${currentDescription}"` : ""}

      Task:
      1. Generate an improved, compelling, and eco-focused product 'description' (string, max 70 words). Highlight unique selling points and sustainability. If a current description exists, try to enhance it or offer a better alternative.
      2. Suggest 3-5 relevant 'keywords' (array of strings) for discoverability, focusing on eco-friendliness and product type.

      Respond ONLY with a valid JSON object in the format:
      {"description": "string", "keywords": ["string", "string", ...]}
      Do NOT include any text, comments, or explanations outside the JSON.
      Ensure keys and string values are double-quoted.
      Example: {"description": "Handcrafted from reclaimed oak, this durable cutting board champions zero-waste living. Naturally anti-bacterial and built to last.", "keywords": ["reclaimed wood", "handmade", "eco kitchen", "sustainable gift", "chopping board"]}
    `;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    originalResponseText = response.text;
    jsonStr = originalResponseText.trim();
    
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    const parsedData = JSON.parse(jsonStr);
    if (parsedData && typeof parsedData.description === 'string' && Array.isArray(parsedData.keywords)) {
      return {
        description: parsedData.description,
        keywords: parsedData.keywords.map((k:any) => String(k)).slice(0,5) // Ensure keywords are strings and limit to 5
      };
    }
    console.error("Parsed seller suggestions data not in expected format:", parsedData, "Original JSON string:", jsonStr);
    return { description: currentDescription || "Unable to generate suggestions at this time.", keywords: ["eco", productCategory.toLowerCase()] };

  } catch(error) {
    console.error("Error generating seller suggestions. Original API response text:", originalResponseText, "Processed JSON string for parsing:", jsonStr, "Error:", error);
    return { description: currentDescription || "Error fetching AI suggestions.", keywords: [] };
  }
};

export const getSimulatedSellerResponse = async (
  listing: MarketplaceListing,
  userMessage: string,
  chatHistory: MarketplaceChatMessage[]
): Promise<string> => {
  if (!ai) return "Sorry, the seller is currently unavailable to chat.";

  const historyString = chatHistory.map(msg => `${msg.sender === 'user' ? 'Buyer' : 'Seller'}: ${msg.text}`).join('\n');

  const prompt = `
    You are simulating a friendly and reasonable seller on the EcoShop marketplace.
    You are selling:
    - Item: "${listing.title}"
    - Category: "${listing.category}"
    - Condition: "${listing.condition}"
    - Price: ${listing.price} ${listing.currency === 'Trade' ? '(Willing to Trade)' : listing.currency}
    - Description: "${listing.description}"
    ${listing.location ? `- Location: "${listing.location}"` : ""}

    Chat History:
    ${historyString}

    Buyer's latest message: "${userMessage}"

    Your Task:
    Respond to the buyer's message naturally.
    - Be polite and helpful.
    - Answer questions about the item based on the details provided.
    - If asked about price negotiation (and price is not 'Trade'): You can be slightly flexible. Maybe offer a small discount (5-10%) if they seem keen or ask nicely, but don't give it away too easily. You can also suggest they make an offer.
    - If item is for 'Trade', discuss what they might offer.
    - Keep responses concise (1-3 sentences).
    - Do NOT break character as the seller. Do not mention you are an AI.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error in getSimulatedSellerResponse:", error);
    return "I'm having a bit of trouble at the moment, could you say that again?";
  }
};

export const generateProductImage = async (prompt: string): Promise<string | null> => {
  if (!ai) {
    console.warn("AI Service (Imagen) unavailable for image generation.");
    return null;
  }
  try {
    const response = await ai.models.generateImages({
      model: IMAGEN_MODEL_NAME,
      prompt: prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image?.imageBytes) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    console.error("Imagen response did not contain valid image data:", response);
    return null;
  } catch (error) {
    console.error("Error generating product image with Imagen:", error);
    return null;
  }
};


export const isGeminiAvailable = (): boolean => {
  return !!API_KEY && !!ai;
};
