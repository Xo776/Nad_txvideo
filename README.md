# 腾讯视频去广告 v2.0（推倒重来）

## 客户端结论

| 组件 | 说明 |
|------|------|
| `QADSplashSDK` / `QADFeedSDK` / `QADRewardSDK` | 资源包；逻辑在主程序 `live4iphoneRel` |
| `com.tencent.qadsdk` | 广告 SDK 编进主二进制 |
| `TAD*` / `QADJSTools.js` | H5 广告辅助 |
| 明文 host | `news/lives/p.l.qq.com`、`pgdt.gtimg.cn`、`t.gdt.qq.com`、`vv.../getvmind` |
| 广告位 RPC | **`GetSlotAdData`**、`Independent/GetAds`（右上角「广告」） |

## 抓包结论

`svv.video.qq.com/getvinfo` POST：`sppreviewtype=1` → 贴片开启。

## 旧版为何失败

同一 `getvinfo` URL 挂了 **body + header 两条脚本**，QX 同一请求只跑一条，贴片开关经常没改到。

## 安装（同 Soul）

```
https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_ads.conf
```

1. 删掉旧的腾讯视频重写引用，重新添加上面链接  
2. 开启 MitM / 重写  
3. **清腾讯视频缓存或重装**后冷启（清本地开屏缓存）  
4. 强杀再播一集验证贴片  

## 文件

- `qvideo_ads.conf`
- `qvideo_getvinfo.js` — 关贴片  
- `qvideo_ivideo_ads.js` — 清广告位 RPC  

## 许可证

MIT
