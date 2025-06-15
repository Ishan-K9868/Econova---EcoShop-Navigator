
import { Product } from '../types';

// Normalize a value from 0-max to 0-1 scale, then scale to 1-5 for stars
// Lower carbon footprint is better, so invert its contribution
const normalizeCarbonFootprint = (carbon: number, maxCarbon = 10): number => {
  // Assuming maxCarbon is a reasonable upper bound for typical products (e.g., 10kg CO2e)
  // Products with higher carbon get lower scores.
  const normalized = Math.max(0, Math.min(1, carbon / maxCarbon)); // 0 to 1, 0 is best
  return 5 - (normalized * 4); // Scale to 1-5 (5 is best)
};

// Returns a score from 1 to 3. Base of 1, +0.5 for each relevant eco-friendly keyword found, up to max +2 bonus.
const getMaterialBonus = (materials: string[]): number => {
  let keywordPoints = 0;
  const goodKeywords = ['organic', 'recycled', 'bamboo', 'hemp', 'cork', 'sustainable wood', 'plant-based', 'compostable', 'biodegradable'];
  materials.forEach(material => {
    if (goodKeywords.some(keyword => material.toLowerCase().includes(keyword))) {
      keywordPoints += 0.5;
    }
  });
  // Base score of 1, plus keyword points capped at 2. Total score: 1 to 3.
  return 1 + Math.min(2, keywordPoints); 
};

export const calculateComprehensiveEcoScore = (product: Product): number => {
  // console.log(`[EcoScoreCalc] Calculating for: ${product.name}`);
  // console.log(`  Raw Inputs - Carbon: ${product.carbonFootprint}, Durability: ${product.durabilityScore}, Packaging: ${product.packagingScore}, Health: ${product.healthImpactScore}, Materials: [${product.materials.join(', ')}]`);

  const carbonScoreNormalized = normalizeCarbonFootprint(product.carbonFootprint);
  // console.log(`  CarbonScoreNormalized (1-5, 5 is best): ${carbonScoreNormalized.toFixed(3)}`);

  const baseMaterialScore = getMaterialBonus(product.materials); // Score from 1 to 3
  // console.log(`  BaseMaterialScore (1-3): ${baseMaterialScore.toFixed(3)}`);
  
  // Scale material score (1-3) to a 1-5 range to match other factors
  // 1 -> 1, 2 -> 3, 3 -> 5
  const scaledMaterialScore = (baseMaterialScore - 1) * 2 + 1;
  // console.log(`  ScaledMaterialScore (1-5): ${scaledMaterialScore.toFixed(3)}`);

  const scoresToAverage = [
    carbonScoreNormalized,
    product.durabilityScore,
    product.packagingScore,
    product.healthImpactScore,
    scaledMaterialScore
  ];
  // console.log(`  Scores being averaged: [${scoresToAverage.map(s => s.toFixed(3)).join(', ')}]`);

  const averageScore = scoresToAverage.reduce((sum, score) => sum + score, 0) / scoresToAverage.length;
  // console.log(`  Calculated AverageScore: ${averageScore.toFixed(3)}`);
  
  const finalEcoScore = Math.max(1, Math.min(5, parseFloat(averageScore.toFixed(1))));
  // console.log(`  Final Returned EcoScore (clamped 1-5, 1 decimal): ${finalEcoScore}`);
  
  return finalEcoScore;
};
