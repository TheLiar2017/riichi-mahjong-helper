<script setup lang="ts">
import { RouterLink } from 'vue-router'

const features = [
  { to: '/rules', title: '基础规则', desc: '立直麻将核心规则详解', icon: '📖' },
  { to: '/yaku', title: '役种一览', desc: '40+役种图文详解', icon: '🎴' },
  { to: '/calculator', title: '符数计算器', desc: '图形化选牌计算符数', icon: '🧮' },
]
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>欢迎使用立直麻将助手</h1>
      <p class="hero-subtitle">手搓麻将时的贴心帮手</p>
    </section>

    <section class="features">
      <RouterLink
        v-for="feature in features"
        :key="feature.to"
        :to="feature.to"
        class="feature-card"
      >
        <span class="feature-icon">{{ feature.icon }}</span>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.desc }}</p>
      </RouterLink>
    </section>

    <section class="quick-tips">
      <h2>小贴士</h2>
      <div class="tip-card card">
        <p>🎯 新手建议从「断幺九」和「平和」开始熟悉役种</p>
        <p>💡 符数计算时，记得「自摸+2符」「役牌雀头+2符」</p>
        <p>⚠️ 吃牌后无法立直，但可以食断（断幺九）</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: var(--space-xl) 0;
  border-bottom: 1px solid rgba(212, 168, 75, 0.2);
  margin-bottom: var(--space-xl);
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-sm);
}

.hero-subtitle {
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.feature-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-xl);
  background-color: var(--color-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.feature-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-4px);
  text-decoration: none;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: var(--space-sm);
  color: var(--color-accent);
}

.feature-card p {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.quick-tips h2 {
  margin-bottom: var(--space-md);
}

.tip-card p {
  margin-bottom: var(--space-sm);
}

.tip-card p:last-child {
  margin-bottom: 0;
}
</style>
