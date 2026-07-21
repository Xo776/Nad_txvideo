# 腾讯视频去广告 v2.1

## 19:55 抓包结论（`2026-07-21-192707`）

| 时间 | 请求 | 含义 |
|------|------|------|
| 19:55:01 #1395 | `svv.video.qq.com/getvinfo` POST 仍 `sppreviewtype=1` | **请求改写未生效** |
| 同响应 | `vl.vi[0].adpass` → `noBanner:false` + `.l.qq.com` Cookie | 客户端 `decodeAdPassStr` 续拉广告 |
| 随后 | `puui.../media_img/lena/...` | 广告创意图 |
| 同时段 | `vi.l.qq.com/proxyhttp` `buid=onlyad\|vinfoad` | L 域广告代理 |
| | `vv.../getvmind` 已 200 空体 | vmind 拦截有效，但不够 |

客户端二进制：`QAdTvCastAdPass` / `decodeAdPassStr`；广告位 RPC `GetSlotAdData`。

## v2.1 改动

1. **原生** `request-body` 把 `sppreviewtype/spsrt/spadseg` 改为 0（对齐社区，不靠远程 JS 改请求）
2. **响应脚本** 清空 `adpass`（`noBanner:true`）
3. 拦 `media_img/lena`、`ams_` Shiply

## 安装

```
https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_ads.conf
```

删掉旧重写 → 重新订阅 → **更新资源** → 确认 MitM 含 `svv.video.qq.com` → **清 App 缓存或重装** → 强杀冷启 → 播一集。

若贴片仍在：在 QX 日志里搜 `getvinfo`，看请求体是否已是 `sppreviewtype=0`。
