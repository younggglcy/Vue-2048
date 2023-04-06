<script setup lang="ts">
import { useLocalStorage, useMagicKeys, watchPausable } from '@vueuse/core'
import { Refresh } from '@element-plus/icons-vue'
import { onActivated, onDeactivated, watch } from 'vue'
import type { use2048Options } from '~/composables/use2048'
import { use2048 } from '~/composables/use2048'
import colors from '~/styles/color'

interface Props {
  size: use2048Options['size']
}

const { size } = withDefaults(
  defineProps<Props>(),
  { size: 4 },
)

const width = typeof size === 'number' ? size : size.width
const height = typeof size === 'number' ? size : size.height

const {
  board,
  score,
  isGameOver,
  randomGenerate,
  isActive,
  resume,
  pause,
} = use2048({ size })

const histroyBest = useLocalStorage(`historyBest-${width}*${height}`, 0)

function getCellBgColor(val: number): string {
  if (val > 8192)
    return colors['color-beyond']
  else
    return colors[`color-${val}`]
}

function restart() {
  board.value = board.value.map(row => row.map(() => 0))
  score.value = 0
  randomGenerate()
}

watch(
  isGameOver,
  (v) => {
    if (v) {
      histroyBest.value = score.value
      restart()
    }
  },
)

const { r } = useMagicKeys()
const {
  isActive: isRestartWatcherActive,
  pause: pauseRestartWatcher,
  resume: resumeRestartWatcher,
} = watchPausable(
  r,
  v => v && restart(),
)

onActivated(() => {
  !isActive.value && resume()
  !isRestartWatcherActive.value && resumeRestartWatcher()
})

onDeactivated(() => {
  isActive.value && pause()
  isRestartWatcherActive.value && pauseRestartWatcher()
})
</script>

<template>
  <main
    grid="~"
    class="justify-items-center items-center"
    :style="{
      gridTemplateRows: `repeat(${height}, 1fr)`,
      gridTemplateColumns: `repeat(${width}, 1fr)`,
      height: `${height * 5}rem`,
      width: `${width * 5}rem`,
    }"
  >
    <template
      v-for="(row, rowIdx) of board"
      :key="rowIdx"
    >
      <div
        v-for="(item, idx) of row"
        :key="idx"
        :style="{
          gridRow: `${rowIdx + 1} / span 1`,
          gridColumn: `${idx + 1} / span 1`,
          backgroundColor: `${getCellBgColor(item)}`,
        }"
        w="full"
        h="full"
        border="warm-gray-100 2 solid"
        class="text-center text-3xl items-center justify-center dark:text-stroke-dark-700"
        flex="~"
      >
        <span>{{ !!item ? item : '' }}</span>
      </div>
    </template>
  </main>

  <footer flex="~" class="items-center w-3/4">
    <div class="flex-auto text-center">
      History Best:<span>{{ histroyBest }}</span>
    </div>
    <div class="flex-auto text-center">
      Current:<span>{{ score }}</span>
    </div>
    <div flex="~" class="flex-auto items-center justify-center">
      <div w="12" h="12" class="max-w-12 min-w-12">
        <Refresh class="align-middle hover:cursor-pointer" w="full" h="full" @click.stop="restart" />
      </div>
      <span class="ml-4 hover:cursor-pointer" @click.stop="restart">Restart Game(or type R)</span>
    </div>
  </footer>
</template>

<style scoped>

</style>
