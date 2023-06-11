export interface EventStore<Aggregate, AggregateState, EventDetails> {
  getState(id: string): Promise<AggregateState | undefined>;
  getAggregate(id: string): Promise<Aggregate | undefined>;
  save(events: EventDetails[]): Promise<void>;
  listAggregatesIds(): Promise<string[]>;
}
