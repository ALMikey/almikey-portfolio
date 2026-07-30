# GitHub 联系卡设计

## 目标

将联系模块中错误加入的 GitHub 贡献热力图替换为一张与邮箱、微信、QQ 和 Discord 同级的 GitHub 联系卡。

## 交互与内容

- 卡片沿用现有 `.contact-link` 的尺寸、透明度、边框和悬停上浮效果。
- 卡片显示 GitHub 图标、`GitHub` 标签与 `ALMikey` 账号名。
- 点击卡片在新标签页打开 `https://github.com/ALMikey`，并使用 `rel="noreferrer"`。
- 移除联系标题下的贡献热力图及其全部专用样式，避免虚构活跃度信息。

## 验证

`tests/control-room-contract.mjs` 将验证 GitHub 卡片的 URL、图标和新窗口安全属性，并明确禁止遗留的热力图结构与样式。
