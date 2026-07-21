/**
 * i.video 响应过滤 v4.0
 *
 * 深挖结论：频道信息流大卡在 getMVLPageJ 的 gzip 解压后 protobuf 里
 * 含 AdFeedInfo / AdOpenWxProgramAction /「广告」「去微信看看」
 * QX 对 script-response-body 会先解 Content-Encoding，body 已是明文 protobuf（约 150KB+）
 * 等长破坏广告 Any 类型名，使客户端无法解析广告卡（对齐 Soul 删字段思路）
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
  "GetRewardPendant",
  "AdPreGetAdvertisement",
  "SplashAd",
  "adsplash",
  "vip_ad_promotion",
  "AccessPromotion",
  "GetFloatActivity",
  "GetPromotionGlobalConfig",
  "vinfoad",
  "GetGameInfoV2",
  "ChosenPageService",
  "GetRecentGameSlip"
];

/** 等长替换：破坏广告相关 protobuf type URL / 字段名 */
const PAIRS = [
  ["AdFeedInfo", "XxFeedInfo"], // 10
  ["AdFeedImagePoster", "XxFeedImagePoster"], // 16
  ["AdFeedVideoPoster", "XxFeedVideoPoster"], // 16
  ["AdOpenWxProgramAction", "XxOpenWxProgramAction"], // 20
  ["AdResponseInfo", "XxResponseInfo"], // 14
  ["AdDownloadAction", "XxDownloadAction"], // 15
  ["AdFocusPoster", "XxFocusPoster"], // 13
  ["AdJumpAction", "XxJumpAction"], // 12
  ["AdWebAction", "XxWebAction"], // 11
  ["InnerAdPromotionEventList", "InnerXxPromotionEventList"], // 25
  ["InnerAdPullRefreshEventList", "InnerXxPullRefreshEventList"], // 26
  ["InnerAdPullRefreshExtraDisplayInfo", "InnerXxPullRefreshExtraDisplayInfo"] // 34
];

function reqText() {
  try {
    if ($request.bodyBytes) {
      const u8 = new Uint8Array($request.bodyBytes);
      const n = Math.min(u8.length, 65536);
      let s = "";
      for (let i = 0; i < n; i++) s += String.fromCharCode(u8[i]);
      return s;
    }
  } catch (e) {}
  return $request.body || "";
}

function respText() {
  try {
    if ($response.bodyBytes) {
      const u8 = new Uint8Array($response.bodyBytes);
      let s = "";
      for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
      return s;
    }
  } catch (e) {}
  return $response.body || "";
}

function toBytes(s) {
  const u8 = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i) & 0xff;
  return u8.buffer;
}

const req = reqText();
for (let i = 0; i < AD_RPC.length; i++) {
  if (req.indexOf(AD_RPC[i]) !== -1) {
    $done({ body: "{}" });
  }
}

let body = respText();
if (!body) {
  $done({});
} else {
  // 仅当响应里确实有广告结构时改写，避免误伤
  const hasAd =
    body.indexOf("AdFeedInfo") !== -1 ||
    body.indexOf("AdOpenWxProgramAction") !== -1 ||
    body.indexOf("AdResponseInfo") !== -1 ||
    body.indexOf("AdFeedImagePoster") !== -1;

  if (!hasAd) {
    $done({});
  } else {
    for (let i = 0; i < PAIRS.length; i++) {
      const a = PAIRS[i][0];
      const b = PAIRS[i][1];
      if (a.length !== b.length) continue;
      if (body.indexOf(a) !== -1) body = body.split(a).join(b);
    }
    // 「广告」6 字节 → 两个全角空格 6 字节，削弱角标
    const adMark = "广告";
    const blank = "\u3000\u3000";
    if (body.indexOf(adMark) !== -1) body = body.split(adMark).join(blank);

    try {
      $done({ body: body, bodyBytes: toBytes(body) });
    } catch (e) {
      $done({ body: body });
    }
  }
}
