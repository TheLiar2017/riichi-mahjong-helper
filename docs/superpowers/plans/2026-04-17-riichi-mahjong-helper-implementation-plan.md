# 立直麻将助手 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个日式和风的Web应用，提供规则查询、役种详解、符数点数计算功能。核心逻辑与UI分离，支持跨平台复用。

**Architecture:** 
- `packages/core`: 纯TypeScript核心逻辑（牌数据、役种、符数计算、点数计算）
- `packages/web`: Vue 3 + Vite + TypeScript，前端展示层
- 核心逻辑与UI完全分离，`core`包可独立测试和跨平台复用

**Tech Stack:** Vue 3 + Vite + TypeScript + Vue Router + 日式和风CSS

---

## 文件结构

```
riichi-mahjong-helper/
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   ├── data/
│   │   │   │   ├── tiles.ts        # 34种牌定义
│   │   │   │   ├── yaku.ts         # 40+役种数据
│   │   │   │   └── rules.ts        # 规则数据
│   │   │   ├── domain/
│   │   │   │   ├── fu.ts           # 符数计算逻辑
│   │   │   │   └── score.ts        # 点数计算逻辑
│   │   │   └── index.ts            # 统一导出
│   │   └── package.json
│   └── web/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Tile.vue        # 单张麻将牌
│       │   │   ├── TileSelector.vue # 34牌选择器
│       │   │   ├── HandDisplay.vue  # 手牌展示
│       │   │   └── YakuCard.vue     # 役种卡片
│       │   ├── views/
│       │   │   ├── Home.vue        # 首页
│       │   │   ├── Rules.vue       # 规则页
│       │   │   ├── YakuList.vue     # 役种列表
│       │   │   └── Calculator.vue   # 计算器
│       │   ├── styles/
│       │   │   └── theme.css       # 日式和风主题
│       │   ├── router/
│       │   │   └── index.ts        # 路由配置
│       │   ├── App.vue
│       │   └── main.ts
│       ├── index.html
│       └── package.json
└── vite.config.ts
```

---

## Phase 1: 项目脚手架

### Task 1: 创建 packages/core 基础结构

**Files:**
- Create: `packages/core/package.json`
- Create: `packages/core/src/index.ts`

- [ ] **Step 1: 创建 packages/core/package.json**

```json
{
  "name": "@riichi-mahjong/core",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

- [ ] **Step 2: 创建 packages/core/src/index.ts**

```typescript
export * from './data/tiles';
export * from './data/yaku';
export * from './data/rules';
export * from './domain/fu';
export * from './domain/score';
```

- [ ] **Step 3: Commit**

```bash
git add packages/core/package.json packages/core/src/index.ts
git commit -m "feat(core): 初始化 core 包基础结构"
```

---

### Task 2: 创建牌数据 (tiles.ts)

**Files:**
- Create: `packages/core/src/data/tiles.ts`

- [ ] **Step 1: 创建 packages/core/src/data/tiles.ts**

```typescript
export type TileType = 'man' | 'pin' | 'sou' | 'honor';

export interface Tile {
  id: string;           // 如 "1m", "5p", "ES"
  type: TileType;       // 万/筒/索/字
  value: number | string;
  name_ja: string;      // 如 "一万"
  name_zh: string;
}

export const TILES: Tile[] = [
  // 万子 (1-9m)
  { id: '1m', type: 'man', value: 1, name_ja: '一万', name_zh: '一万' },
  { id: '2m', type: 'man', value: 2, name_ja: '二万', name_zh: '二万' },
  { id: '3m', type: 'man', value: 3, name_ja: '三万', name_zh: '三万' },
  { id: '4m', type: 'man', value: 4, name_ja: '四万', name_zh: '四万' },
  { id: '5m', type: 'man', value: 5, name_ja: '五万', name_zh: '五万' },
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

export const TILE_BY_ID = new Map(TILES.map(t => [t.id, t]));

export function getTile(id: string): Tile | undefined {
  return TILE_BY_ID.get(id);
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/core/src/data/tiles.ts
git commit -m "feat(core): 添加34种牌数据定义"
```

---

### Task 3: 创建役种数据 (yaku.ts)

**Files:**
- Create: `packages/core/src/data/yaku.ts`

- [ ] **Step 1: 创建 packages/core/src/data/yaku.ts**

```typescript
export interface HandExample {
  tiles: string[];      // 牌面ID数组
  explanation: string;
}

export interface Yaku {
  id: string;
  name_ja: string;
  name_zh: string;
  han: number;          // 番数
  han_locked?: boolean;  // 是否为役满
  description: string;  // 组成原理
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
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','5m','5m','6m','7m','8m','9m','EW','EW'], explanation: '门前清听牌型' }
    ],
    special_rules: '立直后不可更改手牌，只能自摸和牌',
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
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','5m','5m','6m','7m','8m','9m','EW','EW'], explanation: '立直后一巡内自摸' }
    ],
    special_rules: '立直宣言后，除非有人荣和或吃碰杠，否则一巡内自摸可触发',
    related_yaku: ['riichi'],
    common_pitfalls: '立直后若有人吃碰杠，一発失效'
  },
  {
    id: 'tsumo',
    name_ja: '門前清自摸和',
    name_zh: '自摸',
    han: 1,
    description: '非门前状态下自摸和牌',
    examples: [
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','5m','5m','6m','7m','8m','9m','EW','EW'], explanation: '自摸和牌' }
    ],
    special_rules: '必须门前清状态',
    related_yaku: ['menzen_tsumo'],
    common_pitfalls: '吃过牌后不算'
  },
  {
    id: 'pinfu',
    name_ja: '平和',
    name_zh: '平和',
    han: 1,
    description: '4个顺子+雀头，雀头不是役牌，听牌型为两面听',
    examples: [
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','2p','3p','4p','8p','9p','2p'], explanation: '两边听牌型' }
    ],
    special_rules: '雀头不能是役牌，听牌必须是两面',
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
      { tiles: ['2m','3m','4m','2p','3p','4p','5p','6p','7p','3s','4s','5s','6s','7s','3s'], explanation: '全为中张牌' }
    ],
    special_rules: '允许吃碰杠',
    related_yaku: ['pinfu', 'toitoi'],
    common_pitfalls: '含有1或9或字牌即不算'
  },
  {
    id: 'east',
    name_ja: '東風',
    name_zh: '东风',
    han: 1,
    description: '自风或场风为东时，雀头为东风',
    examples: [
      { tiles: ['ES','ES','1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','2p','3p','4p'], explanation: '东为雀头' }
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
    description: '自风或场风为南时，雀头为南风',
    examples: [
      { tiles: ['SS','SS','1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','2p','3p','4p'], explanation: '南为雀头' }
    ],
    special_rules: '需与自风或场风对应',
    related_yaku: ['east', 'west', 'north'],
    common_pitfalls: '只有自风或场风为南时才计'
  },
  {
    id: 'white',
    name_ja: '白板',
    name_zh: '白板',
    han: 1,
    description: '雀头或面子包含白板',
    examples: [
      { tiles: ['EW','EW','1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','2p','3p','4p'], explanation: '白板为雀头' }
    ],
    special_rules: '白板通常视为普通牌，无特殊效果',
    related_yaku: ['green', 'red'],
    common_pitfalls: '只有在有役时才计算'
  },
  {
    id: 'green',
    name_ja: '緑発',
    name_zh: '绿发',
    han: 1,
    description: '面子包含绿发(發)',
    examples: [
      { tiles: ['FW','FW','1s','2s','3s','4s','5s','6s','2m','3m','4m','1p','2p','3p','4p'], explanation: '绿发为雀头' }
    ],
    special_rules: '通常绿发限定为2s/3s/4s/6s/8s组合',
    related_yaku: ['white', 'red'],
    common_pitfalls: '必须面子中有绿发'
  },
  {
    id: 'red',
    name_ja: '中',
    name_zh: '红中',
    han: 1,
    description: '雀头或面子包含红中',
    examples: [
      { tiles: ['CW','CW','1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','2p','3p','4p'], explanation: '红中为雀头' }
    ],
    special_rules: '红中通常视为普通役牌',
    related_yaku: ['white', 'green'],
    common_pitfalls: '只有在有役时才计算'
  },
  // 两番（2翻）
  {
    id: 'doubleriichi',
    name_ja: '両立直',
    name_zh: '双立直',
    han: 2,
    description: '开天荒地第一巡内立直',
    examples: [
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','5m','5m','6m','7m','8m','9m','EW','EW'], explanation: '第一巡立直' }
    ],
    special_rules: '必须在第一巡摸牌前宣告立直',
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
      { tiles: ['1m','9m','1m','2m','3m','1p','9p','1s','9s','ES','ES','ES','1m','2m','3m'], explanation: '全带幺九' }
    ],
    special_rules: '允许吃碰杠',
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
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','1p','1p','1p','2p','3p','4p'], explanation: '万子一气通贯' }
    ],
    special_rules: '必须同一花色',
    related_yaku: ['pinfu', 'sanshoku'],
    common_pitfalls: '三色不通贯'
  },
  {
    id: 'sanshoku_dojun',
    name_ja: '三色同順',
    name_zh: '三色同顺',
    han: 2,
    description: '万/筒/索三种数牌形成相同的顺子',
    examples: [
      { tiles: ['1m','2m','3m','1p','2p','3p','1s','2s','3s','5m','5m','5m','EW','EW','EW'], explanation: '123三色同顺' }
    ],
    special_rules: '允许吃碰杠',
    related_yaku: ['ittsu', 'sanshoku_doko'],
    common_pitfalls: '必须同一数字顺序'
  },
  {
    id: 'toitoi',
    name_ja: '対对和',
    name_zh: '碰碰和',
    han: 2,
    description: '全部面子都是刻子或杠子',
    examples: [
      { tiles: ['1m','1m','1m','5p','5p','5p','9s','9s','9s','EW','EW','EW','2m','3m','4m'], explanation: '全刻子型' }
    ],
    special_rules: '允许明刻/暗刻',
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
      { tiles: ['1m','1m','1m','5p','5p','5p','9s','9s','9s','2m','3m','4m','EW','EW','EW'], explanation: '三个暗刻' }
    ],
    special_rules: '暗杠也算暗刻',
    related_yaku: ['toitoi', 's Annotations: ['danari'],
    common_pitfalls: '必须三个独立暗刻'
  },
  {
    id: 'sannren',
    name_ja: '三連刻',
    name_zh: '三连刻',
    han: 2,
    description: '同一个数牌连续三个刻子',
    examples: [
      { tiles: ['1m','1m','1m','2m','2m','2m','3m','3m','3m','5p','5p','5p','EW','EW','EW'], explanation: '123三连刻' }
    ],
    special_rules: '必须是同一数牌的连续刻子',
    related_yaku: ['toitoi', 'sananko'],
    common_pitfalls: '数字必须连续'
  },
  {
    id: 'shosangen',
    name_ja: '小三元',
    name_zh: '小三元',
    han: 2,
    description: '三元牌两种为刻子，一种为雀头',
    examples: [
      { tiles: ['EW','EW','EW','FW','FW','FW','CW','CW','1m','2m','3m','4m','5m','6m','7m'], explanation: '白发了为刻子，中为雀头' }
    ],
    special_rules: '小三元为两番役满',
    related_yaku: ['daisangen'],
    common_pitfalls: '必须两种刻子一种雀头'
  },
  {
    id: 'honitsu',
    name_ja: '混一色',
    name_zh: '混一色',
    han: 2,
    description: '只有一种数牌加字牌组成',
    examples: [
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','ES','ES','1m','2m','3m','1m'], explanation: '万子混一色' }
    ],
    special_rules: '允许吃碰杠',
    related_yaku: ['chinitsu', 'toitoi'],
    common_pitfalls: '不能有两种数牌'
  },
  // 三番（3翻）
  {
    id: 'junchan',
    name_ja: '純全帯么九',
    name_zh: '纯全带幺',
    han: 3,
    description: '所有面子和雀头都包含幺九牌，不含字牌',
    examples: [
      { tiles: ['1m','9m','1m','2m','3m','1p','9p','1s','9s','1m','1m','1m','2m','3m','4m'], explanation: '纯全带幺' }
    ],
    special_rules: '不可含字牌',
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
      { tiles: ['1m','9m','1m','2m','3m','1p','9p','1s','9s','ES','ES','ES','1m','2m','3m'], explanation: '混全带幺' }
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
      { tiles: ['1m','2m','3m','1m','2m','3m','7m','8m','9m','7m','8m','9m','EW','EW','EW'], explanation: '两个一三顺子+两个七八九顺子' }
    ],
    special_rules: '必须门前清',
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
      { tiles: ['1m','2m','3m','4m','5m','6m','7m','8m','9m','1m','2m','3m','4m','5m','6m'], explanation: '万子清一色' }
    ],
    special_rules: '允许吃碰杠',
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
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','5m','5m','6m','7m','8m','9m','EW','EW'], explanation: '配牌即和' }
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
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','5m','5m','6m','7m','8m','9m','EW','EW'], explanation: '第一巡自摸' }
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
      { tiles: ['EW','EW','EW','FW','FW','FW','CW','CW','CW','1m','2m','3m','4m','5m','6m'], explanation: '白发中全为刻子' }
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
      { tiles: ['1m','1m','1m','5p','5p','5p','9s','9s','9s','2m','3m','4m','EW','EW','EW'], explanation: '四个暗刻单骑听' }
    ],
    special_rules: '必须全部暗刻且单骑听牌',
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
      { tiles: ['1m','1m','1m','5p','5p','5p','9s','9s','9s','2m','3m','4m','EW','EW','CW'], explanation: '单骑自摸和' }
    ],
    special_rules: '必须单骑自摸',
    related_yaku: ['suanko'],
    common_pitfalls: '荣和只算普通四暗刻'
  },
  {
    id: 'daisushi',
    name_ja: '大四喜',
    name_zh: '大四喜',
    han: 13,
    han_locked: true,
    description: '四种字牌全部为刻子',
    examples: [
      { tiles: ['ES','ES','ES','SS','SS','SS','WS','WS','WS','NS','NS','NS','1m','2m','3m'], explanation: '东南西北全为刻子' }
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
      { tiles: ['ES','ES','ES','SS','SS','SS','WS','WS','WS','NS','NS','1m','2m','3m','4m'], explanation: '东南西北中小四喜' }
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
      { tiles: ['ES','ES','ES','SS','SS','SS','WS','WS','WS','NS','NS','NS','EW','EW','EW'], explanation: '字一色' }
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
      { tiles: ['2s','2s','2s','3s','3s','3s','4s','4s','4s','6s','6s','6s','8s','8s','8s'], explanation: '绿一色' }
    ],
    special_rules: '限定使用绿发系牌',
    related_yaku: ['honitsu', 'chinitsu'],
    common_pitfalls: '含其他牌不算'
  },
  {
    id: 'chinroto',
    name_ja: '清老頭',
    name_zh: '清老頭',
    han: 13,
    han_locked: true,
    description: '全部由老頭（1/9）组成',
    examples: [
      { tiles: ['1m','1m','1m','9m','9m','9m','1s','1s','1s','9s','9s','9s','1p','9p','1p'], explanation: '清老頭' }
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
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','6m','7m','8m','9m','9m','9m','1m','1m'], explanation: '九莲宝灯' }
    ],
    special_rules: '必须门前清',
    related_yaku: ['junsei_chuuren', 'chinitsu'],
    common_pitfalls: '吃过牌后不算'
  },
  {
    id: 'junsei_chuuren',
    name_ja: '純正九連宝燈',
    name_zh: '纯正九莲宝灯',
    han: 13,
    han_locked: true,
    description: '同种数牌1112345678999加该牌本身和牌',
    examples: [
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','6m','7m','8m','9m','9m','9m','1m','1m'], explanation: '纯正九莲宝灯' }
    ],
    special_rules: '纯正为役满',
    related_yaku: ['chuuren_poto', 'chinitsu'],
    common_pitfalls: '必须1112345678999+1'
  },
  {
    id: 'haitei',
    name_ja: '海底摸月',
    name_zh: '海底捞月',
    han: 1,
    description: '牌山最后一牌自摸和牌',
    examples: [
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','5m','5m','6m','7m','8m','9m','EW','EW'], explanation: '海底自摸' }
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
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','5m','5m','6m','7m','8m','9m','EW','EW'], explanation: '河底荣和' }
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
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','5m','5m','6m','7m','8m','9m','EW','EW'], explanation: '岭上开花' }
    ],
    special_rules: '杠后摸岭上牌',
    related_yaku: ['kan']);
    common_pitfalls: '必须杠后'
  },
  {
    id: 'kan',
    name_ja: '杠',
    name_zh: '杠',
    han: 1,
    description: '明杠或暗杠',
    examples: [
      { tiles: ['1m','1m','1m','1m','2m','3m','4m','5m','5m','5m','6m','7m','8m','9m','EW'], explanation: '明杠' }
    ],
    special_rules: '任何杠都算',
    related_yaku: ['rinkou'],
    common_pitfalls: '岭上开花需配合'
  },
  {
    id: 'nuki',
    name_ja: '抜き',
    name_zh: '拔',
    han: 1,
    description: '吃碰杠后拔出一牌',
    examples: [
      { tiles: ['1m','1m','1m','2m','3m','4m','5m','5m','5m','6m','7m','8m','9m','EW','EW'], explanation: '拔牌' }
    ],
    special_rules: '特殊规则',
    related_yaku: [],
    common_pitfalls: '部分规则不计'
  },
  {
    id: 'sha',
    name_ja: '食',
    name_zh: '食',
    han: 0,
    description: '吃牌',
    examples: [
      { tiles: ['1m','2m','3m'], explanation: '吃牌' }
    ],
    special_rules: '吃牌后无法立直',
    related_yaku: [],
    common_pitfalls: '门前清失效'
  },
  {
    id: 'pon',
    name_ja: '碰',
    name_zh: '碰',
    han: 0,
    description: '碰牌',
    examples: [
      { tiles: ['1m','1m','1m'], explanation: '碰牌' }
    ],
    special_rules: '碰后无法立直',
    related_yaku: [],
    common_pitfalls: '门前清失效'
  },
  {
    id: 'minkan',
    name_ja: '明杠',
    name_zh: '明杠',
    han: 0,
    description: '明杠',
    examples: [
      { tiles: ['1m','1m','1m','1m'], explanation: '明杠' }
    ],
    special_rules: '杠后摸岭上牌',
    related_yaku: ['ankan'],
    common_pitfalls: '岭上开花需配合'
  },
  {
    id: 'ankan',
    name_ja: '暗杠',
    name_zh: '暗杠',
    han: 0,
    description: '暗杠',
    examples: [
      { tiles: ['1m','1m','1m','1m'], explanation: '暗杠' }
    ],
    special_rules: '门前清可立直',
    related_yaku: ['minkan'],
    common_pitfalls: '门前清可保留'
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
```

- [ ] **Step 2: Commit**

```bash
git add packages/core/src/data/yaku.ts
git commit -m "feat(core): 添加役种数据"
```

---

### Task 4: 创建规则数据 (rules.ts)

**Files:**
- Create: `packages/core/src/data/rules.ts`

- [ ] **Step 1: 创建 packages/core/src/data/rules.ts**

```typescript
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
    description: '门前清状态下听牌时，可宣告立直，支付1000点供托。立直后不可更改手牌，只能自摸和牌或荣和。立直后一巡内自摸可得一発。',
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
    name_ja: '一発',
    name_zh: '一发自摸',
    description: '立直宣言后，在一巡之内自摸和牌，可得一発。立直宣言后若有人吃碰杠，一発失效。',
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
```

- [ ] **Step 2: Commit**

```bash
git add packages/core/src/data/rules.ts
git commit -m "feat(core): 添加规则数据"
```

---

### Task 5: 创建符数计算逻辑 (fu.ts)

**Files:**
- Create: `packages/core/src/domain/fu.ts`

- [ ] **Step 1: 创建 packages/core/src/domain/fu.ts**

```typescript
import type { Tile } from '../data/tiles';
import { TILES } from '../data/tiles';

export interface FuResult {
  total: number;
  breakdown: string[];
  isMenzen: boolean;     // 是否门前清
  isTsumo: boolean;       // 是否自摸
  isPinfu: boolean;      // 是否平和
  isYakuhai: boolean;    // 是否役牌雀头
  isRyanpeikou: boolean;  // 是否两杯口
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

export function calculateScore(baseHan: number, fu: number, isParent: boolean): { mangan: boolean; basicPoints: number; totalPoints: number } {
  // Handle mangan (满贯) - 5 han or 4 han 40 fu
  if (baseHan >= 5 || (baseHan === 4 && fu >= 40)) {
    const manganPoints = isParent ? 12000 : 8000;
    return { mangan: true, basicPoints: manganPoints, totalPoints: manganPoints };
  }
  
  // Handle haneman (役满) - 6-7 han
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
```

- [ ] **Step 2: Commit**

```bash
git add packages/core/src/domain/fu.ts
git commit -m "feat(core): 添加符数计算逻辑"
```

---

### Task 6: 创建点数计算逻辑 (score.ts)

**Files:**
- Create: `packages/core/src/domain/score.ts`

- [ ] **Step 1: 创建 packages/core/src/domain/score.ts**

```typescript
import { calculateScore as calcScore, type FuResult } from './fu';

export interface ScoreResult {
  han: number;
  fu: number;
  mangan: boolean;
  basicPoints: number;
  parentPoints: number;   // 亲家点数
  childPoints: number;    // 子家点数
  riichiBet: number;       // 立直棒
  breakdown: string[];
}

export function calculateScore(
  fuResult: FuResult,
  yakuHan: number,
  isParent: boolean,
  riichiBets: number = 0
): ScoreResult {
  const breakdown: string[] = [];
  const { total: fu, isTsumo, isPinfu, breakdown: fuBreakdown } = fuResult;
  
  let han = yakuHan;
  
  // Add tsumo bonus for menzen tsumo
  if (isTsumo && fuResult.isMenzen) {
    han += 1;
    breakdown.push('门清自摸: +1番');
  }
  
  // Add pinfu bonus
  if (isPinfu && !isTsumo) {
    han += 1;
    breakdown.push('平和: +1番');
  }
  
  breakdown.push(...fuBreakdown);
  breakdown.push(`番数: ${han}番`);
  breakdown.push(`符数: ${fu}符`);
  
  const { mangan, basicPoints, totalPoints } = calcScore(han, fu, isParent);
  
  if (mangan) {
    breakdown.push('帽贯: 已达成');
  }
  
  breakdown.push(`基本点: ${basicPoints}`);
  
  // Calculate parent and child points
  const parentPoints = isParent ? totalPoints : Math.ceil(totalPoints * 2 / 3);
  const childPoints = isParent ? Math.ceil(totalPoints * 2 / 3) : totalPoints;
  
  breakdown.push(`亲家支付: ${parentPoints}`);
  breakdown.push(`子家支付: ${childPoints}`);
  
  // Add riichi bets
  if (riichiBets > 0) {
    const riichiPoints = riichiBets * 1000;
    breakdown.push(`立直棒: +${riichiPoints}`);
  }
  
  return {
    han,
    fu,
    mangan,
    basicPoints,
    parentPoints: parentPoints + riichiBets * 1000,
    childPoints: childPoints + riichiBets * 1000,
    riichiBet: riichiBets,
    breakdown
  };
}

export function formatScore(points: number): string {
  if (points >= 10000) {
    return `${Math.floor(points / 10000)}万${points % 10000 > 0 ? ` ${points % 10000}` : ''}`;
  }
  return `${points}`;
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/core/src/domain/score.ts
git commit -m "feat(core): 添加点数计算逻辑"
```

---

### Task 7: 创建 packages/web Vue3 项目

**Files:**
- Create: `packages/web/package.json`
- Create: `packages/web/index.html`
- Create: `packages/web/vite.config.ts`
- Create: `packages/web/tsconfig.json`
- Create: `packages/web/tsconfig.app.json`
- Create: `packages/web/src/main.ts`
- Create: `packages/web/src/App.vue`
- Create: `packages/web/src/router/index.ts`

- [ ] **Step 1: 创建 packages/web/package.json**

```json
{
  "name": "@riichi-mahjong/web",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.4.0",
    "vite": "^5.4.0",
    "vue-tsc": "^2.0.0"
  }
}
```

- [ ] **Step 2: 创建 packages/web/index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>立直麻将助手</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

- [ ] **Step 3: 创建 packages/web/vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@core': resolve(__dirname, '../core/src')
    }
  },
  server: {
    port: 5173
  }
})
```

- [ ] **Step 4: 创建 packages/web/tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ]
}
```

- [ ] **Step 5: 创建 packages/web/tsconfig.app.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"],
      "@core/*": ["../core/src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

- [ ] **Step 6: 创建 packages/web/src/main.ts**

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/theme.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

- [ ] **Step 7: 创建 packages/web/src/App.vue**

```vue
<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">立直麻将助手</h1>
      <nav class="app-nav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/rules">规则</RouterLink>
        <RouterLink to="/yaku">役种</RouterLink>
        <RouterLink to="/calculator">计算器</RouterLink>
      </nav>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-text);
}

.app-header {
  background-color: var(--color-card);
  padding: 1rem 2rem;
  border-bottom: 2px solid var(--color-accent);
}

.app-title {
  font-family: 'Noto Serif SC', serif;
  color: var(--color-accent);
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
}

.app-nav {
  display: flex;
  gap: 1.5rem;
}

.app-nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  padding: 0.3rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.app-nav a:hover,
.app-nav a.router-link-active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.app-main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
```

- [ ] **Step 8: 创建 packages/web/src/router/index.ts**

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/rules',
      name: 'rules',
      component: () => import('../views/Rules.vue')
    },
    {
      path: '/yaku',
      name: 'yaku',
      component: () => import('../views/YakuList.vue')
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: () => import('../views/Calculator.vue')
    }
  ]
})

export default router
```

- [ ] **Step 9: Commit**

```bash
git add packages/web/package.json packages/web/index.html packages/web/vite.config.ts packages/web/tsconfig.json packages/web/tsconfig.app.json packages/web/src/main.ts packages/web/src/App.vue packages/web/src/router/index.ts
git commit -m "feat(web): 初始化 Vue3 + Vite + TypeScript 项目"
```

---

### Task 8: 创建日式和风主题样式

**Files:**
- Create: `packages/web/src/styles/theme.css`

- [ ] **Step 1: 创建 packages/web/src/styles/theme.css**

```css
:root {
  /* 主色 */
  --color-bg: #1a2a3a;
  --color-card: #2d4a5e;
  --color-accent: #d4a84b;
  --color-text: #f5f0e8;
  --color-text-secondary: #a89f8f;
  --color-danger: #c45c5c;
  
  /* 麻将牌色 */
  --tile-man: #2d5a4a;
  --tile-pin: #4a2d5a;
  --tile-sou: #5a4a2d;
  --tile-honor: #3a4a5a;
  
  /* 字体 */
  --font-serif: 'Noto Serif SC', serif;
  --font-sans: 'Noto Sans SC', sans-serif;
  
  /* 间距 */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  /* 阴影 */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}

/* 背景纹理 */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(ellipse at 50% 0%, rgba(45, 74, 94, 0.3) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: -1;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
  color: var(--color-accent);
  font-weight: 700;
}

h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.25rem; }

a {
  color: var(--color-accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* 卡片样式 */
.card {
  background-color: var(--color-card);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(212, 168, 75, 0.1);
}

.card:hover {
  border-color: rgba(212, 168, 75, 0.3);
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.btn-primary {
  background-color: var(--color-accent);
  color: var(--color-bg);
}

.btn-primary:hover {
  background-color: #e5b95c;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: transparent;
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.btn-secondary:hover {
  background-color: rgba(212, 168, 75, 0.1);
}

/* 筛选标签 */
.filter-tag {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  background-color: rgba(212, 168, 75, 0.15);
  color: var(--color-accent);
  border: 1px solid rgba(212, 168, 75, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tag:hover,
.filter-tag.active {
  background-color: var(--color-accent);
  color: var(--color-bg);
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--color-card);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 168, 75, 0.3);
}

/* 响应式 */
@media (max-width: 768px) {
  .app-header {
    padding: 1rem;
  }
  
  .app-main {
    padding: 1rem;
  }
  
  .app-title {
    font-size: 1.5rem;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/web/src/styles/theme.css
git commit -m "feat(web): 添加日式和风主题样式"
```

---

## Phase 2: 页面实现

### Task 9: 创建首页 (Home.vue)

**Files:**
- Create: `packages/web/src/views/Home.vue`

- [ ] **Step 1: 创建 packages/web/src/views/Home.vue**

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'

const features = [
  { to: '/rules', title: '基础规则', desc: '立直麻将核心规则详解', icon: '📖' },
  { to: '/yaku', title: '役种一览', desc: '40+役种图文详解', icon: '🎴' },
  { to: '/calculator', title: '符数计算器', desc: '图形化选牌计算符数', icon: '🧮' },
]
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>欢迎使用立直麻将助手</h1>
      <p class="hero-subtitle">手搓麻将时的贴心帮手</p>
    </section>
    
    <section class="features">
      <RouterLink 
        v-for="feature in features" 
        :key="feature.to" 
        :to="feature.to"
        class="feature-card"
      >
        <span class="feature-icon">{{ feature.icon }}</span>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.desc }}</p>
      </RouterLink>
    </section>
    
    <section class="quick-tips">
      <h2>小贴士</h2>
      <div class="tip-card card">
        <p>🎯 新手建议从「断幺九」和「平和」开始熟悉役种</p>
        <p>💡 符数计算时，记得「自摸+2符」「役牌雀头+2符」</p>
        <p>⚠️ 吃牌后无法立直，但可以食断（断幺九）</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: var(--space-xl) 0;
  border-bottom: 1px solid rgba(212, 168, 75, 0.2);
  margin-bottom: var(--space-xl);
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-sm);
}

.hero-subtitle {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-xl);
  background-color: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.feature-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-4px);
  text-decoration: none;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: var(--space-sm);
  color: var(--color-accent);
}

.feature-card p {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.quick-tips h2 {
  margin-bottom: var(--space-md);
}

.tip-card p {
  margin-bottom: var(--space-sm);
}

.tip-card p:last-child {
  margin-bottom: 0;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add packages/web/src/views/Home.vue
git commit -m "feat(web): 创建首页"
```

---

### Task 10: 创建规则页面 (Rules.vue)

**Files:**
- Create: `packages/web/src/views/Rules.vue`
- Modify: `packages/core/src/index.ts` (更新导出)

- [ ] **Step 1: 创建 packages/web/src/views/Rules.vue**

```vue
<script setup lang="ts">
import { RULES, type Rule } from '@core/data/rules'

const basicRules = RULES.filter(r => r.category === 'basic')
const playRules = RULES.filter(r => r.category === 'play')
const specialRules = RULES.filter(r => r.category === 'special')
</script>

<template>
  <div class="rules-page">
    <h1>基础规则</h1>
    
    <section class="rule-section">
      <h2>核心规则</h2>
      <div class="rules-grid">
        <div v-for="rule in basicRules" :key="rule.id" class="rule-card card">
          <h3>{{ rule.name_zh }}</h3>
          <p class="rule-name-ja">{{ rule.name_ja }}</p>
          <p class="rule-desc">{{ rule.description }}</p>
        </div>
      </div>
    </section>
    
    <section class="rule-section">
      <h2>游戏规则</h2>
      <div class="rules-grid">
        <div v-for="rule in playRules" :key="rule.id" class="rule-card card">
          <h3>{{ rule.name_zh }}</h3>
          <p class="rule-name-ja">{{ rule.name_ja }}</p>
          <p class="rule-desc">{{ rule.description }}</p>
        </div>
      </div>
    </section>
    
    <section class="rule-section">
      <h2>特殊规则</h2>
      <div class="rules-grid">
        <div v-for="rule in specialRules" :key="rule.id" class="rule-card card">
          <h3>{{ rule.name_zh }}</h3>
          <p class="rule-name-ja">{{ rule.name_ja }}</p>
          <p class="rule-desc">{{ rule.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.rules-page {
  max-width: 1000px;
  margin: 0 auto;
}

.rules-page h1 {
  margin-bottom: var(--space-xl);
}

.rule-section {
  margin-bottom: var(--space-xl);
}

.rule-section h2 {
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid rgba(212, 168, 75, 0.3);
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-md);
}

.rule-card {
  padding: var(--space-lg);
}

.rule-card h3 {
  font-size: 1.2rem;
  margin-bottom: var(--space-xs);
}

.rule-name-ja {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
}

.rule-desc {
  font-size: 0.95rem;
  line-height: 1.7;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add packages/web/src/views/Rules.vue
git commit -m "feat(web): 创建规则页面"
```

---

### Task 11: 创建役种列表页面 (YakuList.vue)

**Files:**
- Create: `packages/web/src/views/YakuList.vue`
- Create: `packages/web/src/components/YakuCard.vue`

- [ ] **Step 1: 创建 packages/web/src/components/YakuCard.vue**

```vue
<script setup lang="ts">
import type { Yaku } from '@core/data/yaku'

defineProps<{
  yaku: Yaku
}>()
</script>

<template>
  <div class="yaku-card card">
    <div class="yaku-header">
      <h3 class="yaku-name">{{ yaku.name_zh }}</h3>
      <span class="yaku-name-ja">{{ yaku.name_ja }}</span>
      <span class="yaku-han" :class="{ 'yakuman': yaku.han_locked }">
        {{ yaku.han_locked ? '役满' : `${yaku.han}番` }}
      </span>
    </div>
    
    <p class="yaku-desc">{{ yaku.description }}</p>
    
    <div v-if="yaku.examples.length > 0" class="yaku-example">
      <strong>示例：</strong>
      <span class="example-tiles">{{ yaku.examples[0].tiles.join(' ') }}</span>
      <p class="example-explanation">{{ yaku.examples[0].explanation }}</p>
    </div>
    
    <div v-if="yaku.special_rules" class="yaku-special">
      <strong>特殊规则：</strong>{{ yaku.special_rules }}
    </div>
    
    <div v-if="yaku.common_pitfalls" class="yaku-pitfalls">
      <strong>常见陷阱：</strong>{{ yaku.common_pitfalls }}
    </div>
  </div>
</template>

<style scoped>
.yaku-card {
  padding: var(--space-lg);
}

.yaku-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-bottom: var(--space-sm);
}

.yaku-name {
  font-size: 1.2rem;
  color: var(--color-accent);
}

.yaku-name-ja {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.yaku-han {
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
  background-color: rgba(212, 168, 75, 0.2);
  color: var(--color-accent);
}

.yaku-han.yakuman {
  background-color: var(--color-danger);
  color: white;
}

.yaku-desc {
  margin-bottom: var(--space-sm);
  line-height: 1.6;
}

.yaku-example {
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid rgba(212, 168, 75, 0.1);
  font-size: 0.9rem;
}

.example-tiles {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  margin-left: var(--space-xs);
}

.example-explanation {
  margin-top: 0.3rem;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.yaku-special,
.yaku-pitfalls {
  margin-top: var(--space-sm);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.yaku-pitfalls {
  color: var(--color-danger);
}
</style>
```

- [ ] **Step 2: 创建 packages/web/src/views/YakuList.vue**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { YAKU_LIST, getYakuByCategory, type Yaku } from '@core/data/yaku'
import YakuCard from '../components/YakuCard.vue'

type FilterType = 'all' | 'han1' | 'han2' | 'han3' | 'yakuman'

const filters: { label: string; value: FilterType }[] = [
  { label: '全部', value: 'all' },
  { label: '一番', value: 'han1' },
  { label: '两番', value: 'han2' },
  { label: '三番/六番', value: 'han3' },
  { label: '役满', value: 'yakuman' },
]

const currentFilter = ref<FilterType>('all')

const filteredYaku = computed(() => {
  return getYakuByCategory(currentFilter.value)
})

const stats = computed(() => ({
  total: YAKU_LIST.length,
  han1: YAKU_LIST.filter(y => y.han === 1).length,
  han2: YAKU_LIST.filter(y => y.han === 2).length,
  han3: YAKU_LIST.filter(y => y.han >= 3 && !y.han_locked).length,
  yakuman: YAKU_LIST.filter(y => y.han_locked).length,
}))
</script>

<template>
  <div class="yaku-list-page">
    <h1>役种一览</h1>
    
    <div class="stats card">
      <div class="stat-item">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">全部役种</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.han1 }}</span>
        <span class="stat-label">一番</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.han2 }}</span>
        <span class="stat-label">两番</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.han3 }}</span>
        <span class="stat-label">三番以上</span>
      </div>
      <div class="stat-item">
        <span class="stat-value yakuman">{{ stats.yakuman }}</span>
        <span class="stat-label">役满</span>
      </div>
    </div>
    
    <div class="filters">
      <span 
        v-for="filter in filters" 
        :key="filter.value"
        class="filter-tag"
        :class="{ active: currentFilter === filter.value }"
        @click="currentFilter = filter.value"
      >
        {{ filter.label }}
      </span>
    </div>
    
    <div class="yaku-grid">
      <YakuCard v-for="yaku in filteredYaku" :key="yaku.id" :yaku="yaku" />
    </div>
    
    <div v-if="filteredYaku.length === 0" class="empty-state">
      <p>该分类下暂无役种</p>
    </div>
  </div>
</template>

<style scoped>
.yaku-list-page {
  max-width: 1000px;
  margin: 0 auto;
}

.yaku-list-page h1 {
  margin-bottom: var(--space-lg);
}

.stats {
  display: flex;
  justify-content: space-around;
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-accent);
}

.stat-value.yakuman {
  color: var(--color-danger);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.filters {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-bottom: var(--space-lg);
}

.yaku-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--space-md);
}

.empty-state {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-secondary);
}

@media (max-width: 600px) {
  .yaku-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add packages/web/src/components/YakuCard.vue packages/web/src/views/YakuList.vue
git commit -m "feat(web): 创建役种列表页面"
```

---

## Phase 3: 符数计算器

### Task 12: 创建麻将牌组件 (Tile.vue)

**Files:**
- Create: `packages/web/src/components/Tile.vue`

- [ ] **Step 1: 创建 packages/web/src/components/Tile.vue**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { TileType } from '@core/data/tiles'

const props = defineProps<{
  tileId: string
  selected?: boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: [tileId: string]
}>()

const tileInfo = computed(() => {
  const match = props.tileId.match(/^(\d+)([mps])$/)
  if (match) {
    const [, num, suit] = match
    const suitMap: Record<string, string> = { m: '万', p: '筒', s: '索' }
    return { num, suit: suitMap[suit] || suit, isHonor: false }
  }
  const honorMap: Record<string, { char: string; color: string }> = {
    'ES': { char: '東', color: '#3a8a5a' },
    'SS': { char: '南', color: '#8a3a5a' },
    'WS': { char: '西', color: '#3a5a8a' },
    'NS': { char: '北', color: '#5a3a8a' },
    'EW': { char: '白', color: '#3a8a9a' },
    'FW': { char: '發', color: '#3a8a5a' },
    'CW': { char: '中', color: '#8a3a3a' },
  }
  const info = honorMap[props.tileId]
  if (info) return { num: info.char, suit: '', isHonor: true, color: info.color }
  return { num: props.tileId, suit: '', isHonor: false }
})

const tileClass = computed(() => {
  const suit = props.tileId.match(/[mps]$/)?.[0]
  return [
    'tile',
    `tile-${suit || 'honor'}`,
    `tile-${props.size || 'md'}`,
    { 'tile-selected': props.selected, 'tile-disabled': props.disabled }
  ]
})

const handleClick = () => {
  if (!props.disabled) {
    emit('click', props.tileId)
  }
}
</script>

<template>
  <div :class="tileClass" @click="handleClick">
    <span class="tile-num" :style="tileInfo.isHonor ? { color: tileInfo.color } : {}">
      {{ tileInfo.num }}
    </span>
    <span v-if="!tileInfo.isHonor" class="tile-suit">{{ tileInfo.suit }}</span>
  </div>
</template>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #f8f8f8 0%, #e8e8e8 100%);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border: 2px solid #ccc;
  user-select: none;
}

.tile:hover:not(.tile-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.tile-selected {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-accent), 0 4px 8px rgba(0, 0, 0, 0.4);
}

.tile-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Size variants */
.tile-sm {
  width: 32px;
  height: 44px;
  font-size: 0.9rem;
}

.tile-md {
  width: 40px;
  height: 56px;
  font-size: 1.1rem;
}

.tile-lg {
  width: 48px;
  height: 68px;
  font-size: 1.3rem;
}

/* Suit colors */
.tile-m {
  background: linear-gradient(145deg, #f5fff5 0%, #e0f0e0 100%);
  border-color: #8ab8a8;
}

.tile-p {
  background: linear-gradient(145deg, #fff5f5 0%, #f0e0e0 100%);
  border-color: #d8a8a8;
}

.tile-s {
  background: linear-gradient(145deg, #f5f5ff 0%, #e0e0f0 100%);
  border-color: #a8a8d8;
}

.tile-honor {
  background: linear-gradient(145deg, #f5f5f0 0%, #e0e0d0 100%);
  border-color: #c8c8a8;
}

.tile-num {
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.tile-suit {
  font-size: 0.6em;
  color: #666;
  margin-top: 1px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add packages/web/src/components/Tile.vue
git commit -m "feat(web): 创建麻将牌组件"
```

---

### Task 13: 创建牌选择器 (TileSelector.vue)

**Files:**
- Create: `packages/web/src/components/TileSelector.vue`

- [ ] **Step 1: 创建 packages/web/src/components/TileSelector.vue**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { TILES } from '@core/data/tiles'
import Tile from './Tile.vue'

const props = defineProps<{
  selectedTiles: string[]
  maxTiles?: number
}>()

const emit = defineEmits<{
  select: [tileId: string]
  deselect: [tileId: string]
}>()

const groupedTiles = computed(() => {
  const man = TILES.filter(t => t.type === 'man')
  const pin = TILES.filter(t => t.type === 'pin')
  const sou = TILES.filter(t => t.type === 'sou')
  const honor = TILES.filter(t => t.type === 'honor')
  return { man, pin, sou, honor }
})

const isSelected = (tileId: string) => props.selectedTiles.includes(tileId)

const isDisabled = (tileId: string) => {
  const count = props.selectedTiles.filter(t => t === tileId).length
  const maxOfType = tileId.match(/^[1-9]/) ? 4 : 4
  return count >= maxOfType || (props.selectedTiles.length >= (props.maxTiles || 14) && !isSelected(tileId))
}

const getSelectedCount = (tileId: string) => {
  return props.selectedTiles.filter(t => t === tileId).length
}

const handleTileClick = (tileId: string) => {
  if (isSelected(tileId)) {
    emit('deselect', tileId)
  } else {
    emit('select', tileId)
  }
}
</script>

<template>
  <div class="tile-selector">
    <div class="tile-group">
      <h3 class="tile-group-title">万子</h3>
      <div class="tile-row">
        <div v-for="tile in groupedTiles.man" :key="tile.id" class="tile-wrapper">
          <Tile 
            :tile-id="tile.id"
            :selected="isSelected(tile.id)"
            :disabled="isDisabled(tile.id)"
            size="md"
            @click="handleTileClick"
          />
          <span v-if="getSelectedCount(tile.id) > 1" class="tile-count">{{ getSelectedCount(tile.id) }}</span>
        </div>
      </div>
    </div>
    
    <div class="tile-group">
      <h3 class="tile-group-title">筒子</h3>
      <div class="tile-row">
        <div v-for="tile in groupedTiles.pin" :key="tile.id" class="tile-wrapper">
          <Tile 
            :tile-id="tile.id"
            :selected="isSelected(tile.id)"
            :disabled="isDisabled(tile.id)"
            size="md"
            @click="handleTileClick"
          />
          <span v-if="getSelectedCount(tile.id) > 1" class="tile-count">{{ getSelectedCount(tile.id) }}</span>
        </div>
      </div>
    </div>
    
    <div class="tile-group">
      <h3 class="tile-group-title">索子</h3>
      <div class="tile-row">
        <div v-for="tile in groupedTiles.sou" :key="tile.id" class="tile-wrapper">
          <Tile 
            :tile-id="tile.id"
            :selected="isSelected(tile.id)"
            :disabled="isDisabled(tile.id)"
            size="md"
            @click="handleTileClick"
          />
          <span v-if="getSelectedCount(tile.id) > 1" class="tile-count">{{ getSelectedCount(tile.id) }}</span>
        </div>
      </div>
    </div>
    
    <div class="tile-group">
      <h3 class="tile-group-title">字牌</h3>
      <div class="tile-row">
        <div v-for="tile in groupedTiles.honor" :key="tile.id" class="tile-wrapper">
          <Tile 
            :tile-id="tile.id"
            :selected="isSelected(tile.id)"
            :disabled="isDisabled(tile.id)"
            size="md"
            @click="handleTileClick"
          />
          <span v-if="getSelectedCount(tile.id) > 1" class="tile-count">{{ getSelectedCount(tile.id) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tile-selector {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.tile-group {
  background-color: var(--color-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.tile-group-title {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
}

.tile-row {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.tile-wrapper {
  position: relative;
}

.tile-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--color-accent);
  color: var(--color-bg);
  font-size: 0.7rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add packages/web/src/components/TileSelector.vue
git commit -m "feat(web): 创建牌选择器组件"
```

---

### Task 14: 创建手牌展示组件 (HandDisplay.vue)

**Files:**
- Create: `packages/web/src/components/HandDisplay.vue`

- [ ] **Step 1: 创建 packages/web/src/components/HandDisplay.vue**

```vue
<script setup lang="ts">
import Tile from './Tile.vue'

defineProps<{
  tiles: string[]
  maxTiles?: number
}>()

const emit = defineEmits<{
  remove: [index: number]
  clear: []
}>()
</script>

<template>
  <div class="hand-display">
    <div class="hand-header">
      <span class="hand-count">{{ tiles.length }} / {{ maxTiles || 14 }}</span>
      <button v-if="tiles.length > 0" class="btn btn-secondary btn-sm" @click="emit('clear')">
        清空
      </button>
    </div>
    
    <div class="hand-tiles">
      <div v-if="tiles.length === 0" class="hand-empty">
        点击上方麻将牌开始选牌
      </div>
      <div 
        v-for="(tileId, index) in tiles" 
        :key="`${tileId}-${index}`"
        class="hand-tile-wrapper"
        @click="emit('remove', index)"
      >
        <Tile :tile-id="tileId" size="md" />
        <span class="remove-hint">×</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hand-display {
  background-color: var(--color-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.hand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.hand-count {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
}

.hand-tiles {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
  min-height: 60px;
}

.hand-empty {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  height: 60px;
}

.hand-tile-wrapper {
  position: relative;
  cursor: pointer;
}

.hand-tile-wrapper:hover .remove-hint {
  opacity: 1;
}

.remove-hint {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: var(--color-danger);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add packages/web/src/components/HandDisplay.vue
git commit -m "feat(web): 创建手牌展示组件"
```

---

### Task 15: 创建计算器页面 (Calculator.vue)

**Files:**
- Create: `packages/web/src/views/Calculator.vue`

- [ ] **Step 1: 创建 packages/web/src/views/Calculator.vue**

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { TILES, getTile } from '@core/data/tiles'
import { calculateFu, type FuResult } from '@core/domain/fu'
import { calculateScore, formatScore, type ScoreResult } from '@core/domain/score'
import TileSelector from '../components/TileSelector.vue'
import HandDisplay from '../components/HandDisplay.vue'

const selectedTiles = ref<string[]>([])
const isTsumo = ref(false)
const riichiBets = ref(0)
const result = ref<ScoreResult | null>(null)

const canCalculate = computed(() => selectedTiles.value.length === 14)

const handleSelect = (tileId: string) => {
  if (selectedTiles.value.length < 14) {
    selectedTiles.value.push(tileId)
  }
}

const handleDeselect = (tileId: string) => {
  const index = selectedTiles.value.indexOf(tileId)
  if (index > -1) {
    selectedTiles.value.splice(index, 1)
  }
}

const handleRemove = (index: number) => {
  selectedTiles.value.splice(index, 1)
}

const handleClear = () => {
  selectedTiles.value = []
  result.value = null
}

const calculate = () => {
  if (!canCalculate.value) return
  
  const tiles = selectedTiles.value.map(id => getTile(id)).filter(Boolean) as any[]
  const fuResult = calculateFu(tiles, isTsumo.value)
  
  // Simple yaku detection (placeholder - would need full hand analysis)
  // For now, just calculate basic fu
  let han = 0
  
  // Check tanyao (断幺九) - no 1/9/honor
  const hasYao = selectedTiles.value.some(id => {
    const num = parseInt(id)
    return num === 1 || num === 9 || id.endsWith('S') || id.endsWith('W')
  })
  if (!hasYao) han += 1
  
  // Check pinfu (平和) - all sequences, pair not yakuhai, two-sided wait
  if (fuResult.isPinfu) han += 1
  
  // Check tsumo (自摸)
  if (isTsumo.value && fuResult.isMenzen) han += 1
  
  result.value = calculateScore(fuResult, han, false, riichiBets.value)
}

watch(selectedTiles, () => {
  if (result.value && selectedTiles.value.length !== 14) {
    result.value = null
  }
}, { deep: true })
</script>

<template>
  <div class="calculator-page">
    <h1>符数计算器</h1>
    
    <div class="calculator-layout">
      <div class="selector-section">
        <TileSelector 
          :selected-tiles="selectedTiles"
          @select="handleSelect"
          @deselect="handleDeselect"
        />
      </div>
      
      <div class="result-section">
        <div class="hand-section card">
          <h3>当前手牌</h3>
          <HandDisplay 
            :tiles="selectedTiles"
            @remove="handleRemove"
            @clear="handleClear"
          />
        </div>
        
        <div class="options-section card">
          <h3>选项</h3>
          <label class="option-item">
            <input type="checkbox" v-model="isTsumo" />
            <span>自摸</span>
          </label>
          <div class="option-item">
            <span>立直棒:</span>
            <select v-model.number="riichiBets">
              <option :value="0">0</option>
              <option :value="1">1 (1000点)</option>
              <option :value="2">2 (2000点)</option>
              <option :value="3">3 (3000点)</option>
            </select>
          </div>
        </div>
        
        <button 
          class="btn btn-primary calculate-btn" 
          :disabled="!canCalculate"
          @click="calculate"
        >
          计算符数与点数
        </button>
        
        <div v-if="result" class="result-card card">
          <h3>计算结果</h3>
          <div class="result-main">
            <div class="result-han">
              <span class="result-value">{{ result.han }}</span>
              <span class="result-label">番</span>
            </div>
            <div class="result-fu">
              <span class="result-value">{{ result.fu }}</span>
              <span class="result-label">符</span>
            </div>
          </div>
          
          <div class="result-points">
            <div class="point-item">
              <span class="point-label">亲家支付</span>
              <span class="point-value">{{ formatScore(result.parentPoints) }}</span>
            </div>
            <div class="point-item">
              <span class="point-label">子家支付</span>
              <span class="point-value">{{ formatScore(result.childPoints) }}</span>
            </div>
          </div>
          
          <div v-if="result.riichiBet > 0" class="result-riichi">
            含 {{ result.riichiBet }} 根立直棒 (+{{ result.riichiBet * 1000 }})
          </div>
          
          <div class="result-breakdown">
            <h4>详细分解</h4>
            <ul>
              <li v-for="(item, index) in result.breakdown" :key="index">{{ item }}</li>
            </ul>
          </div>
        </div>
        
        <div v-else-if="selectedTiles.length > 0 && selectedTiles.length < 14" class="waiting-card card">
          <p>还需选择 {{ 14 - selectedTiles.length }} 张牌</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calculator-page {
  max-width: 1200px;
  margin: 0 auto;
}

.calculator-page h1 {
  margin-bottom: var(--space-lg);
}

.calculator-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: var(--space-lg);
}

.selector-section {
  min-width: 0;
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.hand-section h3,
.options-section h3 {
  font-size: 1rem;
  margin-bottom: var(--space-sm);
}

.options-section {
  padding: var(--space-md);
}

.option-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.option-item:last-child {
  margin-bottom: 0;
}

.option-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.calculate-btn {
  width: 100%;
  padding: var(--space-md);
  font-size: 1rem;
}

.calculate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-card {
  padding: var(--space-lg);
}

.result-card h3 {
  margin-bottom: var(--space-md);
}

.result-main {
  display: flex;
  justify-content: center;
  gap: var(--space-xl);
  margin-bottom: var(--space-lg);
}

.result-han,
.result-fu {
  text-align: center;
}

.result-value {
  display: block;
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1;
}

.result-label {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.result-points {
  display: flex;
  justify-content: space-around;
  padding: var(--space-md) 0;
  border-top: 1px solid rgba(212, 168, 75, 0.2);
  border-bottom: 1px solid rgba(212, 168, 75, 0.2);
  margin-bottom: var(--space-md);
}

.point-item {
  text-align: center;
}

.point-label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
}

.point-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
}

.result-riichi {
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}

.result-breakdown h4 {
  font-size: 0.95rem;
  margin-bottom: var(--space-sm);
}

.result-breakdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.result-breakdown li {
  font-size: 0.85rem;
  padding: 0.25rem 0;
  color: var(--color-text-secondary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.result-breakdown li:last-child {
  border-bottom: none;
}

.waiting-card {
  text-align: center;
  padding: var(--space-lg);
  color: var(--color-text-secondary);
}

@media (max-width: 900px) {
  .calculator-layout {
    grid-template-columns: 1fr;
  }
  
  .result-section {
    order: -1;
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add packages/web/src/views/Calculator.vue
git commit -m "feat(web): 创建符数计算器页面"
```

---

## Phase 4: 完善与优化

### Task 16: 完善役种数据示例

**Files:**
- Modify: `packages/core/src/data/yaku.ts`

- [ ] **Step 1: 补充役种手牌示例**

由于役种示例需要大量手牌数据，此任务需要在 yaku.ts 中补充更完整的手牌示例。

- [ ] **Step 2: Commit**

```bash
git add packages/core/src/data/yaku.ts
git commit -m "feat(core): 补充役种手牌示例"
```

---

### Task 17: 添加环境配置与项目构建

**Files:**
- Create: `vite.config.ts` (根目录)
- Create: `package.json` (根目录)
- Create: `tsconfig.json` (根目录)

- [ ] **Step 1: 创建根目录 package.json**

```json
{
  "name": "riichi-mahjong-helper",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "dev:web": "npm run dev -w @riichi-mahjong/web",
    "build:web": "npm run build -w @riichi-mahjong/web"
  },
  "workspaces": [
    "packages/*"
  ]
}
```

- [ ] **Step 2: 创建根目录 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@core': resolve(__dirname, './packages/core/src')
    }
  },
  server: {
    port: 5173
  }
})
```

- [ ] **Step 3: 创建根目录 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

- [ ] **Step 4: Commit**

```bash
git add package.json vite.config.ts tsconfig.json
git commit -m "chore: 添加根目录配置文件"
```

---

## 验收标准检查

- [ ] 用户能在图形化界面中选出14张手牌 — Task 12-14
- [ ] 役种列表能按番数筛选，显示40+役种 — Task 10-11
- [ ] 每个役种有至少一个完整的手牌示例 — Task 16
- [ ] 符数计算器能正确计算标准牌型的符数与点数 — Task 15
- [ ] 视觉风格为日式和风，配色和质感符合设计稿 — Task 8
- [ ] 核心逻辑与UI分离，packages/core 可独立使用 — Task 1-6

---

## 执行选项

**1. Subagent-Driven (推荐)** — 每个任务由独立子代理执行，任务间有审查点，快速迭代

**2. Inline Execution** — 在当前会话中执行任务，批量执行加审查点

**选择哪种方式？**
