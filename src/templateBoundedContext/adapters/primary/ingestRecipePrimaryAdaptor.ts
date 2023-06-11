import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EventStore } from '@castore/core';
import { Ingredient } from '../../domain/types/Ingredient';
import { DynamoDbSingleTableEventStorageAdapter } from '../../../common/dynamodb-event-storage-adapter/src';
import { recipeEvents } from '../../domain/events/RecipeEvent';
import RecipeAggregate from '../../domain/models/Recipe';
import { RecipeEventStoreImpl } from '../../domain/eventStores/RecipeEventStore';
import IngestRecipeService from '../../domain/application/IngestRecipeService';

interface IngestRecipeEvent {
  expectedIngredient: Ingredient[];
}

export const handler = async (event: IngestRecipeEvent): Promise<void> => {
  // Log the event argument for debugging and for use in local development.
  console.log(JSON.stringify(event, undefined, 2));

  const dynamoDb = new DynamoDBClient({});

  const storageAdapter = new DynamoDbSingleTableEventStorageAdapter({
    dynamoDbClient: dynamoDb,
    tableName: 'event-source-poc-stack-EventSourceTable-SRPYO4HMKAA',
  });

  const castoreEventStore = new EventStore({
    eventStoreEvents: recipeEvents,
    eventStoreId: 'RECIPES',
    reduce: RecipeAggregate.recipeReducer,
    storageAdapter,
  });

  const recipeEventStore = new RecipeEventStoreImpl(castoreEventStore);

  const ingestRecipeService = new IngestRecipeService(recipeEventStore);

  await ingestRecipeService.ingestRecipe({ payload: { expectedIngredients: event.expectedIngredient } });
};
