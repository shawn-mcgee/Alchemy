export function Version( o?: {
  moniker ?: string,
  major   ?: number,
  minor   ?: number,
  patch   ?: number
}): Version {
  return {
    moniker: o?.moniker ?? "Alchemy",
    major  : o?.major   ?? 0,
    minor  : o?.minor   ?? 0,
    patch  : o?.patch   ?? 0
  }
}

export interface Version {
  readonly moniker: string;
  readonly major  : number;
  readonly minor  : number;
  readonly patch  : number;
}

export namespace Version {
  export function toString(a: Version) {
    return `${a.moniker} ${a.major}.${a.minor}.${a.patch}`;
  }

  export function compare(a: Version, b: Version) {
    let k;
    if ((k = a.major - b.major) !== 0) return k;
    if ((k = a.minor - b.minor) !== 0) return k;
    if ((k = a.patch - b.patch) !== 0) return k;
    return 0;
  }
}

export default Version;