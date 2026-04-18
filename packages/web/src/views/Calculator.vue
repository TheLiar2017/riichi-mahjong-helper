<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getTile, AKA_DORA_IDS } from '@core/data/tiles'
import { calculateFu } from '@core/domain/fu'
import { calculateScore, formatScore, type ScoreResult } from '@core/domain/score'
import { detectYaku, analyzeTenpai, type YakuMatch, type TenpaiResult } from '@core/domain/detector'
import TileSelector from '../components/TileSelector.vue'
import HandDisplay from '../components/HandDisplay.vue'
import FuluSelector, { type FuluGroup } from '../components/FuluSelector.vue'

// 当前选牌区（临时存放正在选择的牌）
const currentSelection = ref<string[]>([])
// 已宣告的副露组
const fuluGroups = ref<FuluGroup[]>([])
// 手牌（不含副露）
const handTiles = ref<string[]>([])

const isTsumo = ref(false)
const riichiBets = ref(0)
const enableAkaDora = ref(false)
const result = ref<ScoreResult | null>(null)

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
  return [...fuluGroups.value.flatMap(g => g.tiles), ...handTiles.value, ...currentSelection.value]
})

// 计算用总牌数
const totalTiles = computed(() => {
  const fuluTiles = fuluGroups.value.flatMap(g => g.tiles)
  return [...handTiles.value, ...fuluTiles]
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

// TileSelector 交互
const handleSelect = (tileId: string) => {
  // 检查是否已在其他区域
  const fuluTiles = fuluGroups.value.flatMap(g => g.tiles)
  if (fuluTiles.includes(tileId) || handTiles.value.includes(tileId)) {
    // 已在其他区域，忽略
    return
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
  const han = detectedYaku.value.reduce((sum, match) => sum + match.yaku.han, 0) + akaDoraCount.value

  result.value = calculateScore(fuResult, han, false, riichiBets.value)
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

    <div class="calculator-layout">
      <div class="selector-section">
        <TileSelector
          :selected-tiles="allSelectedTiles"
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
          />
          <div v-if="currentSelection.length > 0" class="add-to-hand-hint">
            <button class="btn btn-secondary btn-sm" @click="addSelectionToHand">
              + 加入手牌 ({{ currentSelection.length }}张)
            </button>
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
          <div class="option-item">
            <span>立直棒:</span>
            <select v-model.number="riichiBets">
              <option :value="0">0</option>
              <option :value="1">1 (1000点)</option>
              <option :value="2">2 (2000点)</option>
              <option :value="3">3 (3000点)</option>
            </select>
          </div>
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
            含 {{ result.riichiBet }} 根立直棒 (+{{ result.riichiBet * 1000 }})
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
