/**
 * 腾讯视频 i.video.qq.com 广告 RPC 过滤（v1.4）
 *
 * script-response-body：广告 RPC 清空响应；非广告 $done({}) 不改二进制。
 * 目标：尽量让客户端拿不到广告位配置，减少「空广告框」。
 */

const AD_MARKERS = [
  // 激励 / SSP
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
  "AdEmptyAdInfo",
  "VideoBoardAdConfig",
  "BatchPullBizAdInfos",
  "BatchPullDynamicVideoAdInfos",
  "BatchQueryBizAdInfos",
  "QueryUnlockModuleAdInfos",
  "QueryWelfareTaskAdInfo",
  // 运营弹层 / 推广（占位来源之一）
  "AccessPromotion",
  "GetFloatActivity",
  "GetPromotionGlobalConfig",
  "promotion.adapter",
  "vip_ad_promotion",
  // 开屏
  "adsplash",
  "SplashAd",
  "AdSplash",
  // 通用（protobuf / 业务字段）
  "QAdSplash",
  "QAdFeed",
  "QAdReward",
  "qad_device",
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
  console.log("[qvideo-ad] empty ad RPC response");
  $done({ body: "", status: "HTTP/1.1 200 OK" });
} else {
  $done({});
}
