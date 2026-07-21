/**
 * getvinfo 响应：清除 vl.vi[].adpass
 * 19:55 抓包 #1395：adpass 含 noBanner:false + .l.qq.com Cookie，客户端 decodeAdPassStr 后继续拉广告
 */
const EMPTY =
  "eyJiYW5uZXJQYXNzSW5mbyI6eyJzZXNzaW9uSWQiOiIiLCJub0Jhbm5lciI6dHJ1ZSwiY2FzdEFkVHlwZSI6MH0sImFkQ29va2llIjoiIiwiYWRSZXBvcnRQYXJhbXMiOiIiLCJobHNQYXNzVGhyb3VnaCI6IiJ9";

let body = $response.body || "";
try {
  const j = JSON.parse(body);
  const list = j && j.vl && j.vl.vi;
  if (Array.isArray(list)) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i].adpass != null) list[i].adpass = EMPTY;
    }
    body = JSON.stringify(j);
  }
} catch (e) {
  body = body.replace(/"adpass"\s*:\s*"[^"]*"/g, '"adpass":"' + EMPTY + '"');
}
$done({ body });
