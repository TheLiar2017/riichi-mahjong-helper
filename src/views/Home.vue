<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  { title: '规则查询', description: '了解日本立直麻将的基础规则', icon: '📖', route: '/rules', color: '#2196F3' },
  { title: '役种查询', description: '查看所有役种及清晰示例', icon: '🎯', route: '/yaku', color: '#4CAF50' },
  { title: '符数计算', description: '输入牌型计算符数与点数', icon: '🧮', route: '/calculator', color: '#FF9800' },
  { title: '听牌分析', description: '分析手牌听哪些牌', icon: '👂', route: '/shanten', color: '#9C27B0' }
]
</script>

<template>
  <div class="home">
    <div class="hero">
      <h1>🀄 日本立直麻将助手</h1>
      <p class="subtitle">手搓麻将的好帮手，快速上手，计算无忧</p>
    </div>

    <div class="features">
      <div
        v-for="feature in features"
        :key="feature.route"
        class="feature-card"
        :style="{ '--accent': feature.color }"
        @click="router.push(feature.route)"
      >
        <div class="feature-icon">{{ feature.icon }}</div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </div>

    <div class="tips">
      <h3>💡 使用提示</h3>
      <ul>
        <li>符数计算页面可交互选择牌面</li>
        <li>役种页面按番数分类，方便查询</li>
        <li>支持赤牌（赤5万/赤5筒/赤5索）</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.home { padding: 24px; max-width: 900px; margin: 0 auto; }
.hero { text-align: center; margin-bottom: 40px; }
.hero h1 { font-size: 32px; color: #333; margin-bottom: 8px; }
.subtitle { font-size: 16px; color: #666; }
.features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
.feature-card { padding: 24px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.2s; border-left: 4px solid var(--accent); }
.feature-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.feature-icon { font-size: 40px; margin-bottom: 12px; }
.feature-card h3 { font-size: 18px; color: #333; margin-bottom: 8px; }
.feature-card p { font-size: 14px; color: #666; }
.tips { background: #FFF8E1; padding: 20px; border-radius: 12px; }
.tips h3 { font-size: 16px; color: #F57C00; margin-bottom: 12px; }
.tips ul { list-style: none; padding: 0; }
.tips li { font-size: 14px; color: #666; padding: 4px 0; }
</style>
