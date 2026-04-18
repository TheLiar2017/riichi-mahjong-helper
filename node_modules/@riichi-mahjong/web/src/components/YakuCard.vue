<script setup lang="ts">
import { computed } from 'vue'
import type { Yaku } from '@core/data/yaku'
import Tile from './Tile.vue'

const props = defineProps<{
  yaku: Yaku
}>()

const exampleTiles = computed(() => {
  if (!props.yaku.examples.length) return []
  return props.yaku.examples[0].tiles
})

const handTiles = computed(() => {
  return exampleTiles.value.slice(0, -1)
})

const winningTile = computed(() => {
  if (exampleTiles.value.length >= 14) {
    return exampleTiles.value[exampleTiles.value.length - 1]
  }
  return null
})
</script>

<template>
  <div class="yaku-card card">
    <div class="yaku-header">
      <h3 class="yaku-name">{{ yaku.name_zh }}</h3>
      <span class="yaku-name-ja">{{ yaku.name_ja }}</span>
      <span class="yaku-han" :class="{ 'yakuman': yaku.han_locked }">
        {{ yaku.han_locked ? '役满' : `${yaku.han}番` }}
      </span>
    </div>

    <p class="yaku-desc">{{ yaku.description }}</p>

    <div v-if="exampleTiles.length > 0" class="yaku-example">
      <strong>示例：</strong>
      <div class="example-hand">
        <div class="hand-tiles">
          <Tile
            v-for="(tileId, idx) in handTiles"
            :key="`hand-${tileId}-${idx}`"
            :tile-id="tileId"
            size="sm"
            class="example-tile"
          />
        </div>
        <div v-if="winningTile" class="winning-section">
          <span class="winning-label">摸</span>
          <Tile
            :tile-id="winningTile"
            size="sm"
            class="example-tile winning-tile"
          />
          <span class="winning-label">和</span>
        </div>
      </div>
      <p class="example-explanation">{{ yaku.examples[0].explanation }}</p>
    </div>

    <div v-if="yaku.special_rules" class="yaku-special">
      <strong>特殊规则：</strong>{{ yaku.special_rules }}
    </div>

    <div v-if="yaku.common_pitfalls" class="yaku-pitfalls">
      <strong>常见陷阱：</strong>{{ yaku.common_pitfalls }}
    </div>
  </div>
</template>

<style scoped>
.yaku-card {
  padding: var(--space-lg);
}

.yaku-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-bottom: var(--space-sm);
}

.yaku-name {
  font-size: 1.2rem;
  color: var(--color-accent);
}

.yaku-name-ja {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.yaku-han {
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-sm);
  background-color: rgba(212, 168, 75, 0.2);
  color: var(--color-accent);
}

.yaku-han.yakuman {
  background-color: var(--color-danger);
  color: white;
}

.yaku-desc {
  margin-bottom: var(--space-sm);
  line-height: 1.6;
}

.yaku-example {
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid rgba(212, 168, 75, 0.1);
  font-size: 0.9rem;
}

.example-hand {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-top: var(--space-xs);
  padding: var(--space-sm);
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
}

.hand-tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.winning-section {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding-top: var(--space-xs);
  border-top: 1px dashed rgba(212, 168, 75, 0.3);
}

.winning-label {
  font-size: 0.75rem;
  color: var(--color-accent);
  font-weight: 600;
}

.winning-tile {
  filter: brightness(1.2);
}

.example-tile {
  filter: brightness(1.1);
}

.example-explanation {
  margin-top: 0.3rem;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.yaku-special,
.yaku-pitfalls {
  margin-top: var(--space-sm);
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.yaku-pitfalls {
  color: var(--color-danger);
}
</style>
