import type { EventContext } from "./event-context";

export type EventListener<T> = (event: T, context: EventContext<T>) => void;