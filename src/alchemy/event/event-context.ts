import type { EventTree     } from "./event-tree";
import type { EventListener } from "./event-listener";

export interface EventContext<T> {
  tree: EventTree;
  type: string;
  path: string;
  self: EventListener<T>;
}