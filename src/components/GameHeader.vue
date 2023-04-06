<script setup lang="ts">
import ToggleDark from '~/components/ToggleDark.vue'
import type { use2048Options } from '~/composables/use2048'

interface Props {
  activeIdx: number
  sizes: Array<use2048Options['size'] | 'custom'>
}
defineProps<Props>()

const emits = defineEmits<Emits>()
interface Emits {
  (e: 'onCustomSizeChange', val: use2048Options['size']): void
  (e: 'update:activeIdx', val: number): void
}

function handleItemClick(idx: number) {
  emits('update:activeIdx', idx)
}
</script>

<template>
  <header flex="~ col" class="w-3/4">
    <h1 class="flex-grow-[1] text-center font-bold text-2xl -mt-4 mb-12">
      Press ↑←↓→ to play 2048!
    </h1>
    <div class="flex-grow-[2] items-center justify-around" flex="~">
      <ToggleDark class="mr-4" />
      <div
        flex="~"
        class="justify-around"
        w="full"
      >
        <div
          v-for="(size, idx) of sizes"
          :key="idx"
          class="item"
          :class="{ 'item-active': activeIdx === idx }"
          @click="handleItemClick(idx)"
        >
          <template v-if="size === 'custom'">
            cus
            <!-- TODO: change customSize -->
          </template>
          <template v-else>
            <span>
              {{ size }} * {{ size }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.item {
  @apply items-center flex-1 text-center rounded-xl bg-gray-400 max-w-32 h-12 leading-[3rem] hover:cursor-pointer flex ;
  transition: all .4s ease;
}

.item:hover {
  transform: scale(1.1);
}

.item-active {
  @apply bg-yellow-600 ;
}

.item > span {
  width: 100%;
}
</style>
