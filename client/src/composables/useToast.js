import useUiStore
from "../stores/uiStore"

import {
  playSound
}
from "./useGameAudio"

let toastTimeout = null

export default function useToast() {

  const {
    toast
  } = useUiStore()

  function showToast(
    message,
    type = "error"
  ) {

    toast.value = {

      visible: true,
      message,
      type
    }

    playSound(
      "toastError"
    )

    clearTimeout(
      toastTimeout
    )

    toastTimeout =
      setTimeout(() => {

        toast.value.visible =
          false

      }, 3000)
  }

  function toastError(message) {

    showToast(
      message,
      "error"
    )
  }

  return {

    showToast,

    toastError
  }
}
