import type { P2PRequest } from "./p2p-request";

import Alchemy from "../alchemy";
import Version from "../version";
import P2PSecret  from "./p2p-secret";
import P2PMessage from "./p2p-message";

import * as Trystero from "trystero";

export interface P2PSession {
  readonly secret: string;
  readonly id    : string;
  readonly pw    : string;
  readonly is    : "server" | "client";

  readonly hostId ?:     string ;
  readonly selfId  :     string ;
  readonly peerIds : Set<string>;

  readonly requests: Map<string, P2PRequest>;

  readonly _trystero_room: Trystero.Room;
  readonly _trystero_tx  : Trystero.ActionSender  <P2PMessage>;
  readonly _trystero_rx  : Trystero.ActionReceiver<P2PMessage>;
}

export namespace P2PSession {
  const appId = Version.toString(Alchemy.VERSION);
  
  export function host(s: string | [string, string]) {
    const secret  = P2PSecret.mend(s            );
    const id      = P2PSecret.id  (secret, false);
    const pw      = P2PSecret.pw  (secret, false);

    // trystero
    const _trystero_room = Trystero.joinRoom({appId, password: pw}, id);
    const [
      _trystero_tx,
      _trystero_rx
    ] = _trystero_room.makeAction<P2PMessage>(P2PMessage.ACTION);
  }

  export function join(s: string | [string, string]) {

  }
  
  export function resolveRequest(sesh: P2PSession, reqId: string, result ?: any) {
    sesh.requests.get(reqId)?.resolve(result);
    sesh.requests.delete(reqId);
  }

  export function rejectRequest (sesh: P2PSession, reqId: string, result ?: any) {
    sesh.requests.get(reqId)?.reject (result);
    sesh.requests.delete(reqId);
  }

  export function rejectRequestsTo(sesh: P2PSession, to: string, a ?: any) {
    sesh.requests.forEach((request, reqId) => {
      if (request.to === to)
        rejectRequest(sesh, reqId, a);
    })
  }

  export function reqId(sesh: P2PSession) {
    let requestId = crypto.randomUUID();
    while (sesh.requests.has(requestId))
        requestId = crypto.randomUUID();
    return requestId;
  }

  export       function message(sesh: P2PSession, to: string, type: string, data: any, resId ?: string) {
    const message: P2PMessage = { from: sesh.selfId, to, type, data, resId,                    };
    if (sesh.is === "server") sesh._trystero_tx(message,              to);
    else                      sesh._trystero_tx(message, sesh.hostId ?? to);
  }

  export async function request(sesh: P2PSession, to: string, type: string, data: any, resId ?: string) {
    const message: P2PMessage = { from: sesh.selfId, to, type, data, resId, reqId: reqId(sesh) };
    return new Promise((resolve, reject) => {
      sesh.requests.set(message.reqId!, { to, resolve, reject });
      if (sesh.is === "server") sesh._trystero_tx(message,              to);
      else                      sesh._trystero_tx(message, sesh.hostId ?? to);
    })
  }

  function inclusive(sesh: P2PSession, ids: Array<string>) {
    return Array.from(sesh.peerIds).filter(id =>  ids.includes(id));
  }

  function exclusive(sesh: P2PSession, ids: Array<string>) {
    return Array.from(sesh.peerIds).filter(id => !ids.includes(id));
  }

  export function broadcastInclusive(sesh: P2PSession, ids: Array<string>, type: string, data: any) {
    inclusive(sesh, ids).forEach(id => message(sesh, id, type, data));
  }

  export function broadcastExclusive(sesh: P2PSession, ids: Array<string>, type: string, data: any) {
    exclusive(sesh, ids).forEach(id => message(sesh, id, type, data));
  }

  export function on(sesh: P2PSession, type: string, ) {

  }

}

export default P2PSession;