<script setup lang="ts">
import { computed } from 'vue'
import { getTileDisplay, getTileName } from '../data/tiles'

const props = defineProps<{ code: number; size?: 'small' | 'medium' | 'large'; selected?: boolean; disabled?: boolean }>()
const emit = defineEmits<{ click: [code: number] }>()

const display = computed(() => getTileDisplay(props.code))
const name = computed(() => getTileName(props.code))
const sizeClass = computed(() => `tile-${props.size || 'medium'}`)
</script>

<template>
  <div :class="['tile', sizeClass, { selected, disabled }]" @click="!disabled && emit('click', code)" :title="name">
    <span class="tile-display">{{ display }}</span>
  </div>
</template>

<style scoped>
.tile { display: inline-flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%); border-radius: 4px; cursor: pointer; transition: all 0.15s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.2); border: 2px solid #ccc; user-select: none; }
.tile:hover:not(.disabled) { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.3); border-color: #2196F3; }
.tile.selected { border-color: #4CAF50; background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%); box-shadow: 0 0 8px rgba(76,175,80,0.5); }
.tile.disabled { opacity: 0.5; cursor: not-allowed; }
.tile-display { font-size: inherit; line-height: 1; }
.tile-small { width: 32px; height: 40px; font-size: 20px; }
.tile-medium { width: 44px; height: 56px; font-size: 28px; }
.tile-large { width: 56px; height: 72px; font-size: 36px; }
</style>
