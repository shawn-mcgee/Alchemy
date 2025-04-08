export interface P2PRequest {
  peerId: string;
  res: (a ?: any) => void;
  rej: (a ?: any) => void;
}