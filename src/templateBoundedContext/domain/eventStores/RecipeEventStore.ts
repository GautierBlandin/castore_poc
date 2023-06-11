import { Reducer, EventStore as CastoreEventStoreImpl } from '@castore/core';
import {
  RecipeEvent, recipeEvents,
} from '../events/RecipeEvent';
import RecipeAggregate from '../models/Recipe';
import { Recipe } from '../types/Recipe';
import { EventStore } from '../../../common/eventSourcing/EventStore';
import { CastoreEventStore } from '../../../common/eventSourcing/CastoreEventStore';

export type RecipeEventStore = EventStore<RecipeAggregate, Recipe, RecipeEvent>;

export class RecipeEventStoreImpl implements RecipeEventStore {
  private castoreEventStore: CastoreEventStore<'RECIPES', typeof recipeEvents, RecipeEvent, Recipe, Reducer<Recipe, RecipeEvent>>;

  constructor(castoreEventStore: CastoreEventStore<'RECIPES', typeof recipeEvents, RecipeEvent, Recipe, Reducer<Recipe, RecipeEvent>>) {
    this.castoreEventStore = castoreEventStore;
  }

  public async getState(id: string): Promise<Recipe | undefined> {
    const state = await this.castoreEventStore.getAggregate(id);
    return state.aggregate;
  }

  public async getAggregate(id: string): Promise<RecipeAggregate | undefined> {
    const state = await this.getState(id);
    if (state) {
      return new RecipeAggregate(state);
    }
    return undefined;
  }

  public async listAggregatesIds(): Promise<string[]> {
    const aggregates = await this.castoreEventStore.listAggregateIds();
    return aggregates.aggregateIds;
  }

  public async save(events: RecipeEvent[]): Promise<void> {
    if (events.length === 0) {
      throw new Error('Cannot save empty events array');
    }

    const groupedEvents = events.map((event) => this.castoreEventStore.groupEvent(event));
    await CastoreEventStoreImpl.pushEventGroup(groupedEvents[0], ...groupedEvents.slice(1));
  }
}
