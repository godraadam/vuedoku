<template>
  <Transition
    enter-from-class="opacity-0 scale-[95%]"
    enter-to-class="opacity-100 scale-100"
    enter-active-class="transition-opacity duration-100"
    leave-from-class="opacity-100 scale-100"
    leave-active-class="transition-opacity duration-100"
    leave-to-class="opacity-0 scale-[95%]"
  >
    <template v-if="isOpen">
      <ul
        :id="`select-${id}`"
        ref="target"
        role="listbox"
        :class="dropdownClass"
        @focusout="setOpen(false)"
      >
        <slot />
      </ul>
    </template>
  </Transition>
</template>

<script setup lang="ts" generic="T">
import { onClickOutside } from "@vueuse/core";
import type { Ref } from "vue";
import { computed, inject, useAttrs, useTemplateRef } from "vue";

import { cn } from "@/util";

const { isOpen, setOpen, id } = inject<{
  isOpen: Ref<boolean>;
  setOpen: (open: boolean) => void;
  id: string;
}>("state")!;

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const dropdownClass = computed(() =>
  cn(
    "absolute z-50 right-0 max-h-80 space-y-0.5 overflow-auto rounded-lg border border-gray-100 bg-white p-1.5 shadow-lg shadow-gray-600/20 focus-within:border-gray-200 focus:outline-none",
    attrs.class ?? "",
  ),
);

const target = useTemplateRef<HTMLElement>("target");

onClickOutside(target, () => setOpen(false));
</script>
