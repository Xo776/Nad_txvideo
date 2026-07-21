/**
 * 腾讯视频 i.video.qq.com — 清空广告 RPC 响应
 * 客户端二进制可见：GetSlotAdData / GetAds / reward_ad_ssp / Splash 等
 * Soul 同款：script-response-body + 远程 raw；非广告 $done({})
 */
const AD = [
  // 广告位（右上角「广告」角标来源）
  "GetSlotAdData",
  "Independent/GetAds",
  "ServerAdFeedsVideo",
  "GetPersonalCenterAdData",
  "GetSpeedPanelAd",
  "video_ad_ssp",
  // 激励
  "reward_ad_ssp",
  "RewardAdNewPlay",
  "RewardAdNewUpdate",
  "GetFollowHeartRewardAdInfo",
  "GetRewardEntranceInfo",
  "GetRewardPendant",
  // 开屏 / 推广
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
  $done({ body: "", status: "HTTP/1.1 200 OK" });
} else {
  $done({});
}
