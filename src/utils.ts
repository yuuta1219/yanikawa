const pad = (n: number) => String(n).padStart(2, '0');
const WEEK = ['日', '月', '火', '水', '木', '金', '土'];
const KANJI = ['零', '壱', '弐', '参', '肆', '伍', '陸', '漆', '捌', '玖', '拾'];

export function formatDate(d: Date) {
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

export function formatMonthDay(d: Date) {
  return `${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

export function weekday(d: Date) {
  return WEEK[d.getDay()];
}

export function formatDateJa(d: Date, withWeekday = true) {
  const date = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  return withWeekday ? `${date}（${weekday(d)}）` : date;
}

export function kanjiNum(n: number) {
  return KANJI[n] ?? String(n);
}

// 一覧に出す本文の冒頭。Markdown の記号をざっと落とす
export function excerpt(markdown = '', length = 64) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^\s*([-*_])\1{2,}\s*$/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s*(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_`~]/g, '')
    .replace(/([A-Za-z0-9])\s*\n\s*(?=[A-Za-z0-9])/g, '$1 ')
    .replace(/\s*\n\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

export function byDateDesc<T extends { data: { date: Date } }>(a: T, b: T) {
  return b.data.date.getTime() - a.data.date.getTime();
}

// 半券の通し番号。古いものから 1, 2, 3…（あとから増やしても番号が変わらない）
export function ticketNumbers<T extends { id: string; data: { date: Date } }>(items: T[]) {
  const sorted = [...items].sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  return new Map(sorted.map((item, i) => [item.id, i + 1]));
}

export const published = <T extends { data: { draft: boolean } }>(e: T) =>
  import.meta.env.DEV || !e.data.draft;
