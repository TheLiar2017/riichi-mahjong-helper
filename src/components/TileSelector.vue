<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Tile from './Tile.vue'
import { encodeTile, decodeTile } from '../data/tiles'
import type { TileSuit } from '../data/tiles'

const props = defineProps<{ modelValue: number[]; maxTiles?: number }>()
const emit = defineEmits<{ 'update:modelValue': [tiles: number[]] }>()

const selectedTiles = ref<number[]>([])
watch(() => props.modelValue, (newVal) => { selectedTiles.value = [...newVal] }, { immediate: true })

const maxTiles = computed(() => props.maxTiles || 14)

const suits: { suit: TileSuit; name: string; tiles: number[] }[] = [
  { suit: 'm', name: '万子', tiles: [] },
  { suit: 'p', name: '筒子', tiles: [] },
  { suit: 's', name: '索子', tiles: [] },
  { suit: 'z', name: '字牌', tiles: [] }
]

for (const suit of suits) {
  const count = suit.suit === 'z' ? 7 : 9
  for (let num = 1; num <= count; num++) {
    suit.tiles.push(encodeTile(suit.suit, num))
    if ((suit.suit === 'm' || suit.suit === 'p' || suit.suit === 's') && num === 5) {
      suit.tiles.push(encodeTile(suit.suit, num, true))
    }
  }
}

const countMap = computed(() => {
  const map: Record<number, number> = {}
  for (const t of selectedTiles.value) { map[t] = (map[t] || 0) + 1 }
  return map
})

const getTileCount = (code: number) => countMap.value[code] || 0
const isSelected = (code: number) => selectedTiles.value.includes(code)

const isDisabled = (code: number) => {
  if (selectedTiles.value.length >= maxTiles.value) return !isSelected(code)
  const count = getTileCount(code)
  const maxCount = decodeTile(code).isRed ? 1 : 4
  return count >= maxCount
}

const toggleTile = (code: number) => {
  const index = selectedTiles.value.indexOf(code)
  if (index !== -1) selectedTiles.value.splice(index, 1)
  else if (selectedTiles.value.length < maxTiles.value) selectedTiles.value.push(code)
  emit('update:modelValue', [...selectedTiles.value])
}

const clearAll = () => { selectedTiles.value = []; emit('update:modelValue', []) }
const remainingSlots = computed(() => maxTiles.value - selectedTiles.value.length)
</script>

<template>
  <div class="tile-selector">
    <div class="selector-header">
      <span class="remaining">剩余：{{ remainingSlots }} 张</span>
      <button class="clear-btn" @click="clearAll">清空</button>
    </div>
    <div class="suit-section" v-for="suitInfo in suits" :key="suitInfo.suit">
      <div class="suit-name">{{ suitInfo.name }}</div>
      <div class="suit-tiles">
        <div v-for="code in suitInfo.tiles" :key="code" class="tile-wrapper">
          <Tile :code="code" :selected="isSelected(code)" :disabled="isDisabled(code)" size="medium" @click="toggleTile" />
          <span v-if="getTileCount(code) > 0" class="tile-count">×{{ getTileCount(code) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tile-selector { padding: 16px; background: #f5f5f5; border-radius: 8px; }
.selector-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #ddd; }
.remaining { font-size: 14px; color: #666; }
.clear-btn { padding: 6px 16px; background: #ff5722; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
.clear-btn:hover { background: #e64a19; }
.suit-section { margin-bottom: 16px; }
.suit-name { font-size: 14px; font-weight: bold; color: #333; margin-bottom: 8px; }
.suit-tiles { display: flex; flex-wrap: wrap; gap: 4px; }
.tile-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; }
.tile-count { position: absolute; bottom: -4px; right: -4px; background: #4CAF50; color: white; font-size: 10px; padding: 1px 4px; border-radius: 8px; font-weight: bold; }
</style>
