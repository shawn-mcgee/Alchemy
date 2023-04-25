import Version from "./util/Version";

// Alchemy 0.1.0
export const VERSION: Version = {
  moniker: "Alchemy",
  major  :         0,
  minor  :         1,
  patch  :         0
}

console.log(Version.toString(VERSION))