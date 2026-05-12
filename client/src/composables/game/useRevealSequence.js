import {
  computed,
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

import {
  ENABLE_PROGRESSIVE_TTS_REVEAL
}
from "../../constants/revealEffects"

import buildRevealSegments
from "../../utils/cards/buildRevealSegments"

import useAudioSettings
from "../useAudioSettings"

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
    ttsEnabled,
    progressiveTtsEnabled
  } = useAudioSettings()

  const {
    speak,
    cancelSpeech
  } = useSpeechSynthesis()

  const activeRevealIndex =
    ref(-1)

  const activeAnswerIndex =
    ref(-1)

  const revealedAnswerCount =
    ref(0)

  const progressiveReveal =
    computed(() =>

      ENABLE_PROGRESSIVE_TTS_REVEAL &&
      ttsEnabled.value &&
      progressiveTtsEnabled.value &&
      typeof window !== "undefined" &&
      Boolean(window.speechSynthesis)
    )

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

  function resetAnswerProgress() {
    activeAnswerIndex.value =
      -1

    revealedAnswerCount.value =
      0
  }

  function showAllAnswers(answerRanges) {
    activeAnswerIndex.value =
      -1

    revealedAnswerCount.value =
      answerRanges.length
  }

  function setAnswerProgressFromTextIndex(
    answerRanges,
    textIndex
  ) {
    if (!answerRanges.length) {
      resetAnswerProgress()

      return
    }

    let completedCount = 0
    let currentIndex = -1

    answerRanges.some(range => {
      if (textIndex >= range.end) {
        completedCount =
          range.answerIndex + 1

        return false
      }

      if (textIndex >= range.start) {
        currentIndex =
          range.answerIndex

        return true
      }

      return true
    })

    revealedAnswerCount.value =
      completedCount

    activeAnswerIndex.value =
      currentIndex
  }

  function startEstimatedAnswerProgress(
    fullText,
    answerRanges,
    latestTextIndex
  ) {
    if (
      !progressiveReveal.value ||
      !answerRanges.length
    ) {
      return () => {}
    }

    const duration =
      Math.max(
        6000,
        fullText.length * 90
      )

    const startedAt =
      Date.now()

    const interval =
      setInterval(() => {
        if (isCancelled()) {
          return
        }

        const elapsed =
          Date.now() - startedAt

        const estimatedIndex =
          Math.min(
            fullText.length,
            Math.floor(
              (elapsed / duration) *
              fullText.length
            )
          )

        if (
          estimatedIndex <
          latestTextIndex.value
        ) {
          return
        }

        latestTextIndex.value =
          estimatedIndex

        setAnswerProgressFromTextIndex(
          answerRanges,
          estimatedIndex
        )
      }, 120)

    return () => {
      clearInterval(interval)
    }
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

      resetAnswerProgress()

      activeRevealIndex.value =
        i

      await wait(350)

      if (isCancelled()) {
        return
      }

      const {
        fullText,
        answerRanges
      } =
        buildRevealSegments(

          blackCard.value.text,

          submission.cards
        )

      const latestTextIndex =
        ref(0)

      const stopEstimatedProgress =
        startEstimatedAnswerProgress(
          fullText,
          answerRanges,
          latestTextIndex
        )

      await speak(
        fullText,
        {
          onBoundary(event) {
            if (!progressiveReveal.value) {
              return
            }

            if (
              event.charIndex <
              latestTextIndex.value
            ) {
              return
            }

            latestTextIndex.value =
              event.charIndex

            setAnswerProgressFromTextIndex(
              answerRanges,
              event.charIndex
            )
          }
        }
      )

      stopEstimatedProgress()

      showAllAnswers(answerRanges)

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

    resetAnswerProgress()

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

    activeRevealIndex,
    activeAnswerIndex,
    revealedAnswerCount,
    progressiveReveal
  }
}
