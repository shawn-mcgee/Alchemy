import P2PSecret  from "./p2p-secret";
import P2PMessage from "./p2p-message";
import P2PSession from "./p2p-session";

import * as Trystero from "trystero";

export interface P2PServer extends P2PSession {
  is: "server";
}

export namespace P2PServer {
  const appId = P2PSession.APPLICATION_ID;

  export function host(s: string | [string, string]) {
    const
      secret = P2PSecret.mend(s),
      id     = P2PSecret.id  (s),
      pw     = P2PSecret.pw  (s);

    const 
      _trystero_room = Trystero.joinRoom({appId, password: pw}, id),
      [
        _trystero_tx,
        _trystero_rx
      ] = _trystero_room.makeAction<P2PMessage>(P2PMessage.ACTION);

    const server: P2PServer = {
      is       : "server",
      serverId : Trystero.selfId,
      clientId : Trystero.selfId,
      clientIds: new Set(),
      requests : new Map(),

      secret,
      id,
      pw,

      _trystero_room,
      _trystero_tx  ,
      _trystero_rx
    }

    return server;
  }
}

export default P2PServer;