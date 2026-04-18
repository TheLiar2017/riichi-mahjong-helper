<script setup lang="ts">
import { computed } from 'vue'
import { TILES } from '@core/data/tiles'
import Tile from './Tile.vue'

const props = defineProps<{
  selectedTiles: string[]
  maxTiles?: number
  showAkaDora?: boolean
}>()

const emit = defineEmits<{
  select: [tileId: string]
  deselect: [tileId: string]
}>()

const groupedTiles = computed(() => {
  const akaDoraIds = props.showAkaDora !== false ? [] : ['r5m', 'r5p', 'r5s']
  const man = TILES.filter(t => t.type === 'man' && !akaDoraIds.includes(t.id))
  const pin = TILES.filter(t => t.type === 'pin' && !akaDoraIds.includes(t.id))
  const sou = TILES.filter(t => t.type === 'sou' && !akaDoraIds.includes(t.id))
  const honor = TILES.filter(t => t.type === 'honor')
  return { man, pin, sou, honor }
})

const isSelected = (tileId: string) => props.selectedTiles.includes(tileId)

const isDisabled = (tileId: string) => {
  const count = props.selectedTiles.filter(t => t === tileId).length
  return count >= 4 || (props.selectedTiles.length >= (props.maxTiles || 14) && !isSelected(tileId))
}

const getSelectedCount = (tileId: string) => {
  return props.selectedTiles.filter(t => t === tileId).length
}

const handleTileClick = (tileId: string) => {
  const count = getSelectedCount(tileId)
  if (count >= 4) {
    // 已选4张，不能再选
    return
  }
  if (count > 0) {
    // 已选了1-3张，再点击添加一张（凑刻子/杠）
    emit('select', tileId)
  } else {
    // 未选择的牌，添加
    emit('select', tileId)
  }
}
</script>

<template>
  <div class="tile-selector">
    <div class="tile-group">
      <h3 class="tile-group-title">万子</h3>
      <div class="tile-row">
        <div v-for="tile in groupedTiles.man" :key="tile.id" class="tile-wrapper">
          <Tile
            :tile-id="tile.id"
            :selected="isSelected(tile.id)"
            :disabled="isDisabled(tile.id)"
            size="md"
            @click="handleTileClick"
          />
          <span v-if="getSelectedCount(tile.id) > 1" class="tile-count">{{ getSelectedCount(tile.id) }}</span>
        </div>
      </div>
    </div>

    <div class="tile-group">
      <h3 class="tile-group-title">筒子</h3>
      <div class="tile-row">
        <div v-for="tile in groupedTiles.pin" :key="tile.id" class="tile-wrapper">
          <Tile
            :tile-id="tile.id"
            :selected="isSelected(tile.id)"
            :disabled="isDisabled(tile.id)"
            size="md"
            @click="handleTileClick"
          />
          <span v-if="getSelectedCount(tile.id) > 1" class="tile-count">{{ getSelectedCount(tile.id) }}</span>
        </div>
      </div>
    </div>

    <div class="tile-group">
      <h3 class="tile-group-title">索子</h3>
      <div class="tile-row">
        <div v-for="tile in groupedTiles.sou" :key="tile.id" class="tile-wrapper">
          <Tile
            :tile-id="tile.id"
            :selected="isSelected(tile.id)"
            :disabled="isDisabled(tile.id)"
            size="md"
            @click="handleTileClick"
          />
          <span v-if="getSelectedCount(tile.id) > 1" class="tile-count">{{ getSelectedCount(tile.id) }}</span>
        </div>
      </div>
    </div>

    <div class="tile-group">
      <h3 class="tile-group-title">字牌</h3>
      <div class="tile-row">
        <div v-for="tile in groupedTiles.honor" :key="tile.id" class="tile-wrapper">
          <Tile
            :tile-id="tile.id"
            :selected="isSelected(tile.id)"
            :disabled="isDisabled(tile.id)"
            size="md"
            @click="handleTileClick"
          />
          <span v-if="getSelectedCount(tile.id) > 1" class="tile-count">{{ getSelectedCount(tile.id) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tile-selector {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.tile-group {
  background-color: var(--color-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.tile-group-title {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
}

.tile-row {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.tile-wrapper {
  position: relative;
}

.tile-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--color-accent);
  color: var(--color-bg);
  font-size: 0.7rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
