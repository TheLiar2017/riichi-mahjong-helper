<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tileId: string
  selected?: boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>()

const emit = defineEmits<{
  click: [tileId: string]
}>()

const tileInfo = computed(() => {
  const match = props.tileId.match(/^(\d+)([mps])$/)
  if (match) {
    const [, num, suit] = match
    const suitMap: Record<string, string> = { m: '万', p: '筒', s: '索' }
    return { num, suit: suitMap[suit] || suit, isHonor: false }
  }
  const honorMap: Record<string, { char: string; color: string }> = {
    'ES': { char: '東', color: '#3a8a5a' },
    'SS': { char: '南', color: '#8a3a5a' },
    'WS': { char: '西', color: '#3a5a8a' },
    'NS': { char: '北', color: '#5a3a8a' },
    'EW': { char: '白', color: '#3a8a9a' },
    'FW': { char: '發', color: '#3a8a5a' },
    'CW': { char: '中', color: '#8a3a3a' },
  }
  const info = honorMap[props.tileId]
  if (info) return { num: info.char, suit: '', isHonor: true, color: info.color }
  return { num: props.tileId, suit: '', isHonor: false }
})

const tileClass = computed(() => {
  const suit = props.tileId.match(/[mps]$/)?.[0]
  return [
    'tile',
    `tile-${suit || 'honor'}`,
    `tile-${props.size || 'md'}`,
    { 'tile-selected': props.selected, 'tile-disabled': props.disabled }
  ]
})

const handleClick = () => {
  if (!props.disabled) {
    emit('click', props.tileId)
  }
}
</script>

<template>
  <div :class="tileClass" @click="handleClick">
    <span class="tile-num" :style="tileInfo.isHonor ? { color: tileInfo.color } : {}">
      {{ tileInfo.num }}
    </span>
    <span v-if="!tileInfo.isHonor" class="tile-suit">{{ tileInfo.suit }}</span>
  </div>
</template>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #f8f8f8 0%, #e8e8e8 100%);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border: 2px solid #ccc;
  user-select: none;
}

.tile:hover:not(.tile-disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.tile-selected {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px var(--color-accent), 0 4px 8px rgba(0, 0, 0, 0.4);
}

.tile-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Size variants */
.tile-sm {
  width: 32px;
  height: 44px;
  font-size: 0.9rem;
}

.tile-md {
  width: 40px;
  height: 56px;
  font-size: 1.1rem;
}

.tile-lg {
  width: 48px;
  height: 68px;
  font-size: 1.3rem;
}

/* Suit colors */
.tile-m {
  background: linear-gradient(145deg, #f5fff5 0%, #e0f0e0 100%);
  border-color: #8ab8a8;
}

.tile-p {
  background: linear-gradient(145deg, #fff5f5 0%, #f0e0e0 100%);
  border-color: #d8a8a8;
}

.tile-s {
  background: linear-gradient(145deg, #f5f5ff 0%, #e0e0f0 100%);
  border-color: #a8a8d8;
}

.tile-honor {
  background: linear-gradient(145deg, #f5f5f0 0%, #e0e0d0 100%);
  border-color: #c8c8a8;
}

.tile-num {
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.tile-suit {
  font-size: 0.6em;
  color: #666;
  margin-top: 1px;
}
</style>
