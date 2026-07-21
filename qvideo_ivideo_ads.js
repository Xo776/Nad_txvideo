/**
 * 腾讯视频 i.video.qq.com 广告 RPC 过滤（v1.2）
 *
 * 使用 script-response-body（不是 analyze-echo + fetch）：
 * - 请求已正常到达源站，响应原样在 $response
 * - 仅当请求体含广告 trpc 名时清空响应
 * - 非广告：$done({}) 完全不改，避免破坏二进制 protobuf
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
  "AdPreGetAdvertisement",
  "Independent/GetAds",
  "BatchPullBizAdInfos",
  "BatchPullDynamicVideoAdInfos",
  "BatchQueryBizAdInfos",
  "QueryUnlockModuleAdInfos",
  "QueryWelfareTaskAdInfo",
  "AccessPromotion",
  "GetFloatActivity",
  "GetPromotionGlobalConfig",
  "adsplash",
  "SplashAd"
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
  console.log("[qvideo-ad] empty ad response on i.video.qq.com");
  $done({ body: "", status: "HTTP/1.1 200 OK" });
} else {
  $done({});
}
