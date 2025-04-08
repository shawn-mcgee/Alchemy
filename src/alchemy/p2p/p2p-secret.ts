import { sampleSize } from "lodash";

export namespace P2PSecret {
  export const RUNES = "abcdefghijklmnopqrstuvwxyz0123456789";

  export function random(n=6, m=6) {
    let id = sampleSize([...RUNES], n).join("");
    let pw = sampleSize([...RUNES], m).join("");
    return mend([id, pw], false);
  }

  export function id  (s: string | [string, string], scrub=true) {
    return rend(s, scrub)[0];
  }

  export function pw  (s: string | [string, string], scrub=true) {
    return rend(s, scrub)[1];
  }

  export function rend(s: string | [string, string], scrub=true) {
    let id, pw;
    if (typeof s === "string") {
      id = s.split("?")[0] ?? "";
      pw = s.split("?")[1] ?? "";
    } else
      [id, pw] = s;

    if (scrub) return [
      P2PSecret.scrub(id), 
      P2PSecret.scrub(pw)
    ] as const;
    else return [id, pw] as const;
  }

  export function mend(s: string | [string, string], scrub=true) {
    let id, pw;
    if (typeof s === "string") {
      id = s.split("?")[0] ?? "";
      pw = s.split("?")[1] ?? "";
    } else
      [id, pw] = s;

    if (scrub) return P2PSecret.scrub(`${id}?${pw}`);
    else       return              `${id}?${pw}` ;
  }
  
  export function scrub(s: string, keep=RUNES + "?") {
    return [...s.toLowerCase()].filter(c => keep.includes(c)).join("");
  }
}

export default P2PSecret;