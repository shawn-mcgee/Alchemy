import type { P2PRequest } from "./p2p-request";

import Alchemy    from "../alchemy";
import Version    from "../version";
import P2PMessage from "./p2p-message";

import * as Trystero from "trystero";

export interface P2PSession {
  readonly secret: string;
  readonly id    : string;
  readonly pw    : string;
  readonly is    : "server" | "client";

  readonly serverId ?:     string ;
  readonly clientId  :     string ;
  readonly clientIds : Set<string>;

  readonly requests: Map<string, P2PRequest>;

  readonly _trystero_room: Trystero.Room;
  readonly _trystero_tx  : Trystero.ActionSender  <P2PMessage>;
  readonly _trystero_rx  : Trystero.ActionReceiver<P2PMessage>;
}

export namespace P2PSession {
  export const APPLICATION_ID = Version.toString(Alchemy.VERSION);
}

export default P2PSession;