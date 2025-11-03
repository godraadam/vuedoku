<template>
  <Modal :is-open class="mx-2 w-full max-w-lg" @close="emits('close')">
    <div class="h-fit overflow-visible">
      <h1 class="pb-4 text-3xl font-medium">Congratulations!</h1>
      <p class="pb-5 text-gray-900">
        You solved a{{ difficulty == "easy" ? "n " : " " }}
        <span class="text-theme-600">{{ difficulty }}</span> sudoku in
        <span class="text-theme-600">{{ time }}</span>
        {{ hintsUsed > 0 ? `using ${hintsUsed} hints` : "" }}!
      </p>
      <div class="flex items-center justify-between gap-2 pt-10">
        <RouterLink
          to="/"
          class="text-theme-600 hover:text-theme-700 cursor-pointer py-2 text-center transition-colors"
        >
          Exit
        </RouterLink>
        <div class="flex gap-2">
          <button
            class="border-theme-600 text-theme-600 hover:bg-theme-50 flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 transition-colors md:min-w-32"
            @click="onShare"
          >
            {{ linkCopied ? "Link copied!" : "Share" }}
            <CopiedIcon v-if="linkCopied" class="text-theme-600 size-5" />
            <ShareIcon v-else class="text-theme-600 size-5" />
          </button>
          <button
            v-if="difficulty != 'custom'"
            class="bg-theme-600 hover:bg-theme-500 flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-white transition-colors md:min-w-32"
            @click="onPlayAnother"
          >
            Play another
            <PlayIcon class="size-5 text-white" />
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
