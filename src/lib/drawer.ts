import type { CollectionEntry } from 'astro:content';
import { SITE } from '../site.config';
import { byDateDesc, escapeHtml as esc, formatDate, formatDateJa, kanjiNum } from '../utils';

// 引き出し（小説）のページ本体を HTML の文字列で組み立てる。
// これをまるごと暗号化して埋め込むので、タイトル一覧も番号なしでは見えない
type Novel = CollectionEntry<'novels'>;

const href = (n: Novel) => `/drawer/${esc(n.id)}/`;
const episode = (n: Novel) => (n.data.episode ? `第${kanjiNum(n.data.episode)}話` : '');

export function groupNovels(all: Novel[]) {
  const series = new Map<string, Novel[]>();
  const oneshots: Novel[] = [];
  for (const n of [...all].sort(byDateDesc)) {
    if (!n.data.series) {
      oneshots.push(n);
      continue;
    }
    if (!series.has(n.data.series)) series.set(n.data.series, []);
    series.get(n.data.series)!.push(n);
  }
  for (const eps of series.values()) eps.sort((a, b) => (a.data.episode ?? 0) - (b.data.episode ?? 0));
  return { series, oneshots };
}

// 同じ連載の前後の話
export function neighbors(all: Novel[], entry: Novel): { prev?: Novel; next?: Novel } {
  if (!entry.data.series) return {};
  const eps = groupNovels(all).series.get(entry.data.series)!;
  const i = eps.findIndex((e) => e.id === entry.id);
  return { prev: eps[i - 1], next: eps[i + 1] };
}

function row(n: Novel, label = '') {
  const pre = label ? `<span class="pre">${label}</span>` : '';
  const summary = !label && n.data.summary ? `<p class="s">${esc(n.data.summary)}</p>` : '';
  return `<li><a href="${href(n)}"><span class="t">${pre}${esc(n.data.title)}</span><span class="dots"></span><span class="d">${formatDate(n.data.date)}</span></a>${summary}</li>`;
}

export function renderIndex(all: Novel[]) {
  const { series, oneshots } = groupNovels(all);
  const sections = [...series].map(
    ([name, eps]) => `
      <section>
        <div class="section-head"><h2>${esc(name)}</h2><span class="meta">連載・全${eps.length}話</span></div>
        <ul class="toc">${eps.map((n) => row(n, episode(n))).join('')}</ul>
      </section>`,
  );
  if (oneshots.length) {
    sections.push(`
      <section>
        <div class="section-head"><h2>短編</h2><span class="meta">${oneshots.length}篇</span></div>
        <ul class="toc">${oneshots.map((n) => row(n)).join('')}</ul>
      </section>`);
  }
  return `
    <header class="page-head" data-title="引き出し">
      <p class="kicker">Drafts</p>
      <h1>引き出しの奥</h1>
      <p class="lead">ここだけの話にしておいてください。</p>
    </header>
    ${sections.join('') || '<p class="muted">まだ何も入っていません。</p>'}
    <p class="relock-wrap"><button type="button" class="relock" data-relock>鍵をかけて出る</button></p>`;
}

export function renderNovel(entry: Novel, prev?: Novel, next?: Novel) {
  const { title, series, date } = entry.data;
  const link = (n: Novel | undefined, text: (n: Novel) => string) =>
    n ? `<a href="${href(n)}">${text(n)}</a>` : '<span></span>';
  return `
    <article class="manuscript" data-title="${esc(title)}">
      <header>
        ${series ? `<p class="series">${esc(series)}　${episode(entry)}</p>` : ''}
        <h1>${esc(title)}</h1>
        <p class="byline">${esc(SITE.author)}</p>
      </header>
      <div class="novel">${entry.rendered?.html ?? ''}</div>
      <p class="date">${formatDateJa(date)}</p>
    </article>
    <nav class="pager">
      ${link(prev, (n) => `← ${esc(n.data.title)}`)}
      <a href="/drawer/">目次</a>
      ${link(next, (n) => `${esc(n.data.title)} →`)}
    </nav>`;
}
