import {
  onUnmounted
}
from "vue"

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

  function loadVoices() {
    if (!window.speechSynthesis) {
      return
    }

    speechSynthesis.getVoices()
  }

  function speak(text) {

    return new Promise(resolve => {
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
        0.35

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
