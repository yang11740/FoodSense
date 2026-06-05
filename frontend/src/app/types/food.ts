export type MealTag = '早餐' | '午餐' | '晚餐' | '夜宵' | '零食' | '其他';

export type FoodRecommendation = 'recommended' | 'caution' | 'not-recommended';

export type CookingTechnique =
  | '蒸'
  | '煮'
  | '炖'
  | '煲'
  | '炒'
  | '爆炒'
  | '红烧'
  | '卤'
  | '凉拌'
  | '油炸';

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
  cookingTechnique: CookingTechnique;
  cookingMethod: string;
  recommendation: FoodRecommendation;
  summary: string;
  reasons: string[];
  tags: string[];
};
