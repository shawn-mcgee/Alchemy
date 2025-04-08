import type { EventListener } from "./event-listener";

import EventNode from "./event-node";

const LISTEN   = "__listen__"
const DEAFEN   = "__deafen__"
const DISPATCH = "__dispatch__"

interface Listen   { action: typeof LISTEN  , path: string, type  : string, listener  : EventListener<any> }
interface Deafen   { action: typeof DEAFEN  , path: string, type ?: string, listener ?: EventListener<any> }
interface Dispatch { action: typeof DISPATCH, path: string, type: string, event: any }
type Action = Listen | Deafen | Dispatch;

export function EventTree(): EventTree {
  return {
    root   : EventNode(),
    pending: new Array()
  }
}

export interface EventTree {
  readonly root: EventNode;
  readonly pending: Array<Action>;
}

export namespace EventTree {

  export function listen<T>(tree: EventTree, type  : string, listener  : EventListener<T>, o ?: { defer ?: boolean, path ?: string }) {
     const a: Listen = { action: LISTEN, path: o?.path ?? "", type, listener };
     if (o?.defer ?? true) queue(tree, a);
     else                  flush(tree, a);
  }

  export function deafen<T>(tree: EventTree, type ?: string, listener ?: EventListener<T>, o ?: { defer ?: boolean, path ?: string }) {
    const a: Deafen = { action: DEAFEN, path: o?.path ?? "", type, listener };
    if (o?.defer ?? true) queue(tree, a);
    else                  flush(tree, a);
  }

  export function dispatch<T>(tree: EventTree, type: string, event: T, o ?: { defer ?: boolean, path ?: string }) {
    const a: Dispatch = { action: DISPATCH, path: o?.path ?? "", type, event };
    if (o?.defer ?? true) queue(tree, a);
    else                  flush(tree, a);
  }

  export function poll(tree: EventTree) {
    drain(tree).forEach(
      a => flush(tree, a)
    )
  }

  function queue(tree: EventTree, a: Action) {
    tree.pending.push(a);
  }

  function flush(tree: EventTree, a: Action) {
    switch (a.action) {
      case LISTEN   : onListen  (tree, a); break;
      case DEAFEN   : onDeafen  (tree, a); break;
      case DISPATCH : onDispatch(tree, a); break;
    }
  }

  function drain(tree: EventTree) {
    return tree.pending.splice(0, tree.pending.length);
  }

  function onListen  (tree: EventTree, a: Listen  ) {
    requireListeners(tree, a.path, a.type).add(a.listener);
  }

  function onDeafen  (tree: EventTree, a: Deafen  ) {
           if(a.type !== undefined && a.listener !== undefined) {
      requestListeners(tree, a.path, a.type)?.delete(a.listener);
    } else if(a.type !== undefined && a.listener === undefined) {
      requestListeners(tree, a.path, a.type)?.clear();
    } else if(a.type === undefined && a.listener !== undefined) {
      requestNode(tree, a.path)?.listeners.forEach(
        listeners => listeners.delete(a.listener!)
      )
    } else if(a.type === undefined && a.listener === undefined) {
      const node = requestNode(tree, a.path)
      if(node) {
        node.listeners.clear()
        node.children .clear()
      }
    }
  }

  function onDispatch(tree: EventTree, a: Dispatch) {
    const node = requestNode(tree, a.path);
    if(node) onDispatchRecursive(tree, node, a.path, a.type, a.event);
  }

  function onDispatchRecursive(tree: EventTree, node: EventNode, path: string, type: string, event: any) {
    EventNode.requestListeners(node, type)?.forEach(
      self => self(event, { tree, path, type, self})
    )

    node.children.forEach((child, name) => {
      onDispatchRecursive(tree, child, `${path}/${name}`, type, event);
    })
  }

  function requestNode(tree: EventTree, path: string) {
    return EventNode.requestNode(tree.root, path);
  }

  function requireNode(tree: EventTree, path: string) {
    return EventNode.requireNode(tree.root, path);
  }

  function requestListeners(tree: EventTree, path: string, type: string) {
    return EventNode.requestListeners(EventNode.requestNode(tree.root, path), type);
  }

  function requireListeners(tree: EventTree, path: string, type: string) {
    return EventNode.requireListeners(EventNode.requireNode(tree.root, path), type);
  }
}

export default EventTree;