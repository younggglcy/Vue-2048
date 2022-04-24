<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sunny } from '@element-plus/icons-vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <button 
    @click="toggleDark()"
    flex="~"
    class="items-center"
  >
    <div w="min-12 12" h="min-12 12">
      <moon v-if="isDark" class="align-middle" />
      <sunny v-else="isDark" class="align-middle" />
    </div>

    <span class="mx-2">{{ isDark ? 'Dark': 'Light' }}</span>
  </button>
</template>
