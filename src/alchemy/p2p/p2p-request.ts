export interface P2PRequest {
  to : string;
  resolve: (result ?: any) => void;
  reject : (result ?: any) => void;
}