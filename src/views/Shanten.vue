<script setup lang="ts">
import { ref, computed } from 'vue'
import TileSelector from '../components/TileSelector.vue'
import HandDisplay from '../components/HandDisplay.vue'
import { calculateShanten, getWaitingTiles } from '../utils/shanten'
import type { WaitingInfo } from '../utils/shanten'
import { getTileDisplay, getTileName } from '../data/tiles'

const selectedTiles = ref<number[]>([])

const shanten = computed(() => {
  if (selectedTiles.value.length !== 13) return null
  return calculateShanten(selectedTiles.value)
})

const waitingTiles = computed<WaitingInfo[]>(() => {
  if (selectedTiles.value.length !== 13) return []
  return getWaitingTiles(selectedTiles.value)
})

const adviceText = computed(() => {
  if (selectedTiles.value.length !== 13) return `请选择13张手牌（当前 ${selectedTiles.value.length}/13）`
  if (shanten.value === 0) {
    if (waitingTiles.value.length > 0) return `听牌！可胡：${waitingTiles.value.map(w => getTileName(w.tile)).join('、')}`
    return '听牌中'
  }
  if (shanten.value === -1) return '手牌已和牌！'
  return `向听数：${shanten.value}（还需 ${shanten.value} 张关键牌）`
})

const shantenClass = computed(() => {
  if (shanten.value === null) return ''
  if (shanten.value === -1) return 'win'
  if (shanten.value === 0) return 'tenpai'
  return 'not-tenpai'
})

const getWaitingTypeName = (type: string): string => {
  const names: Record<string, string> = { tanki: '单骑', shanpon: '双碰', kanchan: '嵌张', penchan: '边张', ryanmen: '两面' }
  return names[type] || type
}
</script>

<template>
  <div class="shanten-page">
    <h1>👂 听牌分析</h1>
    <div class="analysis-layout">
      <div class="left-panel">
        <div class="section"><h3>手牌选择（13张）</h3><TileSelector v-model="selectedTiles" :max-tiles="13" /></div>
        <div class="section"><h3>当前手牌</h3><HandDisplay :tiles="selectedTiles" size="medium" /></div>
      </div>
      <div class="right-panel">
        <div :class="['result-section', shantenClass]">
          <div class="shanten-display">
            <span v-if="shanten !== null" class="shanten-number">{{ shanten === -1 ? '和' : shanten }}</span>
            <span v-else class="shanten-hint">?</span>
            <span class="shanten-label">向听数</span>
          </div>
          <p class="advice">{{ adviceText }}</p>
        </div>
        <div class="section waiting-section" v-if="waitingTiles.length > 0">
          <h3>可听的牌</h3>
          <div class="waiting-grid">
            <div v-for="w in waitingTiles" :key="w.tile" class="waiting-card">
              <span class="tile-display">{{ getTileDisplay(w.tile) }}</span>
              <span class="tile-name">{{ getTileName(w.tile) }}</span>
              <span class="tile-type">{{ getWaitingTypeName(w.type) }}</span>
              <span class="tile-count">剩{{ w.count }}张</span>
            </div>
          </div>
        </div>
        <div class="section tips-section" v-if="shanten !== null && shanten > 0">
          <h3>建议</h3>
          <ul class="tips-list">
            <li v-if="shanten >= 4">手牌较散，优先凑面子</li>
            <li v-if="shanten >= 3">注意保留搭子数量</li>
            <li v-if="shanten >= 2">减少孤立牌</li>
            <li>幺九牌价值需综合考虑</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shanten-page { padding: 24px; max-width: 1100px; margin: 0 auto; }
h1 { font-size: 28px; color: #333; margin-bottom: 24px; text-align: center; }
.analysis-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
@media (max-width: 900px) { .analysis-layout { grid-template-columns: 1fr; } }
.left-panel { display: flex; flex-direction: column; gap: 20px; }
.section { background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.section h3 { font-size: 16px; color: #333; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #E3F2FD; }
.result-section { background: #FFF8E1; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 20px; }
.result-section.tenpai { background: #E8F5E9; }
.result-section.win { background: #4CAF50; color: white; }
.shanten-display { display: flex; flex-direction: column; align-items: center; margin-bottom: 16px; }
.shanten-number { font-size: 72px; font-weight: bold; line-height: 1; }
.shanten-hint { font-size: 72px; color: #ccc; font-weight: bold; }
.shanten-label { font-size: 18px; color: inherit; opacity: 0.7; }
.advice { font-size: 16px; color: #333; }
.result-section.win .advice { color: white; }
.waiting-section { background: white; }
.waiting-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 12px; }
.waiting-card { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 12px; background: #E8F5E9; border-radius: 8px; }
.tile-display { font-size: 32px; }
.tile-name { font-size: 12px; color: #666; }
.tile-type { font-size: 11px; color: #4CAF50; background: #C8E6C9; padding: 2px 6px; border-radius: 8px; }
.tile-count { font-size: 11px; color: #999; }
.tips-section { background: white; }
.tips-list { list-style: none; padding: 0; margin: 0; }
.tips-list li { font-size: 14px; color: #666; padding: 6px 0; border-bottom: 1px solid #eee; }
.tips-list li:last-child { border-bottom: none; }
</style>
