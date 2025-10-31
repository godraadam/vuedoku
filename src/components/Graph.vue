<template>
  <div v-if="showGraph" id="links-wrapper">
    <Link
      v-for="(link, i) in weakLinksFiltered"
      :from="link[0]"
      :to="link[1]"
      type="weak"
      :key="`weak-${i}`"
    />
    <Link
      v-for="(link, i) in strongLinksFiltered"
      :from="link[0]"
      :to="link[1]"
      type="strong"
      :key="`strong-${i}`"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import useState from "@/composables/useState";
import Link from "@/components/Link.vue";

const { weakLinks, strongLinks, showGraph, focusedCandidate } = useState();
const digit = computed(() => focusedCandidate.value?.getDigit());

const weakLinksFiltered = computed(() =>
  weakLinks.value.filter(([from, to]) =>
    digit.value != undefined
      ? from.getDigit() == digit.value && to.getDigit() == digit.value
      : true,
  ),
);
const strongLinksFiltered = computed(() =>
  strongLinks.value.filter(([from, to]) =>
    digit.value != undefined
      ? from.getDigit() == digit.value && to.getDigit() == digit.value
      : true,
  ),
);
</script>
