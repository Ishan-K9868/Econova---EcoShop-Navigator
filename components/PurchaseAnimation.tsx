
import React, { useEffect, useState } from 'react';

interface PurchaseAnimationProps {
  productId: string | null;
  onAnimationEnd: () => void;
}

const PurchaseAnimation: React.FC<PurchaseAnimationProps> = ({ productId, onAnimationEnd }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (productId) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onAnimationEnd();
      }, 2500); // Total animation duration
      return () => clearTimeout(timer);
    }
  }, [productId, onAnimationEnd]);

  if (!visible || !productId) return null;

  const logoClasses = "w-8 h-8 text-green-500 dark:text-green-400";

  const logos = [
    // Recyclable
    <svg key="recycle" className={logoClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-5.236-4.264-9.5-9.5-9.5S.5 6.764.5 12s4.264 9.5 9.5 9.5S19.5 17.236 19.5 12z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 9.75L12 14.25 7.5 9.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v2.25M12 17.25v2.25M6.303 6.303l1.591 1.591M16.106 16.106l1.591 1.591M4.5 12h2.25M17.25 12h2.25M6.303 17.697l1.591-1.591M16.106 7.894l1.591-1.591" />
    </svg>,
    // Leaf (Organic/Natural)
    <svg key="leaf" className={logoClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.16.84a2.25 2.25 0 00-2.475 2.475.75.75 0 01-1.5 0A3.75 3.75 0 018.66.365l.5.135zm8.68.505a2.25 2.25 0 012.475 2.475.75.75 0 001.5 0A3.75 3.75 0 0018.34.365l-.5.135zm-4.34 16.16a2.25 2.25 0 002.475-2.475.75.75 0 011.5 0 3.75 3.75 0 01-3.475 3.475l-.5-.135zm-4.34-16.16a2.25 2.25 0 01-2.475-2.475.75.75 0 00-1.5 0A3.75 3.75 0 006.66 3.84l.5-.135zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9.75a3.75 3.75 0 01-7.5 0" />
    </svg>,
    // CO2 Reduce
    <svg key="co2" className={logoClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.27 9.27a2.475 2.475 0 010-3.502L6 3m12 9l2.73 2.73a2.475 2.475 0 010 3.502L18 21M9 3h6M9 21h6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25V6.75" />
      <text x="12" y="13.5" fontSize="4" className="fill-current text-green-500 dark:text-green-400" textAnchor="middle" dy=".3em">CO₂↓</text>
    </svg>,
     // Globe/Planet
    <svg key="globe" className={logoClasses} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" />
    </svg>
  ];

  const radius = 60; // Radius of the circle for logos

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-black dark:bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[1000] pointer-events-none">
      <div className="relative p-8 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-2xl animate-pulseOnce">
        {/* Green Tick */}
        <svg className="w-24 h-24 text-green-500 dark:text-green-400 animate-scaleUpTick" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>

        {/* Revolving Logos Container */}
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{ animation: `revolveContainer 2.5s ease-in-out forwards` }}
        >
          {logos.map((logo, index) => {
            const angle = (index / logos.length) * 2 * Math.PI;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            return (
              <div
                key={index}
                className="absolute"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  animation: `fadeInOutIndividualLogoRevamp 2.3s ease-in-out forwards`,
                  animationDelay: `${0.1 + index * 0.15}s`
                }}
              >
                {logo}
              </div>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes scaleUpTick {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pulseOnce {
          0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); } /* green-400 */
          html.dark & { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7); } /* emerald-400 for dark */
          70% { box-shadow: 0 0 0 25px rgba(74, 222, 128, 0); }
          html.dark & { box-shadow: 0 0 0 25px rgba(52, 211, 153, 0); }
          100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
          html.dark & { box-shadow: 0 0 0 0 rgba(52, 211, 153, 0); }
        }
        @keyframes revolveContainer {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInOutIndividualLogoRevamp { /* Renamed to avoid conflict if old one is cached */
          0% { opacity: 0; transform: scale(0.5); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.5); }
        }
      `}</style>
    </div>
  );
};

export default PurchaseAnimation;