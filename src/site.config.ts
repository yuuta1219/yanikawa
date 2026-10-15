// サイト全体の設定。名前やリンクはここを書き換えてね
export const SITE = {
  title: 'yanikawa',
  // トップに縦書きで出る一文（「、」のところで折り返す）
  description: '日々の記録と、つくったもの。',
  intro: '日記と、つくったアプリと、自己紹介を置いています。',
  author: 'yanikawa',
  links: [
    { label: 'GitHub', href: 'https://github.com/yuuta1219' },
    { label: 'X', href: 'https://x.com/yanikawa_runteq' },
  ],
};

// 小説（引き出し）はわざとナビに入れていない
export const NAV = [
  { label: '日記', href: '/diary/' },
  { label: 'アプリ', href: '/apps/' },
  { label: '自己紹介', href: '/about/' },
];
