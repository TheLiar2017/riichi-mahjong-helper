# Calculator UI 优化实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 优化计算器的手牌展示和结果展示，修复场风参数未传递的 bug。

**Architecture:** 改动集中于 Calculator.vue、HandDisplay.vue、detector.ts 三个文件。HandDisplay 新增分组显示和进度条；Calculator.vue 修复 bug 并优化结果布局；detector.ts 支持 fieldWind 参数。

**Tech Stack:** Vue 3 Composition API, TypeScript

---

## 任务总览

| 顺序 | 任务 | 改动文件 |
|------|------|----------|
| 1 | 修复场风参数 bug | detector.ts, Calculator.vue |
| 2 | 移除冗余役种检测代码 | Calculator.vue |
| 3 | HandDisplay 分组显示改造 | HandDisplay.vue |
| 4 | HandDisplay 添加进度条 | HandDisplay.vue |
| 5 | HandDisplay 优化删除交互 | HandDisplay.vue |
| 6 | Calculator 结果布局优化 | Calculator.vue |
| 7 | 役种卡片排序和展示优化 | Calculator.vue |
| 8 | 详细分解可折叠 | Calculator.vue |
| 9 | 添加淡入动画 | Calculator.vue, HandDisplay.vue |

---

## Task 1: 修复 detector.ts 支持 fieldWind

**Files:**
- Modify: `packages/core/src/domain/detector.ts:1-20`

- [ ] **Step 1: 检查 detector.ts 当前函数签名**

Read: `packages/core/src/domain/detector.ts` 第 1-30 行，确认 `detectYaku` 和 `analyzeTenpai` 的参数列表。

- [ ] **Step 2: 修改 detectYaku 函数签名**

将 `wind?: string` 改为 `selfWind?: string, fieldWind?: string`。

```typescript
export function detectYaku(tiles: Tile[], isTsumo: boolean, isParent: boolean, selfWind?: string, fieldWind?: string): YakuMatch[] {
```

- [ ] **Step 3: 修改 matchYaku 调用处**

将 `matchYaku(yaku, tiles, split, features, isTsumo, isParent, wind)` 改为 `matchYaku(yaku, tiles, split, features, isTsumo, isParent, selfWind, fieldWind)`。

- [ ] **Step 4: 修改 matchYaku 函数签名和役牌判定逻辑**

```typescript
function matchYaku(yaku: Yaku, _tiles: Tile[], split: HandSplit, features: HandFeatures, isTsumo: boolean, _isParent: boolean, selfWind?: string, fieldWind?: string): boolean {
  // 役牌判定需同时考虑自风和场风
  const yakuhaiTiles = ['EW', 'FW', 'CW', 'RD']; // 东/南/西/北/白
  // 如果有自风或场风的役牌刻子，也算役牌
  // ...
}
```

- [ ] **Step 5: 修改 analyzeTenpai 函数签名**

```typescript
export function analyzeTenpai(tiles: Tile[], selfWind?: string, fieldWind?: string): TenpaiResult[] {
```

并将内部的 `detectYaku(fullHand, true, false, wind)` 改为传入两个 wind 参数。

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/domain/detector.ts
git commit -m "fix(core): 支持 detectYaku 和 analyzeTenpai 传入 fieldWind 参数

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 2: 移除 Calculator.vue 冗余役种检测代码

**Files:**
- Modify: `packages/web/src/views/Calculator.vue:58-80`

- [ ] **Step 1: 定位冗余代码**

Read `Calculator.vue` 第 58-80 行，找到 `calculate()` 函数中手动检测 tanyao/pinfu/tsumo 的代码。

- [ ] **Step 2: 简化 calculate 函数**

移除手动的 han 计算逻辑，改为直接从 `detectedYaku` 获取总番数（或调用一个专门计算总番数的函数）。

删除第 67-79 行的冗余代码：
```typescript
// 删除这段：
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
```

保留 `calculateScore` 调用。

- [ ] **Step 3: Commit**

```bash
git add packages/web/src/views/Calculator.vue
git commit -m "refactor(web): 移除 Calculator.vue 中冗余的役种手动检测代码

役种检测已由 detectYaku 统一处理，无需手动计算番数

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 3: HandDisplay 分组显示改造

**Files:**
- Modify: `packages/web/src/components/HandDisplay.vue:1-40`

- [ ] **Step 1: 添加 groupedTiles computed**

在 `<script setup>` 中添加：

```typescript
import { computed } from 'vue'
import Tile from './Tile.vue'
import { TILES } from '@core/data/tiles'

const props = defineProps<{
  tiles: string[]
  maxTiles?: number
}>()

const emit = defineEmits<{
  remove: [index: number]
  clear: []
}>()

const groupedTiles = computed(() => {
  const man = TILES.filter(t => t.type === 'man').map(t => t.id)
  const pin = TILES.filter(t => t.type === 'pin').map(t => t.id)
  const sou = TILES.filter(t => t.type === 'sou').map(t => t.id)
  const honor = TILES.filter(t => t.type === 'honor').map(t => t.id)
  return { man, pin, sou, honor }
})

const groupNames = {
  man: '万子',
  pin: '筒子',
  sou: '索子',
  honor: '字牌'
}
```

- [ ] **Step 2: 修改模板，按花色分组渲染**

替换现有 `<div class="hand-tiles">` 块：

```vue
<div class="hand-tiles">
  <div v-if="tiles.length === 0" class="hand-empty">
    点击上方麻将牌开始选牌
  </div>
  <template v-for="(ids, suit) in groupedTiles" :key="suit">
    <div v-if="ids.some(id => tiles.includes(id))" class="hand-group">
      <span class="hand-group-label">{{ groupNames[suit] }}</span>
      <div class="hand-group-tiles">
        <div
          v-for="(tileId, index) in tiles.filter(t => groupedTiles[suit].includes(t))"
          :key="`${tileId}-${index}`"
          class="hand-tile-wrapper"
          @click="emit('remove', tiles.indexOf(tileId))"
        >
          <Tile :tile-id="tileId" size="md" />
          <span class="remove-hint">×</span>
        </div>
      </div>
    </div>
  </template>
</div>
```

- [ ] **Step 3: 添加分组样式**

在 `<style scoped>` 中添加：

```css
.hand-group {
  margin-bottom: var(--space-sm);
}

.hand-group-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
}

.hand-group-tiles {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
}
```

- [ ] **Step 4: Commit**

```bash
git add packages/web/src/components/HandDisplay.vue
git commit -m "feat(web): HandDisplay 按花色分组显示手牌

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 4: HandDisplay 添加进度条

**Files:**
- Modify: `packages/web/src/components/HandDisplay.vue:48-55`

- [ ] **Step 1: 添加 progress computed**

```typescript
const progress = computed(() => {
  return (props.tiles.length / (props.maxTiles || 14)) * 100
})
```

- [ ] **Step 2: 在 hand-header 中添进度条**

替换现有 `hand-header`：

```vue
<div class="hand-header">
  <span class="hand-count">{{ tiles.length }} / {{ maxTiles || 14 }}</span>
  <button v-if="tiles.length > 0" class="btn btn-secondary btn-sm" @click="emit('clear')">
    清空
  </button>
</div>
<div class="progress-bar">
  <div class="progress-fill" :style="{ width: progress + '%' }"></div>
</div>
```

- [ ] **Step 3: 添加进度条样式**

```css
.progress-bar {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: var(--space-xs);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-accent);
  border-radius: 2px;
  transition: width 0.2s ease;
}
```

- [ ] **Step 4: Commit**

```bash
git add packages/web/src/components/HandDisplay.vue
git commit -m "feat(web): HandDisplay 添加选牌进度条

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 5: HandDisplay 优化删除交互

**Files:**
- Modify: `packages/web/src/components/HandDisplay.vue`

- [ ] **Step 1: 增强 tile 删除交互**

当前删除是通过 `tiles.indexOf(tileId)` 找索引，但这在有重复牌时会出错。改用唯一索引。

修改模板中 `@click`：

```vue
@click="emit('remove', findIndex(tileId))"
```

添加辅助函数：

```typescript
const findIndex = (tileId: string) => {
  // 找到第一个匹配的牌的索引
  return props.tiles.findIndex(t => t === tileId)
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/web/src/components/HandDisplay.vue
git commit -m "feat(web): HandDisplay 优化删除交互，点击牌面直接删除

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 6: Calculator 结果布局优化

**Files:**
- Modify: `packages/web/src/views/Calculator.vue:162-196`

- [ ] **Step 1: 优化点数结果卡片模板**

替换 `.result-card` 部分（第 162-196 行），采用并排布局：

```vue
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

  <div class="result-points-row">
    <div class="point-item">
      <span class="point-label">亲家支付</span>
      <span class="point-value">{{ formatScore(result.parentPoints) }}</span>
    </div>
    <div class="point-divider">/</div>
    <div class="point-item">
      <span class="point-label">子家支付</span>
      <span class="point-value">{{ formatScore(result.childPoints) }}</span>
    </div>
  </div>

  <div v-if="result.riichiBet > 0" class="result-riichi">
    含 {{ result.riichiBet }} 根立直棒 (+{{ result.riichiBet * 1000 }})
  </div>
</div>
```

- [ ] **Step 2: 添加样式**

```css
.result-points-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-md) 0;
  border-top: 1px solid rgba(212, 168, 75, 0.2);
  border-bottom: 1px solid rgba(212, 168, 75, 0.2);
  margin-bottom: var(--space-md);
}

.point-divider {
  font-size: 1.5rem;
  color: var(--color-text-secondary);
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/web/src/views/Calculator.vue
git commit -m "feat(web): Calculator 结果布局优化，亲家/子家并排显示

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 7: 役种卡片排序和展示优化

**Files:**
- Modify: `packages/web/src/views/Calculator.vue:198-209`

- [ ] **Step 1: 对 detectedYaku 排序**

在 computed 中或模板中对 `detectedYaku` 按 `han` 从高到低排序：

```typescript
const sortedYaku = computed(() => {
  return [...detectedYaku.value].sort((a, b) => b.yaku.han - a.yaku.han)
})
```

- [ ] **Step 2: 修改模板使用 sortedYaku**

```vue
<div v-if="sortedYaku.length > 0" class="yaku-card card">
  <h3>可和役种</h3>
  <ul class="yaku-list">
    <li v-for="(match, index) in sortedYaku" :key="index" class="yaku-item">
      <div class="yaku-header">
        <span class="yaku-name">{{ match.yaku.name_zh }}</span>
        <span class="yaku-han">{{ match.yaku.han }}番</span>
      </div>
      <div class="yaku-desc">{{ match.yaku.description }}</div>
      <div v-if="match.score" class="yaku-score">
        {{ formatScore(match.score.parentPoints) }} / {{ formatScore(match.score.childPoints) }}
      </div>
    </li>
  </ul>
</div>
```

- [ ] **Step 3: 添加样式**

```css
.yaku-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.yaku-han {
  font-size: 0.85rem;
  color: var(--color-accent);
  font-weight: 600;
}
```

- [ ] **Step 4: Commit**

```bash
git add packages/web/src/views/Calculator.vue
git commit -m "feat(web): Calculator 役种按番数排序展示

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 8: 详细分解可折叠

**Files:**
- Modify: `packages/web/src/views/Calculator.vue:190-196`

- [ ] **Step 1: 用 `<details>` 替换固定展开**

```vue
<details class="result-breakdown">
  <summary>查看详细分解 ({{ result.breakdown.length }} 项)</summary>
  <ul>
    <li v-for="(item, index) in result.breakdown" :key="index">{{ item }}</li>
  </ul>
</details>
```

- [ ] **Step 2: 添加折叠样式**

```css
.result-breakdown summary {
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  user-select: none;
  list-style: none;
}

.result-breakdown summary::-webkit-details-marker {
  display: none;
}

.result-breakdown summary::before {
  content: '▶ ';
  font-size: 0.7rem;
  transition: transform 0.2s;
}

.result-breakdown[open] summary::before {
  content: '▼ ';
}

.result-breakdown ul {
  list-style: none;
  padding: var(--space-sm) 0 0 0;
  margin: 0;
}

.result-breakdown li {
  font-size: 0.85rem;
  padding: 0.25rem 0;
  color: var(--color-text-secondary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/web/src/views/Calculator.vue
git commit -m "feat(web): Calculator 详细分解支持折叠展开

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 9: 添加淡入动画

**Files:**
- Modify: `packages/web/src/views/Calculator.vue`, `packages/web/src/components/HandDisplay.vue`

- [ ] **Step 1: 在 Calculator.vue 添加 keyframes 和动画类**

在 `<style scoped>` 中添加：

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease forwards;
}
```

- [ ] **Step 2: 给结果卡添加 fade-in**

在 `.result-card` 模板上添加 `:class="{ 'fade-in': result }"` 或使用 `<Transition>` 组件包裹。

```vue
<Transition name="fade">
  <div v-if="result" class="result-card card">
    ...
  </div>
</Transition>
```

添加 Transition 样式：

```css
.fade-enter-active {
  animation: fadeIn 0.3s ease;
}
```

- [ ] **Step 3: HandDisplay tile 添加选中动画**

在 `Tile.vue` 的 `.tile` 样式中添加：

```css
transition: transform 0.15s ease, filter 0.15s ease, outline 0.15s ease;
```

- [ ] **Step 4: Commit**

```bash
git add packages/web/src/views/Calculator.vue packages/web/src/components/Tile.vue
git commit -m "feat(web): Calculator 和 HandDisplay 添加淡入动画

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 10: 修复场风 bug - Calculator 传入 fieldWind

**Files:**
- Modify: `packages/web/src/views/Calculator.vue:21-32`

- [ ] **Step 1: 确保 computed 传入 fieldWind**

确认 `detectedYaku` computed：

```typescript
const detectedYaku = computed<YakuMatch[]>(() => {
  if (selectedTiles.value.length !== 14) return []
  const tiles = selectedTiles.value.map(id => getTile(id)).filter(Boolean) as any[]
  return detectYaku(tiles, isTsumo.value, isParent.value, selfWind.value, fieldWind.value)
})
```

确认 `tenpaiAnalysis` computed：

```typescript
const tenpaiAnalysis = computed<TenpaiResult[]>(() => {
  if (selectedTiles.value.length !== 13) return []
  const tiles = selectedTiles.value.map(id => getTile(id)).filter(Boolean) as any[]
  return analyzeTenpai(tiles, selfWind.value, fieldWind.value)
})
```

- [ ] **Step 2: Commit**

```bash
git add packages/web/src/views/Calculator.vue
git commit -m "fix(web): Calculator 传入 fieldWind 参数到 detectYaku 和 analyzeTenpai

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## 验证步骤

所有任务完成后，执行以下验证：

```bash
# 1. 构建验证
npm run build

# 2. 启动开发服务器
npm run dev

# 3. 手动测试
# - 选择 13 张牌，验证进张分析正确显示
# - 选择 14 张牌，验证役种检测和点数计算
# - 测试折叠展开功能
# - 验证不同场风/自风设置下的役牌判定
```

---

## 任务依赖关系

```
Task 1 (detector.ts fieldWind)
    ↓
Task 2 (移除冗余代码)
    ↓
Task 10 (Calculator 传入 fieldWind)
    ↓
Task 6 (结果布局)
    ↓
Task 7 (役种排序)
    ↓
Task 8 (折叠)
    ↓
Task 9 (动画)

Task 3 (HandDisplay 分组)
    ↓
Task 4 (进度条)
    ↓
Task 5 (删除交互)
```

Tasks 3/4/5 可与 Task 6/7/8/9/10 并行执行。Task 1 和 Task 2 必须先完成。
