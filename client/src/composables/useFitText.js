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

  const textRef =
    ref(null)

  const fontSize =
    ref(defaultFontSize)

  let resizeObserver =
    null

  function getDefaultFontSize(el) {
    if (
      typeof defaultFontSize === "function"
    ) {
      return defaultFontSize(el)
    }

    return defaultFontSize
  }

  async function fitText() {

    await nextTick()

    const el =
      textRef.value

    if (!el) {
      return
    }

    let low =
      minFontSize

    let high =
      getDefaultFontSize(el)

    let best =
      minFontSize

    while (low <= high) {

      const mid =
        Math.floor(
          (low + high) / 2
        )

      fontSize.value =
        mid

      await nextTick()

      const overflowing =

        el.scrollHeight >
        el.clientHeight

        ||

        el.scrollWidth >
        el.clientWidth

      if (!overflowing) {

        best = mid

        low = mid + 1
      }

      else {

        high = mid - 1
      }
    }

    fontSize.value =
      best
  }

  onMounted(() => {

    fitText()

    resizeObserver =
      new ResizeObserver(
        fitText
      )

    if (textRef.value) {

      resizeObserver.observe(
        textRef.value
      )
    }
  })

  onUnmounted(() => {

    resizeObserver?.disconnect()
  })

  watch(
    watchedSource,

    fitText,

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
