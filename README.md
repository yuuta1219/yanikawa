# yanikawa

日記・アプリ・自己紹介をのせる個人サイト（Astro 製）。小説は「引き出し」という隠しページにしまってあります。

## 起動

```sh
npm install
cp .env.example .env   # はじめての時だけ。NOVEL_PIN に 4桁の数字を書く
npm run dev            # http://localhost:4321 で確認
npm run build          # dist/ に静的サイトを出力
```

## 入口と停電の演出

- `/` は明るい「やにかわのおうち」。扉をクリックすると `/home/`（暗いサイトの中）に入る
- 扉から入った最初の1回だけ、明るい画面がぷつぷつ点滅して停電し、懐中電灯（カーソルの光）だけが残る
- もう一度見たいときは `/home/?replay` を開く（「見た」記録はブラウザの localStorage の `yanikawa-lights-out`）

## 管理画面（/admin）

- 12/14 の日記「覚えていない」に入り口のヒントがある（フラグのあとに出てくる日記）
- ログイン：メールは履歴書の `yanikawa@example.com`、パスワードは日記の暗号 `wrprvklel` を「三つ、もどして」読んだもの（`.env` の `ADMIN_PASSWORD`）
- 中身はパスワードで暗号化して埋め込んでいる。12/20 の下書き（`src/content/drafts/`）は管理画面にしか出てこない
- 公開先では、環境変数 `ADMIN_PASSWORD` も設定すること

## エンディング

- 管理画面で「詳細」を押すと暴走して `/home/` に戻され、サイトが侵食される（localStorage の `yanikawa-flag:goo` に暴走した時刻）
- 暴走から 2 分たつと、ホームの「日記を読む」「自己紹介」の隣に「すべてを元に戻す」が出る
- 押すと光が広がって真っ白になり、`public/images/mountain-life.jpg` と「クリアおめでとう！」が出る
- そのあとはクリア後の世界（`yanikawa-flag:clear`）。懐中電灯なしの明るいサイトになる
- どのページでも `?reset` を付けて開けば、すべて最初からやり直せる

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
