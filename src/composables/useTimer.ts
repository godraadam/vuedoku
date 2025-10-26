import { computed, onMounted, onUnmounted, ref, type Ref } from "vue";

export function useTimer(run: Ref<boolean>) {
  const timer = ref(0);
  const minutes = computed(() => {
    const m = Math.floor(timer.value / 60);
    if (m < 10) {
      return `0${m}`;
    }
    return m;
  });
  const seconds = computed(() => {
    const s = Math.floor(timer.value % 60);
    if (s < 10) {
      return `0${s}`;
    }
    return s;
  });

  const time = computed(() => `${minutes.value}:${seconds.value}`);

  const intervalRef = ref();
  onMounted(() => {
    intervalRef.value = setInterval(() => run.value && (timer.value += 1), 1000);
  });

  onUnmounted(() => clearInterval(intervalRef.value));

  function reset() {
    timer.value = 0;
  }

  return { time, minutes, seconds, reset, runnning: run.value };
}
