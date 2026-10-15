# yanikawa

日記・アプリ・自己紹介をのせる個人サイト（Astro 製）。小説は「引き出し」という隠しページにしまってあります。

## 起動

```sh
npm install
cp .env.example .env   # はじめての時だけ。NOVEL_PIN に 4桁の数字を書く
npm run dev            # http://localhost:4321 で確認
npm run build          # dist/ に静的サイトを出力
```

## 記事の増やし方

`src/content/` に Markdown ファイルを置くだけ。ファイル名がそのまま URL になります。

| 種類 | 置き場所 | 書く項目 |
| --- | --- | --- |
| 日記 | `src/content/diary/` | `title`, `date`（`weather` に「晴れ」などを書くと表示される） |
| アプリ | `src/content/apps/` | `title`, `date`, `summary`（`url`, `repo`, `tags`, `emoji` は任意） |
| 小説 | `src/content/novels/` | `title`, `date`（連載なら `series`, `episode` も） |

- `draft: true` を付けると本番ビルドには出ません（`npm run dev` では見えます）
- 画像は `public/images/` に置いて `![説明](/images/xxx.png)` で貼れます

## 引き出し（小説の隠しページ）

- ナビには出てきません。入口はフッターの © のとなりで小さく灯っている火種です
- 押すと枠が 4つだけ出るので、`NOVEL_PIN` の番号を入れると `/drawer/` が開きます
- 小説はタイトルも本文もビルド時に暗号化して埋め込んでいるので、HTML のソースを覗いても読めません
- 一度開けると、そのタブを閉じるまでは番号なしで読めます。目次の「鍵をかけて出る」で閉じられます

### 注意

- 4桁の番号なので、本気で総当たりされれば破られます。あくまで「見られたくない」程度の目隠しです
- GitHub に**公開リポジトリ**として置くと、`src/content/novels/` の原稿はそこから読めてしまいます。リポジトリは非公開にしてください
- 公開先（Vercel など）では、環境変数 `NOVEL_PIN` を設定しないとビルドが止まります
- 暗号を解くのにブラウザの Web Crypto を使うので、`https://` か `localhost` でしか開けません（スマホから `http://192.168.x.x:4321` で確認すると開きません）

## 書き換えるところ

- サイト名・トップの一文・リンク: `src/site.config.ts`
- 自己紹介（履歴書）: `src/pages/about.astro` の `profile`
- 色: `src/styles/global.css` の `:root`
- 公開URL: `astro.config.mjs` の `site`
