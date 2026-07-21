# 腾讯视频 (Qvideo) AdBlock v1.2

## 先说清楚：域名挖全了吗？

**独立广告域 / SDK 域：基本挖到了**（抓包 + IPA QAD 字符串 + 社区规则交叉）。  
**但「所有广告」不等于「所有带 ad 的域名」**：

| 广告形态 | 是否已覆盖 | 说明 |
|----------|------------|------|
| `vi/news/lives/p.l.qq.com`、GDT/AMS 上报 | ✅ L1 reject | 独立域 |
| Shiply 冷启 splash | ✅ L1 reject | |
| `getvmind` / `vmind` 贴片流 / p201 | ✅ L1 reject | |
| `i.video` 里激励/SSP/弹层 trpc | ✅ L2 脚本清空响应 | v1.2 |
| 首页/频道 **混在 MVL 业务包里的广告卡片** | ❌ 未拆 | 与正片同一 protobuf，强拆易再次打挂 |

所以 v1.1 关掉 L2 后「广告全回来」是预期现象：主广告不走那些外围域。

## v1.2 改动

- **恢复** `i.video.qq.com` 处理，但改用 `script-response-body`
- 广告 RPC → 清空 body；其它 → `$done({})` **不碰二进制**（避免 v1.0 登录/首页挂掉）
- L1 补：`us.l.qq.com`、`mi.gdt.qq.com`、`wa.gtimg.com/adxcdn`、`vmind` 流、`p201` 贴片等

## 安装 / 更新

```
https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_ads.conf
```

1. QX 更新该重写  
2. 确认 MitM 含 `i.video.qq.com`  
3. 强杀 App 再开  

若又无法登录/首页空白：立刻反馈，我们再把 L2 注释掉只留 L1。

## 文件

| 文件 | 用途 |
|------|------|
| `qvideo_ads.conf` | 重写规则 |
| `qvideo_ivideo_ads.js` | L2：按 trpc 名清空广告响应 |

## 许可证

MIT
