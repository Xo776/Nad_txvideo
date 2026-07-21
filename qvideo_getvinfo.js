/**
 * getvinfo 请求：关贴片参数（备用；优先用 conf 里原生 request-body）
 */
function fix(s) {
  if (!s) return s;
  return s
    .replace(/sppreviewtype=\d+/gi, "sppreviewtype=0")
    .replace(/spsrt=\d+/gi, "spsrt=0")
    .replace(/spadseg=\d+/gi, "spadseg=0");
}
$done({ body: fix($request.body || "") });
