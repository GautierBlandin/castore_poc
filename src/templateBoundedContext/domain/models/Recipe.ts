import { Recipe } from '../types/Recipe';
import { IngredientObtained, RecipeCompleted, RecipeEvent } from '../events/RecipeEvent';
import { Ingredient } from '../types/Ingredient';

export default class RecipeAggregate {
  public static recipeReducer(state: Recipe, event: RecipeEvent): Recipe {
    switch (event.type) {
      case 'RECIPE_CREATED':
        return {
          aggregateId: event.aggregateId,
          version: event.version,
          expectedIngredients: event.payload.expectedIngredients,
          obtainedIngredients: [],
          isCompleted: false,
        };
      case 'INGREDIENT_OBTAINED':
        return {
          ...state,
          version: event.version,
          obtainedIngredients: [...state.obtainedIngredients, { name: event.payload.name }],
        };
      case 'RECIPE_COMPLETED':
        return {
          ...state,
          version: event.version,
          isCompleted: true,
        };
      default:
        return state;
    }
  }

  public static createRecipe(id: string, expectedIngredients: Ingredient[]) {
    const recipeCreated: RecipeEvent = {
      type: 'RECIPE_CREATED',
      version: 1,
      aggregateId: id,
      timestamp: new Date().toISOString(),
      payload: {
        expectedIngredients,
      },
    };
    return new RecipeAggregate(RecipeAggregate.recipeReducer({} as Recipe, recipeCreated), [recipeCreated]);
  }

  constructor(
    private state: Recipe,
    private changes: RecipeEvent[] = [],
  ) {
    this.state = state;
  }

  public obtainIngredient(ingredient: Ingredient) {
    if (!this.alreadyHaveIngredient(ingredient) && this.ingredientIsExpected(ingredient)) {
      this.apply(this.generateIngredientObtainedEvent(ingredient));
    }

    if (this.allIngredientsObtained()) {
      this.apply(this.generateRecipeCompletedEvent());
    }
  }

  public popChanges() {
    const { changes } = this;
    this.changes = [];
    return changes;
  }

  public hasChanges() {
    return this.changes.length > 0;
  }

  private apply(event: RecipeEvent) {
    this.state = RecipeAggregate.recipeReducer(this.state, event);
    this.changes.push(event);
  }

  private alreadyHaveIngredient(ingredient: Ingredient): boolean {
    return this.state.obtainedIngredients.some((obtainedIngredient) => obtainedIngredient.name === ingredient.name);
  }

  private ingredientIsExpected(ingredient: Ingredient): boolean {
    return this.state.expectedIngredients.some((expectedIngredient) => expectedIngredient.name === ingredient.name);
  }

  private allIngredientsObtained(): boolean {
    return this.state.expectedIngredients.length === this.state.obtainedIngredients.length;
  }

  private generateIngredientObtainedEvent(ingredient: Ingredient): IngredientObtained {
    return {
      type: 'INGREDIENT_OBTAINED',
      version: this.state.version + 1,
      aggregateId: this.state.aggregateId,
      timestamp: new Date().toISOString(),
      payload: {
        name: ingredient.name,
      },
    };
  }

  private generateRecipeCompletedEvent(): RecipeCompleted {
    return {
      type: 'RECIPE_COMPLETED',
      version: this.state.version + 1,
      aggregateId: this.state.aggregateId,
      timestamp: new Date().toISOString(),
      payload: {},
    };
  }
}
