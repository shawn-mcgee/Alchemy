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

  function onListen  (tree: EventTree, a: Listen) {
    requireListeners(tree, a.path, a.type).add(a.listener);
  }

  function onDeafen  (tree: EventTree, a: Deafen) {
    
  }

  function onDispatch(tree: EventTree, a: Dispatch) {
    
  }

  function requireListeners(tree: EventTree, path: string, type: string) {
    return EventNode.requireListeners(EventNode.requireNode(tree.root, path) , type);
  }
}

export default EventTree;