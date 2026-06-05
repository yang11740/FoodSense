export type MealTag = '早餐' | '午餐' | '晚餐' | '夜宵' | '零食' | '其他';

export type FoodRecommendation = 'recommended' | 'caution' | 'not-recommended';

export type RecipeRecord = {
  id: string;
  date: string;
  meal: MealTag;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  ingredients: string[];
  cookingMethod: string;
  recommendation: FoodRecommendation;
  summary: string;
  reasons: string[];
  tags: string[];
};
