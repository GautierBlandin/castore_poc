import {
  EventDetail,
  EventStore,
  EventType,
  Aggregate as CastoreAggregate,
  Reducer as CastoreReducer,
  $Contravariant,
} from '@castore/core';

export type CastoreEventStore<
  EventStoreId extends string,
  EventTypes extends EventType[],
  EventDetails extends EventDetail,
  AggregateState extends CastoreAggregate,
  Reducer extends CastoreReducer<AggregateState, $Contravariant<EventDetails, EventDetail>>,
> = EventStore<
EventStoreId,
EventTypes,
EventDetails,
$Contravariant<EventDetails, EventDetail>,
Reducer,
AggregateState,
$Contravariant<AggregateState, CastoreAggregate>>;
