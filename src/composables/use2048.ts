import type { Ref } from 'vue'
import { computed, ref, unref } from 'vue'
import { useMagicKeys, watchPausable } from '@vueuse/core'

export interface use2048Options {
  /**
   * if param is a number, it decide how many squares the sides of a square contain
   * else define a matrix's width and height
   */
  size?: number | { width: number; height: number }
}

export function use2048(options?: use2048Options) {
  const { size = 4 } = options ?? {}

  function initBoard() {
    if (typeof size === 'number')
      return Array.from({ length: size }, () => Array.from({ length: size }, () => 0))

    const { width, height } = size
    return Array.from({ length: height }, () => Array.from({ length: width }, () => 0))
  }

  const board = ref(initBoard())

  const canMoveHorizontally = computed(() => checkCanMoveHorizontally(board))

  const canMoveVertically = computed(() => checkCanMoveVertically(board))

  const isGameOver = computed(() => !canMoveHorizontally.value && !canMoveVertically.value)

  /** show if you could make the whole board move towards certain directions */
  const moveStatus = {
    left: canMoveHorizontally,
    right: canMoveHorizontally,
    top: canMoveVertically,
    down: canMoveVertically,
  }

  function checkCanMoveHorizontally(arr: Ref<number[][]>) {
    const _arr = unref(arr)
    const m = _arr.length
    const n = _arr[0].length
    for (let i = 0; i < m; i++) {
      const subArr = _arr[i]
      if (subArr[0] === 0)
        return true
      for (let j = 1; j < n; j++) {
        if (subArr[j] === 0)
          return true

        if (subArr[j] === subArr[j - 1])
          return true
      }
    }
    return false
  }

  function checkCanMoveVertically(arr: Ref<number[][]>) {
    const _arr = unref(arr)
    const m = _arr.length
    const n = _arr[0].length
    for (let i = 0; i < n; i++) {
      if (_arr[0][i] === 0)
        return true
      for (let j = 1; j < m; j++) {
        if (_arr[j][i] === 0)
          return true

        if (_arr[j][i] === _arr[j - 1][i])
          return true
      }
    }
    return false
  }

  const score = ref(0)

  const { arrowleft, arrowright, arrowup, arrowdown } = useMagicKeys()

  function move(dir: 'left' | 'right' | 'up' | 'down') {
    if (dir === 'left') {
      board.value = board.value.map(row => merge(row, true))
    }
    else if (dir === 'right') {
      board.value = board.value.map(row => merge(row, false))
    }
    else if (dir === 'up') {
      const m = board.value.length
      const n = board.value[0].length
      let cols: number[][] = []
      for (let i = 0; i < m; i++) {
        const col: number[] = []
        for (let j = 0; j < n; j++)
          col.push(board.value[j][i])

        cols.push(col)
      }
      cols = cols.map(col => merge(col, true))
      cols.forEach((col, i) => {
        col.forEach((cell, j) => {
          board.value[j][i] = cell
        })
      })
    }
    else if (dir === 'down') {
      const m = board.value.length
      const n = board.value[0].length
      let cols: number[][] = []
      for (let i = 0; i < m; i++) {
        const col: number[] = []
        for (let j = 0; j < n; j++)
          col.push(board.value[j][i])

        cols.push(col)
      }
      cols = cols.map(col => merge(col, false))
      cols.forEach((col, i) => {
        col.forEach((cell, j) => {
          board.value[j][i] = cell
        })
      })
    }
    randomGenerate()
  }

  function merge(tar: number[], ltor: boolean) {
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
          score.value += first + second
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
      while (ret.length < tar.length)
        ret.push(0)
    }
    else {
      first = filteredTar[filteredTar.length - 1]
      second = null
      for (let j = filteredTar.length - 2; j >= 0; j--) {
        second = filteredTar[j]
        if (first === second) {
          ret.unshift(first + second)
          score.value += first + second
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
      while (ret.length < tar.length)
        ret.unshift(0)
    }
    return ret
  }

  // after each move, randomly generate a 2 or 4 to the empty cell
  function randomGenerate() {
    const emptyCells = board.value.reduce((acc: Array<[number, number]>, row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0)
          acc.push([i, j])
      })
      return acc
    }, [])
    if (!emptyCells.length)
      return
    const randomIndex = Math.floor(Math.random() * emptyCells.length)
    const [i, j] = emptyCells[randomIndex]
    board.value[i][j] = Math.random() > 0.5 ? 2 : 4
  }

  const { pause, resume, isActive } = watchPausable(
    [arrowleft, arrowright, arrowdown, arrowup],
    ([l, r, d, u]) => {
      if (l)
        canMoveHorizontally.value && move('left')

      else if (r)
        canMoveHorizontally.value && move('right')

      else if (d)
        canMoveVertically.value && move('down')

      else if (u)
        canMoveVertically.value && move('up')
    },
  )

  randomGenerate()

  return {
    board,
    isGameOver,
    score,
    moveStatus,
    randomGenerate,
    pause,
    resume,
    isActive,
  }
}
