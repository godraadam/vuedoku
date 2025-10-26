import { onMounted, onUnmounted } from "vue";

export function useKeyboardEvent(
  cb: (e: KeyboardEvent) => void,
  options?: Partial<{ preventDefault: boolean; debounce: number; on: "keydown" | "keyup" }>,
) {
  function handle(e: KeyboardEvent) {
    if (options?.preventDefault) {
      e.preventDefault();
    }
    cb(e);
  }
  const event = options?.on == "keyup" ? "keyup" : "keydown";
  onMounted(() => window.addEventListener(event, handle));
  onUnmounted(() => window.removeEventListener(event, handle));
}
