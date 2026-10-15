import type { CollectionEntry } from 'astro:content';
import { profile } from '../data/profile';
import { byDateDesc, escapeHtml as esc, formatDate } from '../utils';

// 管理画面のログイン後の中身。パスワードで暗号化して埋め込む
type Diary = CollectionEntry<'diary'> | CollectionEntry<'drafts'>;

interface Input {
  diary: CollectionEntry<'diary'>[];
  drafts: CollectionEntry<'drafts'>[];
  apps: CollectionEntry<'apps'>[];
}

const button = (label: string) => `<button type="button" disabled>${label}</button>`;

function diaryRow(entry: Diary, id: number) {
  const isDraft = entry.collection === 'drafts';
  const view = isDraft ? '' : ` <a href="/diary/${esc(entry.id)}/" target="_blank">表示</a>`;
  return `
    <tr${isDraft ? ' class="draft"' : ''}>
      <td>${id}</td>
      <td>
        <details>
          <summary>${esc(entry.data.title)}</summary>
          <textarea readonly rows="14">${esc(entry.body ?? '')}</textarea>
        </details>
      </td>
      <td>${formatDate(entry.data.date)}</td>
      <td>${isDraft ? '<span class="status draft">下書き</span>' : '<span class="status">公開</span>'}</td>
      <td><button type="button" data-goo>詳細</button> ${button('編集')} ${button('削除')}${view}</td>
    </tr>`;
}

export function renderAdmin({ diary, drafts, apps }: Input) {
  const entries: Diary[] = [...diary, ...drafts].sort(byDateDesc);
  const total = entries.length;
  const resumeRows: [string, string][] = [
    ['ふりがな', profile.kana],
    ['氏名', profile.name],
    ['生年月日', profile.birthday],
    ['現住所', `${profile.zip} ${profile.address}`],
    ['電話', profile.phone],
    ['メール', profile.mail],
    ['免許・資格', profile.licenses.join(' / ')],
    ['趣味・特技', profile.hobbies],
    ['好きなもの', profile.likes],
    ['志望の動機', profile.motive],
    ['同居人', profile.housemates],
    ['本人希望記入欄', profile.request],
  ];
  const history = profile.history
    .map((row) => ('heading' in row ? `【${row.heading.replace(/\s/g, '')}】` : `${row.year} ${row.month} ${row.text}`))
    .join('\n');

  return `
    <header class="bar">
      <strong>yanikawa 管理画面</strong>
      <span class="who">${esc(profile.mail)} でログイン中</span>
      <button type="button" data-logout>ログアウト</button>
    </header>
    <main class="wrap">
      <nav class="tabs"><a href="#diary">日記</a> | <a href="#apps">アプリ</a> | <a href="#resume">履歴書</a></nav>
      <p class="info">最終ログイン：2026/12/20 03:19（IPアドレス：取得できませんでした）</p>

      <h2 id="diary">日記（<span id="diary-count">${total}</span>件）</h2>
      <p>${button('＋ 新規作成')}</p>
      <table>
        <thead><tr><th>ID</th><th>タイトル</th><th>日付</th><th>ステータス</th><th>操作</th></tr></thead>
        <tbody id="diary-rows">${entries.map((e, i) => diaryRow(e, total - i)).join('')}</tbody>
      </table>

      <h2 id="apps">アプリ（${apps.length}件）</h2>
      <p>${button('＋ 新規作成')}</p>
      <table>
        <thead><tr><th>ID</th><th>名前</th><th>日付</th><th>ステータス</th><th>操作</th></tr></thead>
        <tbody>${[...apps]
          .sort(byDateDesc)
          .map(
            (a, i) => `
            <tr>
              <td>${apps.length - i}</td>
              <td>${esc(a.data.title)}</td>
              <td>${formatDate(a.data.date)}</td>
              <td><span class="status">非公開（工事中）</span></td>
              <td>${button('編集')} ${button('削除')}</td>
            </tr>`,
          )
          .join('')}</tbody>
      </table>

      <h2 id="resume">履歴書</h2>
      <form class="form" onsubmit="return false">
        ${resumeRows
          .map(
            ([label, value]) => `
          <label><span>${label}</span><input type="text" value="${esc(value)}" readonly /></label>`,
          )
          .join('')}
        <label><span>略歴</span><textarea readonly rows="${profile.history.length + 1}">${esc(history)}</textarea></label>
        <p>${button('保存')}</p>
      </form>
    </main>`;
}
