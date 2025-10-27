<template>
  <Modal :is-open class="w-full max-w-lg mx-2" @close="emits('close')">
    <div class="h-fit overflow-visible">
      <h1 class="text-3xl font-medium pb-4">Congratulations!</h1>
      <p class="text-gray-900 pb-5">
        You solved a{{ difficulty == "easy" ? "n " : " " }}
        <span class="text-theme-600">{{ difficulty }}</span> sudoku in
        <span class="text-theme-600">{{ time }}</span>
        {{ hintsUsed > 0 ? `using ${hintsUsed} hints` : "" }}!
      </p>
      <div class="flex items-center justify-between gap-2 pt-10">
        <RouterLink
          :to="`/${difficulty}`"
          class="text-center text-theme-600 py-2 cursor-pointer hover:text-theme-700 transition-colors"
        >
          Exit
        </RouterLink>
        <div class="flex gap-2">
          <button
            class="border border-theme-600 md:min-w-32 flex justify-center items-center gap-2 text-theme-600 px-3 py-2 rounded-lg cursor-pointer hover:bg-theme-50 transition-colors"
            @click="onShare"
          >
            {{ linkCopied ? "Link copied!" : "Share" }}
            <CopiedIcon v-if="linkCopied" class="size-5 text-theme-600" />
            <ShareIcon v-else class="size-5 text-theme-600" />
          </button>
          <button
            class="bg-theme-600 md:min-w-32 flex justify-center items-center gap-2 text-white px-3 py-2 rounded-lg cursor-pointer hover:bg-theme-500 transition-colors"
            @click="onPlayAnother"
          >
            Play another
            <PlayIcon class="text-white size-5" />
          </button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import Modal from "@/components/ui/Modal.vue";
import useState from "@/composables/useState";
import PlayIcon from "@/components/ui/icons/play.svg";
import ShareIcon from "@/components/ui/icons/share.svg";
import CopiedIcon from "@/components/ui/icons/check-copied.svg";
import { getRandomSudoku } from "@/util";

const { difficulty, time, hintsUsed } = useState();
const router = useRouter();

defineProps<{ isOpen: boolean }>();
const emits = defineEmits<{ close: [] }>();

const linkCopied = ref(false);

async function onPlayAnother() {
  const randomSudoku = await getRandomSudoku(difficulty.value);
  router.replace(`/${difficulty.value}/${randomSudoku}`).then(() => emits("close"));
}

function onShare() {
  navigator.clipboard.writeText(window.location.origin + window.location.pathname);
  linkCopied.value = true;
}
</script>
