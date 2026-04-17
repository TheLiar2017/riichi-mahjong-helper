// 点数计算模块

export interface ScoreResult {
  han: number
  fu: number
  basePoint: number
  totalPoint: number
  isParent: boolean
  isTsumo: boolean
  isMangan: boolean
  manganType: string
}

export type ManganLevel = 'mangan' | 'haneman' | 'baiman' | 'sanbaiman' | 'yakuman'

export function calculateScore(han: number, fu: number, isParent: boolean, isTsumo: boolean): ScoreResult {
  const manganLevel = getManganLevel(han)

  if (manganLevel) {
    const manganType = getManganTypeName(manganLevel)
    return {
      han, fu: 0, basePoint: 0,
      totalPoint: getManganPoint(manganLevel, isParent),
      isParent, isTsumo, isMangan: true, manganType
    }
  }

  const basePoint = fu * Math.pow(2, han + 2)
  let totalPoint: number

  if (isTsumo) {
    totalPoint = Math.ceil(basePoint * (isParent ? 4 : 2))
  } else {
    totalPoint = Math.ceil(basePoint * (isParent ? 6 : 4))
  }

  return {
    han, fu, basePoint: Math.ceil(basePoint), totalPoint,
    isParent, isTsumo, isMangan: false, manganType: ''
  }
}

function getManganLevel(han: number): ManganLevel | null {
  if (han >= 13) return 'yakuman'
  if (han >= 11) return 'sanbaiman'
  if (han >= 8) return 'baiman'
  if (han >= 6) return 'haneman'
  if (han >= 5) return 'mangan'
  return null
}

function getManganTypeName(level: ManganLevel): string {
  const names: Record<ManganLevel, string> = {
    mangan: '满贯', haneman: '跳满', baiman: '倍满', sanbaiman: '三倍满', yakuman: '役满'
  }
  return names[level]
}

function getManganPoint(level: ManganLevel, isParent: boolean): number {
  const points: Record<ManganLevel, [number, number]> = {
    mangan: [12000, 8000], haneman: [18000, 12000], baiman: [24000, 16000],
    sanbaiman: [36000, 24000], yakuman: [48000, 32000]
  }
  return isParent ? points[level][0] : points[level][1]
}
