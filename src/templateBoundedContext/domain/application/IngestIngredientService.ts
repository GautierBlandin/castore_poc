import { RecipeEventStore } from '../eventStores/RecipeEventStore';
import RecipeAggregate from '../models/Recipe';

export type IngestIngredientCommand = {
  payload: {
    name: string;
  }
};

export default class IngestIngredientService {
  private eventStore: RecipeEventStore;

  constructor(eventStore: RecipeEventStore) {
    this.eventStore = eventStore;
  }

  public async ingestIngredient(command: IngestIngredientCommand) {
    const recipes = await this.getAllRecipes();

    recipes.forEach((recipe) => {
      recipe.obtainIngredient({ name: command.payload.name });
    });

    await this.saveUpdatedRecipes(recipes);
  }

  private async getAllRecipes(): Promise<RecipeAggregate[]> {
    const aggregateIds = await this.eventStore.listAggregatesIds();
    return Promise.all(aggregateIds.map((id: string) => this.eventStore.getAggregate(id) as Promise<RecipeAggregate>));
  }

  private async saveUpdatedRecipes(recipes: RecipeAggregate[]): Promise<void> {
    await Promise.all(recipes
      .filter((recipe) => recipe.hasChanges())
      .map((recipe) => this.eventStore.save(recipe.popChanges())));
  }
}
