<script setup lang="ts">
import { computed } from 'vue'
import Tile from './Tile.vue'

const props = defineProps<{ tiles: number[]; size?: 'small' | 'medium' | 'large'; selectedIndex?: number }>()
const sortedTiles = computed(() => [...props.tiles].sort((a, b) => a - b))
</script>

<template>
  <div class="hand-display">
    <div class="hand-tiles">
      <Tile v-for="(code, index) in sortedTiles" :key="`${code}-${index}`" :code="code" :size="size || 'medium'" :selected="selectedIndex === index" />
    </div>
    <div class="tile-count" v-if="tiles.length > 0">{{ tiles.length }}张</div>
  </div>
</template>

<style scoped>
.hand-display { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.hand-tiles { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; }
.tile-count { font-size: 12px; color: #666; }
</style>
