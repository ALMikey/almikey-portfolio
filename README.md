# ALMikey 个人网站

静态单页作品集，用于展示 Minecraft 服务器开发能力、技术范围和项目参与方向。网站不包含账号、表单、数据库或后端接口，可部署到任意支持 HTTPS 的静态文件服务器。

## 本地预览

在此目录运行：

```powershell
python -m http.server 4173
```

访问 `http://127.0.0.1:4173`。不要使用此命令作为生产服务。

## 验证

发布前运行以下检查：

```powershell
node tests\technical-range-contract.mjs
node tests\capabilities-contract.mjs
node tests\control-room-contract.mjs
node tests\contact-copy-contract.mjs
node tests\mobile-menu-contract.mjs
node tests\module-hover-contract.mjs
node tests\module-switcher-contract.mjs
node tests\hero-reentry-contract.mjs
node tests\layout-contract.mjs
node tests\production-readiness-contract.mjs
node --check app.js
git diff --check
```

## 生产部署

1. 使用 HTTPS，将站点根目录指向当前发布版本，而不是开发目录。
2. 使用独立的版本目录，例如 `releases/2026-07-31/`，验证完成后再将 Web 根目录或 `current` 软链接切到新版本。保留上一个版本，以便回滚。
3. `index.html` 使用 `no-cache`，确保每次发布都能重新验证入口文件。当前 CSS、JS 与图片使用固定文件名，不应设置为长期 `immutable` 缓存；后续引入内容哈希文件名后，才可为哈希资源设置一年缓存。
4. 图标库已自托管在 `vendor/lucide.min.js`。Google Fonts 仍为外部字体服务；网络受限时会自动回退到系统字体。
5. 首屏背景图会立即加载，其他模块背景在接近视口时加载。新增背景图片时，请保持合理尺寸，并优先提供 WebP 或 AVIF 版本。

Nginx 示例，证书路径和域名需要替换为实际值：

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;
    root /var/www/almikey/current;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    add_header Strict-Transport-Security "max-age=15552000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests" always;

    location = /index.html {
        expires -1;
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ =404;
    }

    location ~* \.(?:css|js|png|jpe?g|webp|avif|svg|woff2?)$ {
        expires 7d;
        try_files $uri =404;
    }
}
```

若域名下没有其他子域名，再评估是否为 HSTS 增加 `includeSubDomains`。部署后在浏览器开发者工具检查控制台无错误，并确认所有本地资源返回 `200`。

## 发布与回滚

发布前确认联系信息和项目描述可公开，并检查联系方式复制功能。将新版本上传到新的发布目录，完成验证后再切换 `current`；若出现样式、资源或交互异常，立即切回上一个目录并清理 CDN 缓存。不要在未验证的情况下覆盖当前线上目录。
