<script setup lang="ts">
interface Props {
  size: number
}
const props = defineProps<Props>()

const emits = defineEmits<Emits>()
interface Emits {
  (e: 'onSizeChange', val: number): void
}
</script>

<template>
  <div
    flex="~"
    class="justify-around"
    w="full"
  >
    <div class="item" :class="{ 'item-active': size === 3 }" @click="$emit('onSizeChange', 3)">
      3*3
    </div>
    <div class="item" :class="{ 'item-active': size === 4 }" @click="$emit('onSizeChange', 4)">
      4*4
    </div>
    <div class="item" :class="{ 'item-active': size === 5 }" @click="$emit('onSizeChange', 5)">
      5*5
    </div>
  </div>
</template>

<style scoped>
.item {
  @apply items-center flex-1 text-center rounded-xl bg-gray-400 max-w-32 h-12 leading-[3rem] hover:cursor-pointer ;
  transition: all .4s ease;
}

.item:hover {
  transform: scale(1.1);
}

.item-active {
  @apply bg-yellow-600 ;
}
</style>
