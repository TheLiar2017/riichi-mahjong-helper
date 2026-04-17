<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const navItems = [
  { path: '/', name: '首页', icon: '🏠' },
  { path: '/rules', name: '规则', icon: '📖' },
  { path: '/yaku', name: '役种', icon: '🎯' },
  { path: '/calculator', name: '计算', icon: '🧮' },
  { path: '/shanten', name: '听牌', icon: '👂' }
]

const currentPath = computed(() => route.path)
</script>

<template>
  <div class="app-container">
    <nav class="nav-bar">
      <div class="nav-brand">🀄 立直麻将助手</div>
      <div class="nav-links">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" :class="['nav-link', { active: currentPath === item.path }]">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.name }}</span>
        </router-link>
      </div>
    </nav>
    <main class="main-content"><RouterView /></main>
  </div>
</template>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background: #f0f2f5; color: #333; min-height: 100vh; }
.app-container { min-height: 100vh; display: flex; flex-direction: column; }
.nav-bar { background: linear-gradient(135deg, #1a237e 0%, #303f9f 100%); padding: 0 24px; display: flex; align-items: center; height: 60px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); position: sticky; top: 0; z-index: 100; }
.nav-brand { font-size: 20px; font-weight: bold; color: white; margin-right: 40px; }
.nav-links { display: flex; gap: 8px; }
.nav-link { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; text-decoration: none; color: rgba(255,255,255,0.8); font-size: 14px; transition: all 0.2s; }
.nav-link:hover { background: rgba(255,255,255,0.1); color: white; }
.nav-link.active { background: rgba(255,255,255,0.2); color: white; }
.nav-icon { font-size: 16px; }
.main-content { flex: 1; padding: 20px; }
</style>
