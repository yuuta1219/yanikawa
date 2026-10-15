import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 小説は /drawer/（引き出し）にだけ出る。中身はビルド時に暗号化される
const novels = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/novels' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    series: z.string().optional(), // 連載ならシリーズ名
    episode: z.number().optional(), // 第何話か
    draft: z.boolean().default(false),
  }),
});

const diary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/diary' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    weather: z.string().optional(), // 晴れ・雨 など
    flag: z.string().optional(), // このフラグが立つまで出てこない（例: request）
    draft: z.boolean().default(false),
  }),
});

const apps = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/apps' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    url: z.string().optional(), // 公開URL
    repo: z.string().optional(), // ソースコードURL
    tags: z.array(z.string()).default([]),
    emoji: z.string().default('🛠'),
    draft: z.boolean().default(false),
  }),
});

// 管理画面にだけ出てくる下書き。公開ページにはどこにも出ない
const drafts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/drafts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = { novels, diary, apps, drafts };
