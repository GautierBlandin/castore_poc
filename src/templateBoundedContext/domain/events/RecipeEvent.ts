import { EventDetail, EventType } from '@castore/core';

import { Ingredient } from '../types/Ingredient';

export type RecipeCreated = EventDetail<'RECIPE_CREATED', { expectedIngredients: Ingredient[] }>;

export type IngredientObtained = EventDetail<'INGREDIENT_OBTAINED', { name: string }>;

export type RecipeCompleted = EventDetail<'RECIPE_COMPLETED', {}>;

export const recipeCreated = new EventType<'RECIPE_CREATED', { expectedIngredients: Ingredient[] }>({ type: 'RECIPE_CREATED' });

export const ingredientObtained = new EventType<'INGREDIENT_OBTAINED', { name: string }>({ type: 'INGREDIENT_OBTAINED' });

export const recipeCompleted = new EventType<'RECIPE_COMPLETED', {}>({ type: 'RECIPE_COMPLETED' });

export type RecipeEvent = IngredientObtained | RecipeCreated | RecipeCompleted;

export const recipeEvents = [recipeCreated, ingredientObtained, recipeCompleted];
