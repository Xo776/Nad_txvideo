# 腾讯视频 (Qvideo) AdBlock v1.4

## 你现在看到的现象

| 现象 | 原因 |
|------|------|
| 开屏没了 / puui 图挂了 | L1 素材域生效 |
| **广告位还在，只是不出图** | 客户端已按广告配置画了坑，只是创意图被拒 |
| **还有视频广告** | 贴片走 `getvmind` → `vmind`/`p201` 视频流，和图片 CDN 不是一路 |

要「去空框」必须让广告**配置接口**失败/变空（L2），不能只拦图。首页混在频道包里的广告卡仍可能残留。

## v1.4

- `getvmind` / `diffvmind` → 回空 XML（`qvideo_vmind_empty.js`）
- 加强 `vmind` / `omts` / `p201` / smtcdns 视频流 reject
- 扩充 `i.video` 广告 RPC 关键字（尽量不去下发广告位）

## 更新

```
https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_ads.conf
```

强杀 App 后再试播放页贴片。若正片播不了，把 L1-C 里 `p20` / `omts` 两行先注释掉反馈。

## 许可证

MIT
