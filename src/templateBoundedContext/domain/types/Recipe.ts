import { Aggregate } from '@castore/core';
import { Ingredient } from './Ingredient';

export type Recipe = Aggregate & {
  expectedIngredients: Ingredient[];
  obtainedIngredients: Ingredient[];
  isCompleted: boolean;
};
