<script setup lang="ts">
import { computed } from 'vue'
import Tile from './Tile.vue'

const props = defineProps<{
  tiles: string[]
  maxTiles?: number
}>()

const emit = defineEmits<{
  remove: [index: number]
  clear: []
  ankan: [tileId: string]
}>()

const groupNames: Record<string, string> = {
  man: '万子',
  pin: '筒子',
  sou: '索子',
  honor: '字牌'
}

const progress = computed(() => {
  return (props.tiles.length / (props.maxTiles || 14)) * 100
})

const tilesWithIndex = computed(() => {
  const man: { id: string, index: number }[] = []
  const pin: { id: string, index: number }[] = []
  const sou: { id: string, index: number }[] = []
  const honor: { id: string, index: number }[] = []

  props.tiles.forEach((t, i) => {
    const item = { id: t, index: i }
    if (t.endsWith('m')) man.push(item)
    else if (t.endsWith('p')) pin.push(item)
    else if (t.endsWith('s')) sou.push(item)
    else honor.push(item)
  })

  return { man, pin, sou, honor }
})

// 红宝牌ID到普通牌ID的映射
const akaToNormal: Record<string, string> = {
  'r5m': '5m',
  'r5p': '5p',
  'r5s': '5s'
}

// 手牌中4张相同的牌（可暗杠）- 红宝牌视为普通牌
const ankanableTiles = computed(() => {
  const counts: Record<string, number> = {}
  props.tiles.forEach(t => {
    // 将红宝牌映射到普通牌ID进行计数
    const normalizedId = akaToNormal[t] || t
    counts[normalizedId] = (counts[normalizedId] || 0) + 1
  })
  return Object.entries(counts)
    .filter(([, count]) => count === 4)
    .map(([tileId]) => tileId)
})
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
      <template v-for="(tilesOfSuit, suit) in tilesWithIndex" :key="suit">
        <div v-if="tilesOfSuit.length > 0" class="hand-group">
          <span class="hand-group-label">{{ groupNames[suit] }}</span>
          <div class="hand-group-tiles">
            <div
              v-for="({ id: tileId, index: tileIndex }) in tilesOfSuit"
              :key="`${tileId}-${tileIndex}`"
              class="hand-tile-wrapper"
              @click="emit('remove', tileIndex)"
            >
              <Tile :tile-id="tileId" size="md" />
              <span class="remove-hint">×</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 暗杠按钮 -->
    <div v-if="ankanableTiles.length > 0" class="ankan-section">
      <span class="ankan-label">暗杠:</span>
      <div class="ankan-buttons">
        <button
          v-for="tileId in ankanableTiles"
          :key="tileId"
          class="btn-ankan"
          @click="emit('ankan', tileId)"
        >
          <Tile :tile-id="tileId" size="sm" />
          <span>暗杠</span>
        </button>
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

.ankan-section {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px dashed rgba(212, 168, 75, 0.3);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.ankan-label {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.ankan-buttons {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.btn-ankan {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: rgba(212, 168, 75, 0.15);
  border: 1px solid rgba(212, 168, 75, 0.4);
  border-radius: var(--radius-sm);
  color: var(--color-accent);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ankan:hover {
  background-color: rgba(212, 168, 75, 0.3);
  border-color: var(--color-accent);
}
</style>
