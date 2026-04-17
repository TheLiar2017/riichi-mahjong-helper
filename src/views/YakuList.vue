<script setup lang="ts">
import { ref, computed } from 'vue'
import { YAKU_LIST } from '../data/yaku'
import type { Yaku } from '../data/yaku'
import YakuCard from '../components/YakuCard.vue'

const selectedHan = ref<number | null>(null)

const hanGroups = computed(() => {
  const groups: Record<number, Yaku[]> = {}
  for (const yaku of YAKU_LIST) {
    if (!groups[yaku.han]) groups[yaku.han] = []
    groups[yaku.han].push(yaku)
  }
  return Object.entries(groups).map(([han, yakus]) => ({ han: Number(han), yakus: yakus as Yaku[] })).sort((a, b) => b.han - a.han)
})

const filteredGroups = computed(() => {
  if (selectedHan.value === null) return hanGroups.value
  return hanGroups.value.filter(g => g.han === selectedHan.value)
})

const getHanLabel = (han: number) => {
  if (han >= 13) return '役满 (13+)'
  if (han >= 8) return '倍满以上'
  if (han >= 6) return '跳满'
  if (han >= 5) return '满贯'
  return `${han}番`
}
</script>

<template>
  <div class="yaku-list-page">
    <h1>🎯 役种一览</h1>
    <div class="filter-bar">
      <button :class="['filter-btn', { active: selectedHan === null }]" @click="selectedHan = null">全部</button>
      <button v-for="group in hanGroups" :key="group.han" :class="['filter-btn', { active: selectedHan === group.han }]" @click="selectedHan = group.han">{{ getHanLabel(group.han) }}</button>
    </div>
    <div class="yaku-groups">
      <div v-for="group in filteredGroups" :key="group.han" class="yaku-group">
        <h2 class="group-title"><span class="han-badge">{{ group.han }}番</span><span class="han-label">{{ getHanLabel(group.han) }}</span></h2>
        <div class="yaku-grid">
          <YakuCard v-for="yaku in group.yakus" :key="yaku.id" :yaku="yaku" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.yaku-list-page { padding: 24px; max-width: 1000px; margin: 0 auto; }
h1 { font-size: 28px; color: #333; margin-bottom: 20px; text-align: center; }
.filter-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; justify-content: center; }
.filter-btn { padding: 8px 16px; border: 2px solid #ddd; background: white; border-radius: 20px; cursor: pointer; font-size: 14px; color: #666; transition: all 0.2s; }
.filter-btn:hover { border-color: #4CAF50; color: #4CAF50; }
.filter-btn.active { background: #4CAF50; border-color: #4CAF50; color: white; }
.yaku-groups { display: flex; flex-direction: column; gap: 32px; }
.yaku-group { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.group-title { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #eee; }
.han-badge { background: #FF5722; color: white; padding: 4px 12px; border-radius: 16px; font-size: 14px; font-weight: bold; }
.han-label { font-size: 16px; color: #333; }
.yaku-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
</style>
