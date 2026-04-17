<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getTile } from '@core/data/tiles'
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
