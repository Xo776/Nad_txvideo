/**
 * i.video 请求侧：去掉频道信息流广告上下文（v3.2）
 *
 * 抓包 getMVLPageJ 明文含：
 * - view_ad_ssp_* 广告位透传
 * - type.googleapis.com/.../AdRequestContextInfo
 * - advertiser=&industry=&product=&aid= 广告定向
 * protobuf 一律等长替换，避免打坏长度前缀
 */
function asText() {
  try {
    if ($request.bodyBytes) {
      const u8 = new Uint8Array($request.bodyBytes);
      let s = "";
      for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
      return s;
    }
  } catch (e) {}
  return $request.body || "";
}

function toBytes(s) {
  const u8 = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i) & 0xff;
  return u8.buffer;
}

const PAIRS = [
  // 12 == 12
  ["view_ad_ssp", "view_no_ssp"],
  // 20 == 20  关键广告 Any 类型，服务端解不出广告上下文
  ["AdRequestContextInfo", "NoRequestContextInfo"],
  // 11 == 11
  ["advertiser=", "xdxertiser="],
  // 10 == 10
  ["ad_ecpm=", "xx_ecpm="],
  // 9 == 9
  ["industry=", "xndustry="],
  // 8 == 8
  ["product=", "xroduct="],
  // 10 == 10  native 广告位
  ["native_ad_", "native_xx_"],
  // 9 == 9
  ["adVipState", "xxVipState"]
];

let body = asText();
if (!body) {
  $done({});
} else {
  let hit = false;
  for (let i = 0; i < PAIRS.length; i++) {
    const a = PAIRS[i][0];
    const b = PAIRS[i][1];
    if (a.length !== b.length) continue;
    if (body.indexOf(a) !== -1) {
      body = body.split(a).join(b);
      hit = true;
    }
  }
  // 清掉 aid= 数字广告 ID（等长：aid= -> xid= 不够；用 aid=0 补位较难）
  // 将 aid= 后紧跟数字尽量保持长度：不做变长替换
  if (!hit) {
    $done({});
  } else {
    try {
      $done({ body: body, bodyBytes: toBytes(body) });
    } catch (e) {
      $done({ body: body });
    }
  }
}
