import { v4 as uuid } from 'uuid';
import { RecipeEventStore } from '../eventStores/RecipeEventStore';
import { Ingredient } from '../types/Ingredient';
import RecipeAggregate from '../models/Recipe';

export type IngestRecipeCommand = {
  payload: {
    expectedIngredients: Ingredient[];
  }
};

export default class IngestRecipeService {
  private eventStore: RecipeEventStore;

  constructor(eventStore: RecipeEventStore) {
    this.eventStore = eventStore;
  }

  public async ingestRecipe(command: IngestRecipeCommand) {
    const recipeUuid = uuid();
    const recipe = RecipeAggregate.createRecipe(recipeUuid, command.payload.expectedIngredients);
    await this.eventStore.save(recipe.popChanges());
  }
}
