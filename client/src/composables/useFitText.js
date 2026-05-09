import {
  ref,
  nextTick,
  onMounted,
  onUnmounted,
  watch
} from "vue"

export default function useFitText(
  watchedSource,
  defaultFontSize = 28,
  minFontSize = 8
) {
  const textRef = ref(null)

  const fontSize = ref(defaultFontSize)

  async function fitText() {
    await nextTick()

    await new Promise(resolve =>
      requestAnimationFrame(resolve)
    )

    const el = textRef.value

    if (!el) {
      return
    }

    fontSize.value = defaultFontSize

    await nextTick()

    await new Promise(resolve =>
      requestAnimationFrame(resolve)
    )

    while (
      (
        el.scrollHeight > el.clientHeight ||
        el.scrollWidth > el.clientWidth
      ) &&
      fontSize.value > minFontSize
    ) {
      fontSize.value--

      await nextTick()

      await new Promise(resolve =>
        requestAnimationFrame(resolve)
      )
    }
  }

  onMounted(() => {
    fitText()

    window.addEventListener(
      "resize",
      fitText
    )
  })

  onUnmounted(() => {
    window.removeEventListener(
      "resize",
      fitText
    )
  })

  watch(
    watchedSource,
    () => {
      fitText()
    },
    {
      deep: true
    }
  )

  return {
    textRef,
    fontSize,
    fitText
  }
}