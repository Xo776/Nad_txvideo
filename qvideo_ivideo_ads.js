/**
 * i.video 响应：广告 RPC 回 {}；并识别请求里已改名的广告上下文
 */
const AD_RPC = [
  "GetSlotAdData",
  "Independent/GetAds",
  "ServerAdFeedsVideo",
  "video_ad_ssp_feeds",
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
  "GetRecentGameSlip",
  "AdRequestContextInfo",
  "NoRequestContextInfo"
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
    // 仅 AdRequestContextInfo / NoRequest... 出现在 MVL 频道请求里：不能整包清空，否则频道空白
    if (
      AD_RPC[i] === "AdRequestContextInfo" ||
      AD_RPC[i] === "NoRequestContextInfo"
    ) {
      continue;
    }
    hit = true;
    break;
  }
}
if (hit) {
  $done({ body: "{}" });
} else {
  $done({});
}
