export interface P2PMessage {
  to  : string;
  from: string;
  type: string;
  data: any;

  reqId ?: string;
  resId ?: string;
}

export namespace P2PMessage {
  export const ACTION = "__message__";
}

export default P2PMessage;