/**
 * i.video 响应过滤 v4.1（对照 19:55 #1503 超能下蛋鸭）
 *
 * 关键因：protobuf 含大量 0x00，用 $response.body 字符串会截断，
 * 导致找不到 AdFeedInfo。必须只用 bodyBytes。
 *
 * #1503 解压后含 3 个 AdFeedInfo Module + AdOpenWxProgramAction +「去微信看看」
 */
const AD_RPC = [
  "GetSlotAdData",
  "Independent/GetAds",
  "ServerAdFeedsVideo",
  "video_ad_ssp_feeds",
  "GetPersonalCenterAdData",
  "GetSpeedPanelAd",
  "reward_ad_ssp",
  "RewardAdNewPlay",
  "RewardAdNewUpdate",
  "GetFollowHeartRewardAdInfo",
  "GetRewardEntranceInfo",
  "AdPreGetAdvertisement",
  "vip_ad_promotion",
  "AccessPromotion",
  "GetFloatActivity",
  "GetPromotionGlobalConfig",
  "vinfoad",
  "GetGameInfoV2",
  "ChosenPageService"
];

const PAIRS = [
  ["AdFeedInfo", "XxFeedInfo"],
  ["AdFeedImagePoster", "XxFeedImagePoster"],
  ["AdFeedVideoPoster", "XxFeedVideoPoster"],
  ["AdOpenWxProgramAction", "XxOpenWxProgramAction"],
  ["AdResponseInfo", "XxResponseInfo"],
  ["AdDownloadAction", "XxDownloadAction"],
  ["AdFocusPoster", "XxFocusPoster"],
  ["AdJumpAction", "XxJumpAction"],
  ["AdWebAction", "XxWebAction"],
  ["InnerAdPromotionEventList", "InnerXxPromotionEventList"],
  ["InnerAdPullRefreshEventList", "InnerXxPullRefreshEventList"],
  ["InnerAdPullRefreshExtraDisplayInfo", "InnerXxPullRefreshExtraDisplayInfo"]
];

function bytesToStr(buf) {
  if (!buf) return "";
  const u8 = buf instanceof ArrayBuffer ? new Uint8Array(buf) : new Uint8Array(buf);
  const CHUNK = 0x8000;
  let s = "";
  for (let i = 0; i < u8.length; i += CHUNK) {
    const sub = u8.subarray(i, Math.min(i + CHUNK, u8.length));
    s += String.fromCharCode.apply(null, sub);
  }
  return s;
}

function strToBytes(s) {
  const u8 = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i) & 0xff;
  return u8.buffer;
}

function reqStr() {
  try {
    if ($request.bodyBytes) return bytesToStr($request.bodyBytes);
  } catch (e) {}
  return $request.body || "";
}

const req = reqStr();
for (let i = 0; i < AD_RPC.length; i++) {
  if (req.indexOf(AD_RPC[i]) !== -1) {
    $done({ body: "{}" });
  }
}

let raw;
try {
  raw = $response.bodyBytes;
} catch (e) {
  raw = null;
}

if (!raw) {
  // 无 bodyBytes 时尽量用 body（可能已截断，仍尝试）
  let body = $response.body || "";
  if (body.indexOf("AdFeedInfo") === -1) {
    $done({});
  } else {
    for (let i = 0; i < PAIRS.length; i++) {
      const a = PAIRS[i][0];
      const b = PAIRS[i][1];
      if (a.length === b.length) body = body.split(a).join(b);
    }
    $done({ body: body });
  }
} else {
  let body = bytesToStr(raw);
  if (body.indexOf("AdFeedInfo") === -1 && body.indexOf("AdOpenWxProgramAction") === -1) {
    $done({});
  } else {
    for (let i = 0; i < PAIRS.length; i++) {
      const a = PAIRS[i][0];
      const b = PAIRS[i][1];
      if (a.length !== b.length) continue;
      if (body.indexOf(a) !== -1) body = body.split(a).join(b);
    }
    // 19:55 明文 CTA / 角标（UTF-8 等长）
    body = body.split("广告").join("\u3000\u3000");
    // 去微信看看 = 15 bytes；看详情内容　 = 需 15 bytes
    // 去微信看看: 5*3=15；　　　　　　　 = 5*3=15 全角空格
    body = body.split("去微信看看").join("\u3000\u3000\u3000\u3000\u3000");
    $done({ bodyBytes: strToBytes(body) });
  }
}
