<template>
  <div id="chain-wrapper">
    <Link v-for="(link, i) in chain" :from="link.from" :to="link.to" :type="link.type" :key="i" />
  </div>
</template>

<script setup lang="ts">
import Link from "@/components/Link.vue";
import type { InferenceChain } from "@/model/InferenceGraphWalker";

defineProps<{ chain: InferenceChain }>();
</script>
