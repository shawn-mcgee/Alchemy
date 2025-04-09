import type { P2PContext } from "./p2p-context";

export interface P2PListener {
  (
    data   : any       ,
    context: P2PContext,
  ): void
}