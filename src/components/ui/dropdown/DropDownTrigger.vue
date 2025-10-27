<template>
  <div class="flex items-center justify-center hover:cursor-pointer" @click="setOpen(!isOpen)">
    <slot :is-open="isOpen" :set-open="setOpen" />
  </div>
</template>

<script setup lang="ts" generic="T">
import { inject } from "vue";

defineOptions({ inheritAttrs: false });

const { isOpen, setOpen } = inject<{ isOpen: boolean; setOpen: (open: boolean) => void }>("state")!;
</script>
