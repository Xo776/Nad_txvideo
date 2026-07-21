/**
 * 腾讯视频 i.video.qq.com 广告过滤（对齐 Soul 的 script-response-body 用法）
 *
 * Soul：改 JSON 响应删 AD_* 字段
 * Qvideo：请求体含广告 trpc 名时清空响应；否则 $done({}) 不动二进制业务包
 */

const AD_MARKERS = [
  "reward_ad_ssp",
  "video_ad_ssp",
  "vip_ad_promotion",
  "GetFollowHeartRewardAdInfo",
  "GetRewardEntranceInfo",
  "GetRewardPendant",
  "RewardAdNewPlay",
  "RewardAdNewUpdate",
  "GetPersonalCenterAdData",
  "ServerAdFeedsVideo",
  "Independent/GetAds",
  "AdPreGetAdvertisement",
  "PreGetAdvertisement",
  "AdResponseAdInfo",
  "VideoBoardAdConfig",
  "BatchPullBizAdInfos",
  "BatchPullDynamicVideoAdInfos",
  "BatchQueryBizAdInfos",
  "QueryUnlockModuleAdInfos",
  "QueryWelfareTaskAdInfo",
  "AccessPromotion",
  "GetFloatActivity",
  "GetPromotionGlobalConfig",
  "promotion.adapter",
  "adsplash",
  "SplashAd",
  "AdSplash",
  "QAdSplash",
  "QAdFeed",
  "QAdReward",
  "vinfoad"
];

function reqText() {
  try {
    if (typeof $request.bodyBytes !== "undefined" && $request.bodyBytes) {
      const u8 = new Uint8Array($request.bodyBytes);
      const n = Math.min(u8.length, 65536);
      let s = "";
      for (let i = 0; i < n; i++) s += String.fromCharCode(u8[i]);
      return s;
    }
  } catch (e) {}
  return $request.body || "";
}

function isAd(text) {
  if (!text) return false;
  for (let i = 0; i < AD_MARKERS.length; i++) {
    if (text.indexOf(AD_MARKERS[i]) !== -1) return true;
  }
  return false;
}

if (isAd(reqText())) {
  console.log("[qvideo-ad] block ad rpc (soul-style response rewrite)");
  $done({ body: "", status: "HTTP/1.1 200 OK" });
} else {
  $done({});
}
