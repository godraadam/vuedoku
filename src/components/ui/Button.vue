<template>
  <button
    :class="
      cn(
        'hover:text-theme-500 focus:border-theme-500 flex h-fit w-fit cursor-pointer items-center justify-center gap-1.5 rounded-lg p-1.5 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none',
        attrs.class ?? '',
      )
    "
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { cn } from "@/util";
import { useAttrs, type ButtonHTMLAttributes } from "vue";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends /** @vue-ignore */ ButtonHTMLAttributes {}
defineProps<Props>();
const attrs = useAttrs();
</script>
