# 腾讯视频去广告 — 抓包开/关现象说明（必读）

## 你观察到的现象

| 状态 | 开屏 / 信息流广告 |
|------|-------------------|
| 打开 QX「HTTP 抓包」 | 广告消失 |
| 关闭抓包 | 开屏和广告又回来 |

**这不是规则写错，而是平时流量没进 MitM。**

## 原因：QUIC 绕过

1. 腾讯视频响应里有 `alt-svc: quic=":443"`，会优先 HTTP/3（UDP）
2. QX 的 **重写 / script-response-body 只能改 TCP 上的 HTTPS（MitM）**
3. 开抓包时，流量被强制抓成可解密的 HTTPS → 规则生效  
4. 关抓包后，App 走 QUIC → **脚本、hostname MitM 全部碰不到** → 广告全回来

Soul 等 App 若不走 QUIC，就不会有这个问题。

## 必做三步（关抓包也要去广告）

### 1）丢弃 QUIC（关键）

编辑 QX 配置文件 `[general]`，加入：

```text
udp_drop_list=443, QUIC
```

或引用仓库里的说明文件：`qvideo_quic.conf`（把其中 `[general]` 那一行拷进你的配置）。

保存后 **不要开抓包**，强杀腾讯视频再开。

### 2）MitM 常开（不要只靠抓包）

- MitM 总开关：**开**
- 证书已信任
- 主机名含：`i.video.qq.com`, `svv.video.qq.com`, `*.l.qq.com`, `*.shiply-cdn.qq.com`, `pgdt.gtimg.cn` 等  
  （引用 `qvideo_ads.conf` 后应自动合并）

### 3）分流 reject（不依赖 MitM）

引用并启用：

```text
https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_filter.list
```

策略选 **reject**。  
可拦 GDT / L 域 / iwan / splash 域名；**拦不住**必须改 body 的 `i.video` 信息流（所以仍要步骤 1）。

## 重写（改 body）

```text
https://raw.githubusercontent.com/Xo776/Nad_txvideo/main/qvideo_ads.conf
```

右滑更新并勾选。

## 如何自检「是不是又在走 QUIC」

关抓包、开着去广告规则，冷启腾讯视频：

- 若开屏/信息流又回来 → 多半 `udp_drop_list` 没生效，检查 `[general]`  
- 若仍干净 → QUIC 已打掉，MitM 正常

## 我们还没「漏掉的广告接口」？

在 **抓包模式下** 已能去掉信息流大卡（AdFeedInfo）和贴片开关，说明接口找得差不多。  
关抓包又回来，优先是 **通道问题（QUIC）**，不是又有一条未知域名。
