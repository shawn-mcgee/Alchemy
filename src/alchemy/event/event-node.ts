import type { EventListener } from "./event-listener";

export function EventNode(): EventNode {
  return {
    children : new Map(),
    listeners: new Map()
  }
}

export interface EventNode {
  children : Map<string, EventNode>;
  listeners: Map<string, Set<EventListener<any>>>;
}

export namespace EventNode {
  export function requestListeners(node: EventNode, type: string) {
    let listeners = node.listeners.get(type);
    // if (!listeners)
    //   node.listeners.set(type, listeners = new Set());
    return listeners;
  }

  export function requireListeners(node: EventNode, type: string) {
    let listeners = node.listeners.get(type);
    if (!listeners) node.listeners.set(type, 
      listeners = new Set()
    );
    return listeners;
  }

  export function requireNode(node: EventNode, path: string) {
    for(let part of path.split("/")) {
      let child = node.children.get(part);
      if (!child) node.children.set(part, 
        child = EventNode()
      );
      node = child;
    }
    return node;
  }

  export function requestNode(node: EventNode, path: string) {
    for(let part of path.split("/")) {
      let child = node.children.get(part);
      if (!child) return;
      node = child;
    }
    return node;
  }
}

export default EventNode;