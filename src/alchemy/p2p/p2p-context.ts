import type { P2PListener } from "./p2p-listener";
import type { P2PSession  } from "./p2p-session";

export interface P2PContext {
  readonly sesh: P2PSession;
  readonly type: string;
  readonly from: string;

  readonly self: P2PListener
}