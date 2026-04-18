export type TileType = 'man' | 'pin' | 'sou' | 'honor';

export interface Tile {
  id: string;
  type: TileType;
  value: number | string;
  name_ja: string;
  name_zh: string;
}

export const TILES: Tile[] = [
  // 万子 (1-9m)
  { id: '1m', type: 'man', value: 1, name_ja: '一万', name_zh: '一万' },
  { id: '2m', type: 'man', value: 2, name_ja: '二万', name_zh: '二万' },
  { id: '3m', type: 'man', value: 3, name_ja: '三万', name_zh: '三万' },
  { id: '4m', type: 'man', value: 4, name_ja: '四万', name_zh: '四万' },
  { id: '5m', type: 'man', value: 5, name_ja: '五万', name_zh: '五万' },
  { id: '5mr', type: 'man', value: 5, name_ja: '赤五万', name_zh: '赤五万' },
  { id: '6m', type: 'man', value: 6, name_ja: '六万', name_zh: '六万' },
  { id: '7m', type: 'man', value: 7, name_ja: '七万', name_zh: '七万' },
  { id: '8m', type: 'man', value: 8, name_ja: '八万', name_zh: '八万' },
  { id: '9m', type: 'man', value: 9, name_ja: '九万', name_zh: '九万' },
  // 筒子 (1-9p)
  { id: '1p', type: 'pin', value: 1, name_ja: '一筒', name_zh: '一筒' },
  { id: '2p', type: 'pin', value: 2, name_ja: '二筒', name_zh: '二筒' },
  { id: '3p', type: 'pin', value: 3, name_ja: '三筒', name_zh: '三筒' },
  { id: '4p', type: 'pin', value: 4, name_ja: '四筒', name_zh: '四筒' },
  { id: '5p', type: 'pin', value: 5, name_ja: '五筒', name_zh: '五筒' },
  { id: '5pr', type: 'pin', value: 5, name_ja: '赤五筒', name_zh: '赤五筒' },
  { id: '6p', type: 'pin', value: 6, name_ja: '六筒', name_zh: '六筒' },
  { id: '7p', type: 'pin', value: 7, name_ja: '七筒', name_zh: '七筒' },
  { id: '8p', type: 'pin', value: 8, name_ja: '八筒', name_zh: '八筒' },
  { id: '9p', type: 'pin', value: 9, name_ja: '九筒', name_zh: '九筒' },
  // 索子 (1-9s)
  { id: '1s', type: 'sou', value: 1, name_ja: '一索', name_zh: '一索' },
  { id: '2s', type: 'sou', value: 2, name_ja: '二索', name_zh: '二索' },
  { id: '3s', type: 'sou', value: 3, name_ja: '三索', name_zh: '三索' },
  { id: '4s', type: 'sou', value: 4, name_ja: '四索', name_zh: '四索' },
  { id: '5s', type: 'sou', value: 5, name_ja: '五索', name_zh: '五索' },
  { id: '5sr', type: 'sou', value: 5, name_ja: '赤五索', name_zh: '赤五索' },
  { id: '6s', type: 'sou', value: 6, name_ja: '六索', name_zh: '六索' },
  { id: '7s', type: 'sou', value: 7, name_ja: '七索', name_zh: '七索' },
  { id: '8s', type: 'sou', value: 8, name_ja: '八索', name_zh: '八索' },
  { id: '9s', type: 'sou', value: 9, name_ja: '九索', name_zh: '九索' },
  // 字牌
  { id: 'ES', type: 'honor', value: 'ES', name_ja: '東', name_zh: '东风' },
  { id: 'SS', type: 'honor', value: 'SS', name_ja: '南', name_zh: '南风' },
  { id: 'WS', type: 'honor', value: 'WS', name_ja: '西', name_zh: '西风' },
  { id: 'NS', type: 'honor', value: 'NS', name_ja: '北', name_zh: '北风' },
  { id: 'EW', type: 'honor', value: 'EW', name_ja: '白', name_zh: '白板' },
  { id: 'FW', type: 'honor', value: 'FW', name_ja: '发', name_zh: '发财' },
  { id: 'CW', type: 'honor', value: 'CW', name_ja: '中', name_zh: '中' },
];

// 赤宝牌 ID 列表
export const AKA_DORA_IDS = ['5mr', '5pr', '5sr'];

export const TILE_BY_ID = new Map(TILES.map(t => [t.id, t]));

export function getTile(id: string): Tile | undefined {
  return TILE_BY_ID.get(id);
}
