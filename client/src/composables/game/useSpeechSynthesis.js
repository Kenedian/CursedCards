import {
  onUnmounted
}
from "vue"

import useAudioSettings
from "../useAudioSettings"

let speechUnlockAttempted = false
let speechUnlockInProgress = false
let speechUnlocked = false

export function unlockSpeechSynthesis() {
  if (
    speechUnlocked ||
    speechUnlockInProgress ||
    typeof window === "undefined" ||
    !window.speechSynthesis
  ) {
    return
  }

  speechUnlockAttempted =
    true

  speechUnlockInProgress =
    true

  try {
    speechSynthesis.getVoices()

    speechSynthesis.resume()

    speechSynthesis.cancel()

    const utterance =
      new SpeechSynthesisUtterance(".")

    utterance.lang =
      "cs-CZ"

    utterance.volume =
      0.000001

    utterance.rate =
      10

    const unlockTimeout =
      setTimeout(() => {
        if (speechUnlocked) {
          return
        }

        speechUnlockInProgress =
          false
      }, 1500)

    function markUnlocked() {
      speechUnlocked =
        true

      speechUnlockInProgress =
        false

      clearTimeout(unlockTimeout)
    }

    utterance.onstart =
      markUnlocked

    utterance.onend =
      () => {
        markUnlocked()
      }

    utterance.onerror =
      () => {
        speechUnlockInProgress =
          false

        clearTimeout(unlockTimeout)
      }

    speechSynthesis.speak(
      utterance
    )
  } catch {
    speechUnlockInProgress =
      false
  }
}

function getBestVoice() {
  if (!window.speechSynthesis) {
    return null
  }

  const voices =
    speechSynthesis.getVoices()

  return (

    voices.find(
      voice =>
        voice.name.includes(
          "Jakub"
        )
    )

    ||

    voices.find(
      voice =>

        voice.lang ===
        "cs-CZ"

        &&

        voice.name.includes(
          "Microsoft"
        )
    )

    ||

    voices.find(
      voice =>
        voice.lang ===
        "cs-CZ"
    )

    ||

    voices.find(
      voice =>
        voice.lang.startsWith(
          "cs"
        )
    )

    ||

    voices[0]
  )
}

export default function useSpeechSynthesis() {
  const {
    masterVolume,
    ttsVolume,
    ttsEnabled
  } = useAudioSettings()

  function loadVoices() {
    if (!window.speechSynthesis) {
      return
    }

    speechSynthesis.getVoices()
  }

  function speak(
    text,
    options = {}
  ) {

    return new Promise(resolve => {
      if (!ttsEnabled.value) {
        setTimeout(
          resolve,
          Math.min(
            Math.max(
              1800,
              text.length * 35
            ),
            5000
          )
        )

        return
      }

      if (!window.speechSynthesis) {
        resolve()

        return
      }

      if (!speechUnlocked) {
        unlockSpeechSynthesis()
      }

      let finished = false

      const fallbackTimer =
        setTimeout(() => {
          finish()
        }, Math.max(6000, text.length * 90))

      speechSynthesis.cancel()

      const utterance =

        new SpeechSynthesisUtterance(
          text
        )

      utterance.lang =
        "cs-CZ"

      utterance.rate =
        0.95

      utterance.pitch =
        1

      utterance.volume =
        Math.min(
          Math.max(
            masterVolume.value *
            ttsVolume.value,
            0
          ),
          1
        )

      const voice =
        getBestVoice()

      if (voice) {

        utterance.voice =
          voice
      }

      function finish() {
        if (finished) {
          return
        }

        finished = true

        clearTimeout(fallbackTimer)

        resolve()
      }

      utterance.onend =
        finish

      utterance.onerror =
        finish

      utterance.onboundary =
        event => {
          options.onBoundary?.({
            charIndex:
              event.charIndex || 0,

            name:
              event.name
          })
        }

      speechSynthesis.speak(
        utterance
      )
    })
  }

  function cancelSpeech() {
    if (!window.speechSynthesis) {
      return
    }

    speechSynthesis.cancel()
  }

  loadVoices()

  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged =
      loadVoices
  }

  onUnmounted(() => {

    cancelSpeech()
  })

  return {

    speak,

    cancelSpeech
  }
}
