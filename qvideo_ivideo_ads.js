/**
 * i.video 响应过滤 v4.4
 *
 * QUIC 已丢弃后开屏可消，若频道仍有「广告」大卡：
 * - 服务端仍可能在 getMVLPageJ 嵌 AdFeedInfo（仅改请求不够稳）
 * - 必须用 bodyBytes 等长破坏 protobuf Any 类型名
 * - 顺带清空独立广告 RPC（Float/激励/Slot）
 */
const AD_RPC = [
  "GetSlotAdData",
  "Independent/GetAds",
  "ServerAdFeedsVideo",
  "video_ad_ssp_feeds",
  "video_ad_ssp",
  "GetPersonalCenterAdData",
  "GetSpeedPanelAd",
  "reward_ad_ssp",
  "RewardAdNewPlay",
  "RewardAdNewUpdate",
  "GetFollowHeartRewardAdInfo",
  "GetRewardEntranceInfo",
  "GetRewardPendant",
  "AdPreGetAdvertisement",
  "vip_ad_promotion",
  "AccessPromotion",
  "GetFloatActivity",
  "GetPromotionGlobalConfig",
  "vinfoad",
  "GetGameInfoV2",
  "ChosenPageService",
  "GetRecentGameSlip",
  "ad_ssp_widget"
];

// 等长替换：破坏 type.googleapis.com/.../Ad* 解析
const PAIRS = [
  ["AdFeedInfo", "XxFeedInfo"],
  ["AdFeedImagePoster", "XxFeedImagePoster"],
  ["AdFeedVideoPoster", "XxFeedVideoPoster"],
  ["AdFeedRewardInfo", "XxFeedRewardInfo"],
  ["AdFeedRewardDialogInfo", "XxFeedRewardDialogInfo"],
  ["AdOpenWxProgramAction", "XxOpenWxProgramAction"],
  ["AdResponseInfo", "XxResponseInfo"],
  ["AdDownloadAction", "XxDownloadAction"],
  ["AdFocusPoster", "XxFocusPoster"],
  ["AdJumpAction", "XxJumpAction"],
  ["AdWebAction", "XxWebAction"],
  ["AdRequestContextInfo", "NoRequestContextInfo"],
  ["AdDislikeItem", "XxDislikeItem"],
  ["InnerAdPromotionEventList", "InnerXxPromotionEventList"],
  ["InnerAdPullRefreshEventList", "InnerXxPullRefreshEventList"],
  ["InnerAdPullRefreshExtraDisplayInfo", "InnerXxPullRefreshExtraDisplayInfo"],
  ["InnerAdCommonPromotionEventActivityList", "InnerXxCommonPromotionEventActivityList"],
  // 宽匹配：protocol.pb.AdXxx → protocol.pb.XdXxx
  ["protocol.pb.Ad", "protocol.pb.Xd"],
  ["pgdt.gtimg.cn", "xxxx.gtimg.cn"],
  ["native_ad_", "native_xx_"],
  ["view_ad_ssp", "view_no_ssp"],
  ["去微信看看", "\u3000\u3000\u3000\u3000\u3000"]
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

function needsStrip(body) {
  return (
    body.indexOf("AdFeed") !== -1 ||
    body.indexOf("AdOpenWx") !== -1 ||
    body.indexOf("InnerAd") !== -1 ||
    body.indexOf("protocol.pb.Ad") !== -1 ||
    body.indexOf("pgdt.gtimg.cn") !== -1 ||
    body.indexOf("view_ad_ssp") !== -1 ||
    body.indexOf("native_ad_") !== -1 ||
    body.indexOf("去微信看看") !== -1
  );
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
  return { body: body, changed: changed };
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
