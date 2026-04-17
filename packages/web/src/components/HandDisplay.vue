<script setup lang="ts">
import Tile from './Tile.vue'

defineProps<{
  tiles: string[]
  maxTiles?: number
}>()

const emit = defineEmits<{
  remove: [index: number]
  clear: []
}>()
</script>

<template>
  <div class="hand-display">
    <div class="hand-header">
      <span class="hand-count">{{ tiles.length }} / {{ maxTiles || 14 }}</span>
      <button v-if="tiles.length > 0" class="btn btn-secondary btn-sm" @click="emit('clear')">
        清空
      </button>
    </div>

    <div class="hand-tiles">
      <div v-if="tiles.length === 0" class="hand-empty">
        点击上方麻将牌开始选牌
      </div>
      <div
        v-for="(tileId, index) in tiles"
        :key="`${tileId}-${index}`"
        class="hand-tile-wrapper"
        @click="emit('remove', index)"
      >
        <Tile :tile-id="tileId" size="md" />
        <span class="remove-hint">×</span>
      </div>
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
</style>
