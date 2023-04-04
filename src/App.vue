<script setup lang="ts">
import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { Refresh } from '@element-plus/icons-vue'
import ToggleDark from '~/components/ToggleDark.vue'
import ToggleSize from '~/components/ToggleSize.vue'
import colors from '~/styles/color'

const curScore = ref(0)
const histroyBest = [
  useLocalStorage('histroyBest-3*3', 0),
  useLocalStorage('histroyBest-4*4', 0),
  useLocalStorage('histroyBest-5*5', 0),
]
const size = ref(4)

const arr: Ref<number[][]> = ref(new Array(size.value).fill(0).map(() => new Array(size.value).fill(0)))

function handleSizeChange(val: number) {
  size.value = val
  arr.value = new Array(size.value).fill(0).map(() => new Array(size.value).fill(0))
  randomGenerate()
  curScore.value = 0
}

function restart() {
  arr.value = new Array(size.value).fill(0).map(() => new Array(size.value).fill(0))
  randomGenerate()
  curScore.value = 0
}

// after each move, randomly generate a 2 or 4 to the empty cell
function randomGenerate() {
  const emptyCells = arr.value.reduce((acc: Array<[number, number]>, row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0)
        acc.push([i, j])
    })
    return acc
  }, [])
  if (!emptyCells.length) {
    console.warn('Game Over')
    gameOver()
    return
  }
  const randomIndex = Math.floor(Math.random() * emptyCells.length)
  const [i, j] = emptyCells[randomIndex]
  arr.value[i][j] = Math.random() > 0.5 ? 2 : 4
}

function gameOver() {
  if (curScore.value > histroyBest[size.value - 3].value)
    histroyBest[size.value - 3].value = curScore.value

  restart()
}

onMounted(() => {
  randomGenerate()

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft')
      move('left')
    else if (e.key === 'ArrowRight')
      move('right')
    else if (e.key === 'ArrowUp')
      move('up')
    else if (e.key === 'ArrowDown')
      move('down')
  })
})

function getCellBgColor(val: number): string {
  if (val > 8192)
    return colors['color-beyond']
  else
    return colors[`color-${val}`]
}

function move(dir: 'left' | 'right' | 'up' | 'down') {
  if (dir === 'left') {
    arr.value = arr.value.map(row => merge(row, true))
  }
  else if (dir === 'right') {
    arr.value = arr.value.map(row => merge(row, false))
  }
  else if (dir === 'up') {
    let cols: number[][] = []
    for (let i = 0; i < size.value; i++) {
      const col: number[] = []
      for (let j = 0; j < size.value; j++)
        col.push(arr.value[j][i])

      cols.push(col)
    }
    cols = cols.map(col => merge(col, true))
    cols.forEach((col, i) => {
      col.forEach((cell, j) => {
        arr.value[j][i] = cell
      })
    })
  }
  else if (dir === 'down') {
    let cols: number[][] = []
    for (let i = 0; i < size.value; i++) {
      const col: number[] = []
      for (let j = 0; j < size.value; j++)
        col.push(arr.value[j][i])

      cols.push(col)
    }
    cols = cols.map(col => merge(col, false))
    cols.forEach((col, i) => {
      col.forEach((cell, j) => {
        arr.value[j][i] = cell
      })
    })
  }
  randomGenerate()
}

function merge(tar: number[], ltor: boolean): number[] {
  const filteredTar = tar.filter(cell => !!cell)
  let first, second
  const ret: number[] = []
  if (ltor) {
    first = filteredTar[0]
    second = null
    for (let j = 1; j < filteredTar.length; j++) {
      second = filteredTar[j]
      if (first === second) {
        ret.push(first + second)
        curScore.value += first + second
        j++
        if (j < filteredTar.length)
          first = filteredTar[j]
        else
          break
      }
      else {
        ret.push(first)
        first = second
      }
    }
    ret.push(first)
    while (ret.length < size.value)
      ret.push(0)
  }
  else {
    first = filteredTar[filteredTar.length - 1]
    second = null
    for (let j = filteredTar.length - 2; j >= 0; j--) {
      second = filteredTar[j]
      if (first === second) {
        ret.unshift(first + second)
        curScore.value += first + second
        j--
        if (j >= 0)
          first = filteredTar[j]
        else
          break
      }
      else {
        ret.unshift(first)
        first = second
      }
    }
    ret.unshift(first)
    while (ret.length < size.value)
      ret.unshift(0)
  }
  return ret
}
</script>

<template>
  <div
    flex="~ col"
    class="justify-between items-center py-16 dark:bg-dark-800 dark:text-light-400"
    h="full"
  >
    <header flex="~ col" class="w-3/4">
      <h1 class="flex-grow-[1] text-center font-bold text-2xl -mt-4 mb-12">
        Press ↑←↓→ to play 2048!
      </h1>
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
        width: `${size * 5}rem`,
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
        History Best:<span>{{ histroyBest[size - 3] }}</span>
      </div>
      <div class="flex-auto text-center">
        Current:<span>{{ curScore }}</span>
      </div>
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
