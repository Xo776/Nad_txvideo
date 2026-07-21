/**
 * i.video 请求侧：关掉信息流原生广告上下文
 *
 * 截图广告：电视剧频道信息流大卡「广告」+「去微信看看」
 * 抓包：getMVLPageJ 请求含 view_ad_ssp_*（protobuf map key）
 * 等长替换 view_ad_ssp → view_no_ssp，不破坏 protobuf 长度前缀
 */
function asText() {
  try {
    if ($request.bodyBytes) {
      const u8 = new Uint8Array($request.bodyBytes);
      let s = "";
      for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
      return s;
    }
  } catch (e) {}
  return $request.body || "";
}

function toBytes(s) {
  const u8 = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i) & 0xff;
  return u8.buffer;
}

let body = asText();
if (!body || body.indexOf("view_ad_ssp") === -1) {
  $done({});
} else {
  body = body.split("view_ad_ssp").join("view_no_ssp");
  try {
    $done({ body: body, bodyBytes: toBytes(body) });
  } catch (e) {
    $done({ body: body });
  }
}
