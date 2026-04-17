// 符数计算与面子分析模块
import { decodeTile, isYaoJiu, encodeTile, countTiles } from '../data/tiles'
import type { TileSuit } from '../data/tiles'

export interface FuResult {
  base: number
  menzen: number
  head: number
  tanki: number
  total: number
}

export interface HandAnalysis {
  tiles: number[]
  type: 'normal' | 'chitoitsu' | 'kokushimusou'
  shanten: number
  tenpai: boolean
  waiting: number[]
}

export type MeldType = 'shuntsu' | 'kotsu' | 'kantsu' | 'toitsu'

export interface Meld {
  type: MeldType
  tiles: number[]
  isMinkou: boolean
  isAnkou: boolean
  isYaochu: boolean
}

export interface FullHandAnalysis {
  melds: Meld[]
  head: number | null
  leftTiles: number[]
}

export function analyzeHandStructure(tiles: number[]): FullHandAnalysis | null {
  if (tiles.length !== 14) return null

  const counts = countTiles(tiles)

  for (const [code, count] of Object.entries(counts)) {
    if (count >= 2) {
      const head = Number(code)
      const remaining = [...tiles]
      for (let i = 0; i < 2; i++) {
        const idx = remaining.indexOf(head)
        if (idx !== -1) remaining.splice(idx, 1)
      }

      const result = tryFormMelds(remaining, [])
      if (result) {
        return { melds: result, head, leftTiles: [] }
      }
    }
  }

  return null
}

function tryFormMelds(tiles: number[], formed: Meld[]): Meld[] | null {
  if (tiles.length === 0) {
    return formed.length === 4 ? formed : null
  }

  if (formed.length >= 4) return null

  const sorted = [...tiles].sort((a, b) => a - b)

  if (sorted.length >= 3) {
    const first = sorted[0]
    if (sorted[0] === sorted[1] && sorted[1] === sorted[2]) {
      const newTiles = sorted.slice(3)
      const meld: Meld = {
        type: 'kotsu', tiles: [first, first, first],
        isMinkou: false, isAnkou: true, isYaochu: isYaoJiu(first)
      }
      const result = tryFormMelds(newTiles, [...formed, meld])
      if (result) return result
    }
  }

  if (sorted.length >= 3) {
    const firstTile = decodeTile(sorted[0])
    if (firstTile.suit !== 'z' && firstTile.number <= 7) {
      const suit = firstTile.suit
      const n1 = firstTile.number
      const code1 = encodeTile(suit, n1)
      const code2 = encodeTile(suit, n1 + 1)
      const code3 = encodeTile(suit, n1 + 2)

      const counts = countTiles(sorted)
      if ((counts[code1] || 0) >= 1 && (counts[code2] || 0) >= 1 && (counts[code3] || 0) >= 1) {
        const tempTiles = [...sorted]
        const removeIdx: number[] = []
        for (let i = 0; i < tempTiles.length && removeIdx.length < 3; i++) {
          if ((tempTiles[i] === code1 || tempTiles[i] === code2 || tempTiles[i] === code3) && !removeIdx.includes(i)) {
            removeIdx.push(i)
          }
        }
        removeIdx.sort((a, b) => b - a)
        for (const idx of removeIdx) {
          tempTiles.splice(idx, 1)
        }

        const meld: Meld = {
          type: 'shuntsu', tiles: [code1, code2, code3],
          isMinkou: false, isAnkou: true, isYaochu: false
        }
        const result = tryFormMelds(tempTiles, [...formed, meld])
        if (result) return result
      }
    }
  }

  return null
}

export function hasShuntsuWithNumber(tiles: number[], suit: TileSuit, num: number): boolean {
  if (num < 1 || num > 7) return false
  const c1 = encodeTile(suit, num)
  const c2 = encodeTile(suit, num + 1)
  const c3 = encodeTile(suit, num + 2)
  const counts = countTiles(tiles)
  return (counts[c1] || 0) >= 1 && (counts[c2] || 0) >= 1 && (counts[c3] || 0) >= 1
}

export function hasShuntsu(tiles: number[]): { suit: TileSuit; num: number }[] {
  const results: { suit: TileSuit; num: number }[] = []
  const suits: TileSuit[] = ['m', 'p', 's']
  for (const suit of suits) {
    for (let num = 1; num <= 7; num++) {
      if (hasShuntsuWithNumber(tiles, suit, num)) {
        results.push({ suit, num })
      }
    }
  }
  return results
}

export function countKotsu(tiles: number[]): number {
  const counts = countTiles(tiles)
  return Object.values(counts).filter(c => c >= 3).length
}

export function analyzeHand(tiles: number[]): HandAnalysis {
  const sorted = [...tiles].sort((a, b) => a - b)

  if (sorted.length === 14 && isChiitoitsu(sorted)) {
    return { tiles: sorted, type: 'chitoitsu', shanten: -1, tenpai: true, waiting: [] }
  }

  if (sorted.length === 13 && isKokushimusou(sorted)) {
    return { tiles: sorted, type: 'kokushimusou', shanten: 0, tenpai: true, waiting: getKokushimusouWaiting(sorted) }
  }

  const result = calculateShanten(sorted)
  return { tiles: sorted, type: 'normal', shanten: result.shanten, tenpai: result.shanten === 0, waiting: result.waiting }
}

function isChiitoitsu(tiles: number[]): boolean {
  const counts = countTiles(tiles)
  const pairCount = Object.values(counts).filter(c => c >= 2).length
  const hasOnePair = Object.values(counts).some(c => c === 2)
  const uniqueTiles = Object.keys(counts).length
  return uniqueTiles === 7 && hasOnePair && pairCount === 7
}

function isKokushimusou(tiles: number[]): boolean {
  const yaochu = [11, 19, 21, 29, 31, 39, 41, 42, 43, 44, 45, 46, 47]
  const yaochuCount = yaochu.map(t => tiles.filter(x => x === t).length)
  const unique = yaochuCount.filter(c => c > 0).length
  const pairs = yaochuCount.filter(c => c === 2).length
  return unique === 13 && pairs === 1
}

function getKokushimusouWaiting(tiles: number[]): number[] {
  const yaochu = [11, 19, 21, 29, 31, 39, 41, 42, 43, 44, 45, 46, 47]
  const counts = countTiles(tiles)
  for (const t of yaochu) {
    if (!counts[t]) return [t]
  }
  const singles = yaochu.filter(t => counts[t] === 1)
  return singles
}

function calculateShanten(tiles: number[]): { shanten: number; waiting: number[] } {
  const waiting: number[] = []
  const counts = countTiles(tiles)

  for (const [tile, count] of Object.entries(counts)) {
    if (count === 2) {
      const others = Object.entries(counts).filter(([t, c]) => c >= 2 && Number(t) !== Number(tile))
      if (others.length === 0) {
        waiting.push(Number(tile))
      }
    }
  }

  const suits = ['m', 'p', 's'] as TileSuit[]
  for (const suit of suits) {
    for (let num = 2; num <= 8; num++) {
      const code = encodeTile(suit, num)
      const left = encodeTile(suit, num - 1)
      const right = encodeTile(suit, num + 1)
      if (counts[left] && counts[right] && !counts[code]) {
        waiting.push(code)
      }
    }
  }

  for (const suit of suits) {
    for (let num = 1; num <= 9; num++) {
      const code = encodeTile(suit, num)
      if (!counts[code]) {
        const left = encodeTile(suit, num - 1)
        const right = encodeTile(suit, num + 1)
        if (counts[left] && counts[right]) {
          if (!checkShuntsuExists(tiles, suit, num)) {
            waiting.push(code)
          }
        }
      }
    }
  }

  return { shanten: waiting.length > 0 ? 0 : 1, waiting: [...new Set(waiting)] }
}

function checkShuntsuExists(tiles: number[], suit: TileSuit, num: number): boolean {
  if (num < 2 || num > 8) return false
  const left = encodeTile(suit, num - 1)
  const mid = encodeTile(suit, num)
  const right = encodeTile(suit, num + 1)
  return tiles.filter(t => t === left || t === mid || t === right).length >= 3
}

export function calculateFu(hand: number[], _winningTile: number, context: {
  isTsumo: boolean
  isMenzen: boolean
  isPinfu: boolean
  melds: Meld[]
  headTile: number
  winningType: 'tanki' | 'shanpon' | 'kanchan' | 'penchan' | 'others'
}): FuResult {
  const { isTsumo, isMenzen, isPinfu, melds, headTile, winningType } = context

  if (isChiitoitsu(hand)) {
    return { base: 0, menzen: 0, head: 0, tanki: 0, total: 25 }
  }

  if (isKokushimusou(hand)) {
    return { base: 0, menzen: 0, head: 0, tanki: 0, total: 30 }
  }

  let base = 20
  let menzen = 0
  let head = 0
  let tanki = 0

  for (const meld of melds) {
    if (meld.type === 'shuntsu') {
      // 顺子0符
    } else if (meld.type === 'kotsu') {
      if (meld.isAnkou) {
        menzen += isYaoJiu(meld.tiles[0]) ? 8 : 4
      } else {
        menzen += isYaoJiu(meld.tiles[0]) ? 4 : 2
      }
    } else if (meld.type === 'kantsu') {
      if (meld.isAnkou) {
        menzen += isYaoJiu(meld.tiles[0]) ? 32 : 16
      } else {
        menzen += isYaoJiu(meld.tiles[0]) ? 16 : 8
      }
    }
  }

  const headTileInfo = decodeTile(headTile)
  if (headTileInfo.suit === 'z') {
    head = 2
  }

  if (isPinfu && isMenzen) {
    tanki = 2
    return { base: 0, menzen: 0, head: 0, tanki: 2, total: 10 + (isTsumo ? 0 : 10) }
  }

  if (winningType === 'tanki' || winningType === 'shanpon') {
    tanki = 2
  }

  const total = base + menzen + head + tanki
  return { base, menzen, head, tanki, total }
}
