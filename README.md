# 腾讯视频 AdBlock v1.7

## 客户端深挖结论（为何「所有广告都还在」）

外围域 reject + 锁 puui **挡不住贴片**。抓包实锤：

| 链路 | 端点 | 关键字段 |
|------|------|----------|
| 正片信息 | `svv.video.qq.com/getvinfo` POST | **`sppreviewtype=1`** 打开贴片 |
| 中插清单 | `vv.video.qq.com/getvmind` | 广告 XML |
| 开屏/信息流 | `*.l.qq.com` / Shiply splash / QAD | 独立域 |
| 角标广告位 | `i.video.qq.com` trpc | 业务混排 |

社区成熟做法（Surge/Loon）：把 `sppreviewtype` / `spsrt` 改成 `0`。v1.7 已照做。

IPA 另补：`pgdt.gtimg.cn`、`gdtimg.com`、`info4/6.video.qq.com`、`beacon` 等。

## 安装（同 Soul）

重写引用：
```
https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_ads.conf
```

脚本（conf 已写 raw，无需本地拷贝）：
- `qvideo_getvinfo.js` — 改 POST body  
- `qvideo_getvinfo_url.js` — 改 GET query  
- `qvideo_ivideo_ads.js` — 清 i.video 广告 RPC  

更新后请：**强杀腾讯视频**，播一集看前贴是否还在。开屏若仍闪，清 App 缓存再冷启。

## 文件

| 文件 | 作用 |
|------|------|
| `qvideo_ads.conf` | 重写总表 |
| `qvideo_getvinfo.js` | 关贴片开关 |
| `qvideo_getvinfo_url.js` | GET 版关贴片 |
| `qvideo_ivideo_ads.js` | 网关广告 RPC |

## 许可证

MIT
