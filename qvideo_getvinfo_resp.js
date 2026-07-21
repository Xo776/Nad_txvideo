/**
 * getvinfo 响应 — 清除 adpass（对齐 Soul popup：改 JSON 字段，不整包 reject）
 * 客户端 decodeAdPassStr；noBanner:false 会继续拉广告
 */
const EMPTY =
  "eyJiYW5uZXJQYXNzSW5mbyI6eyJzZXNzaW9uSWQiOiIiLCJub0Jhbm5lciI6dHJ1ZSwiY2FzdEFkVHlwZSI6MH0sImFkQ29va2llIjoiIiwiYWRSZXBvcnRQYXJhbXMiOiIiLCJobHNQYXNzVGhyb3VnaCI6IiJ9";

let body = $response.body;
if (body) {
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
}
$done({ body });
