/**
 * i.video 请求侧 v3.3 — Uint8Array 等长替换（避免大 body 转字符串失败）
 */
const PAIRS = [
  ["view_ad_ssp", "view_no_ssp"],
  ["AdRequestContextInfo", "NoRequestContextInfo"],
  ["advertiser=", "xdxertiser="],
  ["ad_ecpm=", "xx_ecpm="],
  ["industry=", "xndustry="],
  ["product=", "xroduct="],
  ["native_ad_", "native_xx_"],
  ["adVipState", "xxVipState"]
];

function toU8(buf) {
  if (!buf) return null;
  return buf instanceof Uint8Array ? buf : new Uint8Array(buf);
}

function enc(s) {
  const u8 = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i) & 0xff;
  return u8;
}

function findBytes(hay, needle, from) {
  const n = needle.length;
  if (!n || hay.length < n) return -1;
  outer: for (let i = from || 0; i <= hay.length - n; i++) {
    for (let j = 0; j < n; j++) {
      if (hay[i + j] !== needle[j]) continue outer;
    }
    return i;
  }
  return -1;
}

function replaceAll(hay, aStr, bStr) {
  const a = enc(aStr);
  const b = enc(bStr);
  if (a.length !== b.length) return false;
  let hit = false;
  let i = 0;
  while (true) {
    const p = findBytes(hay, a, i);
    if (p < 0) break;
    hay.set(b, p);
    hit = true;
    i = p + b.length;
  }
  return hit;
}

let raw = null;
try {
  if ($request.bodyBytes) raw = $request.bodyBytes;
} catch (e) {}
if (!raw) {
  $done({});
} else {
  const u8 = new Uint8Array(toU8(raw));
  let hit = false;
  for (let i = 0; i < PAIRS.length; i++) {
    if (replaceAll(u8, PAIRS[i][0], PAIRS[i][1])) hit = true;
  }
  if (!hit) {
    $done({});
  } else {
    $done({ bodyBytes: u8.buffer });
  }
}
