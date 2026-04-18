<script setup lang="ts">
import { ref, computed } from 'vue'
import { YAKU_LIST, getYakuByCategory } from '@core/data/yaku'
import YakuCard from '../components/YakuCard.vue'

type FilterType = 'all' | 'han1' | 'han2' | 'han3' | 'yakuman'

const filters: { label: string; value: FilterType }[] = [
  { label: '全部', value: 'all' },
  { label: '一番', value: 'han1' },
  { label: '两番', value: 'han2' },
  { label: '三番/六番', value: 'han3' },
  { label: '役满', value: 'yakuman' },
]

const currentFilter = ref<FilterType>('all')

const filteredYaku = computed(() => {
  return getYakuByCategory(currentFilter.value)
})

const stats = computed(() => ({
  total: YAKU_LIST.length,
  han1: YAKU_LIST.filter(y => y.han === 1).length,
  han2: YAKU_LIST.filter(y => y.han === 2).length,
  han3: YAKU_LIST.filter(y => y.han >= 3 && !y.han_locked).length,
  yakuman: YAKU_LIST.filter(y => y.han_locked).length,
}))
</script>

<template>
  <div class="yaku-list-page">
    <h1>役种一览</h1>

    <div class="stats card">
      <div class="stat-item">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">全部役种</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.han1 }}</span>
        <span class="stat-label">一番</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.han2 }}</span>
        <span class="stat-label">两番</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.han3 }}</span>
        <span class="stat-label">三番以上</span>
      </div>
      <div class="stat-item">
        <span class="stat-value yakuman">{{ stats.yakuman }}</span>
        <span class="stat-label">役满</span>
      </div>
    </div>

    <div class="filters">
      <span
        v-for="filter in filters"
        :key="filter.value"
        class="filter-tag"
        :class="{ active: currentFilter === filter.value }"
        @click="currentFilter = filter.value"
      >
        {{ filter.label }}
      </span>
    </div>

    <div class="yaku-grid">
      <YakuCard v-for="yaku in filteredYaku" :key="yaku.id" :yaku="yaku" />
    </div>

    <div v-if="filteredYaku.length === 0" class="empty-state">
      <p>该分类下暂无役种</p>
    </div>
  </div>
</template>

<style scoped>
.yaku-list-page {
  max-width: 1000px;
  margin: 0 auto;
}

.yaku-list-page h1 {
  margin-bottom: var(--space-lg);
}

.stats {
  display: flex;
  justify-content: space-around;
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-accent);
}

.stat-value.yakuman {
  color: var(--color-danger);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.filters {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-bottom: var(--space-lg);
}

.yaku-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--space-md);
}

.empty-state {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-secondary);
}

@media (max-width: 600px) {
  .yaku-grid {
    grid-template-columns: 1fr;
  }
}
</style>
