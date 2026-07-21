/**
 * getvmind 中插清单 — 返回空 XML（播放器要 XML，不能只回 {}）
 */
const body =
  '<?xml version="1.0" encoding="utf-8"?><root><ad_list></ad_list></root>';
$done({
  body,
  headers: { "Content-Type": "text/xml; charset=utf-8" }
});
