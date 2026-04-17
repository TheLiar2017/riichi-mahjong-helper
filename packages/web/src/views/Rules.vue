<script setup lang="ts">
import { RULES } from '@core/data/rules'

const basicRules = RULES.filter(r => r.category === 'basic')
const playRules = RULES.filter(r => r.category === 'play')
const specialRules = RULES.filter(r => r.category === 'special')
</script>

<template>
  <div class="rules-page">
    <h1>基础规则</h1>

    <section class="rule-section">
      <h2>核心规则</h2>
      <div class="rules-grid">
        <div v-for="rule in basicRules" :key="rule.id" class="rule-card card">
          <h3>{{ rule.name_zh }}</h3>
          <p class="rule-name-ja">{{ rule.name_ja }}</p>
          <p class="rule-desc">{{ rule.description }}</p>
        </div>
      </div>
    </section>

    <section class="rule-section">
      <h2>游戏规则</h2>
      <div class="rules-grid">
        <div v-for="rule in playRules" :key="rule.id" class="rule-card card">
          <h3>{{ rule.name_zh }}</h3>
          <p class="rule-name-ja">{{ rule.name_ja }}</p>
          <p class="rule-desc">{{ rule.description }}</p>
        </div>
      </div>
    </section>

    <section class="rule-section">
      <h2>特殊规则</h2>
      <div class="rules-grid">
        <div v-for="rule in specialRules" :key="rule.id" class="rule-card card">
          <h3>{{ rule.name_zh }}</h3>
          <p class="rule-name-ja">{{ rule.name_ja }}</p>
          <p class="rule-desc">{{ rule.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.rules-page {
  max-width: 1000px;
  margin: 0 auto;
}

.rules-page h1 {
  margin-bottom: var(--space-xl);
}

.rule-section {
  margin-bottom: var(--space-xl);
}

.rule-section h2 {
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid rgba(212, 168, 75, 0.3);
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-md);
}

.rule-card {
  padding: var(--space-lg);
}

.rule-card h3 {
  font-size: 1.2rem;
  margin-bottom: var(--space-xs);
}

.rule-name-ja {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
}

.rule-desc {
  font-size: 0.95rem;
  line-height: 1.7;
}
</style>
