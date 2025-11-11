<template>
  <div v-if="isOpen" class="size-screen z-10 absolute inset-0" @click="isOpen = false"></div>
  <div ref="contextRef" :class="cn('relative', $attrs.class ?? '')">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { provide, ref, useAttrs, useTemplateRef } from "vue";
import { cn } from "@/util";

const isOpen = ref(false);
const contextRef = useTemplateRef("contextRef");
const emits = defineEmits<{ close: [] }>();

const { id } = useAttrs();

const props = withDefaults(defineProps<{ closeOnSelect?: boolean }>(), { closeOnSelect: true });
defineExpose({
  toggleOpen: () => {
    isOpen.value = !isOpen.value;
  },
});

provide("state", {
  isOpen,
  setOpen: (open: boolean) => {
    isOpen.value = open;
    emits("close");
  },
  id,
  contextRef,
  closeOnSelect: props.closeOnSelect,
});
</script>
