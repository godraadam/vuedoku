<template>
  <Modal :is-open @close="emits('close')">
    <div class="w-[728px] h-[680px]">
      <h1 class="text-3xl font-medium">Settings</h1>
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <input
            v-model="autoCandidates"
            type="checkbox"
            id="auto-candidates"
            class="rounded-md accent-theme-600 size-3.5"
          />
          <label for="auto-candidates" class="text-sm text-gray-900">Auto Candidates</label>
        </div>
        <div class="flex items-center gap-2">
          <input
            v-model="autoHint"
            type="checkbox"
            id="auto-hints"
            class="rounded-md accent-theme-600 size-3.5"
          />
          <label for="auto-hints" class="text-sm text-gray-900">Auto Hints</label>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from "@/components/ui/Modal.vue";
import useState from "@/composables/useState";

defineProps<{ isOpen: boolean }>();
const emits = defineEmits<{ close: [] }>();

const { autoCandidates, autoHint } = useState();
</script>
