# 腾讯视频 AdBlock v1.5（修复远程脚本不生效）

## 为什么「更新后广告还在 / 开屏又回来」

Quantumult X **经常忽略** rewrite 里的远程 `https://.../*.js`（官方说明 script 应放本地 Scripts）。  
因此 v1.2–v1.4 的：

- `script-response-body` → 远程 JS **没跑**（右上角「广告」角标还在）
- `script-echo-response` → 远程空 XML **没跑**，还可能拖累整份重写

开屏若曾缓存过 Shiply 包，仅拦网络时仍可能再闪一次；请清腾讯视频缓存或重装后再验。

## 安装（按顺序）

### 1. 拷贝本地脚本（关键）

把仓库里的 `qvideo_ivideo_ads.js` 放到手机：

`文件 → 我的iPhone/iCloud Drive → Quantumult X → Scripts → qvideo_ivideo_ads.js`

下载：  
https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_ivideo_ads.js  

### 2. 更新重写

```
https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_ads.conf
```

### 3. 检查

- 重写已开启，本资源已更新为 v1.5  
- MitM 含 `i.video.qq.com`、`*.shiply-cdn.qq.com`、`*.l.qq.com`、`vv.video.qq.com`  
- 腾讯视频：清缓存或重装后冷启  

## v1.5 改动

- 去掉远程 `script-echo-response`，`getvmind` 改回 `reject-200`  
- `i.video` 改为 **本地** `qvideo_ivideo_ads.js`  
- 开屏：加强 splash / AMS shiply 规则  

## 右上角「广告」二字

那是广告位控件自带的角标，图被拒后字还在。要去掉字，必须让 `i.video` 本地脚本清空广告 RPC（步骤 1）。  
首页频道混在业务包里的广告卡，仍可能去不干净。

## 许可证

MIT
