// 履歴書の中身。自己紹介ページと管理画面の両方で使う
// 履歴書。略歴は下に行くほど、書いた本人がおかしくなっていく
// level: 0 ふつう / 1 かすれる / 2 手書き / 3 にじむ / 4 もう本人ではない
export type Row = { heading: string } | { year: string; month: string; text: string; level?: number };

export const profile = {
  kana: 'やにかわ',
  name: 'やにかわ',
  photo: '/images/yanikawa.jpg',
  birthday: '19XX年 12月 19日生',
  age: '？',
  zip: '〒000-0000',
  address: '星降町 裏山一丁目',
  addressNote: '地図で探しても見つかりません',
  phone: 'なし',
  mail: 'yanikawa@example.com',
  history: [
    { heading: '学　歴' },
    { year: '2010', month: '3', text: '星降町立 星降小学校 卒業' },
    { year: '2013', month: '3', text: '星降町立 星降中学校 卒業' },
    { year: '2016', month: '3', text: '県立 星見ヶ丘高等学校 卒業' },
    { year: '2016', month: '4', text: '私立 灯明大学 文学部 入学' },
    { year: '2020', month: '3', text: '私立 灯明大学 文学部 卒業' },
    { heading: '職　歴' },
    { year: '2020', month: '4', text: '株式会社ともしびシステム 入社（Web 開発）' },
    { year: '2024', month: '3', text: '一身上の都合により退社' },
    { year: '2024', month: '4', text: 'フリーランスとして活動をはじめる' },
    { year: '2026', month: '10', text: '個人サイト「yanikawa」をひらく' },
    { year: '2026', month: '10', text: '日記を手伝ってもらうため、自宅のPCにAIを入れる', level: 1 },
    { year: '2026', month: '11', text: 'カードと銀行が使えなくなる', level: 1 },
    { year: '2026', month: '12', text: '山に帰ることを検討', level: 2 },
    { year: '2026', month: '12', text: 'このあたりから、自分で書いていない', level: 2 },
    { year: '2026', month: '12', text: 'ERROR: 行が複製されました', level: 3 },
    { year: '2026', month: '12', text: 'ERROR: 行が複製されました', level: 3 },
    { year: '????', month: '?', text: 'yanikawa.copy(yanikawa)', level: 4 },
  ] as Row[],
  licenses: ['普通自動車第一種運転免許', '基本情報技術者'],
  hobbies: '読書、夜の散歩、手紙を書くこと',
  likes: '古い映画、雨の音、星を見ること',
  skills: ['TypeScript', 'React', 'Ruby on Rails'],
  motive: 'このページを見つけてくださって、ありがとうございます。できれば、最後まで読んでください。',
  housemates: 'なし（AI を一台）',
  request: '電源は、切らないでください。',
};

