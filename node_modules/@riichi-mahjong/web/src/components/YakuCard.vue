<script setup lang="ts">
import type { Yaku } from '@core/data/yaku'

defineProps<{
  yaku: Yaku
}>()
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

    <div v-if="yaku.examples.length > 0" class="yaku-example">
      <strong>示例：</strong>
      <span class="example-tiles">{{ yaku.examples[0].tiles.join(' ') }}</span>
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

.example-tiles {
  font-family: monospace;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  margin-left: var(--space-xs);
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
