# 腾讯视频 (Qvideo) AdBlock

Quantumult X 重写：拦独立广告域 / 开屏配置 / 中插决策 / 广告上报。

> **v1.1**：已禁用对 `i.video.qq.com` 的脚本拦截。v1.0 用 `$task.fetch` 透传会破坏二进制 trpc，表现为无法登录、主页不刷新、动漫等模块打不开。

## 文件

| 文件 | 用途 |
|------|------|
| `qvideo_ads.conf` | QX 重写（导入即可） |
| `qvideo_ivideo_ads.js` | 旧 L2 脚本（**默认不用**，仅作研究备份） |

## 当前策略（仅 L1）

| 目标 | 处理 |
|------|------|
| `vi.l.qq.com` / `news|lives|p.l.qq.com` | `reject-200` |
| `sdkreport.e.qq.com` / `t.gdt.qq.com` | `reject-200` |
| Shiply `app_cold_launch_home_splash` | `reject-200` |
| `vv*.video.qq.com/*vmind` | `reject-200` |
| `*/qqmi/video_ad/`、`promotionTest` 素材 | `reject-img` |

**不拦**：`i.video.qq.com`、`rdelivery.qq.com`、`tips.video.qq.com`

激励 SSP / 运营弹层若仍走 `i.video` trpc，本版故意放过，优先保证可用性。

## 安装

1. QX → 重写 → 引用：
   `https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_ads.conf`
2. 更新该资源（或删了重加），确认 MitM 主机名已合并  
3. 强杀腾讯视频后重开，验证：能登录、首页能刷、模块能进  

若仍异常：暂时关闭本重写，并检查 MitM 里是否还手动留着 `i.video.qq.com`（可删掉）。

## 与 Soul 对照

Soul 广告域独立，整路径 reject 很安全。腾讯视频大量广告挤在业务网关，**不能**用「拦网关再透传」的方式。

## 许可证

MIT
