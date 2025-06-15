
import React, { useState, useEffect, useRef } from 'react';
import { 
  SellerFormData, 
  BusinessInfoData, 
  SustainabilityProfileData,
  DocumentUploadData,
  PaymentSetupData,
  StoreCustomizationData,
  UserProfile,
  CoinTransaction 
} from '../../types';
import { SELLER_REGISTRATION_STEPS, SELLER_ONBOARDING_ACHIEVEMENTS } from '../../constants';
import BusinessInfoStep from './BusinessInfoStep';
import SustainabilityProfileStep from './SustainabilityProfileStep';
import DocumentUploadStep from './DocumentUploadStep';
import PaymentSetupStep from './PaymentSetupStep';
import StoreCustomizationStep from './StoreCustomizationStep';
import LoadingSpinner from '../LoadingSpinner';

interface SellerRegistrationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (formData: SellerFormData, totalCoinRewardFromSteps: number) => void;
  addCoins: (amount: number, reason: string, achievementKey?: string, context?: CoinTransaction['context']) => void;
  userProfile?: UserProfile;
}

const AIAssistantPlaceholder: React.FC<{ suggestions?: string[] }> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
        <div className="my-4 p-3 bg-sky-50 dark:bg-sky-900/40 border border-sky-200 dark:border-sky-700 rounded-lg">
            <h4 className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">💡 AI Assistant Tip</h4>
            <p className="text-xs text-sky-600 dark:text-sky-400">Complete all required fields accurately. Detailed information helps build trust and may improve your store's visibility. AI suggestions for this step will be available soon!</p>
        </div>
    );
  }
  return (
    <div className="my-4 p-3 bg-sky-50 dark:bg-sky-900/40 border border-sky-200 dark:border-sky-700 rounded-lg">
      <h4 className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-1">💡 AI Suggestions</h4>
      <ul className="list-disc list-inside text-xs text-sky-600 dark:text-sky-400 space-y-0.5">
        {suggestions.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
  );
};

const SellerRegistrationWizard: React.FC<SellerRegistrationWizardProps> = ({ isOpen, onClose, onComplete, addCoins, userProfile }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<SellerFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const wizardContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      // Initialize formData with default structures for each step to avoid undefined issues
      const initialData: SellerFormData = {
        business_info: { businessName: '', businessType: '', taxId: '' },
        sustainability_profile: { sustainabilityPractices: '', certifications: '' },
        verification_documents: {},
        payment_setup: { paymentMethod: '', taxExempt: false },
        store_customization: { storeName: '', storeDescription: '' }
      };
      setFormData(initialData);
      setIsSubmitting(false);
      wizardContentRef.current?.scrollTo(0, 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeStepConfig = SELLER_REGISTRATION_STEPS[currentStepIndex];

  const handleStepDataChange = (stepId: keyof SellerFormData, field: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [stepId]: {
        // Ensure the step object exists before spreading
        ...(prevData[stepId] || {}),
        [field]: value,
      },
    }));
  };
  
  const handleDocumentStepDataChange = (field: keyof DocumentUploadData, value: File | File[] | string | string[] | null) => {
    setFormData(prevData => ({
        ...prevData,
        verification_documents: {
            ...(prevData.verification_documents || {}),
            [field]: value,
        }
    }));
  };
  
  const handlePaymentStepDataChange = (
    field: keyof PaymentSetupData,
    value: string | boolean | number | undefined
  ) => {
     setFormData(prevFormData => {
        const existingPaymentData = prevFormData.payment_setup || { paymentMethod: '', taxExempt: false };
        const newPaymentSetupData: PaymentSetupData = {
            ...existingPaymentData,
            [field]: value,                    
        };
        return { ...prevFormData, payment_setup: newPaymentSetupData, };
    });
  };

  const handleStoreCustomizationStepDataChange = (
    field: keyof StoreCustomizationData,
    value: string | File | null
   ) => {
     setFormData(prevFormData => {
        const existingStoreData = prevFormData.store_customization || { storeName: '', storeDescription: ''};
        const newStoreCustomizationData: StoreCustomizationData = {
            ...existingStoreData, 
            [field]: value,                            
        };
        return { ...prevFormData, store_customization: newStoreCustomizationData };
    });
  };

  const validateCurrentStep = (): boolean => {
    const currentDataForValidation = formData[activeStepConfig.id];
    if (!currentDataForValidation) return false;

    switch (activeStepConfig.id) {
      case 'business_info':
        const bi = currentDataForValidation as BusinessInfoData;
        return !!(bi.businessName && bi.businessType && bi.taxId);
      case 'sustainability_profile':
        const sp = currentDataForValidation as SustainabilityProfileData;
        return !!sp.sustainabilityPractices;
      case 'verification_documents':
         const vd = currentDataForValidation as DocumentUploadData;
         return !!vd.businessLicense; 
      case 'payment_setup':
         const ps = currentDataForValidation as PaymentSetupData;
         return !!ps.paymentMethod;
      case 'store_customization':
         const sc = currentDataForValidation as StoreCustomizationData;
         return !!(sc.storeName && sc.storeDescription);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
        alert("Please complete all required fields for this step.");
        return;
    }
    if (activeStepConfig.coinReward && activeStepConfig.coinReward > 0) {
        addCoins(activeStepConfig.coinReward, `Seller Onboarding: ${activeStepConfig.title}`, undefined, { sellerStepId: activeStepConfig.id });
    }

    if (currentStepIndex < SELLER_REGISTRATION_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      wizardContentRef.current?.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      wizardContentRef.current?.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep() && currentStepIndex === SELLER_REGISTRATION_STEPS.length - 1) {
        alert("Please complete all required fields on the final step before submitting.");
        return;
    }
    setIsSubmitting(true);
    
    let totalCoinsEarnedInWizard = 0;
    SELLER_REGISTRATION_STEPS.forEach(step => totalCoinsEarnedInWizard += step.coinReward || 0);

    if (formData.sustainability_profile?.certifications && formData.sustainability_profile.certifications.split(',').filter(c => c.trim() !== "").length >= 2) {
        const achievement = SELLER_ONBOARDING_ACHIEVEMENTS.sustainability_champion_docs;
        addCoins(achievement.coins, achievement.name, achievement.id);
    }
    if (formData.sustainability_profile?.sustainabilityPractices && formData.sustainability_profile.sustainabilityPractices.length > 50) {
         const achievement = SELLER_ONBOARDING_ACHIEVEMENTS.eco_profile_pro;
         addCoins(achievement.coins, achievement.name, achievement.id);
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onComplete(formData, totalCoinsEarnedInWizard); 
    setIsSubmitting(false);
  };
  
  const CurrentStepComponent = (() => {
    const stepId = activeStepConfig.id;
    // Ensure currentDataForStep is correctly initialized for each step type
    const currentDataForStep = formData[stepId];

    switch (stepId) {
      case 'business_info':
        return <BusinessInfoStep data={currentDataForStep as BusinessInfoData || { businessName: '', taxId: '', businessType: ''}} onDataChange={(field, value) => handleStepDataChange(stepId, field, value)} />;
      case 'sustainability_profile':
        return <SustainabilityProfileStep data={currentDataForStep as SustainabilityProfileData || {sustainabilityPractices: '', certifications: ''}} onDataChange={(field, value) => handleStepDataChange(stepId, field, value)} />;
      case 'verification_documents':
        return <DocumentUploadStep data={currentDataForStep as DocumentUploadData || {}} onDataChange={handleDocumentStepDataChange} />;
      case 'payment_setup':
        return <PaymentSetupStep data={currentDataForStep as PaymentSetupData || {paymentMethod: '', taxExempt: false}} onDataChange={handlePaymentStepDataChange} />;
      case 'store_customization':
        return <StoreCustomizationStep data={currentDataForStep as StoreCustomizationData || {storeName: '', storeDescription: ''}} onDataChange={handleStoreCustomizationStepDataChange} />;
      default:
        return <div className="text-red-500 p-4">Error: Unknown registration step. Configuration might be missing.</div>;
    }
  })();

  const progressPercentage = ((currentStepIndex + 1) / SELLER_REGISTRATION_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 backdrop-blur-md flex items-center justify-center z-[90] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Become a Seller
          </h2>
          <button onClick={onClose} disabled={isSubmitting} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="mb-1">
                <span className="text-xs font-semibold inline-block text-sky-600 dark:text-sky-300">
                    Step {currentStepIndex + 1} of {SELLER_REGISTRATION_STEPS.length}: {activeStepConfig.title}
                </span>
            </div>
            <div className="overflow-hidden h-2.5 mb-2 text-xs flex rounded bg-sky-200 dark:bg-sky-700">
                <div
                    style={{ width: `${progressPercentage}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-sky-500 transition-all duration-500 ease-out"
                ></div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{activeStepConfig.description}</p>
            {activeStepConfig.coinReward && activeStepConfig.coinReward > 0 && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-0.5">
                    Complete this step for +{activeStepConfig.coinReward} EcoCoins!
                </p>
            )}
        </div>

        <div ref={wizardContentRef} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-grow">
           <AIAssistantPlaceholder suggestions={currentStepIndex === 0 ? ["Ensure your business name is unique and reflects your brand.", "Double-check your Tax ID for accuracy."] : ["Highlight unique eco-friendly aspects of your business."]} />
          {CurrentStepComponent}
        </div>

        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0 || isSubmitting}
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-medium py-2.5 px-5 rounded-lg transition duration-150 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={isSubmitting || !validateCurrentStep()}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-150 disabled:opacity-60 flex items-center"
          >
            {isSubmitting && currentStepIndex === SELLER_REGISTRATION_STEPS.length - 1 ? (
              <LoadingSpinner size="sm" /> 
            ) : (
              currentStepIndex === SELLER_REGISTRATION_STEPS.length - 1 ? 'Submit Registration' : 'Next Step'
            )}
            {currentStepIndex < SELLER_REGISTRATION_STEPS.length - 1 && !isSubmitting && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerRegistrationWizard;
