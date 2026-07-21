/**
 * i.video 响应过滤 v4.5
 *
 * 223401（关重写）实锤：getMVLPageJ 解压后含 AdFeedInfo / 去微信看看 / pgdt
 * 响应常 160–244KB。整包转 JS 字符串易在 QX 里超时/失败 → 改成 Uint8Array 原地等长替换。
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
  ["protocol.pb.Ad", "protocol.pb.Xd"],
  ["pgdt.gtimg.cn", "xxxx.gtimg.cn"],
  ["native_ad_", "native_xx_"],
  ["view_ad_ssp", "view_no_ssp"],
  ["去微信看看", "\u3000\u3000\u3000\u3000\u3000"]
];

function toU8(buf) {
  if (!buf) return null;
  return buf instanceof Uint8Array ? buf : new Uint8Array(buf);
}

function enc(s) {
  const u8 = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i) & 0xff;
  return u8;
}

// UTF-8 encode for non-latin1 (去微信看看)
function encUtf8(s) {
  const bytes = [];
  for (let i = 0; i < s.length; i++) {
    let c = s.charCodeAt(i);
    if (c < 0x80) bytes.push(c);
    else if (c < 0x800) {
      bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else {
      bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
  }
  return new Uint8Array(bytes);
}

function findBytes(hay, needle, from) {
  const n = needle.length;
  if (!n || hay.length < n) return -1;
  outer: for (let i = from || 0; i <= hay.length - n; i++) {
    for (let j = 0; j < n; j++) {
      if (hay[i + j] !== needle[j]) continue outer;
    }
    return i;
  }
  return -1;
}

function containsStr(u8, s) {
  return findBytes(u8, enc(s), 0) !== -1;
}

function replaceAllBytes(hay, fromStr, toStr) {
  const useUtf8 = /[^\u0000-\u00ff]/.test(fromStr);
  const a = useUtf8 ? encUtf8(fromStr) : enc(fromStr);
  const b = useUtf8 ? encUtf8(toStr) : enc(toStr);
  if (a.length !== b.length) return { u8: hay, changed: false };
  let changed = false;
  let i = 0;
  while (true) {
    const p = findBytes(hay, a, i);
    if (p < 0) break;
    hay.set(b, p);
    changed = true;
    i = p + b.length;
  }
  return { u8: hay, changed: changed };
}

function hasAdRpc(u8) {
  if (!u8) return false;
  for (let i = 0; i < AD_RPC.length; i++) {
    if (containsStr(u8, AD_RPC[i])) return true;
  }
  return false;
}

function needsStrip(u8) {
  return (
    containsStr(u8, "AdFeed") ||
    containsStr(u8, "AdOpenWx") ||
    containsStr(u8, "InnerAd") ||
    containsStr(u8, "protocol.pb.Ad") ||
    containsStr(u8, "pgdt.gtimg.cn") ||
    containsStr(u8, "view_ad_ssp") ||
    containsStr(u8, "native_ad_") ||
    findBytes(u8, encUtf8("去微信看看"), 0) !== -1
  );
}

function stripFeed(u8) {
  let changed = false;
  for (let i = 0; i < PAIRS.length; i++) {
    const r = replaceAllBytes(u8, PAIRS[i][0], PAIRS[i][1]);
    u8 = r.u8;
    if (r.changed) changed = true;
  }
  return { u8: u8, changed: changed };
}

let reqU8 = null;
try {
  if ($request.bodyBytes) reqU8 = toU8($request.bodyBytes);
} catch (e) {}
if (!reqU8 && $request.body) reqU8 = enc($request.body);

if (hasAdRpc(reqU8)) {
  $done({ body: "{}" });
} else {
  let raw = null;
  try {
    raw = $response.bodyBytes;
  } catch (e) {}
  if (!raw) {
    $done({});
  } else {
    let u8 = toU8(raw);
    // 拷贝后再改，避免改坏只读缓冲
    u8 = new Uint8Array(u8);
    if (!needsStrip(u8)) {
      $done({});
    } else {
      const r = stripFeed(u8);
      if (!r.changed) {
        $done({});
      } else {
        $done({ bodyBytes: r.u8.buffer });
      }
    }
  }
}
