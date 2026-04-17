// 日本立直麻将役种数据

export interface Yaku {
  id: string
  name: string
  nameCn: string
  han: number
  hanOpen: number
  description: string
  example: string
  exampleTiles: number[][]
}

export interface YakuContext {
  isMenzen: boolean
  isTsumo: boolean
  isRiichi: boolean
  isIppatsu: boolean
  isChankan: boolean
  isRinshankaihou: boolean
  isHaitei: boolean
  isHoutei: boolean
  isTenhou: boolean
  isChiihou: boolean
  wind: number
  selfWind: number
  doraCount: number
  uraDoraCount: number
}

export const YAKU_LIST: Yaku[] = [
  {
    id: 'riichi', name: 'Riichi', nameCn: '立直', han: 1, hanOpen: 1,
    description: '听牌后宣告立直，宣告时需支付1000点供托',
    example: '听牌状态下宣言立直', exampleTiles: []
  },
  {
    id: 'ippatsu', name: 'Ippatsu', nameCn: '一发', han: 1, hanOpen: 0,
    description: '立直后在一巡之内自摸或荣和',
    example: '立直后同一巡内和牌', exampleTiles: []
  },
  {
    id: 'tsumo', name: 'Tsumo', nameCn: '门前自摸', han: 1, hanOpen: 0,
    description: '门前清状态下自摸',
    example: '门前清自摸', exampleTiles: []
  },
  {
    id: 'pinfu', name: 'Pinfu', nameCn: '平和', han: 1, hanOpen: 0,
    description: '4组顺子+雀头+单骑听牌（听牌型为两面或嵌张）',
    example: '123m 456p 789s 11z 4m听牌', exampleTiles: []
  },
  {
    id: 'tanyao', name: 'Tanyao', nameCn: '断幺九', han: 1, hanOpen: 1,
    description: '手牌不含幺九牌',
    example: '手牌全是2-8的中张牌', exampleTiles: []
  },
  {
    id: 'east', name: 'East', nameCn: '东', han: 1, hanOpen: 1,
    description: '自风或场风为东', example: '自风或场风是东', exampleTiles: []
  },
  {
    id: 'south', name: 'South', nameCn: '南', han: 1, hanOpen: 1,
    description: '自风或场风为南', example: '自风或场风是南', exampleTiles: []
  },
  {
    id: 'west', name: 'West', nameCn: '西', han: 1, hanOpen: 1,
    description: '自风或场风为西', example: '自风或场风是西', exampleTiles: []
  },
  {
    id: 'north', name: 'North', nameCn: '北', han: 1, hanOpen: 1,
    description: '自风或场风为北', example: '自风或场风是北', exampleTiles: []
  },
  {
    id: 'haku', name: 'Haku', nameCn: '白', han: 1, hanOpen: 1,
    description: '三元牌白', example: '手牌有白刻子', exampleTiles: []
  },
  {
    id: 'hatsu', name: 'Hatsu', nameCn: '发', han: 1, hanOpen: 1,
    description: '三元牌发', example: '手牌有发刻子', exampleTiles: []
  },
  {
    id: 'chun', name: 'Chun', nameCn: '中', han: 1, hanOpen: 1,
    description: '三元牌中', example: '手牌有中刻子', exampleTiles: []
  },
  {
    id: 'dora', name: 'Dora', nameCn: '宝牌', han: 1, hanOpen: 1,
    description: '每张宝牌加1翻', example: '有宝牌', exampleTiles: []
  },
  {
    id: 'double_riichi', name: 'Double Riichi', nameCn: '双立直', han: 2, hanOpen: 0,
    description: '第一巡宣告立直',
    example: '第一巡立直', exampleTiles: []
  },
  {
    id: 'chii_toitsu', name: 'Chii Toitsu', nameCn: '七对子', han: 2, hanOpen: 0,
    description: '7组对子组成的特殊和牌型',
    example: '1122m 3344p 5566s 77z',
    exampleTiles: [[11,11], [12,12], [22,22], [21,21], [31,31], [32,32], [41,41]]
  },
  {
    id: 'san_shoku_doujun', name: 'San Shoku Doujun', nameCn: '三色同顺', han: 2, hanOpen: 1,
    description: '万筒索三门数字相同的顺子',
    example: '123m 123p 123s', exampleTiles: []
  },
  {
    id: 'ikki_tsukan', name: 'Ikki Tsukan', nameCn: '一气通贯', han: 2, hanOpen: 1,
    description: '同门数牌123-789的顺子',
    example: '123m 456m 789m', exampleTiles: []
  },
  {
    id: 'sanshoku_dookan', name: 'Sanshoku Dookan', nameCn: '三色同刻', han: 2, hanOpen: 2,
    description: '万筒索三门数字相同的刻子',
    example: '111m 111p 111s', exampleTiles: []
  },
  {
    id: 'san_ankou', name: 'San Ankou', nameCn: '三暗刻', han: 2, hanOpen: 2,
    description: '手牌中有3组暗刻',
    example: '111m 222p 333s 44z 5m', exampleTiles: []
  },
  {
    id: 'san_koutou', name: 'San Koutou', nameCn: '三杠子', han: 2, hanOpen: 2,
    description: '手牌中有3组杠子',
    example: '1111m 2222p 3333s 44z 5m', exampleTiles: []
  },
  {
    id: 'honitsu', name: 'Honitsu', nameCn: '混一色', han: 3, hanOpen: 2,
    description: '手牌由一种数牌+字牌组成',
    example: '123m 456m 789m 11z 22z', exampleTiles: []
  },
  {
    id: 'junchan', name: 'Junchan', nameCn: '纯全带幺', han: 3, hanOpen: 2,
    description: '所有面子和雀头都带幺九牌',
    example: '19m 123p 789m 11z 9m', exampleTiles: []
  },
  {
    id: 'chii_paiy', name: 'Chii Paiy', nameCn: '混全带幺', han: 2, hanOpen: 1,
    description: '所有面子和雀头都带幺九牌',
    example: '19m 123p 789m 11z 9m', exampleTiles: []
  },
  {
    id: 'toitoi', name: 'Toitoi', nameCn: '对对和', han: 2, hanOpen: 2,
    description: '4组刻子+雀头',
    example: '111m 222p 333s 44z', exampleTiles: []
  },
  {
    id: 'honrou', name: 'Honrou', nameCn: '混老头', han: 3, hanOpen: 2,
    description: '全部由幺九牌和字牌组成',
    example: '111m 999m 11z 11p 11s', exampleTiles: []
  },
  {
    id: 'shou_san', name: 'Shou San', nameCn: '小三元', han: 2, hanOpen: 2,
    description: '2组三元牌刻子+1组三元牌对子',
    example: '111p 111s 11z 222m 33z', exampleTiles: []
  },
  {
    id: 'chinitsu', name: 'Chinitsu', nameCn: '清一色', han: 6, hanOpen: 5,
    description: '手牌由一种数牌组成',
    example: '123456789m 11m 11m', exampleTiles: []
  },
  {
    id: 'chinrou', name: 'Chinrou', nameCn: '清老头', han: 5, hanOpen: 5,
    description: '全部由幺九数牌组成',
    example: '111m 999m 111p 999p 11m', exampleTiles: []
  },
  {
    id: 'tsuuiisou', name: 'Tsuuiisou', nameCn: '字一色', han: 5, hanOpen: 5,
    description: '全部由字牌组成',
    example: '111z 222z 33z 44z 55z', exampleTiles: []
  },
  {
    id: 'dai_san', name: 'Dai San', nameCn: '大三元', han: 5, hanOpen: 5,
    description: '三种三元牌各有一组刻子',
    example: '111z 222z 333z 44m 55p', exampleTiles: []
  },
  {
    id: 'shou_suushii', name: 'Shou Suushii', nameCn: '小四喜', han: 4, hanOpen: 4,
    description: '三种风牌刻子+1组风牌对子',
    example: '111z 222z 333z 44z 11m', exampleTiles: []
  },
  {
    id: 'dai_suushii', name: 'Dai Suushii', nameCn: '大四喜', han: 13, hanOpen: 13,
    description: '四种风牌各有一组刻子',
    example: '111z 222z 333z 444z 11m', exampleTiles: []
  },
  {
    id: 'chinraot', name: 'Chinraot', nameCn: '清一色一杯口', han: 6, hanOpen: 0,
    description: '清一色+一组相同顺子',
    example: '123m 123m 456m 789m 11m', exampleTiles: []
  },
  {
    id: 'kokushi', name: 'Kokushi', nameCn: '国士无双', han: 13, hanOpen: 0,
    description: '13种幺九牌各一张+任意一张幺九牌对子',
    example: '1m9m 1p9p 1s9s 1z2z3z4z5z6z7z', exampleTiles: []
  },
  {
    id: 'suu_ankou', name: 'Suu Ankou', nameCn: '四暗刻', han: 13, hanOpen: 0,
    description: '手牌中有4组暗刻',
    example: '111m 222p 333s 44z', exampleTiles: []
  },
  {
    id: 'suu_ankou_tanki', name: 'Suu Ankou Tanki', nameCn: '四暗刻单骑', han: 13, hanOpen: 0,
    description: '四暗刻且单骑听牌',
    example: '111m 222p 333s 44z 4z', exampleTiles: []
  },
  {
    id: 'tenhou', name: 'Tenhou', nameCn: '天和', han: 13, hanOpen: 13,
    description: '配牌完成后即听牌并自摸和牌',
    example: '庄家配牌后直接自摸', exampleTiles: []
  },
  {
    id: 'chihou', name: 'Chihou', nameCn: '地和', han: 13, hanOpen: 13,
    description: '配牌完成后即听牌并自摸和牌（闲家）',
    example: '闲家配牌后直接自摸', exampleTiles: []
  },
  {
    id: 'renhou', name: 'Renhou', nameCn: '人', han: 5, hanOpen: 5,
    description: '非立直状态下荣和',
    example: '非立直荣和', exampleTiles: []
  }
]
