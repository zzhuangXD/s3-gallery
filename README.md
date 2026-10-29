# S3 Gallery

一张海报，一个入口。持续维护的 S3 网站收藏画廊。

**线上入口：https://zzhuangxd.github.io/s3-gallery/**

当前主表是 [`data/sites.json`](data/sites.json)，沿用 Uxie 的 L 编号。初始 7 个网站的来源清单见 [SOURCE_LIST.md](SOURCE_LIST.md)。

## 本地打开

无构建步骤，无运行依赖。使用 Node.js 20+：

```sh
npm start
```

然后打开 http://127.0.0.1:8793 。不要双击 HTML 用 `file://` 打开：浏览器会限制读取 JSON。

## 更新收藏

1. 以 Uxie 最新确认的 S3 清单为准，在 `data/sites.json` 添加或修改记录，保留原有 L 编号。`category` 取 `play`、`interact` 或 `visual`。
2. 打开原站确认现状，再按其风格生成一张原创 2:3 海报。当前海报通过 Cindy 的 ChatGPT 订阅生图通道（`provider_id: openai`，`model_id: openai/gpt-image-2`）生成。
3. 将优化后的 WebP 放入 `assets/posters/`，文件名沿用 `L编号-网站名.webp`。填写 `poster` 与描述画面的 `posterAlt`。建议尺寸 768×1152；单张控制在 900 KB 内。
4. 更新 `updated`、本清单与 `SOURCE_LIST.md`；在 `index.html` 的 `<noscript>` 链接列表中同步新增网站。修改收藏范围时更新页面分享描述。
5. 运行 `npm run check`。浏览器检查手机/桌面、筛选/搜索、海报与清单视图、明暗外观、每个原站跳转。详情见 [MAINTENANCE.md](MAINTENANCE.md)。
6. 提交并推送 `main`。GitHub Pages 从 `main` 根目录自动发布，无需手动构建。
7. 等 Pages 构建成功，用线上 URL 验证新内容，再在原 Cindy 群分享入口并按最新消息要求提醒相关成员。

界面网站总数、搜索范围与更新时间由 JSON 自动读取。海报视图/清单视图及明暗外观保存在浏览器本地。

## 版权与关系

这是独立收藏入口。海报为原创 AI 视觉演绎，不代表原站官方宣传。各网站名称、内容与原站作品归各自作者所有。
