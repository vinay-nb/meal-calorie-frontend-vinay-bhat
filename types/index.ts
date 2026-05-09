export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type Macro = {
  protein?: number;
  carbs?: number;
  fat?: number;
};

export type MealResult = {
  dish_name: string;
  servings: number;
  calories_per_serving?: number;
  total_calories?: number;
  source?: string;
  macros?: Macro;
  raw?: any;
};
