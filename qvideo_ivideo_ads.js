/**
 * 腾讯视频(Qvideo) 去广告 - i.video.qq.com 网关过滤
 *
 * 原理：
 *   业务与广告共用 https://i.video.qq.com/ （POST /，trpc 方法名在二进制 body 内）。
 *   使用 script-analyze-echo-response 读取请求体：
 *   - 命中广告 trpc → 本地直接返回空 200，不放行到源站
 *   - 非广告 → $task.fetch 原样转发，保证首页/频道/播放正常
 *
 * QX 能力：script-analyze-echo-response（等待 request body）+ $task.fetch 透传
 */

const AD_RPC = [
  // 激励广告 SSP（抓包已证实）
  "reward_ad_ssp",
  "GetFollowHeartRewardAdInfo",
  "GetRewardEntranceInfo",
  "GetRewardPendant",
  "RewardAdNewPlay",
  "RewardAdNewUpdate",
  // 信息流 / 个人中心广告（抓包 + IPA）
  "video_ad_ssp",
  "ServerAdFeedsVideo",
  "GetPersonalCenterAdData",
  "GetAds",
  "Independent/GetAds",
  // VIP / 运营推广弹层（抓包已证实）
  "vip_ad_promotion",
  "AccessPromotion",
  "GetFloatActivity",
  "GetPromotionGlobalConfig",
  // 开屏 / 预取广告（IPA Proto）
  "AdPreGetAdvertisement",
  "adsplash",
  "SplashAd",
  // 成长任务拉广告（IPA）
  "BatchPullBizAdInfos",
  "BatchPullDynamicVideoAdInfos",
  "BatchQueryBizAdInfos",
  "QueryUnlockModuleAdInfos",
  "QueryWelfareTaskAdInfo"
];

function bodyText() {
  // 二进制 protobuf 里 ASCII 方法名仍可按字符串检索
  if (typeof $request.bodyBytes !== "undefined" && $request.bodyBytes) {
    try {
      const u8 = new Uint8Array($request.bodyBytes);
      let s = "";
      const n = Math.min(u8.length, 65536);
      for (let i = 0; i < n; i++) s += String.fromCharCode(u8[i]);
      return s;
    } catch (e) {}
  }
  return $request.body || "";
}

function isAdRequest(text) {
  if (!text) return false;
  for (let i = 0; i < AD_RPC.length; i++) {
    if (text.indexOf(AD_RPC[i]) !== -1) return true;
  }
  return false;
}

function emptyOk() {
  $done({
    response: {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": "0"
      },
      body: ""
    }
  });
}

const text = bodyText();
if (isAdRequest(text)) {
  console.log("[qvideo-ad] block trpc ad on i.video.qq.com");
  emptyOk();
} else {
  // 非广告：透传，避免误伤业务
  const req = {
    url: $request.url,
    method: $request.method,
    headers: $request.headers,
    body: $request.body
  };
  if (typeof $request.bodyBytes !== "undefined" && $request.bodyBytes) {
    req.bodyBytes = $request.bodyBytes;
  }
  $task.fetch(req).then(
    (resp) => {
      const out = {
        status: resp.statusCode || 200,
        headers: resp.headers || {},
        body: resp.body || ""
      };
      if (typeof resp.bodyBytes !== "undefined" && resp.bodyBytes) {
        out.bodyBytes = resp.bodyBytes;
      }
      $done({ response: out });
    },
    (err) => {
      console.log("[qvideo-ad] fetch fail: " + err);
      // 透传失败时放空，避免卡死；业务侧会重试
      emptyOk();
    }
  );
}
