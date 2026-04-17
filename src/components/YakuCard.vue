<script setup lang="ts">
import { computed } from 'vue'
import type { Yaku } from '../data/yaku'
import { getTileDisplay } from '../data/tiles'

const props = defineProps<{ yaku: Yaku; isActive?: boolean }>()

const displayExamples = computed(() => {
  if (!props.yaku.exampleTiles || props.yaku.exampleTiles.length === 0) return []
  return props.yaku.exampleTiles.map(tiles => tiles.map(code => getTileDisplay(code)).join(' '))
})
</script>

<template>
  <div :class="['yaku-card', { active: isActive }]">
    <div class="yaku-header">
      <span class="yaku-name">{{ yaku.nameCn }}</span>
      <span class="yaku-han">{{ yaku.han }}番</span>
    </div>
    <div class="yaku-english">{{ yaku.name }}</div>
    <div class="yaku-desc">{{ yaku.description }}</div>
    <div class="yaku-example" v-if="displayExamples.length > 0">
      <span class="example-label">示例：</span>
      <span class="example-tiles">{{ displayExamples[0] }}</span>
    </div>
  </div>
</template>

<style scoped>
.yaku-card { padding: 12px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 2px solid transparent; transition: all 0.2s; }
.yaku-card:hover { box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
.yaku-card.active { border-color: #4CAF50; background: #E8F5E9; }
.yaku-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.yaku-name { font-size: 16px; font-weight: bold; color: #333; }
.yaku-han { font-size: 14px; font-weight: bold; color: #FF5722; background: #FFF3E0; padding: 2px 8px; border-radius: 12px; }
.yaku-english { font-size: 12px; color: #999; margin-bottom: 8px; }
.yaku-desc { font-size: 14px; color: #666; line-height: 1.4; }
.yaku-example { margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 13px; }
.example-label { color: #999; }
.example-tiles { font-family: monospace; color: #333; }
</style>
