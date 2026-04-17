export interface Rule {
  id: string;
  name_ja: string;
  name_zh: string;
  description: string;
  category: 'basic' | 'play' | 'yaku' | 'special';
}

export const RULES: Rule[] = [
  {
    id: 'kaze',
    name_ja: '場風と自風',
    name_zh: '场风与自风',
    description: '每局有场风（东场/南场/西场/北场）和自风（根据坐位）。东风场时东家自风为东，南家为南，依此类推。役牌东/南/西/北对应各自风。',
    category: 'basic'
  },
  {
    id: 'kuitan',
    name_ja: '喰断',
    name_zh: '食断',
    description: '鸣牌（吃/碰/杠）后只能和断幺九牌型。食断是非门前状态下的断幺九和牌。',
    category: 'basic'
  },
  {
    id: 'furmble',
    name_ja: '振聴',
    name_zh: '振听',
    description: '三种振听：1) 食振：吃牌后听自己打出的牌；2) 立直振听：立直后打牌前所打的牌；3) 同巡振听：同巡内打出的牌。振听状态下只能自摸和牌。',
    category: 'basic'
  },
  {
    id: 'reach',
    name_ja: '立直',
    name_zh: '立直',
    description: '门前清状态下听牌时，可宣告立直，支付1000点供托。立直后不可更改手牌，只能自摸和牌或荣和。立直后一巡内自摸可得一撃。',
    category: 'basic'
  },
  {
    id: 'double_reach',
    name_ja: '両立直',
    name_zh: '双立直',
    description: '开天荒地第一巡内宣告立直。支付1000点供托，得两番。双立直后不可更改手牌。',
    category: 'yaku'
  },
  {
    id: 'ippatsu',
    name_ja: '一撃',
    name_zh: '一撃',
    description: '立直宣言后，在一巡之内自摸和牌，可得一撃。立直宣言后若有人吃碰杠，一撃失效。',
    category: 'yaku'
  },
  {
    id: 'tsumo',
    name_ja: '自摸',
    name_zh: '自摸',
    description: '门前清状态下自摸和牌，得一番。非门前清状态下的自摸（食断）不算一番。',
    category: 'yaku'
  },
  {
    id: 'pinfu',
    name_ja: '平和',
    name_zh: '平和',
    description: '4个顺子+雀头，雀头不是役牌，听牌型为两面听（两边都可能和牌）。',
    category: 'yaku'
  },
  {
    id: 'tanyao',
    name_ja: '断么九',
    name_zh: '断幺九',
    description: '手牌中不包含1/9/字牌。允许鸣牌。断幺九是常见的基础役。',
    category: 'yaku'
  },
  {
    id: 'yakuhai',
    name_ja: '役牌',
    name_zh: '役牌',
    description: '自风/场风/三元牌作为雀头或面子。东风/南风/西风/北风/白板/发财/中，每种一番。',
    category: 'yaku'
  },
  {
    id: 'haitei',
    name_ja: '海底摸月',
    name_zh: '海底捞月',
    description: '牌山最后一牌自摸和牌。得一番。海底捞月只有自摸有效。',
    category: 'special'
  },
  {
    id: 'houtei',
    name_ja: '河底摸魚',
    name_zh: '河底摸鱼',
    description: '牌山最后一牌荣和（别人打出）。得一番。河底摸鱼只有荣和有效。',
    category: 'special'
  },
  {
    id: 'rinkou',
    name_ja: '岭上开花',
    name_zh: '岭上开花',
    description: '杠后从岭上牌区摸牌并自摸和牌。得一番。岭上开花的杠后摸牌顺序有特殊规定。',
    category: 'special'
  },
  {
    id: 'kan',
    name_ja: '槓',
    name_zh: '杠',
    description: '明杠（碰杠/加杠）或暗杠。明杠后摸岭上牌，岭上开花自摸得一番。',
    category: 'play'
  },
  {
    id: 'nagashi',
    name_ja: '流し満貫',
    name_zh: '流局满贯',
    description: '流局时，若己方未舍任意幺九牌（含字牌），可宣告流局满贯。得六番（部分规则役满）。',
    category: 'special'
  },
];

export function getRulesByCategory(category: 'basic' | 'play' | 'yaku' | 'special' | 'all'): Rule[] {
  if (category === 'all') return RULES;
  return RULES.filter(r => r.category === category);
}
