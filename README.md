# 腾讯视频 (Qvideo) AdBlock

对齐 **Soul / byead** 的 Quantumult X 写法。

## 和 Soul 一样怎么装

| 文件 | 用途 |
|------|------|
| `qvideo_ads.conf` | 重写配置（导入 QX 引用） |
| `qvideo_ivideo_ads.js` | 响应过滤脚本（GitHub raw，由 conf 引用） |

### 1. 已托管（同 Soul 的 byead）

```
https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_ivideo_ads.js
https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_ads.conf
```

### 2. 导入 Quantumult X

1. 重写 → 引用 → 添加 `qvideo_ads.conf` 的 raw 链接  
2. 开启 MitM（conf 末尾已带 hostname）  
3. 开启「重写」  

### 3. 验证

强杀腾讯视频后冷启；开屏应减少。右上角「广告」角标依赖 L2 脚本生效。

## 策略对照 Soul

| | Soul | Qvideo |
|--|------|--------|
| 独立广告域 | `reject-200` | 同左（`*.l.qq.com` / GDT / vmind / puui…） |
| 要改响应的接口 | `script-response-body` + raw JS | 同左（仅 `i.video.qq.com`） |
| 不用 | — | **不用** `script-echo-response`（易失效） |

Soul 广告域独立，整路径 reject 就够。  
腾讯视频大量广告挤在 `i.video.qq.com`，所以多一层「按 trpc 名清空响应」。

## 开屏又出现时

清腾讯视频缓存或重装后再冷启（Shiply 开屏包可能已本地缓存）。

## 许可证

MIT
