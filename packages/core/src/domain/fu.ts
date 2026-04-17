import type { Tile } from '../data/tiles';
import { TILES } from '../data/tiles';

export interface FuResult {
  total: number;
  breakdown: string[];
  isMenzen: boolean;
  isTsumo: boolean;
  isPinfu: boolean;
  isYakuhai: boolean;
  isRyanpeikou: boolean;
}

function countTiles(tiles: Tile[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const tile of tiles) {
    counts.set(tile.id, (counts.get(tile.id) || 0) + 1);
  }
  return counts;
}

function findPair(counts: Map<string, number>): string | null {
  for (const [id, count] of counts) {
    if (count >= 2) return id;
  }
  return null;
}

function findMelds(tiles: Tile[], counts: Map<string, number>): { type: 'pon' | 'chi' | 'kan' | null; tiles: Tile[] }[] {
  const result: { type: 'pon' | 'chi' | 'kan' | null; tiles: Tile[] }[] = [];
  const remaining = new Map(counts);

  // Find quads (kan)
  for (const [id, count] of remaining) {
    if (count >= 4) {
      const tile = TILES.find(t => t.id === id);
      if (tile) {
        result.push({ type: 'kan', tiles: [tile, tile, tile, tile] });
        remaining.set(id, count - 4);
        if (remaining.get(id) === 0) remaining.delete(id);
      }
    }
  }

  // Find triplets (pon)
  for (const [id, count] of remaining) {
    if (count >= 3) {
      const tile = TILES.find(t => t.id === id);
      if (tile && tile.type !== 'honor') {
        result.push({ type: 'pon', tiles: [tile, tile, tile] });
        remaining.set(id, count - 3);
        if (remaining.get(id) === 0) remaining.delete(id);
      }
    }
  }

  // Find sequences (chi) - only for numbered tiles
  const manTiles = TILES.filter(t => t.type === 'man');
  const pinTiles = TILES.filter(t => t.type === 'pin');
  const souTiles = TILES.filter(t => t.type === 'sou');

  for (const tileGroup of [manTiles, pinTiles, souTiles]) {
    for (let i = 0; i < tileGroup.length - 2; i++) {
      const t1 = tileGroup[i];
      const t2 = tileGroup[i + 1];
      const t3 = tileGroup[i + 2];
      const c1 = remaining.get(t1.id) || 0;
      const c2 = remaining.get(t2.id) || 0;
      const c3 = remaining.get(t3.id) || 0;

      if (c1 > 0 && c2 > 0 && c3 > 0) {
        result.push({ type: 'chi', tiles: [t1, t2, t3] });
        remaining.set(t1.id, c1 - 1);
        remaining.set(t2.id, c2 - 1);
        remaining.set(t3.id, c3 - 1);
        if (remaining.get(t1.id) === 0) remaining.delete(t1.id);
        if (remaining.get(t2.id) === 0) remaining.delete(t2.id);
        if (remaining.get(t3.id) === 0) remaining.delete(t3.id);
        break;
      }
    }
  }

  return result;
}

export function calculateFu(tiles: Tile[], isTsumo: boolean, wind?: string): FuResult {
  const counts = countTiles(tiles);
  const breakdown: string[] = [];
  let fu = 0;

  // Find pair
  const pair = findPair(counts);
  if (!pair) {
    return { total: 0, breakdown: ['无雀头'], isMenzen: true, isTsumo, isPinfu: false, isYakuhai: false, isRyanpeikou: false };
  }

  const pairTile = TILES.find(t => t.id === pair);
  const isYakuhaiPair = pairTile?.type === 'honor' && (pair === wind || ['EW', 'FW', 'CW'].includes(pair));

  // Base fu
  fu = 20;
  breakdown.push('基本符: 20');

  // Count melds
  const melds = findMelds(tiles, counts);
  const ponCount = melds.filter(m => m.type === 'pon').length;
  const kanCount = melds.filter(m => m.type === 'kan').length;
  const chiCount = melds.filter(m => m.type === 'chi').length;

  // Calculate fu from melds
  for (const meld of melds) {
    if (meld.type === 'pon' || meld.type === 'kan') {
      const tile = meld.tiles[0];
      let meldFu = 0;

      if (tile.type === 'honor') {
        meldFu = meld.type === 'kan' ? 16 : 4;
      } else if (tile.value === 1 || tile.value === 9) {
        meldFu = meld.type === 'kan' ? 16 : 4;
      } else {
        meldFu = meld.type === 'kan' ? 8 : 2;
      }

      fu += meldFu;
      breakdown.push(`${tile.name_zh}${meld.type === 'kan' ? '杠' : '刻'}: +${meldFu}`);
    }
  }

  // Pair fu
  if (isYakuhaiPair) {
    fu += 2;
    breakdown.push(`役牌雀头: +2`);
  }

  // Wait shape fu (for tsumo pinfu)
  const isMenzen = ponCount + kanCount === 0 && chiCount === 4;
  const isPinfu = isMenzen && !isYakuhaiPair && melds.every(m => m.type === 'chi');

  // Tsumo fu
  if (isTsumo) {
    if (isPinfu) {
      fu = 20;
      breakdown.push('平和自摸: 20');
    } else {
      fu += 2;
      breakdown.push('自摸: +2');
    }
  }

  // Round up to nearest 10
  const roundedFu = Math.ceil(fu / 10) * 10;
  if (roundedFu !== fu) {
    breakdown.push(`向上取整: ${fu} → ${roundedFu}`);
  }

  return {
    total: roundedFu,
    breakdown,
    isMenzen,
    isTsumo,
    isPinfu,
    isYakuhai: isYakuhaiPair,
    isRyanpeikou: false
  };
}

export function calculateBaseScore(baseHan: number, fu: number, isParent: boolean): { mangan: boolean; basicPoints: number; totalPoints: number } {
  // Handle mangan (满贯) - 5 han or 4 han 40 fu
  if (baseHan >= 5 || (baseHan === 4 && fu >= 40)) {
    const manganPoints = isParent ? 12000 : 8000;
    return { mangan: true, basicPoints: manganPoints, totalPoints: manganPoints };
  }

  // Handle haneman (倍满) - 6-7 han
  if (baseHan >= 6 && baseHan <= 7) {
    const hanemanPoints = isParent ? 18000 : 12000;
    return { mangan: false, basicPoints: hanemanPoints, totalPoints: hanemanPoints };
  }

  // Handle baiman (倍满) - 8-10 han
  if (baseHan >= 8 && baseHan <= 10) {
    const baimanPoints = isParent ? 24000 : 16000;
    return { mangan: false, basicPoints: baimanPoints, totalPoints: baimanPoints };
  }

  // Handle sanbaihan (三倍满) - 11-12 han
  if (baseHan >= 11 && baseHan <= 12) {
    const sanbaihanPoints = isParent ? 36000 : 24000;
    return { mangan: false, basicPoints: sanbaihanPoints, totalPoints: sanbaihanPoints };
  }

  // Handle yakuman (役满) - 13+ han
  if (baseHan >= 13) {
    const yakumanPoints = isParent ? 48000 : 32000;
    return { mangan: false, basicPoints: yakumanPoints, totalPoints: yakumanPoints };
  }

  // Standard calculation
  const basicPoints = fu * Math.pow(2, baseHan + 2);
  const totalPoints = isParent ? basicPoints * 1.5 : basicPoints;

  return { mangan: false, basicPoints, totalPoints: Math.ceil(totalPoints) };
}
