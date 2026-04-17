// 役种判定模块
import { YAKU_LIST } from '../data/yaku'
import type { Yaku, YakuContext } from '../data/yaku'
import { countTiles, decodeTile, encodeTile, isYaoJiu } from '../data/tiles'
import type { TileSuit } from '../data/tiles'
import { analyzeHandStructure, hasShuntsu, countKotsu, hasShuntsuWithNumber } from './fu'

export interface YakuResult {
  yaku: Yaku
  han: number
  isValid: boolean
}

export interface HandYakuResult {
  results: YakuResult[]
  totalHan: number
  yakuNames: string[]
}

export function calculateYaku(tiles: number[], context: YakuContext): HandYakuResult {
  const results: YakuResult[] = []
  let totalHan = 0

  for (const yaku of YAKU_LIST) {
    const isValid = checkYaku(yaku, tiles, context)
    if (isValid) {
      const han = context.isMenzen ? yaku.han : yaku.hanOpen
      results.push({ yaku, han, isValid: true })
      totalHan += han
    }
  }

  return { results, totalHan, yakuNames: results.map(r => r.yaku.nameCn) }
}

function checkYaku(yaku: Yaku, tiles: number[], context: YakuContext): boolean {
  switch (yaku.id) {
    case 'riichi': return context.isRiichi
    case 'ippatsu': return context.isRiichi && context.isIppatsu
    case 'tsumo': return context.isTsumo && context.isMenzen
    case 'pinfu': return checkPinfu(tiles, context)
    case 'tanyao': return checkTanyao(tiles)
    case 'east': case 'south': case 'west': case 'north': return checkWindYaku(yaku.id, context)
    case 'haku': case 'hatsu': case 'chun': return check三元牌Yaku(yaku.id, tiles)
    case 'dora': return context.doraCount > 0
    case 'double_riichi': return context.isRiichi && context.isIppatsu
    case 'chii_toitsu': return checkChiitoitsu(tiles)
    case 'san_shoku_doujun': return checkSanShokuDoujun(tiles, context)
    case 'ikki_tsukan': return checkIkkiTsukan(tiles, context)
    case 'sanshoku_dookan': return checkSanshokuDookan(tiles)
    case 'san_ankou': return checkSanAnkou(tiles, context)
    case 'san_koutou': return checkSanKoutou(tiles, context)
    case 'honitsu': return checkHonitsu(tiles)
    case 'chinitsu': return checkChinitsu(tiles)
    case 'junchan': return checkJunchan(tiles, context)
    case 'chii_paiy': return checkChiiPaiy(tiles, context)
    case 'toitoi': return checkToitoi(tiles)
    case 'honrou': return checkHonrou(tiles)
    case 'shou_san': return checkShouSan(tiles)
    case 'chinrou': return checkChinrou(tiles)
    case 'tsuuiisou': return checkTsuuiisou(tiles)
    case 'dai_san': return checkDaiSan(tiles)
    case 'shou_suushii': return checkShouSuushii(tiles)
    case 'dai_suushii': return checkDaiSuushii(tiles)
    case 'chinraot': return checkChinraot(tiles, context)
    case 'kokushi': return checkKokushi(tiles)
    case 'suu_ankou': return checkSuuAnkou(tiles, context)
    case 'suu_ankou_tanki': return checkSuuAnkouTanki(tiles, context)
    case 'tenhou': return context.isTenhou
    case 'chihou': return context.isChiihou
    default: return false
  }
}

function checkPinfu(tiles: number[], context: YakuContext): boolean {
  if (!context.isMenzen || tiles.length !== 14) return false
  const analysis = analyzeHandStructure(tiles)
  if (!analysis) return false
  const shuntsuCount = analysis.melds.filter(m => m.type === 'shuntsu').length
  if (shuntsuCount !== 4) return false
  const headTile = decodeTile(analysis.head!)
  return headTile.suit !== 'z'
}

function checkTanyao(tiles: number[]): boolean {
  const counts = countTiles(tiles)
  for (const [code] of Object.entries(counts)) {
    const tile = decodeTile(Number(code))
    if (tile.suit === 'z') return false
    if (tile.number === 1 || tile.number === 9) return false
  }
  return true
}

function checkWindYaku(wind: string, context: YakuContext): boolean {
  const windMap: Record<string, number> = { east: 1, south: 2, west: 3, north: 4 }
  const w = windMap[wind]
  return context.wind === w || context.selfWind === w
}

function check三元牌Yaku(id: string, tiles: number[]): boolean {
  const dragonMap: Record<string, number> = { haku: 5, hatsu: 6, chun: 7 }
  const target = dragonMap[id]
  if (!target) return false
  return tiles.some(t => decodeTile(t).suit === 'z' && decodeTile(t).number === target)
}

function checkChiitoitsu(tiles: number[]): boolean {
  if (tiles.length !== 14) return false
  const counts = countTiles(tiles)
  const pairCount = Object.values(counts).filter((c: number) => c === 2).length
  return pairCount === 7
}

function checkSanShokuDoujun(tiles: number[], context: YakuContext): boolean {
  if (!context.isMenzen || tiles.length !== 14) return false
  const suits: TileSuit[] = ['m', 'p', 's']
  for (let num = 1; num <= 7; num++) {
    let hasAllThree = true
    for (const suit of suits) {
      if (!hasShuntsuWithNumber(tiles, suit, num)) { hasAllThree = false; break }
    }
    if (hasAllThree) return true
  }
  return false
}

function checkIkkiTsukan(tiles: number[], context: YakuContext): boolean {
  if (!context.isMenzen || tiles.length !== 14) return false
  const suits: TileSuit[] = ['m', 'p', 's']
  for (const suit of suits) {
    if (hasShuntsuWithNumber(tiles, suit, 1) && hasShuntsuWithNumber(tiles, suit, 4) && hasShuntsuWithNumber(tiles, suit, 7)) {
      return true
    }
  }
  return false
}

function checkSanshokuDookan(tiles: number[]): boolean {
  const counts = countTiles(tiles)
  for (let num = 1; num <= 9; num++) {
    const m = encodeTile('m', num)
    const p = encodeTile('p', num)
    const s = encodeTile('s', num)
    if ((counts[m] || 0) >= 3 && (counts[p] || 0) >= 3 && (counts[s] || 0) >= 3) return true
  }
  return false
}

function checkSanAnkou(tiles: number[], _context: YakuContext): boolean {
  if (tiles.length !== 14) return false
  return countKotsu(tiles) >= 3
}

function checkSanKoutou(tiles: number[], _context: YakuContext): boolean {
  const counts = countTiles(tiles)
  const kantsuCount = Object.values(counts).filter((c: number) => c >= 4).length
  return kantsuCount >= 3
}

function checkHonitsu(tiles: number[]): boolean {
  const counts = countTiles(tiles)
  let hasNumber = false, hasHonor = false, numberSuit: TileSuit | null = null
  for (const [code] of Object.entries(counts)) {
    const tile = decodeTile(Number(code))
    if (tile.suit === 'z') { hasHonor = true }
    else {
      if (!hasNumber) { hasNumber = true; numberSuit = tile.suit }
      else if (numberSuit !== tile.suit) return false
    }
  }
  return hasNumber && hasHonor
}

function checkChinitsu(tiles: number[]): boolean {
  const counts = countTiles(tiles)
  const suits = new Set<TileSuit>()
  for (const [code] of Object.entries(counts)) {
    const tile = decodeTile(Number(code))
    if (tile.suit !== 'z') suits.add(tile.suit)
  }
  return suits.size === 1
}

function checkJunchan(tiles: number[], context: YakuContext): boolean {
  if (!context.isMenzen || tiles.length !== 14) return false
  const analysis = analyzeHandStructure(tiles)
  if (!analysis) return false
  for (const meld of analysis.melds) { if (!meld.isYaochu) return false }
  if (!isYaoJiu(analysis.head!)) return false
  const counts = countTiles(tiles)
  for (const [code, count] of Object.entries(counts)) {
    if (count > 0) {
      const tile = decodeTile(Number(code))
      if (tile.suit !== 'z' && tile.number !== 1 && tile.number !== 9) return true
    }
  }
  return false
}

function checkChiiPaiy(tiles: number[], context: YakuContext): boolean {
  if (!context.isMenzen || tiles.length !== 14) return false
  const analysis = analyzeHandStructure(tiles)
  if (!analysis) return false
  for (const meld of analysis.melds) { if (!meld.isYaochu) return false }
  return isYaoJiu(analysis.head!)
}

function checkToitoi(tiles: number[]): boolean {
  const counts = countTiles(tiles)
  const kotsuCount = Object.values(counts).filter((c: number) => c >= 3).length
  return kotsuCount === 4
}

function checkHonrou(tiles: number[]): boolean {
  const counts = countTiles(tiles)
  for (const [code] of Object.entries(counts)) {
    const tile = decodeTile(Number(code))
    if (tile.suit !== 'z' && tile.number !== 1 && tile.number !== 9) return false
  }
  return true
}

function checkShouSan(tiles: number[]): boolean {
  const counts = countTiles(tiles)
  let dragonPairs = 0, dragonKoutou = 0
  for (let d = 5; d <= 7; d++) {
    const count = counts[encodeTile('z', d)] || 0
    if (count >= 3) dragonKoutou++
    if (count === 2) dragonPairs++
  }
  return dragonKoutou === 2 && dragonPairs === 1
}

function checkChinrou(tiles: number[]): boolean {
  const counts = countTiles(tiles)
  for (const [code] of Object.entries(counts)) {
    const tile = decodeTile(Number(code))
    if (tile.suit === 'z') return false
    if (tile.number !== 1 && tile.number !== 9) return false
  }
  return true
}

function checkTsuuiisou(tiles: number[]): boolean {
  const counts = countTiles(tiles)
  for (const [code] of Object.entries(counts)) {
    const tile = decodeTile(Number(code))
    if (tile.suit !== 'z') return false
  }
  return true
}

function checkDaiSan(tiles: number[]): boolean {
  const counts = countTiles(tiles)
  let dragonKoutou = 0
  for (let d = 5; d <= 7; d++) { if ((counts[encodeTile('z', d)] || 0) >= 3) dragonKoutou++ }
  return dragonKoutou === 3
}

function checkShouSuushii(tiles: number[]): boolean {
  const counts = countTiles(tiles)
  let windKoutou = 0, windPair = 0
  for (let w = 1; w <= 4; w++) {
    const count = counts[encodeTile('z', w)] || 0
    if (count >= 3) windKoutou++
    if (count === 2) windPair++
  }
  return windKoutou === 3 && windPair === 1
}

function checkDaiSuushii(tiles: number[]): boolean {
  const counts = countTiles(tiles)
  let windKoutou = 0
  for (let w = 1; w <= 4; w++) { if ((counts[encodeTile('z', w)] || 0) >= 3) windKoutou++ }
  return windKoutou === 4
}

function checkChinraot(tiles: number[], context: YakuContext): boolean {
  if (!context.isMenzen || tiles.length !== 14 || !checkChinitsu(tiles)) return false
  const suits: TileSuit[] = ['m', 'p', 's']
  for (const suit of suits) {
    const shuntsuList = hasShuntsu(tiles).filter(s => s.suit === suit)
    const numCounts: Record<number, number> = {}
    for (const { num } of shuntsuList) { numCounts[num] = (numCounts[num] || 0) + 1; if (numCounts[num] >= 2) return true }
  }
  return false
}

function checkKokushi(tiles: number[]): boolean {
  if (tiles.length !== 13) return false
  const yaochu = [11, 19, 21, 29, 31, 39, 41, 42, 43, 44, 45, 46, 47]
  const counts = countTiles(tiles)
  const yaochuSet = new Set(yaochu)
  let found = 0
  for (const [code] of Object.entries(counts)) { if (yaochuSet.has(Number(code))) found++ }
  return found === 13
}

function checkSuuAnkou(tiles: number[], _context: YakuContext): boolean {
  if (tiles.length !== 14) return false
  return countKotsu(tiles) >= 4
}

function checkSuuAnkouTanki(tiles: number[], _context: YakuContext): boolean {
  if (tiles.length !== 14) return false
  return countKotsu(tiles) >= 4
}
