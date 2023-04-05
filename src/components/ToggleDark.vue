<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Moon, Sunny } from '@element-plus/icons-vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <button
    flex="~"
    class="items-center"
    @click="toggleDark()"
  >
    <div w="12" h="12" class="min-w-12 min-h-12">
      <Moon v-if="isDark" class="align-middle" />
      <Sunny v-else class="align-middle" />
    </div>

    <span class="mx-2">{{ isDark ? 'Dark' : 'Light' }}</span>
  </button>
</template>
