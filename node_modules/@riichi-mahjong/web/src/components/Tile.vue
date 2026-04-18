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

const tileClass = computed(() => {
  const suit = props.tileId.match(/[mps]$/)?.[0]
  return [
    'tile',
    `tile-${suit || 'honor'}`,
    `tile-${props.size || 'md'}`,
    { 'tile-selected': props.selected, 'tile-disabled': props.disabled }
  ]
})

const tileUrl = computed(() => {
  return `/tiles/dark/${props.tileId}.png`
})

const handleClick = () => {
  if (!props.disabled) {
    emit('click', props.tileId)
  }
}
</script>

<template>
  <div :class="tileClass" @click="handleClick">
    <img :src="tileUrl" :alt="tileId" class="tile-img" />
  </div>
</template>

<style scoped>
.tile {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.tile:hover:not(.tile-disabled) {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.tile-selected {
  outline: 3px solid var(--color-accent);
  outline-offset: 1px;
  border-radius: 6px;
}

.tile-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(50%);
}

/* Size variants */
.tile-sm .tile-img {
  width: 32px;
  height: auto;
}

.tile-md .tile-img {
  width: 40px;
  height: auto;
}

.tile-lg .tile-img {
  width: 48px;
  height: auto;
}
</style>
