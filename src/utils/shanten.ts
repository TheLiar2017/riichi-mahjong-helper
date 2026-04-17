// 向听数计算与听牌分析模块
import { encodeTile, decodeTile } from '../data/tiles'
import type { TileSuit } from '../data/tiles'

export interface WaitingInfo {
  tile: number
  type: 'tanki' | 'shanpon' | 'kanchan' | 'penchan' | 'ryanmen'
  count: number
}

export function calculateShanten(tiles: number[]): number {
  const counts: Record<number, number> = {}
  for (const t of tiles) {
    counts[t] = (counts[t] || 0) + 1
  }

  let mentsu = 0
  for (const [, count] of Object.entries(counts)) {
    if (count >= 3) mentsu++
  }

  const shanten = 8 - mentsu * 2
  return Math.max(0, shanten)
}

export function getWaitingTiles(tiles: number[]): WaitingInfo[] {
  const counts: Record<number, number> = {}
  for (const t of tiles) {
    counts[t] = (counts[t] || 0) + 1
  }
  const waiting: WaitingInfo[] = []

  for (const [code, count] of Object.entries(counts)) {
    if (count === 2) {
      const pairCount = Object.values(counts).filter(c => c >= 2).length
      if (pairCount >= 1) {
        waiting.push({ tile: Number(code), type: 'tanki', count: 4 - counts[Number(code)] })
      }
    }
  }

  for (const suit of ['m', 'p', 's'] as TileSuit[]) {
    for (let num = 2; num <= 8; num++) {
      const left = encodeTile(suit, num - 1)
      const right = encodeTile(suit, num + 1)
      if (counts[left] && counts[right] && !counts[encodeTile(suit, num)]) {
        waiting.push({ tile: encodeTile(suit, num), type: 'kanchan', count: 4 })
      }
    }
  }

  for (const suit of ['m', 'p', 's'] as TileSuit[]) {
    for (let num = 1; num <= 9; num++) {
      if (num === 1) {
        const right = encodeTile(suit, 2)
        if (counts[right] && counts[encodeTile(suit, 1)] && !counts[encodeTile(suit, num)]) {
          waiting.push({ tile: encodeTile(suit, num), type: 'ryanmen', count: 4 })
        }
      } else if (num === 9) {
        const left = encodeTile(suit, 8)
        if (counts[left] && counts[encodeTile(suit, 9)] && !counts[encodeTile(suit, num)]) {
          waiting.push({ tile: encodeTile(suit, num), type: 'ryanmen', count: 4 })
        }
      } else {
        const left = encodeTile(suit, num - 1)
        const right = encodeTile(suit, num + 1)
        if (counts[left] && counts[right]) {
          waiting.push({ tile: encodeTile(suit, num), type: 'ryanmen', count: 4 })
        }
      }
    }
  }

  const pairs = Object.entries(counts).filter(([_, c]) => c === 2).map(([code]) => Number(code))
  if (pairs.length >= 2) {
    for (const p of pairs) {
      waiting.push({ tile: p, type: 'shanpon', count: 4 - counts[p] })
    }
  }

  return waiting
}
