<script setup lang="ts">
import { computed } from 'vue'
import Tile from './Tile.vue'

export interface FuluGroup {
  type: 'pon' | 'chi' | 'kan'
  tiles: string[]
}

const props = defineProps<{
  fuluGroups: FuluGroup[]
  currentSelection: string[]
}>()

const emit = defineEmits<{
  confirmFulu: [type: 'pon' | 'chi' | 'kan']
  removeGroup: [index: number]
  removeFromSelection: [tileId: string]
  addToHand: []
  clearSelection: []
}>()

const canConfirmPon = computed(() => {
  // 需要恰好3张牌，且组成刻子（3张相同）
  if (props.currentSelection.length !== 3) return false
  const [a, b, c] = props.currentSelection
  return a === b && b === c
})

const canConfirmKan = computed(() => {
  // 需要恰好4张牌，且组成杠子（4张相同）
  if (props.currentSelection.length !== 4) return false
  const [a, b, c, d] = props.currentSelection
  return a === b && b === c && c === d
})

const canConfirmChi = computed(() => {
  // 需要恰好3张牌，且是顺子（同一花色连续）
  if (props.currentSelection.length !== 3) return false
  const [a, b, c] = props.currentSelection

  // 解析牌 ID：数字+花色后缀
  const parse = (id: string) => {
    const suit = id.match(/[mps]$/)?.[0]
    const value = parseInt(id)
    return { suit, value }
  }

  const p1 = parse(a)
  const p2 = parse(b)
  const p3 = parse(c)

  // 必须同花色
  if (p1.suit !== p2.suit || p2.suit !== p3.suit) return false

  // 必须是连续数字 (123, 234, ..., 789)
  const sorted = [p1.value, p2.value, p3.value].sort((x, y) => x - y)
  return sorted[0] + 1 === sorted[1] && sorted[1] + 1 === sorted[2]
})

const fuluTypeLabels = {
  pon: '碰',
  chi: '吃',
  kan: '杠'
}
</script>

<template>
  <div class="fulu-selector">
    <!-- 副露展示区 -->
    <div v-if="fuluGroups.length > 0" class="fulu-display">
      <div v-for="(group, index) in fuluGroups" :key="index" class="fulu-group">
        <div class="fulu-group-header">
          <span class="fulu-type">{{ fuluTypeLabels[group.type] }}</span>
          <button class="btn-remove" @click="emit('removeGroup', index)">×</button>
        </div>
        <div class="fulu-tiles">
          <Tile
            v-for="(tileId, i) in group.tiles"
            :key="`${tileId}-${i}`"
            :tile-id="tileId"
            size="sm"
          />
        </div>
      </div>
    </div>

    <!-- 当前选牌区 -->
    <div v-if="currentSelection.length > 0" class="selection-area">
      <div class="selection-header">
        <span>当前选牌 ({{ currentSelection.length }})</span>
        <button class="btn-clear" @click="emit('clearSelection')">清空</button>
      </div>
      <div class="selection-tiles">
        <div
          v-for="(tileId, index) in currentSelection"
          :key="`${tileId}-${index}`"
          class="selection-tile"
          @click="emit('removeFromSelection', tileId)"
        >
          <Tile :tile-id="tileId" size="sm" />
          <span class="remove-x">×</span>
        </div>
      </div>

      <!-- 副露按钮 -->
      <div class="fulu-buttons">
        <button
          class="btn btn-fulu"
          :disabled="!canConfirmPon"
          @click="emit('confirmFulu', 'pon')"
        >
          碰 (3张相同)
        </button>
        <button
          class="btn btn-fulu"
          :disabled="!canConfirmChi"
          @click="emit('confirmFulu', 'chi')"
        >
          吃 (顺子)
        </button>
        <button
          class="btn btn-fulu"
          :disabled="!canConfirmKan"
          @click="emit('confirmFulu', 'kan')"
        >
          杠 (4张相同)
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fulu-selector {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.fulu-display {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.fulu-group {
  background-color: rgba(212, 168, 75, 0.1);
  border: 1px solid rgba(212, 168, 75, 0.3);
  border-radius: var(--radius-md);
  padding: var(--space-sm);
}

.fulu-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xs);
}

.fulu-type {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-accent);
}

.btn-remove {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 1rem;
  padding: 0 0.25rem;
}

.btn-remove:hover {
  color: var(--color-danger);
}

.fulu-tiles {
  display: flex;
  gap: 2px;
}

.selection-area {
  background-color: rgba(212, 168, 75, 0.05);
  border: 1px dashed rgba(212, 168, 75, 0.3);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.btn-clear {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-clear:hover {
  color: var(--color-danger);
}

.selection-tiles {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
  min-height: 50px;
}

.selection-tile {
  position: relative;
  cursor: pointer;
  opacity: 0.8;
}

.selection-tile:hover {
  opacity: 1;
  transform: scale(1.05);
}

.selection-tile:hover .remove-x {
  opacity: 1;
}

.remove-x {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: var(--color-danger);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.fulu-buttons {
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.btn-fulu {
  flex: 1;
  padding: var(--space-sm);
  font-size: 0.85rem;
  background-color: var(--color-card);
  border: 1px solid rgba(212, 168, 75, 0.3);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-fulu:hover:not(:disabled) {
  background-color: rgba(212, 168, 75, 0.2);
  border-color: var(--color-accent);
}

.btn-fulu:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
