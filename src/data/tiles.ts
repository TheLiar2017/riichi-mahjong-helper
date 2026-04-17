// 麻将牌编码系统
// 编码规则：suit * 10 + number
// suit: 0=万子, 1=筒子, 2=索子, 3=字牌
// number: 1-9 (数牌), 1-7 (字牌)
// 赤牌使用负数表示：-1 = 赤5万, -2 = 赤5筒, -3 = 赤5索

export type TileSuit = 'm' | 'p' | 's' | 'z'
export type TileNumber = number

export interface Tile {
  suit: TileSuit
  number: number
  isRed: boolean
  code: number
}

// 编码转牌面
export function decodeTile(code: number): Tile {
  if (code < 0) {
    const redMap: Record<number, { suit: TileSuit; number: number }> = {
      [-1]: { suit: 'm', number: 5 },
      [-2]: { suit: 'p', number: 5 },
      [-3]: { suit: 's', number: 5 }
    }
    const info = redMap[code]
    return { suit: info.suit, number: info.number, isRed: true, code }
  }

  const suitMap: TileSuit[] = ['m', 'p', 's', 'z']
  const suit = suitMap[Math.floor(code / 10)]
  const number = code % 10

  return {
    suit,
    number,
    isRed: false,
    code
  }
}

// 牌面转编码
export function encodeTile(suit: TileSuit, number: number, isRed = false): number {
  if (isRed) {
    const redMap: Record<string, number> = { m: -1, p: -2, s: -3 }
    return redMap[suit]
  }
  const suitMap: Record<TileSuit, number> = { m: 0, p: 1, s: 2, z: 3 }
  return suitMap[suit] * 10 + number
}

// 获取牌的面板显示
export function getTileDisplay(code: number): string {
  const tile = decodeTile(code)
  if (tile.isRed) {
    const redEmoji: Record<string, string> = { m: '🀖', p: '🀟', s: '🀠' }
    return redEmoji[tile.suit]
  }

  if (tile.suit === 'm') {
    return String.fromCodePoint(0x1F006 + tile.number)
  } else if (tile.suit === 'p') {
    return String.fromCodePoint(0x1F018 + tile.number)
  } else if (tile.suit === 's') {
    return String.fromCodePoint(0x1F00F + tile.number)
  } else {
    return String.fromCodePoint(0x1F000 + tile.number - 1)
  }
}

// 获取牌的中文名称
export function getTileName(code: number): string {
  const tile = decodeTile(code)
  const suitNames: Record<TileSuit, string> = { m: '万', p: '筒', s: '索', z: '' }
  const honorNames = ['东', '南', '西', '北', '白', '发', '中']

  if (tile.suit === 'z') {
    return honorNames[tile.number - 1]
  }
  const prefix = tile.isRed ? '赤' : ''
  return `${prefix}${tile.number}${suitNames[tile.suit]}`
}

// 牌的面数分类（用于符数计算）
export function isYaoJiu(code: number): boolean {
  const tile = decodeTile(code)
  if (tile.suit === 'z') return true
  return tile.number === 1 || tile.number === 9
}

// 统计牌数
export function countTiles(tiles: number[]): Record<number, number> {
  const counts: Record<number, number> = {}
  for (const t of tiles) {
    counts[t] = (counts[t] || 0) + 1
  }
  return counts
}
