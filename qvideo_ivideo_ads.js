/**
 * i.video 响应过滤 v4.2
 *
 * 对照抓包 2026-07-21-195538：
 * - 请求改写已生效（NoRequestContextInfo）
 * - AdFeedInfo / 超能下蛋鸭 已从 MVL 消失
 * - 但 GetFloatActivity / AccessPromotion / reward 仍有回包
 *   原因：AD_RPC 命中后 $done("{}") 未结束，后面又 $done({}) 透传覆盖
 * - 残留 InnerAd* 推广事件需一并破坏
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
  "ChosenPageService",
  "GetRecentGameSlip"
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
  ["InnerAdPullRefreshExtraDisplayInfo", "InnerXxPullRefreshExtraDisplayInfo"],
  ["InnerAdCommonPromotionEventActivityList", "InnerXxCommonPromotionEventActivityList"]
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

function hasAdRpc(req) {
  for (let i = 0; i < AD_RPC.length; i++) {
    if (req.indexOf(AD_RPC[i]) !== -1) return true;
  }
  return false;
}

function stripFeed(body) {
  let changed = false;
  for (let i = 0; i < PAIRS.length; i++) {
    const a = PAIRS[i][0];
    const b = PAIRS[i][1];
    if (a.length !== b.length) continue;
    if (body.indexOf(a) !== -1) {
      body = body.split(a).join(b);
      changed = true;
    }
  }
  if (body.indexOf("去微信看看") !== -1) {
    body = body.split("去微信看看").join("\u3000\u3000\u3000\u3000\u3000");
    changed = true;
  }
  return { body: body, changed: changed };
}

function needsStrip(body) {
  return (
    body.indexOf("AdFeedInfo") !== -1 ||
    body.indexOf("AdOpenWxProgramAction") !== -1 ||
    body.indexOf("InnerAdPromotion") !== -1 ||
    body.indexOf("InnerAdPullRefresh") !== -1 ||
    body.indexOf("InnerAdCommonPromotion") !== -1
  );
}

const req = reqStr();
if (hasAdRpc(req)) {
  $done({ body: "{}" });
} else {
  let raw = null;
  try {
    raw = $response.bodyBytes;
  } catch (e) {}

  if (raw) {
    let body = bytesToStr(raw);
    if (!needsStrip(body)) {
      $done({});
    } else {
      const r = stripFeed(body);
      if (!r.changed) {
        $done({});
      } else {
        $done({ bodyBytes: strToBytes(r.body) });
      }
    }
  } else {
    let body = $response.body || "";
    if (!needsStrip(body)) {
      $done({});
    } else {
      const r = stripFeed(body);
      $done({ body: r.body });
    }
  }
}
