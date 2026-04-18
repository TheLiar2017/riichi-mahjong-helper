export interface HandExample {
  tiles: string[];
  explanation: string;
}

export interface Yaku {
  id: string;
  name_ja: string;
  name_zh: string;
  han: number;
  han_locked?: boolean;
  description: string;
  examples: HandExample[];
  special_rules?: string;
  related_yaku?: string[];
  common_pitfalls?: string;
}

export const YAKU_LIST: Yaku[] = [
  // 一番（1翻）
  {
    id: 'riichi',
    name_ja: '立直',
    name_zh: '立直',
    han: 1,
    description: '门前状态下听牌时宣言立直，支付1000点供托',
    examples: [
      { tiles: ['1m','1m','1m','2m','2m','2m','3m','3m','3m','4m','5m','6m','7m','8m'], explanation: '门前清听牌型，等待8m和牌' }
    ],
    special_rules: '门前清限定，立直后不可更改手牌，只能自摸和牌或荣和',
    related_yaku: ['double_riichi', 'ippatsu'],
    common_pitfalls: '食牌后无法立直'
  },
  {
    id: 'ippatsu',
    name_ja: '一発',
    name_zh: '一发自摸',
    han: 1,
    description: '立直后在一巡之内自摸和牌',
    examples: [
      { tiles: ['1m','1m','1m','2m','2m','2m','3m','3m','3m','4m','5m','6m','7m','8m'], explanation: '立直后一巡内自摸8m和牌' }
    ],
    special_rules: '立直宣言后，除非有人荣和或吃碰杠，否则一巡内自摸可触发',
    related_yaku: ['riichi'],
    common_pitfalls: '立直后若有人吃碰杠，一発失效'
  },
  {
    id: 'menzen_tsumo',
    name_ja: '門前清自摸和',
    name_zh: '门前自摸',
    han: 1,
    description: '门前清状态下自摸和牌',
    examples: [
      { tiles: ['2m','3m','4m','2p','3p','4p','5p','6p','7p','3s','4s','5s','6s','6s'], explanation: '门前清自摸6s和牌' }
    ],
    special_rules: '必须门前清状态',
    related_yaku: ['tsumo'],
    common_pitfalls: '吃过牌后不算'
  },
  {
    id: 'pinfu',
    name_ja: '平和',
    name_zh: '平和',
    han: 1,
    description: '4个顺子+雀头，雀头不是役牌，听牌型为两面听',
    examples: [
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','2p','3p','5p','5p','1p'], explanation: '两面听牌型，雀头5p，摸1p或4p和牌' }
    ],
    special_rules: '门前清限定，雀头不能是役牌，听牌必须是两面',
    related_yaku: ['tanyao'],
    common_pitfalls: '边张和嵌张不算平和'
  },
  {
    id: 'tanyao',
    name_ja: '断么九',
    name_zh: '断幺九',
    han: 1,
    description: '不包含幺九牌（1/9/字牌）的手牌',
    examples: [
      { tiles: ['2m','3m','4m','2p','3p','4p','5p','6p','7p','3s','3s','3s','6s','6s'], explanation: '全为中张牌，自摸2s和牌' }
    ],
    special_rules: '允许吃碰杠',
    related_yaku: ['pinfu', 'toitoi'],
    common_pitfalls: '含有1或9或字牌即不算'
  },
  {
    id: 'ippeiko',
    name_ja: '一盃口',
    name_zh: '一杯口',
    han: 1,
    description: '同一花色且数字相同的两组顺子',
    examples: [
      { tiles: ['1m','2m','3m','1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','1p'], explanation: '两组123m顺子+普通顺子+雀头' }
    ],
    special_rules: '门前清限定，必须是完全相同的两组顺子',
    related_yaku: ['ryanpeiko', 'pinfu'],
    common_pitfalls: '两组数字相近但不同的顺子不算'
  },
  {
    id: 'chankan',
    name_ja: '搶槓',
    name_zh: '抢杠',
    han: 1,
    description: '别家加杠时荣和抢杠',
    examples: [
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','2p','3p','1s','1s'], explanation: '别家碰1s后加杠，可抢杠荣和' }
    ],
    special_rules: '只能抢加杠，不能抢暗杠',
    related_yaku: ['kan', 'rinkou'],
    common_pitfalls: '只能抢别人碰过的牌加杠'
  },
  {
    id: 'east',
    name_ja: '東風',
    name_zh: '东风',
    han: 1,
    description: '自风或场风为东时，东风组成刻子',
    examples: [
      { tiles: ['1m','2m','3m','4m','5m','6m','7p','8p','9p','ES','ES','ES','1p','1p'], explanation: '东家自风为东，东组成刻子' }
    ],
    special_rules: '需与自风或场风对应',
    related_yaku: ['south', 'west', 'north'],
    common_pitfalls: '只有自风或场风为东时才计'
  },
  {
    id: 'south',
    name_ja: '南風',
    name_zh: '南风',
    han: 1,
    description: '自风或场风为南时，南风组成刻子',
    examples: [
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','1p','SS','SS','SS'], explanation: '南家自风为南，南组成刻子' }
    ],
    special_rules: '需与自风或场风对应',
    related_yaku: ['east', 'west', 'north'],
    common_pitfalls: '只有自风或场风为南时才计'
  },
  {
    id: 'west',
    name_ja: '西風',
    name_zh: '西风',
    han: 1,
    description: '自风或场风为西时，西风组成刻子',
    examples: [
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','1p','WS','WS','WS'], explanation: '西家自风为西，西组成刻子' }
    ],
    special_rules: '需与自风或场风对应',
    related_yaku: ['east', 'south', 'north'],
    common_pitfalls: '只有自风或场风为西时才计'
  },
  {
    id: 'north',
    name_ja: '北風',
    name_zh: '北风',
    han: 1,
    description: '自风或场风为北时，北风组成刻子',
    examples: [
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','1p','NS','NS','NS'], explanation: '北家自风为北，北组成刻子' }
    ],
    special_rules: '需与自风或场风对应',
    related_yaku: ['east', 'south', 'west'],
    common_pitfalls: '只有自风或场风为北时才计'
  },
  {
    id: 'white',
    name_ja: '白板',
    name_zh: '白板',
    han: 1,
    description: '面子包含白板',
    examples: [
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','1p','EW','EW','EW'], explanation: '白板组成刻子' }
    ],
    special_rules: '白板本身即为1番役，独立计算',
    related_yaku: ['green', 'red'],
    common_pitfalls: '三张白板才能成立，不计对或雀头'
  },
  {
    id: 'green',
    name_ja: '緑発',
    name_zh: '绿发',
    han: 1,
    description: '面子包含绿发(發)',
    examples: [
      { tiles: ['2s','3s','4s','5s','6s','7s','1m','2m','3m','4m','5m','FW','FW','FW'], explanation: '绿发组成刻子' }
    ],
    special_rules: '绿发本身即为1番役，独立计算',
    related_yaku: ['white', 'red'],
    common_pitfalls: '三张绿发才能成立，不计对或雀头'
  },
  {
    id: 'red',
    name_ja: '中',
    name_zh: '红中',
    han: 1,
    description: '面子包含红中',
    examples: [
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','1p','CW','CW','CW'], explanation: '红中组成刻子' }
    ],
    special_rules: '红中本身即为1番役，独立计算',
    related_yaku: ['white', 'green'],
    common_pitfalls: '三张红中才能成立，不计对或雀头'
  },
  // 两番（2翻）
  {
    id: 'double_riichi',
    name_ja: '両立直',
    name_zh: '双立直',
    han: 2,
    description: '开天荒地第一巡内立直',
    examples: [
      { tiles: ['1m','1m','1m','2m','2m','2m','3m','3m','3m','4m','5m','6m','7m','8m'], explanation: '第一巡立直，等待8m和牌' }
    ],
    special_rules: '门前清限定，必须在第一巡摸牌前宣告立直',
    related_yaku: ['riichi'],
    common_pitfalls: '第一巡后立直只算普通立直'
  },
  {
    id: 'chanta',
    name_ja: '混全帯么九',
    name_zh: '混全带幺',
    han: 2,
    description: '所有面子和雀头都包含幺九牌',
    examples: [
      { tiles: ['1m','2m','3m','7m','8m','9m','1p','2p','3p','1s','2s','3s','ES','ES'], explanation: '全带幺九，含字牌' }
    ],
    special_rules: '副露减一番，允许吃碰杠',
    related_yaku: ['junchan', 'honchantai'],
    common_pitfalls: '字牌也算幺九牌'
  },
  {
    id: 'ittsu',
    name_ja: '一気通貫',
    name_zh: '一气通贯',
    han: 2,
    description: '同一种数牌123/456/789三顺子',
    examples: [
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','5p','6p','7p','5p','5p'], explanation: '万子一气通贯，听5p' }
    ],
    special_rules: '副露减一番，必须同一花色',
    related_yaku: ['pinfu', 'sanshoku_dojun'],
    common_pitfalls: '三色不通贯'
  },
  {
    id: 'sanshoku_dojun',
    name_ja: '三色同順',
    name_zh: '三色同顺',
    han: 2,
    description: '万/筒/索三种数牌形成相同的顺子',
    examples: [
      { tiles: ['1m','2m','3m','1p','2p','3p','1s','2s','3s','5m','6m','7m','2m','2m'], explanation: '123三色同顺，听2m' }
    ],
    special_rules: '副露减一番，允许吃碰杠',
    related_yaku: ['ittsu', 'sanshoku_doko'],
    common_pitfalls: '必须同一数字顺序'
  },
  {
    id: 'toitoi',
    name_ja: '对对和',
    name_zh: '对对和',
    han: 2,
    description: '全部面子都是刻子或杠子',
    examples: [
      { tiles: ['1m','1m','1m','5p','5p','5p','9s','9s','9s','2m','2m','2m','3m','3m'], explanation: '四组刻子+一对，听3m' }
    ],
    special_rules: '必须通过吃碰杠达成，否则为四暗刻',
    related_yaku: ['sananko', 'honitsu'],
    common_pitfalls: '顺子型不算'
  },
  {
    id: 'sananko',
    name_ja: '三暗刻',
    name_zh: '三暗刻',
    han: 2,
    description: '三个以上的暗刻（含暗杠）',
    examples: [
      { tiles: ['1m','1m','1m','5p','5p','5p','9s','9s','9s','2m','3m','4m','3m','3m'], explanation: '三个暗刻+顺子+雀头，听3m' }
    ],
    special_rules: '暗杠也算暗刻',
    related_yaku: ['toitoi', 'suanko'],
    common_pitfalls: '必须三个独立暗刻'
  },
  {
    id: 'sangangzi',
    name_ja: '三槓子',
    name_zh: '三杠子',
    han: 2,
    description: '三个杠子（明杠或暗杠）',
    examples: [
      { tiles: ['1m','1m','1m','1m','5p','5p','5p','5p','9s','9s','9s','9s','3m','3m'], explanation: '三个杠子+一对' }
    ],
    special_rules: '三个杠子独立计算，不与四暗刻兼得',
    related_yaku: ['toitoi', 'sananko'],
    common_pitfalls: '四杠子为役满，三杠子为两番'
  },
  {
    id: 'shosangen',
    name_ja: '小三元',
    name_zh: '小三元',
    han: 2,
    description: '三元牌两种为刻子，一种为雀头',
    examples: [
      { tiles: ['EW','EW','EW','FW','FW','FW','1m','2m','3m','4m','5m','6m','7m','CW','CW'], explanation: '白发了为刻子，中为雀头' }
    ],
    special_rules: '小三元为两番役满',
    related_yaku: ['daisangen'],
    common_pitfalls: '必须两种刻子一种雀头'
  },
  {
    id: 'honitsu',
    name_ja: '混一色',
    name_zh: '混一色',
    han: 3,
    description: '只有一种数牌加字牌组成',
    examples: [
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','1m','2m','3m','ES','ES'], explanation: '万子混一色，听ES' }
    ],
    special_rules: '副露减一番，允许吃碰杠',
    related_yaku: ['chinitsu', 'toitoi'],
    common_pitfalls: '不能有两种数牌'
  },
  {
    id: 'sanshoku',
    name_ja: '三色同刻',
    name_zh: '三色同刻',
    han: 2,
    description: '同一个数牌在一万/一筒/一索三种花色都有刻子',
    examples: [
      { tiles: ['7m','7m','7m','7p','7p','7p','7s','7s','7s','3m','4m','5m','6m','6m'], explanation: '三色7同刻面子，听3m和6m' }
    ],
    special_rules: '万筒索同数字刻子各一组',
    related_yaku: ['pinfu', 'toitoi'],
    common_pitfalls: '必须是同一数字的三种花色刻子'
  },
  {
    id: 'honrou',
    name_ja: '混老头',
    name_zh: '混老头',
    han: 2,
    description: '全部由幺九牌和字牌组成',
    examples: [
      { tiles: ['1m','1m','1m','9m','9m','9m','1p','1p','1p','EW','EW','EW','CW','CW'], explanation: '幺九刻子×3+字牌刻子+字牌雀头' }
    ],
    special_rules: '含字牌和1/9牌，允许碰杠',
    related_yaku: ['chinitsu', 'tanyao'],
    common_pitfalls: '混一色含数牌，混老头只需幺九和字牌'
  },
  {
    id: 'chiitoitsu',
    name_ja: '七対子',
    name_zh: '七对子',
    han: 2,
    description: '七个对子组成的手牌',
    examples: [
      { tiles: ['1m','1m','2m','2m','3m','3m','4p','4p','5p','5p','6s','6s','ES','ES'], explanation: '七个对子组成' }
    ],
    special_rules: '门前清限定，不能吃碰杠',
    related_yaku: ['pinfu', 'toitoi'],
    common_pitfalls: '对子不能重复计算'
  },
  // 三番（3翻）
  {
    id: 'junchan',
    name_ja: '純全帯么九',
    name_zh: '纯全带幺',
    han: 3,
    description: '所有面子和雀头都包含幺九牌，不含字牌',
    examples: [
      { tiles: ['1m','2m','3m','7m','8m','9m','1p','2p','3p','1s','2s','3s','9p','9p'], explanation: '纯全带幺，无字牌' }
    ],
    special_rules: '副露减一番，不可含字牌',
    related_yaku: ['chanta', 'honchantai'],
    common_pitfalls: '含字牌则降为混全'
  },
  {
    id: 'honchantai',
    name_ja: '混全帯么九',
    name_zh: '混全带幺',
    han: 3,
    description: '所有面子和雀头都包含幺九牌，含字牌',
    examples: [
      { tiles: ['1m','2m','3m','7m','8m','9m','1p','2p','3p','1s','2s','3s','ES','ES'], explanation: '混全带幺，有字牌' }
    ],
    special_rules: '必须同时有幺九牌和字牌',
    related_yaku: ['chanta', 'junchan'],
    common_pitfalls: '缺一则不算'
  },
  {
    id: 'ryanpeikou',
    name_ja: '二盃口',
    name_zh: '二杯口',
    han: 3,
    description: '同种数牌有两个及以上同顺',
    examples: [
      { tiles: ['1m','2m','3m','1m','2m','3m','7m','8m','9m','7m','8m','9m','2p','2p'], explanation: '两组123m顺子+两组789m顺子+雀头' }
    ],
    special_rules: '门前清限定，必须两组以上同顺',
    related_yaku: ['peikou', 'ippin'],
    common_pitfalls: '吃牌后不算'
  },
  // 六番（6翻）
  {
    id: 'chinitsu',
    name_ja: '清一色',
    name_zh: '清一色',
    han: 6,
    description: '全部由一种数牌组成',
    examples: [
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','1m','2m','3m','4m','6m'], explanation: '万子清一色，听6m' }
    ],
    special_rules: '副露减一番，允许吃碰杠',
    related_yaku: ['honitsu'],
    common_pitfalls: '含字牌或他花色不算'
  },
  // 役满
  {
    id: 'tenho',
    name_ja: '天和',
    name_zh: '天和',
    han: 13,
    han_locked: true,
    description: '亲家配牌后直接和牌',
    examples: [
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','5m','5m','6m','7m','8m','9m','9m'], explanation: '配牌即和' }
    ],
    special_rules: '仅亲家可役满',
    related_yaku: ['chiho'],
    common_pitfalls: '子家无法达成'
  },
  {
    id: 'chiho',
    name_ja: '地和',
    name_zh: '地和',
    han: 13,
    han_locked: true,
    description: '子家第一巡摸牌后直接自摸和牌',
    examples: [
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','5m','5m','6m','7m','8m','9m','9m'], explanation: '第一巡自摸' }
    ],
    special_rules: '必须第一巡自摸',
    related_yaku: ['tenho'],
    common_pitfalls: '有人吃碰杠后不自满'
  },
  {
    id: 'daisangen',
    name_ja: '大三元',
    name_zh: '大三元',
    han: 13,
    han_locked: true,
    description: '三种元牌全部为刻子',
    examples: [
      { tiles: ['EW','EW','EW','FW','FW','FW','CW','CW','CW','3m','4m','5m','5m','5m'], explanation: '白发中全为刻子+顺子+雀头' }
    ],
    special_rules: '三种元牌必须都为刻子',
    related_yaku: ['shosangen'],
    common_pitfalls: '雀头也算刻子'
  },
  {
    id: 'suanko',
    name_ja: '四暗刻',
    name_zh: '四暗刻',
    han: 13,
    han_locked: true,
    description: '四个暗刻单骑听牌',
    examples: [
      { tiles: ['1m','1m','1m','5p','5p','5p','9s','9s','9s','2m','2m','3m','3m','3m'], explanation: '四个暗刻+一对，摸到3m与3m对组成刻子' }
    ],
    special_rules: '门前清限定，必须全部暗刻且单骑听牌',
    related_yaku: ['toitoi', 'sananko'],
    common_pitfalls: '四暗刻听张降为两番'
  },
  {
    id: 'suanko_tenpai',
    name_ja: '四暗刻単騎',
    name_zh: '四暗刻单骑',
    han: 13,
    han_locked: true,
    description: '四个暗刻单骑和牌',
    examples: [
      { tiles: ['1m','1m','1m','5p','5p','5p','9s','9s','9s','2m','2m','2m','3m','3m'], explanation: '四暗刻单骑和3m' }
    ],
    special_rules: '门前清限定，必须单骑自摸',
    related_yaku: ['suanko'],
    common_pitfalls: '荣和只算普通四暗刻'
  },
  {
    id: 'guoshi',
    name_ja: '國士無雙',
    name_zh: '国士无双',
    han: 13,
    han_locked: true,
    description: '含有全部幺九牌和字牌，十三面听',
    examples: [
      { tiles: ['1m','9m','1p','9p','1s','9s','ES','SS','WS','NS','EW','FW','CW','1m'], explanation: '十三种幺九字牌加一张1m，十三面听' }
    ],
    special_rules: '门前清限定，十三面听',
    related_yaku: ['shosushi', 'daisushi'],
    common_pitfalls: '吃过牌后不算'
  },
  {
    id: 'daisushi',
    name_ja: '大四喜',
    name_zh: '大四喜',
    han: 13,
    han_locked: true,
    description: '四种字牌全部为刻子',
    examples: [
      { tiles: ['ES','ES','ES','SS','SS','SS','WS','WS','WS','NS','NS','NS','EW','EW'], explanation: '东南西北全为刻子+白板雀头' }
    ],
    special_rules: '四种字牌必须都为刻子',
    related_yaku: ['shosushi'],
    common_pitfalls: '必须四种全刻'
  },
  {
    id: 'shosushi',
    name_ja: '小四喜',
    name_zh: '小四喜',
    han: 13,
    han_locked: true,
    description: '四种字牌三种为刻子一种为雀头',
    examples: [
      { tiles: ['ES','ES','ES','SS','SS','SS','WS','WS','WS','NS','NS','1m','2m','3m'], explanation: '三种风牌刻子+北风雀头+顺子' }
    ],
    special_rules: '三种刻子一种雀头',
    related_yaku: ['daisushi'],
    common_pitfalls: '必须三种刻子一种雀头'
  },
  {
    id: 'tsuiso',
    name_ja: '字一色',
    name_zh: '字一色',
    han: 13,
    han_locked: true,
    description: '全部由字牌组成',
    examples: [
      { tiles: ['ES','ES','ES','SS','SS','SS','WS','WS','WS','NS','NS','NS','EW','EW'], explanation: '字一色' }
    ],
    special_rules: '全部由字牌组成',
    related_yaku: ['honitsu', 'chinitsu'],
    common_pitfalls: '顺子型也算'
  },
  {
    id: 'ryuiso',
    name_ja: '緑一色',
    name_zh: '绿一色',
    han: 13,
    han_locked: true,
    description: '全部由绿发相关牌组成',
    examples: [
      { tiles: ['2s','2s','2s','3s','3s','3s','4s','4s','4s','6s','6s','6s','8s','8s'], explanation: '绿一色' }
    ],
    special_rules: '限定使用绿发系牌',
    related_yaku: ['honitsu', 'chinitsu'],
    common_pitfalls: '含其他牌不算'
  },
  {
    id: 'chinroto',
    name_ja: '清老頭',
    name_zh: '清老头',
    han: 13,
    han_locked: true,
    description: '全部由老头（1/9）组成',
    examples: [
      { tiles: ['1m','1m','1m','9m','9m','9m','1s','1s','1s','9s','9s','9s','1p','1p'], explanation: '全部幺九刻子+雀头' }
    ],
    special_rules: '只含1和9',
    related_yaku: ['honitsu', 'chinitsu'],
    common_pitfalls: '含字牌不算'
  },
  {
    id: 'chuuren_poto',
    name_ja: '九連宝燈',
    name_zh: '九莲宝灯',
    han: 13,
    han_locked: true,
    description: '同种数牌1112345678999加任意一张该牌',
    examples: [
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','6m','7m','8m','9m','9m','9m','1m'], explanation: '1112345678999+任意一张1m' }
    ],
    special_rules: '必须门前清',
    related_yaku: ['junsei_chuuren', 'chinitsu'],
    common_pitfalls: '吃过牌后不算'
  },
  {
    id: 'junsei_chuuren',
    name_ja: '純粋九連宝燈',
    name_zh: '纯正九莲宝灯',
    han: 13,
    han_locked: true,
    description: '同种数牌1112345678999加该牌本身和牌',
    examples: [
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','6m','7m','8m','9m','9m','9m','1m'], explanation: '1112345678999+1m和牌' }
    ],
    special_rules: '门前清限定，纯正为役满',
    related_yaku: ['chuuren_poto', 'chinitsu'],
    common_pitfalls: '必须1112345678999+1'
  },
  // 无线电（1翻）
  {
    id: 'haitei',
    name_ja: '海底摸月',
    name_zh: '海底捞月',
    han: 1,
    description: '牌山最后一牌自摸和牌',
    examples: [
      { tiles: ['1m','1m','1m','2m','2m','2m','3m','3m','3m','4m','5m','6m','7m','8m'], explanation: '海底自摸8m和牌' }
    ],
    special_rules: '最后一牌自摸',
    related_yaku: ['houtei'],
    common_pitfalls: '荣和不算'
  },
  {
    id: 'houtei',
    name_ja: '河底摸魚',
    name_zh: '河底摸鱼',
    han: 1,
    description: '牌山最后一牌荣和',
    examples: [
      { tiles: ['1m','1m','1m','2m','2m','2m','3m','3m','3m','4m','5m','6m','7m','8m'], explanation: '河底荣和8m' }
    ],
    special_rules: '最后一牌荣和',
    related_yaku: ['haitei'],
    common_pitfalls: '自摸不算'
  },
  {
    id: 'rinkou',
    name_ja: '岭上开花',
    name_zh: '岭上开花',
    han: 1,
    description: '岭上牌自摸和牌',
    examples: [
      { tiles: ['1m','1m','1m','2m','2m','2m','3m','3m','3m','4m','5m','6m','7m','8m'], explanation: '岭上开花自摸8m和牌' }
    ],
    special_rules: '杠后摸岭上牌',
    related_yaku: ['kan'],
    common_pitfalls: '必须杠后'
  },
];

export function getYakuById(id: string): Yaku | undefined {
  return YAKU_LIST.find(y => y.id === id);
}

export function getYakuByHan(han: number): Yaku[] {
  return YAKU_LIST.filter(y => y.han === han);
}

export function getYakuByCategory(category: 'han1' | 'han2' | 'han3' | 'yakuman' | 'all'): Yaku[] {
  switch (category) {
    case 'han1': return YAKU_LIST.filter(y => y.han === 1);
    case 'han2': return YAKU_LIST.filter(y => y.han === 2);
    case 'han3': return YAKU_LIST.filter(y => y.han === 3 || y.han === 6);
    case 'yakuman': return YAKU_LIST.filter(y => y.han_locked);
    default: return YAKU_LIST;
  }
}