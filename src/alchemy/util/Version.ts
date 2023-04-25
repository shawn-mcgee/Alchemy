export type      Version = {
  moniker: string
  major  : string | number
  minor  : string | number
  patch  : string | number
}

export namespace Version   {
  export function toString(v: Version): string {
    return `${v.moniker} ${v.major}.${v.minor}.${v.patch}`
  }
}

export default Version