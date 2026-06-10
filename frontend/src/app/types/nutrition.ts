export interface NutritionTargets {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  bmr: number;
  tdee: number;
  heightCm: number;
  weightKg: number;
  ageYears: number;
  source: 'estimated' | 'profile';
  note: string;
}
