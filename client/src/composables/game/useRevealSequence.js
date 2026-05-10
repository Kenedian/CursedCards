import {
  ref,
  onMounted,
  onUnmounted
}
from "vue"

import socket
from "../../socket"

import {
  SOCKET_EVENTS
}
from "../../../../shared/constants/socketEvents"

import useGameStore
from "../../stores/gameStore"

import formatBlackCardText
from "../../utils/cards/formatBlackCardText"

import useSpeechSynthesis
from "./useSpeechSynthesis"

export default function useRevealSequence({

  blackCard,
  submissions
}) {

  const {
    currentLobby
  } = useGameStore()

  const {
    speak,
    cancelSpeech
  } = useSpeechSynthesis()

  const activeRevealIndex =
    ref(-1)

  let cancelled = false

  function wait(ms) {

    return new Promise(resolve =>

      setTimeout(
        resolve,
        ms
      )
    )
  }

  function isCancelled() {

    return cancelled
  }

  async function startReveal() {

    await wait(1200)

    if (isCancelled()) {
      return
    }

    for (
      let i = 0;
      i < submissions.value.length;
      i++
    ) {

      if (isCancelled()) {
        return
      }

      const submission =
        submissions.value[i]

      activeRevealIndex.value =
        i

      await wait(350)

      if (isCancelled()) {
        return
      }

      const fullText =

        formatBlackCardText(

          blackCard.value.text,

          submission.cards
        )

      await speak(fullText)

      if (isCancelled()) {
        return
      }

      await wait(250)
    }

    if (isCancelled()) {
      return
    }

    await wait(900)

    if (isCancelled()) {
      return
    }

    activeRevealIndex.value =
      -1

    socket.emit(

      SOCKET_EVENTS.REVEAL_FINISHED,

      currentLobby.value.code
    )
  }

  onMounted(() => {

    cancelled = false

    cancelSpeech()

    startReveal()
    
  })

  onUnmounted(() => {

    cancelled = true

    cancelSpeech()
  })

  return {

    activeRevealIndex
  }
}