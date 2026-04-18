# 役种自动检测 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现手牌役种自动检测，支持完整和牌（14张）和听牌分析（13张），输出可和役种列表及点数分解

**Architecture:** 将手牌拆解为面子组合，枚举所有4面子+1雀头可能，对每种组合检测匹配役种。听牌分析枚举进张后重复检测流程

**Tech Stack:** TypeScript, packages/core（无UI依赖）

---

## 文件结构

```
packages/core/src/domain/
├── patterns.ts      # Create: 面子模式匹配工具
├── detector.ts      # Create: 役种检测核心
├── fu.ts            # Modify: 修复符数计算
└── score.ts         # Modify: 无改动（接口已支持）

packages/web/src/
├── views/Calculator.vue  # Modify: 集成检测结果、添加设置选项
└── components/           # 无改动
```

---

## 任务列表

### Task 1: patterns.ts — 面子模式匹配工具

**Files:**
- Create: `packages/core/src/domain/patterns.ts`

- [ ] **Step 1: 创建 patterns.ts**

```typescript
import type { Tile } from '../data/tiles';
import { TILES } from '../data/tiles';

export type MeldType = 'pon' | 'chi' | 'kan';

export interface Meld {
  type: MeldType;
  tiles: Tile[];
}

export interface HandSplit {
  melds: Meld[];      // 4个面子
  pair: Tile | null;  // 雀头
  remaining: Tile[];  // 剩余牌（应为0或进张）
}

// 统计各牌数量
export function countTiles(tiles: Tile[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const tile of tiles) {
    counts.set(tile.id, (counts.get(tile.id) || 0) + 1);
  }
  return counts;
}

// 枚举所有可能的拆解（4面子+1雀头）
export function splitHand(tiles: Tile[]): HandSplit[] {
  const results: HandSplit[] = [];
  const counts = countTiles(tiles);

  // 找雀头
  const pairTiles: string[] = [];
  for (const [id, count] of counts) {
    if (count >= 2) pairTiles.push(id);
  }

  for (const pairId of pairTiles) {
    const remaining = new Map(counts);
    remaining.set(pairId, remaining.get(pairId)! - 2);
    if (remaining.get(pairId) === 0) remaining.delete(pairId);

    // 枚举面子
    const melds = findMeldsRecursive(remaining, []);
    for (const m of melds) {
      if (m.length === 4) {
        results.push({
          melds: m,
          pair: TILES.find(t => t.id === pairId)!,
          remaining: []
        });
      }
    }
  }

  return results;
}

function findMeldsRecursive(counts: Map<string, number>, current: Meld[]): Meld[][] {
  // 终止条件：已有4个面子
  if (current.length === 4) return [current];

  const results: Meld[][] = [];

  // 优先找杠（4张）
  for (const [id, count] of counts) {
    if (count >= 4) {
      const tile = TILES.find(t => t.id === id)!;
      const newCounts = new Map(counts);
      newCounts.set(id, count - 4);
      if (newCounts.get(id) === 0) newCounts.delete(id);
      const result = findMeldsRecursive(newCounts, [...current, { type: 'kan', tiles: [tile, tile, tile, tile] }]);
      results.push(...result);
    }
  }

  // 找刻子（3张）
  for (const [id, count] of counts) {
    if (count >= 3) {
      const tile = TILES.find(t => t.id === id)!;
      if (tile.type !== 'honor') continue; // 字牌刻子特殊处理
      const newCounts = new Map(counts);
      newCounts.set(id, count - 3);
      if (newCounts.get(id) === 0) newCounts.delete(id);
      const result = findMeldsRecursive(newCounts, [...current, { type: 'pon', tiles: [tile, tile, tile] }]);
      results.push(...result);
    }
  }

  // 找顺子（3张连续数牌）
  const manTiles = TILES.filter(t => t.type === 'man');
  const pinTiles = TILES.filter(t => t.type === 'pin');
  const souTiles = TILES.filter(t => t.type === 'sou');

  for (const tileGroup of [manTiles, pinTiles, souTiles]) {
    for (let i = 0; i < tileGroup.length - 2; i++) {
      const t1 = tileGroup[i];
      const t2 = tileGroup[i + 1];
      const t3 = tileGroup[i + 2];
      const c1 = counts.get(t1.id) || 0;
      const c2 = counts.get(t2.id) || 0;
      const c3 = counts.get(t3.id) || 0;

      if (c1 > 0 && c2 > 0 && c3 > 0) {
        const newCounts = new Map(counts);
        newCounts.set(t1.id, c1 - 1);
        newCounts.set(t2.id, c2 - 1);
        newCounts.set(t3.id, c3 - 1);
        if (newCounts.get(t1.id) === 0) newCounts.delete(t1.id);
        if (newCounts.get(t2.id) === 0) newCounts.delete(t2.id);
        if (newCounts.get(t3.id) === 0) newCounts.delete(t3.id);
        const result = findMeldsRecursive(newCounts, [...current, { type: 'chi', tiles: [t1, t2, t3] }]);
        results.push(...result);
      }
    }
  }

  return results.length > 0 ? results : [current]; // 无法继续时返回
}

// 提取手牌特征
export interface HandFeatures {
  isMenzen: boolean;           // 门前清
  hasYao: boolean;             // 含幺九牌
  singleSuit: TileType | null; // 同花色（混一色/清一色）
  allSequences: boolean;       // 全顺子
  pairYakuhai: boolean;        // 役牌雀头
  waitShape: 'ryantan' | 'penchan' | 'kanchan' | 'tanki' | null; // 听牌形状
}

export function extractFeatures(tiles: Tile[], melds: Meld[], pair: Tile, isTsumo: boolean): HandFeatures {
  const allTiles = [...tiles];
  const hasYao = allTiles.some(t =>
    t.type === 'honor' || t.value === 1 || t.value === 9
  );

  // 检查单花色
  const suitTypes = new Set(allTiles.map(t => t.type));
  let singleSuit: TileType | null = null;
  if (suitTypes.size === 1 && !suitTypes.has('honor')) {
    singleSuit = allTiles[0].type;
  } else if (suitTypes.size === 2 && suitTypes.has('honor') && suitTypes.size === 2) {
    const nonHonor = allTiles.find(t => t.type !== 'honor');
    if (nonHonor) singleSuit = nonHonor.type;
  }

  // 检查全顺子
  const allSequences = melds.every(m => m.type === 'chi');

  // 检查役牌雀头
  const pairYakuhai = pair.type === 'honor';

  return { isMenzen: true, hasYao, singleSuit, allSequences, pairYakuhai, waitShape: null };
}
```

- [ ] **Step 2: 提交**

```bash
git add packages/core/src/domain/patterns.ts
git commit -m "feat(core): 添加面子模式匹配工具"
```

---

### Task 2: detector.ts — 役种检测核心

**Files:**
- Create: `packages/core/src/domain/detector.ts`
- Modify: `packages/core/src/index.ts`（导出新模块）

- [ ] **Step 1: 创建 detector.ts**

```typescript
import type { Tile, TileType } from '../data/tiles';
import { TILES, getTile } from '../data/tiles';
import type { Yaku } from '../data/yaku';
import { YAKU_LIST } from '../data/yaku';
import type { ScoreResult } from './score';
import { calculateScore } from './score';
import { calculateFu, type FuResult } from './fu';
import { splitHand, type HandSplit, type Meld, type HandFeatures, extractFeatures } from './patterns';

export interface YakuMatch {
  yaku: Yaku;
  breakdown: string[];
  score?: ScoreResult;
}

export interface TenpaiResult {
  waitingTile: Tile;
  possibleYaku: YakuMatch[];
}

// 检测单一役种是否满足
function matchYaku(yaku: Yaku, tiles: Tile[], split: HandSplit, features: HandFeatures, isTsumo: boolean, isParent: boolean, wind?: string): boolean {
  switch (yaku.id) {
    case 'tanyao':
      return !features.hasYao;
    case 'pinfu':
      return features.allSequences && !features.pairYakuhai;
    case 'menzen_tsumo':
      return isTsumo && features.isMenzen;
    case 'ittsu':
      return matchIttsu(split.melds);
    case 'sanshoku_dojun':
      return matchSanshokuDojun(split.melds);
    case 'honitsu':
      return features.singleSuit !== null && features.singleSuit !== 'honor' && features.hasYao;
    case 'chinitsu':
      return features.singleSuit !== null && features.singleSuit !== 'honor' && !features.hasYao;
    default:
      return false;
  }
}

function matchIttsu(melds: Meld[]): boolean {
  // 统计123/456/789顺子数量
  const chiMelds = melds.filter(m => m.type === 'chi');
  const count123 = chiMelds.filter(m => m.tiles[0].value === 1).length;
  const count456 = chiMelds.filter(m => m.tiles[0].value === 4).length;
  const count789 = chiMelds.filter(m => m.tiles[0].value === 7).length;
  return (count123 > 0 && count456 > 0 && count789 > 0);
}

function matchSanshokuDojun(melds: Meld[]): boolean {
  const chiMelds = melds.filter(m => m.type === 'chi');
  if (chiMelds.length < 1) return false;

  // 按顺序值分组
  const byValue = new Map<number, { type: TileType; count: number }[]>();
  for (const m of chiMelds) {
    const val = m.tiles[0].value as number;
    if (!byValue.has(val)) byValue.set(val, []);
    byValue.get(val)!.push({ type: m.tiles[0].type, count: 1 });
  }

  // 找123/456/789各有一组且类型不同
  for (const val of [1, 4, 7]) {
    if (!byValue.has(val)) return false;
    const types = byValue.get(val)!.map(x => x.type);
    if (types.length !== 1) return false;
  }

  const types123 = byValue.get(1)!.map(x => x.type);
  const types456 = byValue.get(4)!.map(x => x.type);
  const types789 = byValue.get(7)!.map(x => x.type);

  return types123[0] !== types456[0] && types456[0] !== types789[0] && types123[0] !== types789[0];
}

// 完整和牌检测
export function detectYaku(tiles: Tile[], isTsumo: boolean, isParent: boolean, wind?: string): YakuMatch[] {
  const results: YakuMatch[] = [];
  const splits = splitHand(tiles);

  for (const split of splits) {
    const features = extractFeatures(tiles, split.melds, split.pair, isTsumo);

    for (const yaku of YAKU_LIST) {
      if (matchYaku(yaku, tiles, split, features, isTsumo, isParent, wind)) {
        const fuResult: FuResult = {
          total: 30,
          breakdown: [],
          isMenzen: features.isMenzen,
          isTsumo,
          isPinfu: features.allSequences && !features.pairYakuhai,
          isYakuhai: features.pairYakuhai,
          isRyanpeikou: false
        };
        const score = calculateScore(fuResult, yaku.han, isParent);

        results.push({
          yaku,
          breakdown: [`${yaku.name_zh}: ${yaku.description}`],
          score
        });
      }
    }
  }

  return results;
}

// 听牌分析
export function analyzeTenpai(tiles: Tile[], wind?: string): TenpaiResult[] {
  if (tiles.length !== 13) return [];

  const results: TenpaiResult[] = [];
  const usedIds = new Set(tiles.map(t => t.id));

  // 枚举可进张
  for (const tile of TILES) {
    if (usedIds.has(tile.id)) continue;
    const count = tiles.filter(t => t.id === tile.id).length;
    if (count >= 4) continue;

    const fullHand = [...tiles, tile];
    const matches = detectYaku(fullHand, true, false, wind);

    if (matches.length > 0) {
      results.push({ waitingTile: tile, possibleYaku: matches });
    }
  }

  // 按收益排序
  results.sort((a, b) => {
    const aMax = Math.max(...a.possibleYaku.map(m => m.yaku.han));
    const bMax = Math.max(...b.possibleYaku.map(m => m.yaku.han));
    return bMax - aMax;
  });

  return results;
}
```

- [ ] **Step 2: 更新 index.ts 导出**

在 `packages/core/src/index.ts` 末尾添加:
```typescript
export * from './domain/detector';
```

- [ ] **Step 3: 提交**

```bash
git add packages/core/src/domain/detector.ts packages/core/src/index.ts
git commit -m "feat(core): 添加役种检测核心模块"
```

---

### Task 3: fu.ts 修复

**Files:**
- Modify: `packages/core/src/domain/fu.ts`

- [ ] **Step 1: 修复 fu.ts**

需要修复以下问题：
1. `isRyanpeikou` 始终返回 false — 添加二杯口检测
2. 平和自摸符数应为20符非30符
3. 听牌形状符数（边张/嵌张+2符，单骑+2符）
4. 杠符数正确累加

具体修改位置：

1. 找 pair 检测后添加 isRyanpeikou 检测逻辑（检查是否有两个相同顺子）

2. tsumo 分支修改：
```typescript
if (isTsumo) {
  if (isPinfu) {
    fu = 20;  // 平和自摸20符
    breakdown.push('平和自摸: 20');
  } else {
    fu += 2;
    breakdown.push('自摸: +2');
  }
}
```

3. 添加听牌形状检测和符数加成

4. kan 刻子符数累加修复（原来只处理了pon）

- [ ] **Step 2: 提交**

```bash
git add packages/core/src/domain/fu.ts
git commit -m "fix(core): 修复符数计算问题"
```

---

### Task 4: Calculator.vue 集成

**Files:**
- Modify: `packages/web/src/views/Calculator.vue`

- [ ] **Step 1: 添加设置选项**

在 options-section 中添加：
```vue
<div class="option-item">
  <span>自风:</span>
  <select v-model="selfWind">
    <option value="">无</option>
    <option value="ES">东风</option>
    <option value="SS">南风</option>
    <option value="WS">西风</option>
    <option value="NS">北风</option>
  </select>
</div>
<div class="option-item">
  <span>场风:</span>
  <select v-model="fieldWind">
    <option value="">无</option>
    <option value="ES">东风场</option>
    <option value="SS">南风场</option>
    <option value="WS">西风场</option>
    <option value="NS">北风场</option>
  </select>
</div>
<div class="option-item">
  <span>身份:</span>
  <select v-model="isParent">
    <option :value="false">子家</option>
    <option :value="true">亲家</option>
  </select>
</div>
```

- [ ] **Step 2: 调用 detectYaku 和 analyzeTenpai**

```typescript
import { detectYaku, analyzeTenpai } from '@core/domain/detector'

const detectedYaku = computed(() => {
  if (selectedTiles.value.length === 14) {
    const tiles = selectedTiles.value.map(id => getTile(id)).filter(Boolean) as Tile[]
    return detectYaku(tiles, isTsumo.value, isParent.value, selfWind.value || undefined)
  }
  return []
})

const tenpaiAnalysis = computed(() => {
  if (selectedTiles.value.length === 13) {
    const tiles = selectedTiles.value.map(id => getTile(id)).filter(Boolean) as Tile[]
    return analyzeTenpai(tiles, selfWind.value || undefined)
  }
  return []
})
```

- [ ] **Step 3: 添加检测结果显示**

在 result-card 中添加役种列表显示：
```vue
<div v-if="detectedYaku.length > 0" class="yaku-detected">
  <h4>可和役种</h4>
  <div v-for="match in detectedYaku" :key="match.yaku.id" class="yaku-item">
    <span class="yaku-name">{{ match.yaku.name_zh }}</span>
    <span class="yaku-han">{{ match.yaku.han }}番</span>
    <span class="yaku-desc">{{ match.yaku.description }}</span>
  </div>
</div>
```

- [ ] **Step 4: 提交**

```bash
git add packages/web/src/views/Calculator.vue
git commit -m "feat(web): 集成役种自动检测到计算器"
```

---

## 自检清单

1. **Spec覆盖**：detectYaku和analyzeTenpai接口已实现，符数修复已包含
2. **Placeholder扫描**：无TBD/TODO
3. **类型一致性**：Tile类型从data/tiles导入，YakuMatch接口已在Task 2定义