import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { EventStore } from '@castore/core';
import { DynamoDbSingleTableEventStorageAdapter } from '../../../common/dynamodb-event-storage-adapter/src';
import { recipeEvents } from '../../domain/events/RecipeEvent';
import RecipeAggregate from '../../domain/models/Recipe';
import { RecipeEventStoreImpl } from '../../domain/eventStores/RecipeEventStore';
import IngestIngredientService from '../../domain/application/IngestIngredientService';

interface IngestRecipeEvent {
  name: string;
}

export const handler = async (event: IngestRecipeEvent): Promise<void> => {
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

  const ingestIngredientService = new IngestIngredientService(recipeEventStore);

  await ingestIngredientService.ingestIngredient({ payload: { name: event.name } });
};
