export interface P2PListener {
  (
    data   : any   ,
    type   : string,
    from   : string,
    respond: (type: string, data: any) => void,
    request: (type: string, data: any) => void
  ): void
}