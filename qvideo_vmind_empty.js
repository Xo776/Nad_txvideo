/**
 * 腾讯视频中插/贴片 getvmind 空响应
 * 返回无广告 XML，避免 reject-200 后播放器仍占广告位空等。
 */
const body =
  '<?xml version="1.0" encoding="utf-8"?>' +
  "<root><ad_list></ad_list><vl></vl></root>";

$done({
  status: "HTTP/1.1 200 OK",
  headers: {
    "Content-Type": "text/xml; charset=utf-8",
    "Content-Length": body.length.toString()
  },
  body: body
});
