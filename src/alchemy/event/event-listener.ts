import type { EventContext } from "./event-context";

export interface EventListener<T> {
  (event: T, context: EventContext<T>): void;
}