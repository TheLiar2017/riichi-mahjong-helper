<script setup lang="ts">
import { computed } from 'vue'
import Tile from './Tile.vue'
import { TILES } from '@core/data/tiles'

const props = defineProps<{
  tiles: string[]
  maxTiles?: number
}>()

const emit = defineEmits<{
  remove: [index: number]
  clear: []
}>()

const groupedTiles = computed(() => {
  const man = TILES.filter(t => t.type === 'man').map(t => t.id)
  const pin = TILES.filter(t => t.type === 'pin').map(t => t.id)
  const sou = TILES.filter(t => t.type === 'sou').map(t => t.id)
  const honor = TILES.filter(t => t.type === 'honor').map(t => t.id)
  return { man, pin, sou, honor }
})

const groupNames: Record<string, string> = {
  man: '万子',
  pin: '筒子',
  sou: '索子',
  honor: '字牌'
}

const progress = computed(() => {
  return (props.tiles.length / (props.maxTiles || 14)) * 100
})

const findIndex = (tileId: string) => {
  return props.tiles.findIndex(t => t === tileId)
}
</script>

<template>
  <div class="hand-display">
    <div class="hand-header">
      <span class="hand-count">{{ tiles.length }} / {{ maxTiles || 14 }}</span>
      <button v-if="tiles.length > 0" class="btn btn-secondary btn-sm" @click="emit('clear')">
        清空
      </button>
    </div>

    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: progress + '%' }"></div>
    </div>

    <div class="hand-tiles">
      <div v-if="tiles.length === 0" class="hand-empty">
        点击上方麻将牌开始选牌
      </div>
      <template v-for="(ids, suit) in groupedTiles" :key="suit">
        <div v-if="ids.some(id => tiles.includes(id))" class="hand-group">
          <span class="hand-group-label">{{ groupNames[suit] }}</span>
          <div class="hand-group-tiles">
            <div
              v-for="tileId in ids.filter(id => tiles.includes(id))"
              :key="tileId"
              class="hand-tile-wrapper"
              @click="emit('remove', findIndex(tileId))"
            >
              <Tile :tile-id="tileId" size="md" />
              <span class="remove-hint">×</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.hand-display {
  background-color: var(--color-card);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.hand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.hand-count {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
}

.hand-tiles {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
  min-height: 60px;
}

.hand-empty {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  height: 60px;
}

.hand-group {
  margin-bottom: var(--space-sm);
}

.hand-group-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
}

.hand-group-tiles {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.hand-tile-wrapper {
  position: relative;
  cursor: pointer;
}

.hand-tile-wrapper:hover .remove-hint {
  opacity: 1;
}

.remove-hint {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: var(--color-danger);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.progress-bar {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: var(--space-xs);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-accent);
  border-radius: 2px;
  transition: width 0.2s ease;
}
</style>
