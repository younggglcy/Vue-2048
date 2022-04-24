<script setup lang="ts">
import { ref, Ref } from 'vue'
import ToggleDark from '~/components/ToggleDark.vue'
import ToggleSize from '~/components/ToggleSize.vue'
import { useLocalStorage } from '@vueuse/core'
import { Refresh } from '@element-plus/icons-vue'

const curScore = ref(0)
const histroyBest = [
  useLocalStorage('histroyBest-3*3', 0),
  useLocalStorage('histroyBest-4*4', 0),
  useLocalStorage('histroyBest-5*5', 0)
]
const size = ref(4)

const arr: Ref<number[][]> = ref(new Array(size.value).fill(0).map(() => new Array(size.value).fill(0)))

function handleSizeChange(val: number) {
  size.value = val
  arr.value = new Array(size.value).fill(0).map(() => new Array(size.value).fill(0))
}

function restart() {
  arr.value = new Array(size.value).fill(0).map(() => new Array(size.value).fill(0))
}

</script>

<template>
  <div
    flex="~ col"
    class="justify-between items-center py-16 dark:bg-dark-800 dark:text-light-400"
    h="full"
  >
    <header flex="~ col" class="w-3/4" >
      <h1 class="flex-grow-[1] text-center font-bold text-2xl -mt-4 mb-12">Press ↑←↓→ to play 2048!</h1>
      <div class="flex-grow-[2] items-center justify-around" flex="~">
        <ToggleDark class="mr-4" />
        <ToggleSize :size="size" @onSizeChange="handleSizeChange" />
      </div>
    </header>

    <main
      grid="~"
      class="justify-items-center items-center"
      :style="{ 
        gridTemplateRows: `repeat(${size}, 1fr)`,
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        height: `${size * 5}rem`,
        width: `${size * 5}rem`
      }"
    >
      <template
        v-for="(row, rowIdx) of arr" 
        :key="rowIdx"
      >
        <div 
          v-for="(item, idx) of row" 
          :key="idx"
          :style="{
            gridRow: `${rowIdx + 1} / span 1`,
            gridColumn: `${idx + 1} / span 1`,
            backgroundColor: 'rgb(189,172,161)'
          }"
          w="full"
          h="full"
          border="warm-gray-100 2 solid"
        >
          {{ !!item ? item : '' }}
        </div>
      </template>
    </main>
    
    <footer flex="~" class="items-center w-3/4">
      <div class="flex-auto text-center">History Best:<span>{{ histroyBest[size - 3] }}</span></div>
      <div class="flex-auto text-center">Current:<span>{{ curScore }}</span></div>
      <div flex="~" class="flex-auto items-center justify-center">
        <div w="max-12 12" h="max-12 12">
          <Refresh class="align-middle hover:cursor-pointer" w="full" h="full" @click.stop="restart" />
        </div>
        <span class="ml-4 hover:cursor-pointer" @click.stop="restart">Restart Game</span>
      </div>
    </footer>
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
