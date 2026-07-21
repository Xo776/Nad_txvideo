# 腾讯视频 (Qvideo) AdBlock

Quantumult X 重写规则：去除腾讯视频开屏配置、贴片广告网关、激励/SSP、运营弹层与广告上报。

参考 Soul 项目分层思路，并结合 QX 的 `reject-*` / `script-analyze-echo-response` / `$task.fetch` 能力。

## 文件

| 文件 | 用途 |
|------|------|
| `qvideo_ads.conf` | QX 重写配置（导入引用） |
| `qvideo_ivideo_ads.js` | `i.video.qq.com` 网关过滤脚本（需托管 raw 或放到本机 Scripts） |

## 策略分层

| 层 | QX 能力 | 目标 | 处理 |
|----|---------|------|------|
| L1 | `reject-200` / `reject-img` | `*.l.qq.com`、GDT/AMS、Shiply splash、`getvmind` | 直接拒绝 |
| L2 | `script-analyze-echo-response` | `i.video.qq.com`（业务+广告复用） | body 含广告 trpc → 空 200；否则透传 |
| 不做 | — | 整域 `i.video` / `rdelivery` / `tips` 注册 | 会伤正常功能 |

抓包依据见 `../_analysis/FINDINGS.md`。

## 安装

### 1. 托管脚本

把 `qvideo_ivideo_ads.js` 已托管在本仓库，raw 链接：

```
https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_ivideo_ads.js
```

或拷到手机：`Quantumult X / Scripts / qvideo_ivideo_ads.js`，并把 conf 里脚本路径改成本地文件名。

### 2. 改配置

脚本已指向本仓库 raw；若改用本地 Scripts，把 conf 里路径改成本地文件名即可。

### 3. 导入 QX

1. 重写 → 引用 → 添加 `qvideo_ads.conf` 的 raw / 本地路径  
2. 开启 MITM，确认 hostname 已合并（conf 末尾已带）  
3. 开启「重写」「MitM」，证书已信任  

### 4. 验证

- 强杀腾讯视频后冷启：开屏广告应减少/消失  
- 播一集：贴片/`vinfoad` 应被拦（`vi.l.qq.com`）  
- 首页频道仍可刷：说明 L2 透传正常  

若首页异常：先注释掉 L2 的 `i.video.qq.com` 脚本行，只留 L1，再反馈。

## 核心端点

| API / 模式 | 作用 | 处理 |
|------------|------|------|
| `vi.l.qq.com`（`buid=vinfoad`） | 播放侧广告代理 | reject-200 |
| `news/lives/p.l.qq.com` | L 域广告/曝光 | reject-200 |
| `shiply-cdn` + `splash` | 冷启开屏资源 | reject-200 |
| `vv*.video.qq.com/*vmind` | 中插决策 | reject-200 |
| `i.video.qq.com` + `reward_ad_ssp` / `video_ad_ssp` / `vip_ad_promotion` / `GetFloatActivity` 等 | 激励/信息流/弹层 | 脚本拦截 |
| `sdkreport.e.qq.com` / `t.gdt.qq.com` | 上报转化 | reject-200 |

## 与 Soul 对照

| | Soul | Qvideo |
|--|------|--------|
| 广告接口 | 独立 REST 域 | 部分独立 + **大量挤在 i.video trpc** |
| 主手段 | reject + JSON 删字段 | reject + **按 body 关键字 mock** |
| 风险点 | 低 | L2 透传失败会短暂影响业务，可降级只开 L1 |

## 许可证

MIT
