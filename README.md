# 腾讯视频去广告 v3.1（对齐 Soul/byead 成功写法）

## 信息流大卡（截图那种）

电视剧频道中间「广告」+「去微信看看」来自：

`i.video.qq.com` → `getMVLPageJ`，请求体带 `view_ad_ssp_*`

v3.1 用 `qvideo_ivideo_req.js` 把 `view_ad_ssp` **等长**改成 `view_no_ssp`（不破坏 protobuf），思路同 Soul 信息流过滤。

## 为什么之前 reject 没用

Soul 线上仓库 [byead](https://github.com/Xo776/byead) 写明：

> **`url reject-200` 对许多广告域名无效** → 统一用 `script-response-body` 返回 `{}`


## QX 正确用法（必做）

### A. 重写（必须）

1. 风车 → **重写** → **规则资源 / 引用**
2. 删除旧的腾讯视频引用
3. 新增：
   ```
   https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_ads.conf
   ```
4. 保存后对该资源 **右滑 → 更新**（必须看到更新成功）
5. 确认该引用 **已勾选启用**

### B. MitM（改 HTTPS body 必须）

1. 风车 → **MitM** → 生成并安装证书 → **系统设置里信任证书**
2. 打开 **MitM 总开关**
3. 主机名应自动带上 `svv.video.qq.com`、`*.l.qq.com`、`i.video.qq.com` 等  
   （若没有：手动加 `svv.video.qq.com, vv.video.qq.com, *.l.qq.com, i.video.qq.com`）

### C. 分流（推荐双保险）

1. 风车 → **分流** → **引用**
2. 添加：
   ```
   https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_filter.list
   ```
3. 策略选 **reject**，启用并更新

### D. 清缓存（同 Soul 说明）

> 规则生效后如仍有残留，**卸载腾讯视频重装**后冷启。

强杀不够时，本地开屏/贴片缓存仍在。

## 对照 Soul

| Soul (byead) | 腾讯视频 v3 |
|--------------|-------------|
| `soul_block.js` → `{}` | `qvideo_block.js` → `{}` |
| `soul_popup_ads.js` 删 JSON 字段 | `qvideo_getvinfo_resp.js` 清 `adpass` |
| 远程 raw + hostname | 同左 |
| 残留则重装 App | 同左 |

## 自检

播一集时看 QX 日志：

1. `getvinfo` 是否命中重写 / 脚本  
2. 请求体是否出现 `sppreviewtype=0`  
3. `vi.l.qq.com` 是否被脚本处理  

若日志完全没有 `svv.video.qq.com` 的脚本记录 → MitM/重写未生效，不是规则内容问题。

## 文件

| 文件 | 作用 |
|------|------|
| `qvideo_ads.conf` | 重写（主） |
| `qvideo_filter.list` | 分流 reject（辅） |
| `qvideo_block.js` | 空 JSON |
| `qvideo_getvinfo.js` / `_resp.js` | 贴片 |
| `qvideo_vmind.js` | 中插 XML |
| `qvideo_ivideo_ads.js` | 广告 RPC |

## 许可证

MIT
