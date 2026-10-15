import { defineConfig } from 'astro/config';

// 公開URL。OGP の画像など「https:// から始まる完全な URL」を作るときに使う。
// Vercel ではビルド時に本番の URL が渡されるので、それをそのまま使う
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export default defineConfig({
  site: vercelUrl ? `https://${vercelUrl}` : 'https://yanikawa.vercel.app',
});
