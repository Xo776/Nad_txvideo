/**
 * i.video.qq.com — 广告 RPC 清空（非广告透传，对齐 Soul 对业务 JSON 的定点删除）
 */
const AD = [
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
  "vinfoad"
];

function text() {
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

const t = text();
let hit = false;
for (let i = 0; i < AD.length; i++) {
  if (t.indexOf(AD[i]) !== -1) {
    hit = true;
    break;
  }
}
if (hit) {
  $done({ body: "{}" });
} else {
  $done({});
}
