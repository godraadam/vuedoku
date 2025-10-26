<template>
  <button
    :class="
      cn(
        'w-fit h-fit p-1.5 flex gap-1.5 items-center justify-center hover:bg-gray-200 transition-colors text-gray-500 hover:text-blue-500 cursor-pointer rounded-lg',
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
