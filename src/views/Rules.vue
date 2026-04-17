<script setup lang="ts">
import { RULES_DATA } from '../data/rules'
</script>

<template>
  <div class="rules-page">
    <h1>📖 日本立直麻将规则</h1>
    <div class="rules-container">
      <section v-for="(section, index) in RULES_DATA" :key="index" class="rule-section">
        <h2>{{ section.title }}</h2>
        <ul>
          <li v-for="(item, i) in section.content" :key="i">{{ item }}</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.rules-page { padding: 24px; max-width: 800px; margin: 0 auto; }
h1 { font-size: 28px; color: #333; margin-bottom: 24px; text-align: center; }
.rules-container { display: flex; flex-direction: column; gap: 24px; }
.rule-section { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.rule-section h2 { font-size: 18px; color: #2196F3; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #E3F2FD; }
.rule-section ul { list-style: none; padding: 0; margin: 0; }
.rule-section li { font-size: 14px; color: #555; line-height: 1.8; padding: 4px 0; position: relative; padding-left: 20px; }
.rule-section li::before { content: '•'; position: absolute; left: 6px; color: #2196F3; }
</style>
