<template>
  <li
    role="option"
    :class="
      cn(
        'flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-50 focus:border-gray-900 focus:outline-none',
        $attrs.class ?? '',
      )
    "
    @click="onSelect"
  >
    <slot />
  </li>
</template>

<script setup lang="ts" generic="T">
import { inject } from "vue";

import { cn } from "@/util";

const props = defineProps<{ value?: T }>();
defineOptions({ inheritAttrs: false });

const { setOpen, closeOnSelect } = inject<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  closeOnSelect: boolean;
}>("state")!;

const emit = defineEmits<{ selectItem: [T] }>();

function onSelect() {
  if (closeOnSelect) {
    setOpen(false);
  }
  if (props.value) {
    emit("selectItem", props.value);
  }
}
</script>
