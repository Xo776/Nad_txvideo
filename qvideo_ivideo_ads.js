/**
 * [已停用] 腾讯视频 i.video.qq.com 网关过滤
 *
 * v1.0 曾用 script-analyze-echo-response + $task.fetch 透传非广告请求。
 * 实测会破坏登录/首页/频道：该接口响应是二进制 protobuf，
 * QX $task.fetch 无法可靠透传二进制 body。
 *
 * 请使用 qvideo_ads.conf v1.1+（仅 L1 reject），不要再挂本脚本。
 */

$done({});
