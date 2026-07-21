/**
 * 腾讯视频通用阻断（对齐 Soul/byead 的 soul_block.js）
 * 无条件返回空 JSON，用于替代无效的 url reject-200
 */
$done({ body: "{}" });
