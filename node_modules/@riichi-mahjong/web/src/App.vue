<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-title">立直麻将助手</h1>
      <nav class="app-nav">
        <RouterLink to="/">首页</RouterLink>
        <RouterLink to="/rules">规则</RouterLink>
        <RouterLink to="/yaku">役种</RouterLink>
        <RouterLink to="/calculator">计算器</RouterLink>
      </nav>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-text);
}

.app-header {
  background-color: var(--color-card);
  padding: 1rem 2rem;
  border-bottom: 2px solid var(--color-accent);
}

.app-title {
  font-family: 'Noto Serif SC', serif;
  color: var(--color-accent);
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
}

.app-nav {
  display: flex;
  gap: 1.5rem;
}

.app-nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  padding: 0.3rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.app-nav a:hover,
.app-nav a.router-link-active {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.app-main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
