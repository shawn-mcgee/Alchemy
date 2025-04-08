export interface P2PMessage {
  type: string;

  reqId ?: string;
  resId ?: string;
}

export namespace P2PMessage {
  export const ACTION = "__message__";
}

export default P2PMessage;