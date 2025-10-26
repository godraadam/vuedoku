<template>
  <button
    class="w-fit h-fit p-1.5 hover:bg-gray-200 transition-colors text-gray-500 hover:text-blue-500 cursor-pointer rounded-lg"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /** @vue-ignore */ ButtonHTMLAttributes {}
defineProps<Props>();
</script>
