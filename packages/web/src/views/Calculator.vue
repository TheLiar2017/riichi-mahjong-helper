<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getTile, AKA_DORA_IDS } from '@core/data/tiles'
import { calculateFu } from '@core/domain/fu'
import { calculateScore, formatScore, type ScoreResult } from '@core/domain/score'
import { detectYaku, analyzeTenpai, type YakuMatch, type TenpaiResult } from '@core/domain/detector'
import TileSelector from '../components/TileSelector.vue'
import HandDisplay from '../components/HandDisplay.vue'
import Tile from '../components/Tile.vue'
import FuluSelector, { type FuluGroup } from '../components/FuluSelector.vue'

// 当前选牌区（临时存放正在选择的牌）
const currentSelection = ref<string[]>([])
// 已宣告的副露组
const fuluGroups = ref<FuluGroup[]>([])
// 暗杠组
const ankanGroups = ref<{ tiles: string[] }[]>([])
// 手牌（不含副露）
const handTiles = ref<string[]>([])

const isTsumo = ref(false)
const isRiichi = ref(false)
const enableAkaDora = ref(true)
const result = ref<ScoreResult | null>(null)

// 特殊役选项
const haitei = ref(false) // 海底捞月
const houtei = ref(false) // 河底摸鱼
const rinkou = ref(false) // 岭上开花

// 是否门前清（无副露无暗杠）
const isMenzen = computed(() => {
  return fuluGroups.value.length === 0 && ankanGroups.value.length === 0
})

// Settings for yaku detection
const selfWind = ref<string>('ES') // East South West North
const fieldWind = ref<string>('ES')
const isParent = ref(false)

// 赤宝牌数量
const akaDoraCount = computed(() => {
  if (!enableAkaDora.value) return 0
  return totalTiles.value.filter(id => AKA_DORA_IDS.includes(id)).length
})

// 所有已选牌（用于 TileSelector 显示选中状态）
const allSelectedTiles = computed(() => {
  return [...fuluGroups.value.flatMap(g => g.tiles), ...handTiles.value, ...currentSelection.value, ...ankanGroups.value.flatMap(g => g.tiles)]
})

// 计算用总牌数
const totalTiles = computed(() => {
  const fuluTiles = fuluGroups.value.flatMap(g => g.tiles)
  const ankanTiles = ankanGroups.value.flatMap(g => g.tiles)
  return [...handTiles.value, ...fuluTiles, ...ankanTiles]
})

// 检测番数和进张分析
const detectedYaku = computed<YakuMatch[]>(() => {
  if (totalTiles.value.length !== 14) return []
  const tiles = totalTiles.value.map(id => getTile(id)).filter(Boolean) as any[]
  return detectYaku(tiles, isTsumo.value, isParent.value, selfWind.value, fieldWind.value)
})

const sortedYaku = computed(() => {
  return [...detectedYaku.value].sort((a, b) => b.yaku.han - a.yaku.han)
})

const tenpaiAnalysis = computed<TenpaiResult[]>(() => {
  if (totalTiles.value.length !== 13) return []
  const tiles = totalTiles.value.map(id => getTile(id)).filter(Boolean) as any[]
  return analyzeTenpai(tiles, selfWind.value, fieldWind.value)
})

const canCalculate = computed(() => totalTiles.value.length === 14)

// 普通牌ID到红宝牌ID的映射
const normalToAka: Record<string, string> = {
  '5m': 'r5m',
  '5p': 'r5p',
  '5s': 'r5s'
}

const akaToNormal: Record<string, string> = {
  'r5m': '5m',
  'r5p': '5p',
  'r5s': '5s'
}

// TileSelector 交互
const handleSelect = (tileId: string) => {
  const fuluTiles = fuluGroups.value.flatMap(g => g.tiles)
  const ankanTiles = ankanGroups.value.flatMap(g => g.tiles)
  const allTiles = [...handTiles.value, ...fuluTiles, ...ankanTiles, ...currentSelection.value]

  // 检查是否是红宝牌
  const isAka = tileId in akaToNormal
  const pairedId = isAka ? akaToNormal[tileId] : normalToAka[tileId]

  if (isAka) {
    // 红宝牌：只能选择1张
    const akaCount = allTiles.filter(t => t === tileId).length
    if (akaCount >= 1) {
      return
    }
  } else if (pairedId) {
    // 普通5万/5筒/5索
    const normalCount = allTiles.filter(t => t === tileId).length
    if (enableAkaDora.value) {
      // 启用赤宝牌时：普通牌最多3张（红宝牌占1张）
      if (normalCount >= 3) {
        return
      }
    } else {
      // 未启用赤宝牌：最多4张
      if (normalCount >= 4) {
        return
      }
    }
  } else {
    // 普通牌（非5系）：最多4张
    const count = allTiles.filter(t => t === tileId).length
    if (count >= 4) {
      return
    }
  }

  currentSelection.value.push(tileId)
}

const handleDeselect = (tileId: string) => {
  const index = currentSelection.value.indexOf(tileId)
  if (index > -1) {
    currentSelection.value.splice(index, 1)
  }
}

const handleRemoveFromHand = (index: number) => {
  handTiles.value.splice(index, 1)
}

const handleAnkan = (tileId: string) => {
  // 从手牌中移除4张相同的牌作为暗杠（包括红宝牌）
  const akaId = normalToAka[tileId]
  // 找出所有匹配的牌（普通牌和红宝牌都算）
  const matchedIndices: number[] = []
  for (let i = 0; i < handTiles.value.length; i++) {
    if (handTiles.value[i] === tileId || (akaId && handTiles.value[i] === akaId)) {
      matchedIndices.push(i)
    }
  }

  if (matchedIndices.length >= 4) {
    // 从后往前移除，避免索引偏移
    const tilesToStore: string[] = []
    matchedIndices.slice(0, 4).reverse().forEach(i => {
      tilesToStore.push(handTiles.value[i])
      handTiles.value.splice(i, 1)
    })
    const finalTiles = tilesToStore.reverse()
    // 确保红宝牌在中间位置（tiles[1]）显示
    if (akaId) {
      const akaIndex = finalTiles.indexOf(akaId)
      if (akaIndex > -1 && akaIndex !== 1) {
        // 把红宝牌换到位置 1
        const temp = finalTiles[1]
        finalTiles[1] = finalTiles[akaIndex]
        finalTiles[akaIndex] = temp
      }
    }
    ankanGroups.value.push({ tiles: finalTiles })
    result.value = null
  }
}

const removeAnkanGroup = (index: number) => {
  // 将暗杠的牌返回到手牌
  const group = ankanGroups.value[index]
  handTiles.value.push(...group.tiles)
  ankanGroups.value.splice(index, 1)
  result.value = null
}

const handleClearHand = () => {
  handTiles.value = []
  result.value = null
}

// 副露操作
const confirmFulu = (type: 'pon' | 'chi' | 'kan') => {
  if (currentSelection.value.length > 0) {
    fuluGroups.value.push({
      type,
      tiles: [...currentSelection.value]
    })
    currentSelection.value = []
    result.value = null
  }
}

const removeFuluGroup = (index: number) => {
  fuluGroups.value.splice(index, 1)
  result.value = null
}

const handleRemoveFromSelection = (tileId: string) => {
  const index = currentSelection.value.indexOf(tileId)
  if (index > -1) {
    currentSelection.value.splice(index, 1)
  }
}

const clearSelection = () => {
  currentSelection.value = []
}

const addSelectionToHand = () => {
  // 将当前选牌移入手牌
  handTiles.value.push(...currentSelection.value)
  currentSelection.value = []
  result.value = null
}

// 计算
const calculate = () => {
  if (!canCalculate.value) return

  const tiles = totalTiles.value.map(id => getTile(id)).filter(Boolean) as any[]
  const fuResult = calculateFu(tiles, isTsumo.value)
  let han = detectedYaku.value.reduce((sum, match) => sum + match.yaku.han, 0) + akaDoraCount.value

  // 特殊役
  if (haitei.value) han += 1
  if (houtei.value) han += 1
  if (rinkou.value) han += 1

  result.value = calculateScore(fuResult, han, false, isRiichi.value ? 1 : 0)
}

watch(totalTiles, () => {
  if (result.value && totalTiles.value.length !== 14) {
    result.value = null
  }
}, { deep: true })
</script>

<template>
  <div class="calculator-page">
    <h1>符数计算器</h1>

    <!-- 手牌汇总横向展示 - 放在最上方单独一行 -->
    <div v-if="totalTiles.length > 0" class="hand-summary card">
      <div class="hand-summary-row">
        <!-- 手牌 -->
        <div v-if="handTiles.length > 0" class="tile-group hand-group">
          <Tile v-for="(tileId, index) in handTiles" :key="'hand-' + index" :tile-id="tileId" size="sm" />
        </div>

        <!-- 暗杠 -->
        <template v-if="ankanGroups.length > 0">
          <div class="group-separator"></div>
          <div class="tile-group ankan-group">
            <div v-for="(group, gIndex) in ankanGroups" :key="'ankan-' + gIndex" class="sub-group">
              <img src="/tiles/back.png" class="tile-img tile-back" />
              <Tile :tile-id="group.tiles[1]" size="sm" />
              <Tile :tile-id="group.tiles[2]" size="sm" />
              <img src="/tiles/back.png" class="tile-img tile-back" />
            </div>
          </div>
        </template>

        <!-- 副露 -->
        <template v-if="fuluGroups.length > 0">
          <div class="group-separator"></div>
          <div class="tile-group fulu-group">
            <div v-for="(group, gIndex) in fuluGroups" :key="'fulu-' + gIndex" class="sub-group">
              <Tile v-for="(tileId, tIndex) in group.tiles" :key="'fulu-' + gIndex + '-' + tIndex" :tile-id="tileId" size="sm" />
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="calculator-layout">
      <div class="selector-section">
        <TileSelector
          :selected-tiles="allSelectedTiles"
          :show-aka-dora="enableAkaDora"
          @select="handleSelect"
          @deselect="handleDeselect"
        />
      </div>

      <div class="result-section">
        <!-- 副露选择区 -->
        <div class="card">
          <h3>副露</h3>
          <FuluSelector
            :fulu-groups="fuluGroups"
            :current-selection="currentSelection"
            @confirm-fulu="confirmFulu"
            @remove-group="removeFuluGroup"
            @remove-from-selection="handleRemoveFromSelection"
            @add-to-hand="addSelectionToHand"
            @clear-selection="clearSelection"
          />
        </div>

        <!-- 手牌区 -->
        <div class="hand-section card">
          <h3>手牌</h3>
          <HandDisplay
            :tiles="handTiles"
            @remove="handleRemoveFromHand"
            @clear="handleClearHand"
            @ankan="handleAnkan"
          />
          <div v-if="currentSelection.length > 0" class="add-to-hand-hint">
            <button class="btn btn-secondary btn-sm" @click="addSelectionToHand">
              + 加入手牌 ({{ currentSelection.length }}张)
            </button>
          </div>
        </div>

        <!-- 暗杠展示区 -->
        <div v-if="ankanGroups.length > 0" class="ankan-display card">
          <h3>暗杠</h3>
          <div class="ankan-groups">
            <div v-for="(group, index) in ankanGroups" :key="index" class="ankan-group">
              <div class="ankan-group-header">
                <span>暗杠</span>
                <button class="btn-remove-ankan" @click="removeAnkanGroup(index)">×</button>
              </div>
              <div class="ankan-tiles">
                <div class="ankan-tile-wrapper">
                  <img src="/tiles/back.png" class="tile-img tile-back" />
                </div>
                <div class="ankan-tile-wrapper">
                  <Tile :tile-id="group.tiles[1]" size="sm" />
                </div>
                <div class="ankan-tile-wrapper">
                  <Tile :tile-id="group.tiles[2]" size="sm" />
                </div>
                <div class="ankan-tile-wrapper">
                  <img src="/tiles/back.png" class="tile-img tile-back" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="options-section card">
          <h3>选项</h3>
          <label class="option-item">
            <input type="checkbox" v-model="isTsumo" />
            <span>自摸</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="enableAkaDora" />
            <span>赤宝牌</span>
          </label>
          <label class="option-item" :class="{ 'option-disabled': !isMenzen }">
            <input type="checkbox" v-model="isRiichi" :disabled="!isMenzen" />
            <span>立直</span>
            <span v-if="!isMenzen" class="option-hint">(需门前清)</span>
          </label>
          <div class="option-divider"></div>
          <label class="option-item">
            <input type="checkbox" v-model="haitei" />
            <span>海底捞月</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="houtei" />
            <span>河底摸鱼</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="rinkou" />
            <span>岭上开花</span>
          </label>
          <div class="option-divider"></div>
          <div class="option-item">
            <span>自风:</span>
            <select v-model="selfWind">
              <option value="ES">东</option>
              <option value="SS">南</option>
              <option value="WS">西</option>
              <option value="NS">北</option>
            </select>
          </div>
          <div class="option-item">
            <span>场风:</span>
            <select v-model="fieldWind">
              <option value="ES">东</option>
              <option value="SS">南</option>
              <option value="WS">西</option>
              <option value="NS">北</option>
            </select>
          </div>
          <div class="option-item">
            <span>身份:</span>
            <select v-model="isParent">
              <option :value="false">子家</option>
              <option :value="true">亲家</option>
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
            立直 (+{{ result.riichiBet * 1000 }})
          </div>

          <details class="result-breakdown">
            <summary>查看详细分解 ({{ result.breakdown.length }} 项)</summary>
            <ul>
              <li v-for="(item, index) in result.breakdown" :key="index">{{ item }}</li>
            </ul>
          </details>
        </div>

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

        <div v-if="tenpaiAnalysis.length > 0" class="tenpai-card card">
          <h3>进张分析</h3>
          <ul class="tenpai-list">
            <li v-for="(result, index) in tenpaiAnalysis" :key="index" class="tenpai-item">
              <div class="tenpai-waiting">
                听
                <span class="tile-id">{{ result.waitingTile.id }}</span>
                ({{ result.waitingTile.name_zh }})
              </div>
              <ul class="tenpai-yaku">
                <li v-for="(yaku, yIndex) in result.possibleYaku" :key="yIndex">
                  {{ yaku.yaku.name_zh }} ({{ yaku.yaku.han }}番)
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div v-else-if="totalTiles.length > 0 && totalTiles.length < 14" class="waiting-card card">
          <p>还需选择 {{ 14 - totalTiles.length }} 张牌</p>
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

/* 手牌汇总横向展示 */
.hand-summary {
  padding: var(--space-md);
}

.hand-summary-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.tile-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.group-separator {
  width: 1px;
  height: 40px;
  background-color: rgba(212, 168, 75, 0.4);
  margin: 0 var(--space-sm);
}

.sub-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.sub-group + .sub-group {
  margin-left: var(--space-sm);
}

.ankan-group .sub-group,
.fulu-group .sub-group {
  background-color: rgba(75, 75, 75, 0.2);
  padding: 2px 4px;
  border-radius: var(--radius-sm);
}

.tile-back {
  width: 28px;
  height: auto;
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

.option-disabled {
  opacity: 0.6;
}

.option-hint {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.option-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: var(--space-sm) 0;
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

.result-breakdown {
  margin-top: var(--space-md);
}

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
  display: inline-block;
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

.result-breakdown li:last-child {
  border-bottom: none;
}

.waiting-card {
  text-align: center;
  padding: var(--space-lg);
  color: var(--color-text-secondary);
}

.add-to-hand-hint {
  margin-top: var(--space-sm);
  text-align: center;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
}

.ankan-display {
  padding: var(--space-md);
}

.ankan-display h3 {
  font-size: 1rem;
  margin-bottom: var(--space-sm);
}

.ankan-groups {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.ankan-group {
  background-color: rgba(75, 168, 75, 0.1);
  border: 1px solid rgba(75, 168, 75, 0.3);
  border-radius: var(--radius-md);
  padding: var(--space-sm);
}

.ankan-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xs);
  font-size: 0.85rem;
  color: #4ba84b;
}

.btn-remove-ankan {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 1rem;
  padding: 0 0.25rem;
}

.btn-remove-ankan:hover {
  color: var(--color-danger);
}

.ankan-tiles {
  display: flex;
  gap: 2px;
}

.ankan-tile-wrapper {
  position: relative;
}

.tile-back {
  width: 32px;
  height: auto;
}

.yaku-card,
.tenpai-card {
  padding: var(--space-md);
}

.yaku-card h3,
.tenpai-card h3 {
  font-size: 1rem;
  margin-bottom: var(--space-sm);
}

.yaku-list,
.tenpai-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.yaku-item {
  padding: var(--space-sm) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.yaku-item:last-child {
  border-bottom: none;
}

.yaku-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.yaku-name {
  font-weight: 600;
}

.yaku-han {
  font-size: 0.85rem;
  color: var(--color-accent);
  font-weight: 600;
}

.yaku-desc {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.yaku-score {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.tenpai-item {
  padding: var(--space-sm) 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tenpai-item:last-child {
  border-bottom: none;
}

.tenpai-waiting {
  font-weight: 600;
}

.tenpai-waiting .tile-id {
  color: var(--color-accent);
}

.tenpai-yaku {
  list-style: none;
  padding-left: var(--space-md);
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
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
