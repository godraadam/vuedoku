<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { RouterView, useRouter } from "vue-router";

const router = useRouter();
onBeforeMount(() => router.replace("easy"));
</script>
