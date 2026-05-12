import {
  onUnmounted
}
from "vue"

import useAudioSettings
from "../useAudioSettings"

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
