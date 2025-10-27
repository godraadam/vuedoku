<template>
  <Modal :is-open @close="emits('close')">
    <div class="w-[728px] h-[680px]">
      <h1 class="text-3xl font-medium">Game Paused</h1>
      <div class="flex flex-col h-full w-full items-center justify-center gap-4">
        <PauseIcon class="text-gray-900 size-36" />
        <p class="font-light text-gray-900">Close this window or press spacebar to continue</p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import PauseIcon from "@/components/ui/icons/pause.svg";
import Modal from "@/components/ui/Modal.vue";

defineProps<{ isOpen: boolean }>();
const emits = defineEmits<{ close: [] }>();
</script>
