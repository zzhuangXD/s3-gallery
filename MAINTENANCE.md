# 维护与发布约定

## 当前项目

- 仓库：`zzhuangXD/s3-gallery`
- 线上入口：https://zzhuangxd.github.io/s3-gallery/
- 发布分支：`main`，根目录
- 数据源：Uxie 最新确认的 S3 清单；当前发布快照为 `data/sites.json`
- 编号：沿用 L 编号，删除的编号不重新用于别的网站
- 运行结构：原生 HTML / CSS / JavaScript，无构建工具、无 API 密钥、无付费运行服务

用户要求持续更新和维护，没有指定周期；本版不擅自建立定时扫描。收到 S3 更新后按最新消息维护，每次更新必须完成部署和群内告知。

## 交付检查

- `npm run check` 验证编号/URL 唯一、HTTPS、海报存在与文件格式、无 JavaScript 链接清单。
- 桌面与 320 px 手机宽度无横向溢出，图片正常加载。
- 所有风格筛选、名称/中文标签/L 编号搜索、空结果恢复均可用。
- 海报视图/清单视图、明暗外观、键盘 Tab 焦点可用；尊重减少动态效果偏好。
- 七张海报均直接链接对应原站，新标签打开带 `noopener noreferrer`。
- Pages 构建成功；线上数据条数与最新更新时间正确；七张线上图片均返回 HTTP 200。
- 完成后在原 Cindy 群分享线上入口，并按群内最新指令提醒相关成员。不要把 GitHub 仓库地址当作可浏览网页的最终入口。

## 图片记录

海报的生成通道为 Cindy 的 `provider_id=openai` / `model_id=openai/gpt-image-2`，使用 `image.generate`，原始生成尺寸 1024×1536、质量 high。网站存放独立优化的 WebP 文件。海报依据原站画面与 Uxie 的设计参考重新创作。

不得将 Cindy 的 `cindy-media://` 地址直接写入公开网站：它只在 Cindy 中可访问。需使用导出的实际海报资源。
