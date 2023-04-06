<script setup lang="ts">
import { computed, h, reactive, ref } from 'vue'
import GameHeader from './components/GameHeader.vue'
import GameBoard from './components/GameBoard.vue'
import type { use2048Options } from './composables/use2048'

const sizes = reactive<Array<use2048Options['size'] | 'custom'>>([
  3,
  4,
  5,
  // 'custom',
])
// const customSize = ref<use2048Options['size']>({
//   width: 4,
//   height: 4,
// })

const comps = computed(() => sizes.map((size) => {
  // if (size === 'custom') {
  //   return h(
  //     GameBoard,
  //     { size: customSize.value },
  //   )
  // }
  return h(
    GameBoard,
    { size: size as use2048Options['size'] },
  )
}))

const idx = ref(1)
</script>

<template>
  <div
    flex="~ col"
    class="justify-between items-center py-16 dark:bg-dark-800 dark:text-light-400 overflow-scroll"
    h="full"
  >
    <GameHeader v-model:active-idx="idx" :sizes="sizes" />

    <KeepAlive>
      <Component :is="comps[idx]" :key="comps[idx].props?.size" />
    </KeepAlive>
  </div>
</template>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
</style>
