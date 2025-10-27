<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black opacity-30" @click.stop="handleClickOutside" />
      <div
        :class="
          cn(
            'relative z-51 max-h-[95dvh] rounded-lg w-fit max-w-[95vw] py-3 md:py-6 px-4 md:px-8 overflow-auto bg-white shadow-lg ',
            attrs.class ?? '',
          )
        "
      >
        <IconButton v-if="isDismissable" @click="onClose" class="absolute top-5 right-5"
          ><CloseIcon class="size-5"
        /></IconButton>
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useAttrs } from "vue";

import IconButton from "@/components/ui/Button.vue";
import CloseIcon from "@/components/ui/icons/close.svg";
import { cn } from "@/util";

const props = withDefaults(defineProps<{ isOpen: boolean; isDismissable?: boolean }>(), {
  isDismissable: true,
});
const emits = defineEmits<{ close: [] }>();
const attrs = useAttrs();
defineOptions({ inheritAttrs: false });

function handleClickOutside() {
  if (props.isDismissable) {
    onClose();
  }
}

function onClose() {
  emits("close");
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") onClose();
};

onMounted(() => {
  if (props.isDismissable) {
    window.addEventListener("keydown", onKeydown);
  }
});

onUnmounted(() => {
  if (props.isDismissable) {
    window.removeEventListener("keydown", onKeydown);
  }
});
</script>
