<template>
  <svg
    v-if="fromRect && toRect"
    class="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
  >
    <path
      :d="path"
      class="stroke-theme-800/50"
      stroke-width="1"
      fill="transparent"
      :stroke-dasharray="type == 'weak' ? '4' : undefined"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

import useState from "@/composables/useState";
import type Candidate from "@/model/Candidate";
import type { LinkType } from "@/model/InferenceGraph";

const props = defineProps<{ from: Candidate; to: Candidate; type: LinkType }>();

const { candidatePositions } = useState();

const fromRect = computed(() => candidatePositions.value.get(props.from.getCandidateIdx()));
const toRect = computed(() => candidatePositions.value.get(props.to.getCandidateIdx()));

const path = computed(() => {
  if (!fromRect.value || !toRect.value) {
    return;
  }
  const x1 = fromRect.value.left + fromRect.value.width / 2;
  const y1 = fromRect.value.top + fromRect.value.height / 2;
  const x2 = toRect.value.left + toRect.value.width / 2;
  const y2 = toRect.value.top + toRect.value.height / 2;

  const mpx = (x1 + x2) * 0.5;
  const mpy = (y1 + y2) * 0.5;

  // angle of perpendicular to line:
  const theta = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2;

  // distance of control point from mid-point of line:
  const offset = Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2)) * 0.15;

  // location of control point:
  const cx1 = mpx + offset * Math.cos(theta);
  const cy1 = mpy + offset * Math.sin(theta);

  return `M${x1} ${y1} Q${cx1} ${cy1} ${x2} ${y2}`;
});
</script>
