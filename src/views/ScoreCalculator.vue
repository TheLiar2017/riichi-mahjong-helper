<script setup lang="ts">
import { ref, computed } from 'vue'
import TileSelector from '../components/TileSelector.vue'
import HandDisplay from '../components/HandDisplay.vue'
import { calculateScore } from '../utils/score'
import type { ScoreResult } from '../utils/score'
import { calculateYaku } from '../utils/yaku-calculator'
import type { HandYakuResult } from '../utils/yaku-calculator'
import { getWaitingTiles } from '../utils/shanten'
import type { WaitingInfo } from '../utils/shanten'
import { getTileDisplay, getTileName } from '../data/tiles'

const selectedTiles = ref<number[]>([])
const isParent = ref(true)
const isTsumo = ref(false)
const isMenzen = ref(true)
const isRiichi = ref(false)
const doraCount = ref(0)

const waitingTiles = computed<WaitingInfo[]>(() => {
  if (selectedTiles.value.length !== 13) return []
  return getWaitingTiles(selectedTiles.value)
})

const yakuResult = computed<HandYakuResult | null>(() => {
  if (selectedTiles.value.length !== 14) return null
  const context = { isMenzen: isMenzen.value, isTsumo: isTsumo.value, isRiichi: isRiichi.value, isIppatsu: false, isChankan: false, isRinshankaihou: false, isHaitei: false, isHoutei: false, isTenhou: false, isChiihou: false, wind: 1, selfWind: 1, doraCount: doraCount.value, uraDoraCount: 0 }
  return calculateYaku(selectedTiles.value, context)
})

const scoreResult = computed<ScoreResult | null>(() => {
  if (!yakuResult.value || yakuResult.value.totalHan === 0) return null
  return calculateScore(yakuResult.value.totalHan, 20, isParent.value, isTsumo.value)
})

const canCalculate = computed(() => selectedTiles.value.length === 14)
</script>

<template>
  <div class="calculator-page">
    <h1>🧮 符数点数计算</h1>
    <div class="calculator-layout">
      <div class="left-panel">
        <div class="section"><h3>手牌选择</h3><TileSelector v-model="selectedTiles" :max-tiles="14" /></div>
        <div class="section"><h3>当前手牌</h3><HandDisplay :tiles="selectedTiles" size="medium" /></div>
        <div class="section">
          <h3>听牌分析</h3>
          <div v-if="waitingTiles.length > 0" class="waiting-info">
            <p class="tenpai-text">听牌中！</p>
            <div class="waiting-list">
              <div v-for="w in waitingTiles" :key="w.tile" class="waiting-item">
                <span class="tile-display">{{ getTileDisplay(w.tile) }}</span>
                <span class="tile-name">{{ getTileName(w.tile) }}</span>
                <span class="waiting-type">{{ w.type }}</span>
              </div>
            </div>
          </div>
          <div v-else-if="selectedTiles.length === 13" class="not-tenpai"><p>尚未听牌</p><p class="hint">选择14张牌后可计算</p></div>
          <div v-else class="waiting-hint"><p>请选择13张手牌</p><p class="hint">当前 {{ selectedTiles.length }}/13 张</p></div>
        </div>
      </div>
      <div class="right-panel">
        <div class="section result-section">
          <h3>和牌设置</h3>
          <div class="form-row">
            <label><input type="checkbox" v-model="isRiichi" />立直</label>
            <label><input type="checkbox" v-model="isTsumo" />自摸</label>
            <label><input type="checkbox" v-model="isMenzen" />门前清</label>
          </div>
          <div class="form-row">
            <label><input type="radio" v-model="isParent" :value="true" />庄家</label>
            <label><input type="radio" v-model="isParent" :value="false" />闲家</label>
          </div>
          <div class="form-row"><label>宝牌数：</label><input type="number" v-model.number="doraCount" min="0" max="20" /></div>
        </div>
        <div class="section result-section" v-if="canCalculate">
          <h3>役种判定</h3>
          <div v-if="yakuResult && yakuResult.results.length > 0">
            <div class="yaku-list">
              <div v-for="r in yakuResult.results" :key="r.yaku.id" class="yaku-item">
                <span class="yaku-name">{{ r.yaku.nameCn }}</span>
                <span class="yaku-han">{{ r.han }}番</span>
              </div>
            </div>
            <div class="total-han">累计：{{ yakuResult.totalHan }}番</div>
          </div>
          <div v-else class="no-yaku"><p>无役种</p></div>
        </div>
        <div class="section result-section score-result" v-if="scoreResult">
          <h3>结算点数</h3>
          <div class="score-main">
            <span class="score-point">{{ scoreResult.totalPoint.toLocaleString() }}</span>
            <span class="score-unit">点</span>
          </div>
          <div class="score-detail">
            <p>{{ yakuResult?.totalHan }}番</p>
            <p v-if="scoreResult.isMangan">{{ scoreResult.manganType }}</p>
            <p>{{ scoreResult.isParent ? '庄家' : '闲家' }} {{ scoreResult.isTsumo ? '自摸' : '荣和' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calculator-page { padding: 24px; max-width: 1200px; margin: 0 auto; }
h1 { font-size: 28px; color: #333; margin-bottom: 24px; text-align: center; }
.calculator-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
@media (max-width: 900px) { .calculator-layout { grid-template-columns: 1fr; } }
.left-panel, .right-panel { display: flex; flex-direction: column; gap: 20px; }
.section { background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.section h3 { font-size: 16px; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #E3F2FD; }
.waiting-info, .not-tenpai, .waiting-hint { text-align: center; padding: 16px; }
.tenpai-text { color: #4CAF50; font-size: 18px; font-weight: bold; margin-bottom: 12px; }
.waiting-list { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.waiting-item { display: flex; align-items: center; gap: 4px; background: #E8F5E9; padding: 4px 8px; border-radius: 8px; font-size: 14px; }
.waiting-type { color: #666; font-size: 12px; }
.hint { font-size: 12px; color: #999; }
.result-section { background: #FFF8E1; }
.form-row { display: flex; gap: 16px; margin-bottom: 12px; align-items: center; }
.form-row label { display: flex; align-items: center; gap: 4px; font-size: 14px; color: #333; cursor: pointer; }
.form-row input[type="number"] { width: 60px; padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; }
.yaku-list { display: flex; flex-wrap: wrap; gap: 8px; }
.yaku-item { display: flex; align-items: center; gap: 6px; background: white; padding: 6px 12px; border-radius: 16px; font-size: 14px; }
.yaku-name { color: #333; }
.yaku-han { color: #FF5722; font-weight: bold; }
.total-han { margin-top: 12px; padding-top: 12px; border-top: 1px solid #ddd; font-size: 16px; font-weight: bold; color: #FF5722; }
.no-yaku { text-align: center; color: #999; }
.score-result { background: #E8F5E9; text-align: center; }
.score-main { display: flex; align-items: baseline; justify-content: center; gap: 8px; margin-bottom: 12px; }
.score-point { font-size: 48px; font-weight: bold; color: #4CAF50; }
.score-unit { font-size: 24px; color: #4CAF50; }
.score-detail { font-size: 14px; color: #666; }
.score-detail p { margin: 4px 0; }
</style>
