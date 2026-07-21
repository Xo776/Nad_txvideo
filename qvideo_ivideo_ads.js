/**
 * i.video.qq.com 响应 — 纯广告 RPC 回 {}（对齐 Soul block）
 * 信息流广告主要靠 qvideo_ivideo_req.js 去掉 view_ad_ssp
 */
const AD_RPC = [
  "GetSlotAdData",
  "Independent/GetAds",
  "ServerAdFeedsVideo",
  "GetPersonalCenterAdData",
  "GetSpeedPanelAd",
  "video_ad_ssp",
  "reward_ad_ssp",
  "RewardAdNewPlay",
  "RewardAdNewUpdate",
  "GetFollowHeartRewardAdInfo",
  "GetRewardEntranceInfo",
  "GetRewardPendant",
  "AdPreGetAdvertisement",
  "SplashAd",
  "adsplash",
  "AdSplash",
  "QAdSplash",
  "vip_ad_promotion",
  "AccessPromotion",
  "GetFloatActivity",
  "GetPromotionGlobalConfig",
  "vinfoad",
  "GetGameInfoV2",
  "ChosenPageService",
  "GetRecentGameSlip"
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

const t = reqText();
let hit = false;
for (let i = 0; i < AD_RPC.length; i++) {
  if (t.indexOf(AD_RPC[i]) !== -1) {
    hit = true;
    break;
  }
}
if (hit) {
  $done({ body: "{}" });
} else {
  $done({});
}
